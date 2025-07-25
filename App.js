import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, Linking } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';
import { Rating } from 'react-native-ratings';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [shops, setShops] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [modalVisible, setModalVisible] = useState(false);
  const [shopInfo, setShopInfo] = useState(null);
  const [ratedShops, setRatedShops] = useState({});
  const [showRatedShopsModal, setShowRatedShopsModal] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const [blogReviews, setBlogReviews] = useState([]); // 블로그 리뷰 추가

  const getButtonColor = (currentFilter) => {
    return filter === currentFilter ? 'skyblue' : 'white';
  };

  useEffect(() => {
    if (showIntro) {
      setTimeout(() => {
        setShowIntro(false);
      }, 3000);
    }
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      fetchShops();
    })();
    loadRatedShops();
  }, [showIntro]);

  const loadRatedShops = async () => {
    try {
      const storedRatedShops = await SecureStore.getItemAsync('ratedShops');
      if (storedRatedShops) {
        setRatedShops(JSON.parse(storedRatedShops));
      }
    } catch (error) {
      console.error('Failed to load rated shops.', error);
    }
  };

  const saveRatedShop = async (shopName, rating) => {
    try {
      const newRatedShops = {
        ...ratedShops,
        [shopName]: rating,
      };
      await SecureStore.setItemAsync('ratedShops', JSON.stringify(newRatedShops));
      setRatedShops(newRatedShops);
    } catch (error) {
      console.error('Failed to save rating.', error);
    }
  };

  const fetchShopInfo = async (query) => {
    try {
      const apiUrl = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=1&start=1`;
      const response = await fetch(apiUrl, {
        headers: {
          'X-Naver-Client-Id': 'DdpXcyjIAWKKGT6KT2dl',
          'X-Naver-Client-Secret': 'j_IsTv0yM8',
        },
      });
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        setShopInfo(data.items[0]);
        setModalVisible(true);
        // 블로그 리뷰 불러오기
        fetchBlogReviews(removeBoldTags(data.items[0].title));
      } else {
        alert('안심식당을 탈퇴한가게입니다');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 블로그 리뷰 불러오기 함수
  const fetchBlogReviews = async (shopName) => {
    try {
      const query = encodeURIComponent(shopName);
      const apiUrl = `https://openapi.naver.com/v1/search/blog.json?query=${query}&display=3&start=1&sort=sim`;

      const response = await fetch(apiUrl, {
        headers: {
          'X-Naver-Client-Id': 'DdpXcyjIAWKKGT6KT2dl',
          'X-Naver-Client-Secret': 'j_IsTv0yM8',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBlogReviews(data.items);
      } else {
        console.error('Failed to fetch blog reviews:', response.status);
      }
    } catch (error) {
      console.error('Error fetching blog reviews:', error);
    }
  };

  const fetchShops = async () => {
    try {
      // Fetch 안심식당 data
      const safeRestaurantApiKey = '2e558209765d7cb3e643dc57336bf7df8d800426ca054ca6f8b93cf233a51244';
      const safeRestaurantApiUrl = 'http://211.237.50.150:7080/openapi/2e558209765d7cb3e643dc57336bf7df8d800426ca054ca6f8b93cf233a51244/json/Grid_20200713000000000605_1/1/80';
      const safeRestaurantResponse = await fetch(`${safeRestaurantApiUrl}?serviceKey=${encodeURIComponent(safeRestaurantApiKey)}`);
      const safeRestaurantData = await safeRestaurantResponse.json();

      // Fetch 백년가게 data
      const backYearShopApiKey = '3fNo2dXQRmsct+K07C3NG+jAy5PwqoNoeDeTyuQeuVpTUlouCWLky5QnaerSz3uY+WAMRP6V4R/aE5LOPHwUTg==';
      const backYearShopApiUrl = 'https://api.odcloud.kr/api/15102255/v1/uddi:c198d295-7df7-49ad-a7a4-a70c8967d23e';
      const backYearShopResponse = await fetch(`${backYearShopApiUrl}?serviceKey=${encodeURIComponent(backYearShopApiKey)}&page=1&perPage=100`);
      const backYearShopData = await backYearShopResponse.json();

      const allData = [
        ...safeRestaurantData.Grid_20200713000000000605_1.row.map((shop) => ({
          name: shop.RELAX_RSTRNT_NM,
          address: shop.RELAX_ADD1,
          type: 'SAFE',
        })),
        ...backYearShopData.data.map((shop) => ({
          name: shop.업체명.replace(/<b>|<\/b>/g, ''),
          address: `${shop.기본주소} ${shop.상세주소}`,
          type: 'BACK_YEAR',
        })),
      ];

      const transformedShops = await Promise.all(
        allData.map(async (shop) => {
          const geoResponse = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(shop.address)}&key=AIzaSyBATgB4KDVUkujzmOuBKN6FJO9Ln8RqCg8`
          );
          const geoData = await geoResponse.json();
          let coords = {};
          if (geoData.results[0]) {
            coords = {
              latitude: geoData.results[0].geometry.location.lat,
              longitude: geoData.results[0].geometry.location.lng,
            };
          }
          return {
            ...shop,
            ...coords,
          };
        })
      );
      setShops(transformedShops);
    } catch (error) {
      console.error(error);
    }
  };

  const filterShops = () => {
    switch (filter) {
      case 'SAFE':
        return shops.filter((shop) => shop.type === 'SAFE');
      case 'BACK_YEAR':
        return shops.filter((shop) => shop.type === 'BACK_YEAR');
      default:
        return shops;
    }
  };

  if (showIntro) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('./introimage.png')} style={{ width: '90%', height: '90%' }} />
      </View>
    );
  }

  function removeBoldTags(str) {
    return str.replace(/<b>/g, '').replace(/<\/b>/g, '');
  }

  return (
    <View style={{ flex: 1 }}>
      {location ? (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {filterShops().map((shop, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: shop.latitude,
                longitude: shop.longitude,
              }}
            >
              <Callout onPress={() => fetchShopInfo(shop.name)}>
                <View>
                  <Text>{shop.name}</Text>
                  <Text>{shop.address}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>{errorMsg ? errorMsg : 'Loading Map...'}</Text>
        </View>
      )}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: getButtonColor('SAFE') }]}
          onPress={() => setFilter('SAFE')}
        >
          <Text>안심식당</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: getButtonColor('BACK_YEAR') }]}
          onPress={() => setFilter('BACK_YEAR')}
        >
          <Text>백년가게</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: getButtonColor('ALL') }]}
          onPress={() => setFilter('ALL')}
        >
          <Text>모두 보기</Text>
        </TouchableOpacity>
      </View>
      {shopInfo && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <Rating
            showRating
            onFinishRating={(rating) => saveRatedShop(shopInfo.title, rating)}
            style={{ paddingVertical: 10 }}
          />
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{removeBoldTags(shopInfo.title)}</Text>
            <Text>{shopInfo.address}</Text>
            <Text>{shopInfo.roadAddress}</Text>
            <Text>{shopInfo.telephone}</Text>
            {shopInfo.category && <Text>{shopInfo.category}</Text>}
            <Text>{shopInfo.description}</Text>
            <Text>별점: {ratedShops[shopInfo.title] || '아직 평가되지 않았습니다.'}</Text>

            {/* 블로그 리뷰 보기 버튼 */}
            {blogReviews.length > 0 && (
              <TouchableOpacity
                style={styles.openButton}
                onPress={() => {
                  const cleanShopName = removeBoldTags(shopInfo.title);
                  Linking.openURL(`https://search.naver.com/search.naver?query=${encodeURIComponent(cleanShopName)}`);
                }}

              >
                <Text style={styles.textStyle}>블로그 리뷰 보기</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>닫기</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
      {showRatedShopsModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showRatedShopsModal}
          onRequestClose={() => setShowRatedShopsModal(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{removeBoldTags('별점 입력한 가게')}</Text>
            {Object.entries(ratedShops).map(([shopName, rating], index) => (
              <View key={index} style={styles.ratedShop}>
                <Text>{removeBoldTags(shopName)}: {rating}⭐</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.openButton}
              onPress={() => setShowRatedShopsModal(false)}
            >
              <Text style={styles.textStyle}>닫기</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      <View style={styles.showRatedShopsButtonContainer}>
        <TouchableOpacity
          style={styles.showRatedShopsButton}
          onPress={() => setShowRatedShopsModal(true)}
        >
          <Text>별점 입력한 가게 보기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    position: 'absolute',
    top: 50,
    right: 10,
    flexDirection: 'column',
    zIndex: 10,
  },
  filterButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 50,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 15,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  showRatedShopsButtonContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 10,
  },
  showRatedShopsButton: {
    backgroundColor: 'skyblue',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
    marginBottom: 25,
    marginRight: 10,
  },
  ratedShop: {
    marginVertical: 5,
  }

});
