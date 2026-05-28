---
course_clip_ref: "Part 6 / Ch 03 / Clip 7"
result_path: "50-my-work/Part06-스킬만들기/실습28-웹크롤링스킬/"
next_clip_id: "part-6-08-meeting-notes"
---

# Part 6 / Clip 7: 웹 크롤링 — insane-search로 KREAM 트렌드

> 강의 영상: Part 6 / Ch 03 / Clip 7 (~30분)
> 만드는 것: `fashion-trend` 스킬 — 키워드 입력 → KREAM 남녀 인기 브랜드 비교 → 다크 에디토리얼 매거진 HTML 리포트
> 도구: `insane-search` 플러그인 (4단계 적응형 안티봇 우회)
> 시연 주제: 인기 반팔티 트렌드

---

## 이 클립에서 만드는 것

CH02에서는 공식 API가 있는 사이트(TourAPI, 네이버)를 다뤘어요. 이번 클립은 **공식 API가 없는 사이트**에서 데이터를 가져오는 흐름입니다. 대상은 KREAM — 한정판 패션 거래 플랫폼. 봇 차단이 들어가 있어서 일반 `requests` 같은 라이브러리로는 막힙니다.

해결 도구는 `insane-search` 플러그인. WAF·CAPTCHA·로그인 벽을 만나면 자동으로 다음 우회 단계로 올라가는 4단계 적응형 방식이에요. 한 번 설치하면 자연어로 부르는 순간 알아서 발동됩니다.

만드는 스킬은 `fashion-trend`. "요즘 인기 반팔티 트렌드" 같은 자연어로 호출하면, 키워드 하나로 KREAM 남녀 인기 상품을 동시에 가져와 비교한 뒤 매거진 스타일 HTML 리포트로 정리해줍니다.

> ⚠️ **크롤링 주의** — robots.txt와 이용약관을 확인하세요. 과도한 요청은 자제(요청 간 딜레이 설정), 개인정보·로그인 영역은 제외, 수집 데이터는 본인 분석용으로만. 상업 사이트 우회는 본인 책임이에요.

이번 클립은 **CH03 스크립트 분리 패턴의 예외**입니다. Clip 5, 6에서는 결정론 단계를 본인이 작성한 Python 스크립트로 빼냈어요. 여기선 그 결정론 단계를 외부 플러그인(`insane-search`)이 대신 떠맡습니다. "결정론은 코드로" 원칙은 같되, 그 "코드"가 본인 스크립트가 아니라 검증된 플러그인이라는 변형이에요.

이번 클립에서 할 일은 다섯 단계입니다. 플러그인 설치 → 워크플로우 잡기 → URL 조립 정의 → 스킬 작성 → 호출 테스트 + 주기 실행.

---

## 핵심 개념

### 왜 라이브러리 대신 플러그인인가

기존 도구들과 비교해보면 차이가 보입니다.

| 도구 | 안티봇 우회 | 설치 | 비고 |
|---|---|---|---|
| `requests` + BeautifulSoup | ❌ | pip | 정적 페이지 OK, 봇 차단 사이트엔 막힘 |
| Playwright (MCP) | △ | 무거움 (Chromium 다운로드) | 기본 단일 방식, 막히면 끝 |
| **insane-search** | ✅ 4단계 적응형 | 플러그인 2줄 (API 키 X) | 막히면 단계 올림 + 한국 사이트 내장 지원 |

`pip install` 없고, 브라우저 다운로드 없고, 셀렉터 직접 작성도 없습니다. 깔고 자연어로 물으면 끝이에요. `curl_cffi`, `feedparser`, `yt-dlp` 같은 의존성도 필요할 때 자동 설치. Twitter·Reddit·HackerNews 등은 플랫폼 API로, 한국 사이트는 네이버 검색·쿠팡·fmkorea를 내장 지원합니다.

### 4단계 적응형 우회

`insane-search`는 한 가지 방식만 쓰지 않아요. 첫 단계가 막히면 다음 단계로 올라가는 구조입니다.

| 단계 | 방식 | 비고 |
|---|---|---|
| Phase 0 | 특수 엔드포인트 인덱스 확인 | 가장 가벼움 |
| Phase 1 | WebFetch + Jina Reader + User-Agent 변형 | 경량 탐침 |
| Phase 2 | TLS 핑거프린트 위장 | `curl_cffi`로 쿠키·헤더 모방 |
| Phase 3 | Playwright 전체 브라우저 렌더링 | JS 챌린지 대응 |

