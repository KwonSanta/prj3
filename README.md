# Spacehub 프로젝트 기획서

- - -

## 1. 프로젝트 개요

![img_1.png](img_1.png)
- - -

### 1.2 목적

- 사용자와 등록자간의 공실 중계 플렛폼

### 1.3 프로젝트 명

#### Spacehub

## 2. 주요기능

- - -

### 2.1.1 회원가입 및 로그인

- 사용자 혹은 호스트는 각 용도에 맞게 회원가입 및 로그인을 할 수 있습니다.

### 2.2.1 공간 등록

- 호스트가 자신의 공간을 등록하여 자신의 공간을 시간 단위로 공유할 수 있습니다.

### 2.1.2 공간 예약 및 결제

- 사용자는 원하는 공간을 찾아 예약하고 결제하여 호스트의 공간을 시간단위로 대여할 수 있습니다.

### 2.1.3 리뷰 및 평가

- 사용자는 해당 공간을 대여 후에 평점 혹은 리뷰를 남길 수 있습니다.

### 2.1.4 커뮤니티

- 공지사항 Q&A등을 통하여 사용자는 관리자에게 질문하거나 사이트의 소식을 전달받을 수 있습니다.

---

## 4. 기술 스택

- 프론트 엔드
    - ReactJS, Router, ChakraUI, ChakraIcon, FontAwesome
- 백엔드
    - Java21, SpringBoot3.1, SpringSecurity, Lombok ,JWT,OAuth2.0
- 데이터베이스
    - MariaDB, Mybatis
- 기타
    - Git, GitHub, Notion, Docker, AWS
- 개발환경
    - IntelliJ

---

## 5. 개발 일정

- 1단계 기획 및 설계 (1주일)
    - 요구사항 정의
    - 비지니스 로직 작성
    - 기술 스택 선정
- 2단계 : 개발 (2주일)
    - 프론트 엔드 구현
    - 백엔드 구현
    - 데이터베이스 구축 및 연동
- 3단계 : 테스트 및 보완(1주일)
    - 시스템 테스트
    - 보완 및 버그 수정
- 4단계 : 배포
    - 서버 배포
    - 운영 모니터링