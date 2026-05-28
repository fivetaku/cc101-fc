---
course_clip_ref: "Part 6 / Ch 02 / Clip 6"
result_path: "50-my-work/Part06-스킬만들기/실습27-검색API스킬/"
next_clip_id: "part-6-07-web-crawl"
---

# Part 6 / Clip 6: 검색 API — 네이버 뉴스 → 뉴스레터 HTML

> 강의 영상: Part 6 / Ch 02 / Clip 6 (~20분)
> 만드는 것: `naver-news` 스킬 + `scripts/fetch_news.py` + HTML 뉴스레터 자동 생성
> 시연 주제: "클로드코드" 키워드 뉴스레터

---

## 이 클립에서 만드는 것

Clip 5의 패턴을 한 번 더 굴리면서 한 단계 더 나갑니다. 외부 API + 스크립트 분리는 이미 익혔어요. 이번엔 거기에 두 가지를 얹습니다.

- **AskUserQuestion 인터랙티브** — 호출 시점에 사용자에게 옵션을 물어보는 패턴. 정렬 기준(최신순/관련도순)과 시간 범위(6h/24h/48h)를 답변받아 결과를 다르게 만듭니다.
- **HTML 출력** — 마크다운 한 장이 아니라 카테고리 헤더 + 모바일 반응형 디자인이 들어간 뉴스레터 한 페이지를 자동으로 만듭니다.

만드는 스킬은 `naver-news`. "클로드코드 뉴스레터 만들어줘" 같은 자연어 한 마디로 호출하면, 네이버 검색 API에서 관심 키워드 뉴스를 모으고 HTML 뉴스레터로 정리해줍니다.

전과 후의 차이는 이렇습니다.

- 매일 아침 네이버에 키워드 검색하던 작업이 한 마디 호출로 끝납니다.
- 본인 일에 그대로 가져가요. 마케팅은 브랜드 모니터링, PO는 경쟁 키워드, 영업은 고객사 동향. 키워드만 바꾸면 됩니다.
- (선택) 매일 자동 발행까지 가면 GitHub Pages에 누적 뉴스레터가 쌓입니다. 본인 도메인 뉴스 아카이브가 되어요.

이번 클립에서 할 일은 다섯 단계입니다 (선택 1단계 추가). 네이버 API 키 발급 → 워크플로우 잡기 → 분리 정의 → 스킬 + 스크립트 작성 → 호출 테스트 → (선택) 매일 자동 발행.

---

## 핵심 개념

### Clip 5와의 공통 패턴 + 새 두 가지

같은 분리 흐름을 한 번 더 굴려보면 패턴이 손에 더 잡힙니다.

| 단계 | Clip 5 trip-advisor | Clip 6 naver-news |
|---|---|---|
| 키 발급 | 공공데이터포털 TourAPI | 네이버 개발자센터 |
| `.env` 변수 | `TOURAPI_SERVICE_KEY` | `NAVER_CLIENT_ID` + `NAVER_CLIENT_SECRET` |
| Python 스크립트 | `tour_api.py` (5 액션) | `fetch_news.py` (검색 + 24h 필터) |
| 인터랙티브 | 자연어 입력만 | **AskUserQuestion 2단** (정렬·시간) |
| 산출 | 마크다운 가이드 | **HTML 뉴스레터** (모바일 반응형) |

뼈대는 같습니다. 키는 `.env`에, 결정론 호출은 Python으로, 자유도는 SKILL.md 본문에. 새로 들어오는 두 가지(인터랙티브 + HTML)도 같은 분리 원칙을 따라요. 인터랙티브 답변 받는 단계는 SKILL.md 본문(자유도), 받은 답변으로 API 파라미터 만드는 부분은 `fetch_news.py`(결정론).

### AskUserQuestion 2단 — 정렬과 시간 범위

뉴스 모음은 사람마다 원하는 결이 다릅니다. 최신 뉴스만 좁게 보고 싶을 수도 있고, 한 주 치 흐름을 보고 싶을 수도 있어요. 호출 시점에 두 가지를 묻습니다.

```text
Q1: 정렬 기준?
   - 최신순 (시간 우선)
   - 관련도순 (정확도 우선)

Q2: 시간 범위? (최신순 선택 시만)
   - 6시간 이내 (속보 위주)
   - 24시간 이내 (오늘)
   - 48시간 이내 (이틀)
```