본인이 어느 단계를 쓸지 정하지 않아도 돼요. 막히면 자동으로 다음 단계로 올라갑니다.

### KREAM URL 조립 — 키워드 하나로 남녀 두 결과

링크를 미리 받지 않습니다. 키워드 하나만 받아서 성별별 정렬 URL을 두 개 조립해요.

```text
https://kream.co.kr/search
   ?keyword={키워드}        ← URL 인코딩 (예: 반팔티)
   &tab=products
   &sort={정렬}             ← male_popularity 또는 female_popularity

남성용: ...?keyword=반팔티&tab=products&sort=male_popularity
여성용: ...?keyword=반팔티&tab=products&sort=female_popularity
```

두 URL을 `insane-search`로 각각 스크래핑 → 상품명, 브랜드, 가격, 거래량 추출 → **남녀 인기 브랜드 비교**가 핵심입니다.

### 패션 에디터 톤의 매거진 HTML 리포트

단순 데이터 표 X. 다크 에디토리얼 매거진 톤으로 정리하면 본인 일에 그대로 가져가기 좋아요.

```text
[리포트 구조]
- 표지: 키워드 + 발행일 + 한 줄 인사이트
- Section A: 남성 인기 TOP 10 (브랜드·가격·거래량)
- Section B: 여성 인기 TOP 10
- Section C: 남녀 비교 — 겹치는 브랜드 / 성별 고유 브랜드
- Section D: 패션 에디터 관점 한 단락 분석 (가격대·시즌·브랜드 동향)
```

### 날짜 파일명 — 주기 실행으로 트렌드 변화 추적

같은 키워드를 한 번만 보면 그건 스냅샷이에요. 주기적으로 쌓아야 트렌드 "변화"가 보입니다. 그래서 파일명 앞에 날짜를 붙이는 규칙으로 고정해요.

```text
원본 데이터:  artifacts/kream-{키워드}-{성별}-{YYYY-MM-DD}.md
              예: kream-반팔티-남성-2026-05-25.md

리포트:       trend-report/{YYYY-MM-DD}-{키워드}-{성별}.html
              예: 2026-05-25-반팔티-남성.html
```

날짜로 정렬·비교가 일관됩니다. `/schedule`로 "매주 월요일 오전 9시 자동 수집"을 걸어두면, 6/01·6/08·6/15 같은 날짜별 스냅샷이 쌓이면서 순위 변동(예: 스투시 1위↑, 무신사스탠다드 신규 진입)이 자연스럽게 드러나요.

### 사전 준비 — insane-search 플러그인 설치 (2줄)

플러그인 설치는 2줄. API 키 발급 같은 사전 절차가 없어요.

```text
/plugin marketplace add https://github.com/fivetaku/gptaku_plugins.git
/plugin install insane-search
```

설치 후 클로드코드 재시작하면 자동으로 활성화됩니다.

---

## 진행 흐름

### 1. `/part06` 호출 → Clip 7 선택

강의 워크스페이스에서 시작합니다.

```text
/part06
```

자동 셋업이 진도 폴더와 스킬 폴더를 준비합니다.

```text
✓ ~/fastcampus-cc/50-my-work/Part06-스킬만들기/실습28-웹크롤링스킬/trend-report/ 준비 완료
✓ ~/fastcampus-cc/.claude/skills/fashion-trend/ 준비 완료
ℹ insane-search 플러그인 설치 필요 — 위 사전 준비 참고
```

위 "사전 준비" 안내대로 플러그인을 설치한 다음 STEP 1로 넘어가세요.

### 2. STEP 1 — 워크플로우 잡기

```text
KREAM에서 키워드의 남녀 인기순을 가져와서
어떤 브랜드가 뜨는지 분석해 트렌드 리포트 만들려는데,
어떻게 워크플로우를 구성해야 할까?
```

정리되는 단계는 보통 이런 모습입니다.

```text
1. 키워드 + 성별(남/여/둘다) 입력 받기
2. 키워드로 KREAM 정렬 URL 두 개 조립 (male_popularity / female_popularity)
3. insane-search로 두 URL 스크래핑
4. 상품 데이터 추출 (브랜드·가격·거래량)
5. 남녀 비교 — 공통 / 성별 고유 브랜드 식별
6. 패션 에디터 관점 인사이트 한 단락 작성
7. 다크 에디토리얼 매거진 HTML 리포트 생성
8. 날짜 파일명으로 저장
```

