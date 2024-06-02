# Bonfire
초소형 SNS 서비스입니다.
[demo link - WIP](https://community-type.web.app/)

## Installation
1. clone this repository
2. `yarn install` install dependencies
3. setup `.env` file environment values
4. `yarn dev`
5. enjoy development !

### setup `.env` 
env 파일은 굳이 세팅하지 않아도 괜찮습니다. 
숨긴다고 숨겨봐야 찾아낼 수 있기 때문입니다.
보안을 강력히 하고 싶다면 firebase의 보안 규칙을 확인하세요.
[문서보기](https://firebase.google.com/docs/storage/security/rules-conditions?hl=ko&authuser=0&_gl=1*1p7ux2n*_ga*MTQxNjA2MTk4OC4xNzE3MjkxODYz*_ga_CW55HF8NVT*MTcxNzI5NzY1Ni4yLjEuMTcxNzI5ODM3NC42LjAuMA..#enhance_with_firestore)
```
  # firebase Keys
  VITE_FIREBASE_API_KEY: your apiKey
  VITE_FIREBASE_AUTHDOMAIN: your authDomain
  VITE_FIREBASE_RPOJECT_ID: your projectId
  VITE_FIREBASE_STORAGE_BUCKET: your storageBucket
  VITE_FIREBASE_MESSAGING_SENDER_ID: your messagingSenderId
  VITE_FIREBASE_APP_ID: your appId
  VITE_FIREBASE_MEASUREMENT_ID: your measurementId
```


## Project Doc
### Built With

|package name|version|
|------------|-------|
|React       |18.2.0 |
|typescript  |^5.2.2 |

*자세한 개발 스택은 package.json 참고*

### Pages
1. `routes/Home.tsx`: 메인페이지
2. `routes/login.tsx`: 로그인페이지
3. `routes/CreateAccount.tsx`: 회원가입페이지
4. `routes/Profile.tsx`: 프로필페이지
5. `routes/Search.tsx`: 검색페이지
...

<!-- ## Information
- [project notion- WIP](/)
  - {포함 항목}
  - 기획 배경
  - 와이어프레임
  - 태스크
  - 관련 기술 문서 등
- ... -->

## Author
- [Jinyeong Yun(윤진영)](https://www.linkedin.com/in/jinyeong-yun-1b995317a/) -->