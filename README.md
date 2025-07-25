# 내 주변 안심 먹거리

> **“SNS 마케팅에 속지 말자! 국가가 인증한 진짜 안심 맛집을 찾는 앱”**

---

## 📱 앱 개요

- **앱 이름**: 내 주변 안심 먹거리  
- **개발 도구**: Expo Snack  
- **실행 링크**: [앱 실행하러 가기](https://snack.expo.dev/@nokcha111/133a3b)

### 🔧 주요 기능

- **국가 인증 맛집 제공**  
  - 중소벤처기업부 인증 `백년가게`
  - 농림축산식품부 인증 `안심식당`
- **사용자 별점 기능**  
  - 내가 평가한 맛집 모아보기
  - 개인만의 맛집 리스트 작성
- **위치 기반 지도 시각화**
- **외부 브라우저 연동 (블로그 리뷰)**

---

## 👥 대상 사용자

- SNS/바이럴 마케팅에 실망했던 사용자
- 위생과 안전을 중시하는 소비자
- 믿을 수 있는 식당을 탐색하고자 하는 미식가

---

## 📚 주요 개념 설명

### 백년가게
- 30년 이상 운영된 소상공인 가게 중, 정부 및 소상공인진흥공단에서 추천받은 신뢰 가게

### 안심식당
- 농림축산식품부 기준 3대 위생 수칙을 모두 충족한 인증 식당
  - 덜어먹기 가능한 도구 제공
  - 위생적인 수저 관리
  - 종사자 마스크 착용

---

## 🛠 개발 과정

### 사용 API
| API | 설명 |
|-----|------|
| **백년가게 API** | 공공데이터 포털 제공 |
| **안심식당 API** | 농림축산식품부 제공 |
| **Google Geocoding API** | 주소 → 위경도 변환 |
| **Naver 검색 API** | 부족한 상세 정보 보완 |

> Naver Maps API도 고려했으나 기능 제한으로 제외하였습니다.

---

## 🖼️ 앱 실행 화면

### ▶ 앱 인트로 & 위치 인식

<div align="center">
  <img src="https://github.com/user-attachments/assets/db90e648-535c-4d50-9847-6d7451ef5ba8" width="200" />
  <img src="https://github.com/user-attachments/assets/99575ccf-9395-4b56-a4e0-590b27eb9b35" width="200" />
</div>

<p align="center"><i>앱 초기 실행 및 사용자 위치 인식</i></p>

---

### ▶ 식당 종류별 필터 보기

<div align="center">
  <img src="https://github.com/user-attachments/assets/e1549bc6-1a1e-4eda-b7e7-c1fb217652c5" width="180" />
  <img src="https://github.com/user-attachments/assets/726841f9-1853-4e94-b966-12118419136c" width="180" />
  <img src="https://github.com/user-attachments/assets/dd376d5c-4ac7-4833-aa3f-aba8cc23d122" width="180" />
</div>

<p align="center"><i>전체 / 백년가게 / 안심식당만 보기</i></p>

### ▶ 마커 클릭 및 상세 정보 모달

<div align="center">
  <img src="https://github.com/user-attachments/assets/e9c25292-b2a9-4450-9b1a-e3d157038eea" width="200" />
  <img src="https://github.com/user-attachments/assets/d5f28424-11e8-4ef4-a2de-d4336c2c8298" width="200" />
</div>

<p align="center"><i>마커 클릭 시 상호명 표시 → 클릭하면 상세 정보 모달 팝업</i></p>

---

### ▶ 별점 평가 기능

<div align="center">
  <img src="https://github.com/user-attachments/assets/96fbd5ee-1869-4374-b1da-9f70846c0ded" width="200" />
  <img src="https://github.com/user-attachments/assets/8856262d-a166-4992-bdc8-68b6b25f8e27" width="200" />
</div>

<p align="center"><i>드래그 방식 별점 입력 기능 및 평가한 맛집 모아보기</i></p>

---


## 📮 문의

- 개발자: 주재오  