### 3. STEP 2 — URL 조립 + 인터랙티브 정의

링크를 직접 받지 않고 키워드 + 성별만 받는 게 핵심이에요.

```text
정리된 단계 보완하자.

[입력 인터랙티브]
- Q1: 키워드? (자유 입력)
- Q2: 남성/여성/둘다?

[URL 조립 — SKILL.md 본문]
- 키워드 URL 인코딩
- sort 파라미터 분기 (male_popularity / female_popularity / 둘 다 호출)

[수집 — insane-search 플러그인 호출]
- 본인 스크립트 없음. 플러그인이 결정론 역할
- "fashion-trend가 스크래핑은 직접 안 하고 플러그인을 부른다"는 패턴

[분석·리포트 — SKILL.md 본문]
- 데이터 추출 + 남녀 비교
- 패션 에디터 톤 한 단락
- HTML 매거진 디자인
```

### 4. STEP 3 — 스킬 작성 (스크립트 분리 없음)

```text
지금 정의한 흐름대로 fashion-trend 스킬을 만들어줘.

위치: ~/fastcampus-cc/.claude/skills/fashion-trend/SKILL.md

description: "트렌드 분석·인기 브랜드·KREAM·패션 트렌드·시즌 동향" 키워드

SKILL.md 본문 요건:
- AskUserQuestion 2단 (키워드 → 남/여/둘다)
- KREAM URL 조립 (male_popularity / female_popularity 분기)
- insane-search 플러그인 호출 (직접 스크래핑 X)
- 데이터 추출 + 남녀 비교 분석
- 다크 에디토리얼 매거진 HTML 리포트 (모바일 반응형)
- 패션 에디터 톤 한 단락 (가격대·시즌·브랜드 동향)

날짜 파일명 규칙 (반드시 준수):
- 원본 데이터:  artifacts/kream-{키워드}-{성별}-{YYYY-MM-DD}.md
- HTML 리포트:  trend-report/{YYYY-MM-DD}-{키워드}-{성별}.html
- 저장 위치:    ~/fastcampus-cc/50-my-work/Part06-스킬만들기/실습28-웹크롤링스킬/
```

생성된 SKILL.md를 안티그래비티에서 한 번 열어보세요. 스크립트 폴더가 없는 게 정상입니다 (외부 플러그인이 결정론 역할이라).

### 5. STEP 4 — 호출 테스트

클로드코드 재시작 후 자연어로 호출합니다.

```bash
exit
claude
```

```text
요즘 인기 반팔티 브랜드 트렌드 정리해줘
```

description 매칭되면 첫 질문이 떠요.

```text
Q1. 키워드? (기본: 반팔티)
Q2. 남성 / 여성 / 둘다?
```

답변하면 `insane-search` 플러그인이 두 URL을 스크래핑합니다. 막히면 자동으로 Phase 0 → 1 → 2 → 3으로 올라가요. 1~3분 정도 걸립니다.

완료되면 두 파일이 떨어져요.

```text
실습28-웹크롤링스킬/
├── artifacts/
│   ├── kream-반팔티-남성-2026-05-25.md  ← 원본 데이터
│   └── kream-반팔티-여성-2026-05-25.md
└── trend-report/
    ├── 2026-05-25-반팔티-남성.html      ← HTML 리포트
    └── 2026-05-25-반팔티-여성.html
```

브라우저에서 HTML을 열어 결과를 봅니다. 남녀 인기 TOP 10, 비교 섹션, 패션 에디터 분석 한 단락이 다 들어가 있어야 해요.

### 6. STEP 5 — 본인 업계 응용 + 주기 실행으로 트렌드 변화 추적

KREAM은 시연이고, 같은 패턴은 다른 곳에도 그대로 갑니다.

| 업계 | 적용 대상 |
|---|---|
| 마케팅 | 쿠팡 인기 상품 / 11번가 베스트 |
| 영업 | 고객사 공식 사이트 공지 |
| 운영 | 경쟁사 가격표·신제품 |
| 학습 | HackerNews·arXiv 일일 정리 |