답변에 따라 `fetch_news.py`에 넘기는 파라미터가 달라집니다. 자동 모드(매일 무인 발행)에서는 AskUserQuestion이 못 뜨니까 "최신순 + 24h" 고정값으로 떨어지게 분기를 둡니다.

### HTML 뉴스레터 — 카테고리 그룹핑 + 모바일 반응형

검색 결과 5개를 그냥 던지면 그건 검색이지 뉴스레터가 아니에요. 뉴스레터는 같은 키워드에 묶인 기사를 **카테고리**로 그룹핑하고, **트렌드 인사이트** 한 줄을 곁들여야 의미가 생깁니다.

```text
[뉴스레터 구조]
- 헤더: 키워드 + 발행일 + 통계 한 줄
- 카테고리 1: 공식 발표 / 보도자료
- 카테고리 2: 외부 매체 보도
- 카테고리 3: 커뮤니티 반응
- 푸터: 다음 호 예고 + 출처 링크
```

HTML 출력은 모바일 화면에서도 깨지지 않게 단순 CSS로. 클로드코드한테 "모바일 반응형, 가독성 우선"이라고만 명시하면 무난하게 떨어집니다.

### 사전 준비 — 네이버 개발자센터 키 발급

키 발급은 5분 정도면 끝납니다.

```text
1. https://developers.naver.com 접속 → 로그인
2. "Application" → "애플리케이션 등록"
3. 사용 API: "검색"
4. 비로그인 오픈 API: "WEB 설정"
5. URL: http://localhost
6. 등록 → Client ID + Client Secret 복사
```

받은 두 값을 `.env`에 한 줄씩 보관합니다.

```text
~/fastcampus-cc/.env
─────────────────────
TOURAPI_SERVICE_KEY=...        ← Clip 5에서 등록한 것
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
```

`.gitignore`에 등록돼 있어 깃엔 안 올라가요. Clip 5와 같은 위치, 같은 패턴입니다.

---

## 진행 흐름

### 1. `/part06` 호출 → Clip 6 선택 + 네이버 키 발급

강의 워크스페이스에서 시작합니다.

```text
/part06
```

자동 셋업이 진도 폴더와 스크립트 폴더를 준비합니다.

```text
✓ ~/fastcampus-cc/50-my-work/Part06-스킬만들기/실습27-검색API스킬/newsletter/ 준비 완료
✓ ~/fastcampus-cc/.claude/skills/naver-news/scripts/ 준비 완료
```

여기서 네이버 키 발급부터 넣어두세요. 위 "사전 준비" 안내대로 5분 정도면 끝납니다. 발급된 ID/Secret을 `.env`에 등록한 다음 STEP 1로.

### 2. STEP 1 — 워크플로우 잡기

```text
네이버 검색 API로 키워드 뉴스 모아서 뉴스레터 만들려는데,
어떻게 워크플로우를 구성해야 할까?
```

정리되는 단계는 보통 이런 모습이에요.

```text
1. 키워드 + 정렬 + 시간 범위 입력 받기
2. 네이버 검색 API 호출 (뉴스 카테고리)
3. 결과 클린업 (HTML 태그 제거, 중복 제거)
4. 시간 범위 필터 (지정 시간 이내만)
5. 카테고리 그룹핑 (공식/외부/커뮤니티)
6. HTML 뉴스레터 한 장 생성
7. 결과물 저장 (newsletter/{날짜}-{키워드}.html)
```

### 3. STEP 2 — AI vs 결정론 분리 + 인터랙티브 위치 결정

이번엔 분리 안이 한 단계 더 들어가요. AskUserQuestion 위치를 명시합니다.

```text
정리된 단계 좋은데 분리 안 보완하자.

[fetch_news.py — 결정론]
- 네이버 API 호출
- HTML 태그 제거 (<b>, &quot; 같은 entity)
- 24h/48h/6h 시간 범위 필터링

[SKILL.md 본문 — 자유도]
- AskUserQuestion으로 정렬·시간 질문 (2단)
- 카테고리 그룹핑 판단
- 트렌드 인사이트 한 줄 정리

자동 모드 분기:
- AskUserQuestion 응답이 없는 경우 (무인 자동 모드)
  → 정렬=최신순, 시간=24h 고정값
```

