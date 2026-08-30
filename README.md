# 🌟 NOVA ENTERTAINMENT | Global K-POP Label Landing Page

글로벌 K-POP 시장을 선도하는 차세대 엔터테인먼트 레이블 **노바 엔터테인먼트(NOVA ENTERTAINMENT)**의 인터랙티브 공식 반응형 웹 애플리케이션입니다.

---

## ✨ 주요 특징 및 핵심 기능

1. **하이엔드 네오 퓨처리스틱 & K-POP 럭셔리 비주얼 디자인**
   - 딥 다크 테마, 앰비언트 글로우 라이팅, 글래스모피즘(Glassmorphism) 블러 UI
   - 콘서트 그랜드 피아노 배경 비주얼 및 공고딕(Gong Gothic) 아웃라인 타이포그래피

2. **D-DAY 컴백 카운트다운 & 공식 유튜브 '천사와춤을' 연동**
   - 대표 걸그룹 `VIVID9` 신보 발매 타이머 (일/시/분/초 실시간 갱신)
   - 유튜브 표준 16:9 썸네일 렌더링 및 오류 없는 원클릭 고화질 감상 오버레이

3. **글로벌 다국어(i18n) 실시간 언어 전환 (KR / EN)**
   - 상단 네비게이션 및 푸터의 `[ KR / EN ]` 토글 스위치 제공
   - 메뉴, 소개, 통계 수치, 아티스트 프로필, 투어 일정, 뉴스 및 지원 모달까지 실시간 번역 지원

4. **소속 아티스트(Artists) 라인업 & 카테고리 필터**
   - 보이그룹, 걸그룹, 솔로 아티스트 필터링 (`ALL`, `GIRL GROUP`, `BOY GROUP`, `SOLO`)
   - 아티스트 카드 클릭 시 상세 프로필, 멤버 구성, 대표곡 스트리밍 및 음원 플랫폼 링크 모달 제공

5. **최신 음원 및 앨범(Latest Releases) 쇼케이스**
   - 앨범 아트워크, 타이틀곡 정보 및 공식 뮤직비디오 플레이어 모달 연동

6. **2026 월드 투어 & 라이브 콘서트 일정 (World Tour)**
   - 서울, 도쿄돔, LA 크립토닷컴 아레나, 런던 O2 아레나 등 글로벌 투어 일정 및 티켓팅 상태(Sold Out, Tickets Open, Coming Soon) 표시

7. **글로벌 오디션 (Global Audition) 온라인 지원 시스템**
   - 보컬, 댄스, 랩, 프로듀싱 부문 온라인 지원서 입력 폼 모달 및 접수 시뮬레이션

8. **구글 시트(Google Sheets) 실시간 기록 & 환영 이메일 발송 시스템**
   - 뉴스레터/유튜브 구독 시 `google_sheets_subscribers.csv` 및 JSON 데이터베이스에 자동 기록
   - 공식 가입 환영 및 VIP 멤버십 혜택 안내 이메일 발송 연동

9. **로컬 BGM 플레이어 (Watercolor Bus Stop.mp3)**
   - 상단 네비게이션 바의 `BGM` 버튼 클릭 시 고음질 오디오와 반응형 사운드 웨이브 재생/일시정지

---

## 📁 프로젝트 파일 구조

```
TEST02/
├── index.html                    # 메인 랜딩페이지 HTML (다국어 i18n 지원)
├── server.py                     # 구글시트 기록 및 이메일 발송 지원 파이썬 서버
├── google_sheets_subscribers.csv # 구글시트 연동 구독자 데이터베이스
├── subscribers.json              # 백엔드 구독자 JSON 데이터
├── README.md                     # 프로젝트 안내 문서
├── BGM Sound/
│   └── Watercolor Bus Stop.mp3   # 배경음악 음원 파일
├── images/
│   └── piano_hero_bg.jpg         # Hero 섹션 배경 이미지
├── css/
│   ├── style.css                 # 메인 스타일시트 (공고딕 웹폰트, 글래스모피즘, 반응형)
│   └── animations.css            # 키프레임 애니메이션 및 인터랙션 이펙트
└── js/
    ├── data.js                   # 아티스트, 앨범, 투어, 뉴스 및 i18n 다국어 사전
    └── main.js                   # 다국어 엔진, 모달, 카운트다운, BGM, 구독 로직
```

---

## 🚀 실행 방법

### 방법 1. 파이썬 간이 서버로 실행 (권장)
터미널에서 아래 명령어를 실행하면 브라우저가 자동으로 실행됩니다.
```bash
python server.py
```

### 방법 2. index.html 직접 실행
브라우저에서 `index.html` 파일을 직접 더블 클릭하여 실행할 수 있습니다.