스킬 이름을 바꾸지 않고 SKILL.md의 URL 조립 부분만 손보면 같은 흐름이 다른 사이트에 갑니다.

**주기 실행** — 트렌드 "변화"를 추적하려면 `/schedule`로 등록하세요.

```text
/schedule 매주 월요일 오전 9시에 "요즘 인기 반팔티 트렌드 정리해줘" 실행
```

매주 자동으로 같은 자리에 새 스냅샷이 쌓이면, 6/01의 1위 브랜드와 6/15의 1위 브랜드를 비교해 순위 변동이 보입니다. 본인이 직접 차이를 계산하지 않아도 돼요. 리포트에 "직전 스냅샷 대비 순위 변동" 섹션을 추가하면 더 풍부해집니다.

---

## 결과물

이번 클립이 끝나면 아래가 남습니다.

| 결과물 | 위치 | 설명 |
|---|---|---|
| `SKILL.md` | `~/fastcampus-cc/.claude/skills/fashion-trend/SKILL.md` | 스킬 본문 (스크립트 분리 X — 플러그인 호출) |
| `kream-{키워드}-{성별}-{YYYY-MM-DD}.md` | `실습28-웹크롤링스킬/artifacts/` | 원본 수집 데이터 |
| `{YYYY-MM-DD}-{키워드}-{성별}.html` | `실습28-웹크롤링스킬/trend-report/` | HTML 매거진 리포트 |
| (선택) /schedule 루틴 ID | 클로드코드 루틴 | 매주 자동 수집 |

`완료` 또는 `/wrap`을 입력하면 `progress.json`의 `practice_completed`에 `"실습 28"`이, `skills_created`에 `"fashion-trend"`가 추가됩니다.

---

## 자주 막히는 포인트

| 증상 | 원인 | 해결 |
|---|---|---|
| `insane-search 플러그인 확인되지 않음` | 플러그인 미설치 | `/plugin marketplace add https://github.com/fivetaku/gptaku_plugins.git` 후 `/plugin install insane-search` |
| 스크래핑이 1~3분 넘게 걸림 | Phase 3까지 올라감 (Playwright 렌더) | 정상. KREAM이 봇 차단 단계가 높아서 그럼. 기다리거나 백그라운드 |
| 스크래핑 결과가 비어 있음 | URL 조립 오류 (키워드 인코딩 누락) | `urllib.parse.quote(키워드)` 명시 — SKILL.md에 추가 요청 |
| 가격이 다 "0원"으로 나옴 | 데이터 추출 셀렉터 변경됨 | 클로드코드한테 "현재 화면 구조에 맞춰 가격 셀렉터 재확인" 요청 |
| 남녀 비교가 같은 결과를 두 번 반복 | URL의 sort 파라미터 미적용 | URL 조립 시 `male_popularity` / `female_popularity` 차이 확인 |
| HTML 리포트가 흰 배경 | 다크 에디토리얼 톤 누락 | SKILL.md에 "어두운 배경 + 흰 글자, 매거진 톤" 명시 |
| 본인 업계 사이트에서 막힘 | robots.txt 또는 이용약관 위반 | 해당 사이트 정책 확인 후 사용 — 본인 책임. 공식 API가 있다면 그쪽 우선 |
| 매주 자동 수집이 안 됨 | 루틴 등록 누락 | `/schedule` 입력 시 정확한 자연어 + 시간 명시 |
| 트렌드 변화가 안 보임 | 첫 호출만 했음 | 같은 키워드로 2~3주 반복해 누적해야 변화가 잡힘 |
| `fashion-trend`가 KREAM 외 다른 사이트에 안 맞음 | SKILL.md가 KREAM URL 하드코딩 | 본인 사이트용으로 SKILL.md 사본 만들어 URL 조립 부분만 교체 |

---

## 다음 클립

→ [Part 6 / Clip 8: 오디오/영상 → 문서 (회의록 자동화)](#part-6-08-meeting-notes)

다음 클립에서는 텍스트 데이터 말고 **오디오·영상**을 다룹니다. 회의 녹음이나 유튜브 영상을 자동으로 전사 + 화자 분리 + 5가지 문서 유형(회의록·강의·팟캐스트·인터뷰·발표) 자동 판별까지. 시연용 회의 녹음이 없어서 유튜브 영상으로 우회 시연하지만, 본인 회의 녹음에 그대로 적용할 수 있어요.