### 4. STEP 3 — 스킬화 + fetch_news.py 분리

```text
지금 정의한 분리 안대로 naver-news 스킬을 만들어줘.

위치:
- ~/fastcampus-cc/.claude/skills/naver-news/SKILL.md
- ~/fastcampus-cc/.claude/skills/naver-news/scripts/fetch_news.py

SKILL.md description: "네이버 뉴스·뉴스레터·키워드 모니터링·트렌드 정리" 키워드

fetch_news.py 요건:
- 네이버 검색 API 호출 (https://openapi.naver.com/v1/search/news.json)
- 헤더: X-Naver-Client-Id, X-Naver-Client-Secret (.env 에서 읽기)
- 파라미터: query, sort (date/sim), display (50)
- 응답 클린업: <b> 태그 제거, &quot; 같은 entity 디코드
- 시간 범위 필터링: pubDate 기준 6h/24h/48h
- JSON 형태로 결과 반환

SKILL.md 본문 요건:
- AskUserQuestion 2단 (정렬 → 시간 범위, 정렬이 관련도면 시간 질문 생략)
- 무인 모드 분기 (응답 없으면 최신순 + 24h 고정)
- 카테고리 그룹핑 (공식 보도자료 / 외부 매체 / 커뮤니티)
- HTML 뉴스레터 생성 (모바일 반응형, 가독성 우선)
- 결과물: ~/fastcampus-cc/50-my-work/Part06-스킬만들기/실습27-검색API스킬/newsletter/{YYYYMMDD}-{키워드}.html
```

생성된 파일을 안티그래비티에서 열어보세요. 스킬 폴더와 스크립트가 함께 들어가 있어야 합니다.

```text
~/fastcampus-cc/.claude/skills/naver-news/
├── SKILL.md
└── scripts/
    └── fetch_news.py
```

### 5. STEP 4 — 호출 테스트 + AskUserQuestion 2단

클로드코드 재시작 후 자연어로 호출합니다.

```bash
exit
claude
```

```text
클로드코드 뉴스레터 만들어줘
```

description이 매칭되면 첫 질문이 떠요.

```text
Q1. 정렬 기준?
1) 최신순
2) 관련도순
```

답하면 두 번째 질문 (최신순일 때만).

```text
Q2. 시간 범위?
1) 6시간 이내
2) 24시간 이내
3) 48시간 이내
```

답하면 스크립트가 굴러가면서 `newsletter/{YYYYMMDD}-클로드코드.html` 파일이 떨어집니다. 브라우저에서 열어 결과를 봅니다.

```bash
open ~/fastcampus-cc/50-my-work/Part06-스킬만들기/실습27-검색API스킬/newsletter/{YYYYMMDD}-클로드코드.html
```

카테고리 헤더, 모바일 가독성, 인사이트 한 줄이 다 들어가 있어야 합니다.

### 6. STEP 5 — 본인 키워드로 응용

클로드코드 키워드는 시연용. 본인 일에 가져갈 키워드를 한 번 더 호출해보세요.

```text
[마케팅] "본인 브랜드명" 또는 경쟁사명
[PO]    "본인 제품 카테고리" + "트렌드"
[영업]   "고객사명" 또는 "업계 키워드"
[학습]   "관심 분야" + "최신"
```

같은 스킬에 키워드만 바꾸면 됩니다. 매번 새로 만들 필요가 없어요.

### 7. (선택) STEP 6 — 매일 자동 발행 + GitHub Pages

여기까지가 이번 클립의 핵심이고, 더 응용하고 싶은 분만 STEP 6으로 갑니다.

자동 발행 흐름은 네 가지로 나뉩니다.

**① index.html 누적 로직** — 매일 새 HTML 한 장이 떨어지면, `newsletter/index.html`에 그 날짜 링크 한 줄을 맨 위에 추가합니다. 시간이 지나면 자연스럽게 누적 목록이 쌓여요.

**② GitHub Pages 켜기** — 강의 워크스페이스 GitHub repo(Part 5 Clip 5에서 만든)의 Settings → Pages → Source = main 으로 설정. `newsletter/` 폴더가 웹에서 보이게 됩니다.

```text
https://{본인-깃허브-아이디}.github.io/{repo}/newsletter/index.html
```

**③ 클라우드 환경변수** — `/schedule`로 등록하는 루틴은 로컬 `.env`를 못 봅니다. 클라우드 환경변수로 `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`을 따로 등록해야 해요.

**④ /schedule 루틴 등록** — 매일 정해진 시간에 자동 호출.

```text
/schedule 매일 오전 8시에 "클로드코드 뉴스레터 만들어줘. 결과 newsletter/에 저장하고 깃허브에 푸시" 실행
```

루틴이 등록되면 매일 아침 자동으로 HTML이 생성되고, GitHub Pages에 푸시까지 됩니다. 브라우저에서 본인 도메인 뉴스 아카이브를 매일 받아볼 수 있어요.

---

## 결과물

이번 클립이 끝나면 아래가 남습니다.

| 결과물 | 위치 | 설명 |
|---|---|---|
| `SKILL.md` | `~/fastcampus-cc/.claude/skills/naver-news/SKILL.md` | 스킬 본문 (AskUserQuestion + 자동 분기) |
| `fetch_news.py` | `~/fastcampus-cc/.claude/skills/naver-news/scripts/fetch_news.py` | 네이버 API + 24h 필터 |
| `.env` 두 줄 | `~/fastcampus-cc/.env` | `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` |
| `{YYYYMMDD}-{키워드}.html` | `실습27-검색API스킬/newsletter/` | HTML 뉴스레터 |
| `index.html` (선택) | `실습27-검색API스킬/newsletter/` | 누적 발행 모드일 때만 |

`완료` 또는 `/wrap`을 입력하면 `progress.json`의 `practice_completed`에 `"실습 27"`이, `skills_created`에 `"naver-news"`가 추가됩니다.

---

## 자주 막히는 포인트

| 증상 | 원인 | 해결 |
|---|---|---|
| 네이버 키 발급 안 됨 | 사용 API 설정 누락 | "검색" 체크 + WEB 설정 + URL `http://localhost` |
| 네이버 API 호출이 401 | Client ID/Secret 헤더 오타 | `X-Naver-Client-Id`, `X-Naver-Client-Secret` (대소문자 정확히) |
| 응답에 `<b>` 태그가 박혀 옴 | 클린업 누락 | `fetch_news.py`에서 `re.sub(r'<.*?>', '', text)` |
| `&quot;` 같은 entity가 그대로 | HTML 디코드 누락 | `html.unescape(text)` |
| 24h 필터가 안 먹음 | pubDate 파싱 실패 | 네이버 API 응답의 pubDate는 RFC 822 형식. `email.utils.parsedate_to_datetime` 사용 |
| AskUserQuestion이 안 뜸 | description에 인터랙티브 명시 누락 | SKILL.md 본문 시작 부분에 AskUserQuestion 호출 명시 |
| 무인 모드에서 멈춤 | AskUserQuestion 응답 대기 | 무인 분기 로직 추가 — `if interactive: ask else: default(최신순, 24h)` |
| HTML이 데스크탑 PC에서만 예쁨 | 모바일 미디어 쿼리 누락 | `@media (max-width: 600px)` 추가 요청 |
| 카테고리 그룹핑이 엉성 | 분류 로직 모호 | "도메인이 .go.kr/.or.kr/공식 보도자료 → 공식 / 그 외 → 외부 / fmkorea/dcinside → 커뮤니티" 식으로 명시 |
| 매일 자동 발행 루틴이 실패 | 로컬 .env 못 읽음 | 클라우드 환경변수로 키 별도 등록 |
| 깃허브 푸시가 자동 안 됨 | 루틴 프롬프트에 푸시 단계 누락 | "결과 newsletter/에 저장 + git add + commit + push" 명시 |

---

## 다음 클립

→ [Part 6 / Clip 7: 웹 크롤링 — insane-search로 KREAM 트렌드](#part-6-07-web-crawl)

CH02 두 클립으로 외부 API + 스크립트 분리 패턴이 손에 잡혔습니다. 다음 클립부터는 CH03 — 업무 자동화로 넘어가요. 첫 주제는 API가 없는 사이트도 자동화하는 방법. KREAM 같은 상업 사이트의 데이터를 외부 플러그인으로 가져와서, 남녀 인기 브랜드 트렌드 리포트를 HTML 매거진 형태로 만듭니다.
