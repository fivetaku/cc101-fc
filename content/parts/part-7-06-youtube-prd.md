---
course_clip_ref: "Part 7 / Ch 03 / Clip 6"
result_path: "50-my-work/Part07-실전/실습37-유튜브설계/ (앱 본체는 별도 ~/trendboard)"
next_clip_id: "part-7-07-youtube-dashboard"
---

# Part 7 / Clip 6: 유튜브 트렌드 대시보드 — PRD와 데이터 설계

> 강의 영상: Part 7 / Ch 03 / Clip 6 (~25분)
> 만드는 것: PRD 4종(`/show-me-the-prd`) + 키 2종(YouTube·Gemini) 발급 + Supabase 스키마(테이블 7 + `video_details` 뷰)
> 시연 주제: 여러 유튜브 채널의 "터진 영상" 자동 감지 대시보드 (TrendBoard)

---

## 이 클립에서 만드는 것

Part 7의 세 번째이자 마지막 프로젝트입니다. 워크스페이스(첫 프로젝트)를 짓고, LLM Wiki(두 번째 프로젝트)로 지식을 쌓았으니, 이번엔 **밖으로 나가는 서비스**를 만들 차례예요. 여러 유튜브 채널의 영상 성과를 매시간 수집해서, "채널 평균보다 몇 배나 터졌는지"를 숫자로 잡아내는 분석 대시보드. 이름은 TrendBoard입니다.

다만 이번 클립에서 코드를 짜지는 않습니다. 오늘은 **설계와 셋업**까지예요. 큰 서비스일수록 곧장 만들기 시작하면 중간에 무너집니다. 그래서 바이브코딩의 순서를 그대로 따라요 — PRD(제품 정의)를 먼저 쓰고, 데이터 모델을 정하고, 필요한 키를 발급받고, DB 뼈대를 깐 다음에야 다음 클립에서 코드를 생성합니다.

이번 프로젝트가 앞의 두 개와 크게 다른 점이 하나 있어요. **이번엔 진짜 키가 필요합니다.** Wiki까지는 본인 컴퓨터 안에서 다 끝났지만, 유튜브 데이터를 가져오고 AI 요약을 붙이고 시계열을 저장하려면 외부 서비스가 붙어요. 대신 결과물은 진짜 제품급입니다. 부담스러운 키 발급은 이 클립에 몰아서 한 번에 끝내요.

오늘 한 일과 안 한 일을 먼저 정리하면 이렇습니다.

| 단계 | 하는 일 | 어느 클립 |
|---|---|---|
| **PRD·구체화·키·스키마** | 설계도 + 키 발급 + DB 깔기 | **오늘(Clip 6) — 여기까지** |
| 코드 생성·연결 | 화면·수집·Outlier 계산 만들기 | 다음 클립(Clip 7) |
| 배포·자동화 | Vercel 배포 + 매시간 cron | Clip 8 |

이번 클립에서 할 일은 네 단계입니다. `/show-me-the-prd`로 PRD 4종 만들기 → 공통 사양으로 구체화 → 키 2종 발급 + Supabase 연결 → 스키마 적용. 여기까지 끝내면 다음 클립의 코드 생성이 누구 환경에서나 같은 결과를 내도록 출발선이 정리됩니다.

---

## 핵심 개념

### 단순 요약 다이제스트가 아니라 "성과 분석" 도구입니다

먼저 이 앱이 무엇을 만드는 건지 정확히 잡고 갑시다. 흔히 떠올리는 "관심 채널 새 영상 모아보기"와는 결이 완전히 다릅니다.

| | 단순 다이제스트 | **TrendBoard** |
|---|---|---|
| 보여주는 것 | 새 영상 목록·요약 | Outlier Score·채널 평균 배율·V/S Ratio·트렌드 |
| 저장 방식 | 파일 한 장 | Supabase에 매시간 시계열 누적 |
| 필요한 것 | 없음 | 백엔드 + 키 2종(YouTube·Gemini) + Supabase 연결 |

한 문장으로 줄이면 **"평소를 알아야 터졌다를 안다"**예요. 어떤 영상이 평소보다 몇 배 터졌는지 판단하려면 그 채널의 "평소 조회수"를 알아야 하고, 평소를 알려면 조회수를 매시간 계속 쌓아야 해요. 그래서 단순 파일 저장으로는 안 되고, 시계열을 누적하는 백엔드(Supabase)가 있어야 합니다. 두 번째 프로젝트 LLM Wiki가 지식을 쌓아서 가치를 냈던 것과 같은 결이에요. 누적이 있어야 비교가 생깁니다.

### Outlier Score — 이 앱의 심장

이 앱이 정렬·랭킹의 기준으로 쓰는 점수입니다. 공식이 정확해야 다음 클립에서 만든 화면이 레퍼런스 앱과 같은 순서로 영상을 보여줘요. 여기서 한 번 제대로 익혀두면 구체화 단계에서 헷갈릴 일이 없습니다.

| 지표 | 식 | 뜻 |
|---|---|---|
| Ch. Avg 배율 | `views / 채널평균` | 채널 평균보다 몇 배 (예: 2.2x) |
| V/S Ratio | `views / 구독자 × 100` | 구독자 밖으로 얼마나 퍼졌나 (%) |
| **Outlier Score** | `(views / 채널평균) × 10 + V/S Ratio` | 정렬 기준 점수 |

```text
const views = row.views;
const avg   = row.channel_avg_views;   // 채널 평균 조회수
const subs  = row.subscriber_count;

const chAvgMultiplier = avg > 0 ? (views / avg) : 0;        // 1.6x, 2.2x
const vsRatio         = subs > 0 ? (views / subs) * 100 : 0; // 32.1%

// ★ 실제 공식: 배율×10 + V/S Ratio  (avg가 0이면 V/S Ratio만)
const outlierScore = avg > 0 ? (views / avg) * 10 + vsRatio : vsRatio;

const isOutlier     = chAvgMultiplier >= 1.5;  // 채널 평균 1.5배 이상
const isMegaOutlier = chAvgMultiplier >= 5.0;  // 5배 이상 (Top 0.1%)
```

여기서 두 가지를 꼭 기억하세요. 첫째, **Outlier Score는 배율만이 아닙니다.** `(views/avg)×10`에 V/S Ratio를 더해요. 이걸 빼고 "배율×10"으로만 만들면 실제 앱과 정렬 순서가 어긋납니다. 같은 배율이어도 구독자 대비 더 멀리 퍼진 영상이 점수가 높은 거죠. 둘째, **0으로 나누기 방지가 필수**입니다. 채널 평균(`avg_views`)이나 구독자 수가 0이면 그 항을 0으로 처리해요. 새로 등록한 채널은 수집 직후 `avg_views`가 0이라 V/S Ratio만으로 점수가 잡히는데, 수집이 쌓이면 자동으로 채워지니 걱정 안 해도 됩니다.

### 데이터 모델 — 7테이블 + `video_details` 뷰

이 앱이 다루는 데이터 구조입니다. 다음 클립의 코드는 결국 이 모델 위에서 돌아가요.

```text
channels (채널)
 ├── videos (영상)
 │    ├── video_snapshots (매시간 지표 — 시계열)
 │    └── content_summaries (AI 요약 + 키워드 + 태그, 영상당 1개)
 ├── trend_topics (키워드 트렌드 집계)
 ├── strategy_results (AI 전략 결과)
 └── admin_settings (Gemini 키·모델·프롬프트·비번 설정)

 video_details (뷰) = videos + channels + 최신 snapshot + content_summaries
                    → 프론트 분석 화면은 이 뷰 하나만 읽는다
```

테이블이 7개지만, 가장 중요한 건 마지막의 `video_details` **뷰**입니다. 이건 테이블이 아니라 여러 테이블을 미리 조인해둔 "단일 소스"예요. 화면 4페이지(Overview·Videos·Outliers·Trends)가 전부 이 뷰 하나만 읽어서 그려집니다. 뷰가 없거나 컬럼명이 어긋나면 어떤 화면도 데이터가 안 뜨는 이유죠.

**왜 snapshot을 따로 분리하나요?** 같은 영상의 조회수를 매시간 별도 행으로 쌓아야 시계열(성장률)과 "현재값 대비 채널 평균(Outlier)"을 계산할 수 있어서입니다. 영상 한 줄에 조회수를 덮어쓰면 평소가 사라져요.

그리고 이 뷰에서 컬럼명 두 개를 절대 바꾸면 안 됩니다.

| 헷갈리기 쉬운 곳 | 올바른 컬럼명 | 주의 |
|---|---|---|
| 영상 PK | `video_id` | `id`가 아님 — 뷰에서 `v.id AS video_id` |
| 스냅샷 시각 | `snapshot_at` | `collected_at`이 아님 — 뷰에서 별칭 부여 |

프론트가 `key={v.video_id}`로 화면을 그리니까, 이 두 컬럼명이 어긋나면 화면이 그대로 깨집니다. 구체화 단계에서 이걸 명시적으로 박아두는 이유가 바로 이거예요.

### 정직성 — kkirikkiri가 코드를, 클로드코드가 연결을

이 프로젝트의 역할 분담을 미리 정리해둡니다. 다음 클립에서 코드는 `/kkirikkiri`가 생성하지만, **"한 방에 백엔드까지 다 만들어진다"는 아닙니다.** 코드 생성은 kkirikkiri가 맡고, 그 코드를 실제 키·DB·배포에 연결하고 운영하는 건 클로드코드 몫이에요. 그래서 오늘 키와 스키마를 미리 준비해둡니다.

그리고 키 취급 원칙 하나를 처음부터 못 박아둡니다. **`service_role` 키와 YouTube·Gemini 키는 백엔드에만 둡니다.** 프론트엔드나 깃허브에는 절대 노출하지 않아요. YouTube API에서 `search.list`도 쓰지 않습니다(한 번에 100 units라 쿼터가 금방 터져요). 목업·하드코딩 데이터로 "완성"이라고 우기지도 않습니다 — 실제 YouTube API + Supabase 연동만 인정해요. 이 원칙들은 다음 클립에서 코드가 지켜야 할 가드레일이라, 설계 단계인 오늘 미리 알고 시작하는 게 맞습니다.

---

## 진행 흐름

오늘은 영상에서 한 줄 입력하면 본인도 같은 줄을 따라 입력하고 결과를 함께 확인하는 방식으로 갑니다. 네 단계예요. 작업 폴더와 공통 사양은 자동 셋업이 미리 깔아주니, 영상을 보면서 단계별로 따라오시면 됩니다.

### 1. 작업 폴더와 공통 사양 자동 준비

강의 워크스페이스에서 클로드코드를 켜고 시작합니다. 스킬이 호출되면 두 폴더가 자동으로 준비돼요.

```text
✓ 50-my-work/Part07-실전/실습37-유튜브설계/ 진도 폴더 준비
✓ trendboard/ 앱 폴더 준비 (코드는 다음 클립에서 생성)
✓ 사양 문서 + schema.sql을 trendboard/_spec/에 복사
  오늘 결과물: PRD 4종 + 키 2종(YouTube·Gemini) + Supabase 스키마
```

여기서 폴더 구조를 한 번 짚고 갑니다. **앱 본체는 진도 폴더가 아니라 별도의 `~/trendboard/`에 짓습니다.** 두 번째 프로젝트 LLM Wiki를 `~/my-wiki`에 따로 지었던 것과 같은 규칙이에요. 큰 프로젝트는 본체를 독립 폴더에 두고, 진도 기록(`README`)만 `50-my-work/` 안에 남기는 거죠.

```text
~/trendboard/                  ← 앱 본체 (다음 클립에서 코드가 채워짐)
└── _spec/                     ← 공통 사양 문서 + schema.sql (자동 복사됨)

~/fastcampus-cc/50-my-work/Part07-실전/실습37-유튜브설계/
└── README.md                  ← 진도 기록 (완료 시 자동 작성)
```

`_spec/`에 들어 있는 게 이 클립의 숨은 주인공입니다. 모든 수강생이 **동일한 사양**으로 출발하도록 미리 깔아둔 공통 컨텍스트예요. 이게 왜 중요한지는 곧 Phase 2에서 드러납니다.

### 2. STEP 1 — `/show-me-the-prd`로 PRD 4종 만들기

바이브코딩은 PRD부터입니다. 그런데 PRD를 직접 손으로 쓰진 않아요. **스킬에 시킵니다.** Part 6에서 스킬에 일을 맡겼던 것과 똑같아요 — 오늘은 `/show-me-the-prd`가 PRD를, 다음 클립의 `/kkirikkiri`가 코드를 맡습니다.

복사용 입력입니다.

```text
/show-me-the-prd 유튜브 채널들 영상 성과를 매시간 수집해서 '채널 평균 대비 터진 영상(Outlier)'을 자동으로 잡아내고, 트렌드 키워드까지 보여주는 분석 대시보드를 만들고 싶어.
```

스킬이 질문 5~6개를 던집니다. 답의 요지는 이렇습니다.

```text
사용자가 누구?      → 특정 분야 채널을 추적하는 나 (크리에이터/마케터/기획자)
핵심 기능은?        → 채널 등록 · 매시간 수집 · Outlier 감지 · AI 요약 · 트렌드 키워드
안 만드는 것은?     → 로그인/회원가입 · 결제 · 멀티플랫폼(X·Threads) · 댓글 감성분석
```

답을 마치면 PRD 4종(제품·데이터·단계·스펙)이 생성됩니다. 여기서 확인할 건 **범위가 Outlier + 트렌드로 좁혀졌는지**예요. 욕심내서 기능을 다 넣으려 하지 마세요. "안 만드는 것"을 함께 알려주는 게 범위가 새는 걸 막는 핵심입니다. 로그인·결제·멀티플랫폼은 개인용 단계에선 필요 없으니 처음부터 빼두세요.

| 확인 | PRD 4종 생성 / 범위가 Outlier + 트렌드로 좁혀짐(기능 욕심 X) / "안 만드는 것" 목록 포함 |

### 3. STEP 2 — PRD 구체화: 공통 사양으로 수렴 ★

이 단계가 오늘의 핵심입니다. 왜 그런지 먼저 짚을게요.

`/show-me-the-prd`는 **사람마다 다른 PRD**를 만듭니다. 같은 주제를 던져도 본인이 답한 내용에 따라 공식·함수 이름·뷰 컬럼이 제각각으로 나와요. 잘 만든 **이상형**일 뿐, 실제로 동작하는 사양은 아니라는 뜻이죠. 이걸 그대로 다음 클립의 kkirikkiri에 넣으면 누군 되고 누군 안 되는 상황이 생깁니다.

그래서 자동 셋업이 미리 깔아둔 **공통 사양(`trendboard/_spec/`)**으로 수렴시킵니다. PRD를 만드는 경험은 각자 하되, 빌드에 들어갈 사양은 하나로 통일하는 거예요. 그래야 다음 클립에서 kkirikkiri가 누구 환경에서나 같은 결과를 뽑아냅니다.

복사용 입력입니다.

```text
방금 만든 PRD에 trendboard/_spec/의 데이터모델·기술스택·BUILD-PROCESS 실제 사양을 박아줘 — video_details 뷰(컬럼 video_id·snapshot_at 보존), Outlier Score=(views/avg)*10+vsRatio, AI 태깅은 generate-tags(summarize 아님), 체인은 collect-data→generate-tags→extract-trends. kkirikkiri에 줄 통합 사양서로 정리해줘.
```

클로드코드가 PRD와 `_spec/` 문서를 대조해서 하나의 **통합 사양서**로 정리해줍니다. 이때 박히는 핵심 사양은 이런 것들이에요.

| 항목 | 박아야 할 실제 사양 |
|---|---|
| Outlier Score 공식 | `(views/avg)*10 + vsRatio` (V/S Ratio 더하기 빠지면 정렬 순서 달라짐) |
| 뷰 컬럼명 | `video_id`, `snapshot_at` 보존 (별칭) |
| AI 태깅 함수 | `generate-tags` (`summarize-videos`는 레거시, 만들지 않음) |
| 데이터 체인 | `collect-data` → `generate-tags` → `extract-trends`(7일/30일) |
| 화면 구성 | 7페이지 (Overview·Channels·Videos·Outliers·Trends·Strategy·Admin) |

| 확인 | Outlier Score 공식에 `+vsRatio` 포함 / AI 태깅 `generate-tags` 명시 / 뷰 컬럼명 보존 / 화면 7 + 체인 정리됨 |

여기가 오늘의 노하우 지점이에요. `/show-me-the-prd`가 만든 멋진 PRD를 실제 동작 사양으로 한 번 "조이는" 작업입니다. 이 한 단계가 다음 클립의 성패를 가릅니다.

### 4. STEP 3 — 키 2종 발급 + Supabase 연결

진입장벽 구간입니다. 천천히 같이 가요. 한 가지 다행인 건 — **Supabase는 클로드코드가 MCP(커넥터)로 직접 만든다**는 점이에요. 가입·프로젝트 생성·키 연결까지 대신 해주니까, 본인이 손으로 받아야 하는 건 YouTube·Gemini **2종뿐**입니다.

그리고 **전부 각자 본인 계정·본인 프로젝트로** 발급하세요. 영상에 나온 키를 같이 쓰면 안 됩니다 — 내 대시보드는 내 DB에 데이터를 쌓아야 의미가 있으니까요.

| # | 어디서 | 받는 것 | 메모 |
|---|---|---|---|
| 1 | **Supabase (MCP)** | "trendboard 프로젝트 만들어줘" → 클로드코드가 생성 | URL·anon 키 자동 연결 / `service_role`은 자동 주입 |
| 2 | Google Cloud | **YouTube Data API v3 Enable** → API 키 | `YOUTUBE_API_KEY` (손으로) |
| 3 | Google AI Studio | Get API key → Create API key | `GEMINI_API_KEY` (손으로) |

Supabase는 클로드코드에게 이렇게 부탁합니다.

```text
Supabase에 trendboard 프로젝트를 Seoul 리전으로 만들고,
Project URL과 anon(publishable) 키를 .env.local에 넣어줘.
```

클로드코드가 MCP로 프로젝트를 생성(보통 1분 내 활성화)하고, URL과 anon 키를 프론트 환경변수(`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`)로 자동 작성합니다. Supabase 커넥터가 `/mcp`에 없으면 수동 폴백으로 가면 됩니다(`_spec/`의 사전준비 문서 §1 참고).

YouTube 키는 Google Cloud에서 받습니다. 프로젝트를 만들고 → API 라이브러리에서 **YouTube Data API v3를 Enable** → 사용자 인증 정보에서 API 키를 생성하면 끝이에요. Gemini 키는 Google AI Studio에서 Get API key로 받습니다.

키가 들어가는 위치를 정확히 알고 가는 게 중요합니다.

| 키 | 들어가는 곳 | 노출 |
|---|---|---|
| Supabase URL / anon 키 | 프론트 `.env.local` | 공개 가능 |
| Supabase `service_role` 키 | Edge Function (자동 주입) | **비밀** |
| `YOUTUBE_API_KEY` | Edge Function Secrets | **비밀** |
| `GEMINI_API_KEY` | 앱 Admin 페이지 → `admin_settings` 테이블 | **비밀** |

`service_role` 키는 지금 메모만 해두고, 절대 프론트나 깃허브에 넣지 않습니다. 이건 Supabase가 Edge Function에 자동으로 주입하니 따로 발급하거나 설정할 필요도 없어요. Gemini 키는 좀 특이한데, 코드가 아니라 **앱 실행 후 Admin 페이지 UI**에서 등록합니다 — 재배포 없이 키를 교체할 수 있게 한 설계예요. 어쨌든 두 키 모두 오늘은 발급해서 메모까지만 해두면 됩니다.

| 확인 | YouTube·Gemini 키 메모 완료 / Supabase 프로젝트 MCP 생성됨 / `service_role`은 백엔드 전용(자동 주입)임을 인지 |

### 5. STEP 4 — `schema.sql` 적용으로 DB 뼈대 깔기

키를 받았으면 DB 뼈대를 깝니다. `_spec/`에 복사된 `schema.sql`을 본인 Supabase에 적용하면 돼요.

```text
trendboard/_spec/schema.sql을 내 Supabase에 MCP 마이그레이션으로 적용해줘. 테이블 7개랑 video_details 뷰가 생겨야 해. 뷰 컬럼명(video_id·snapshot_at)은 바꾸지 마.
```

클로드코드가 MCP 마이그레이션으로 스키마를 적용합니다. 적용이 끝나면 Supabase의 Table Editor에서 직접 확인하세요. 테이블 7개와 `video_details` 뷰가 생겼는지 보면 됩니다. 데이터가 아직 없어도(빈 결과) 에러 없이 조회되면 성공이에요.

```text
-- Supabase SQL Editor에서 확인
select video_id, snapshot_at from video_details;
-- → 빈 결과라도 에러 없이 나오면 OK
```

| 확인 | Table Editor에 7테이블 + `video_details` 뷰 존재 / `select video_id, snapshot_at from video_details` 에러 없음 |

이걸로 오늘의 설계와 셋업이 끝납니다. 다음 클립에서 kkirikkiri가 이 뼈대 위에 화면과 수집 로직을 얹어요.

---

## 결과물

이번 클립이 끝나면 아래가 남습니다.

| 결과물 | 위치 | 설명 |
|---|---|---|
| PRD 4종 | `~/trendboard/_prd/` (또는 진도 폴더) | 제품·데이터·단계·스펙 정의 |
| 통합 사양서 | `~/trendboard/_spec/통합-사양서.md` | PRD + 공통 사양 수렴 — 다음 클립 kkirikkiri 입력용 |
| `_spec/` 공통 사양 | `~/trendboard/_spec/` | 데이터모델·기술스택·BUILD-PROCESS + `schema.sql` |
| YouTube·Gemini 키 | 메모장 (안전한 곳) | `YOUTUBE_API_KEY`, `GEMINI_API_KEY` |
| Supabase 프로젝트 | 본인 Supabase 계정 | 7테이블 + `video_details` 뷰 적용 완료 |
| `README.md` | `50-my-work/Part07-실전/실습37-유튜브설계/` | 진도 기록 (자동 작성) |

`완료` 또는 `/wrap`을 입력하면 스킬이 정리합니다. `50-my-work/Part07-실전/실습37-유튜브설계/README.md`가 자동으로 작성되고, `progress.json`의 `practice_completed`에 `"실습 37"`이 기록돼요. 앱 본체(`~/trendboard/`)는 별도 폴더에 두고 진도 기록만 `50-my-work/` 안에 남기는 규칙은 두 번째 프로젝트 LLM Wiki 때와 똑같습니다.

WRAP 마지막에 회고 한 줄을 적습니다 — "단순 요약 다이제스트와 이 분석 도구의 차이를 한 줄로." 이 한 줄이 다음 클립에서 본인이 뭘 만드는지 다시 잡아줍니다.

---

## 자주 막히는 포인트

| 증상 | 원인 | 해결 |
|---|---|---|
| 키 발급이 너무 많아 부담됨 | 외부 서비스 첫 연결 | 이 클립에서 몰아서 끝내면 다신 안 합니다. `_spec/` 사전준비 문서 순서대로 천천히 |
| YouTube API 403 | API가 Enable 안 됨 | Google Cloud에서 **YouTube Data API v3를 Enable** 했는지 확인 |
| `service_role` 키 어디 쓰는지 모름 | 키 위치 혼동 | 지금은 메모만. 백엔드(Edge Function)에 자동 주입되니 프론트·깃엔 절대 금지 |
| 스키마 적용이 안 됨 | Supabase 커넥터 미연결 | `/mcp`에서 Supabase 연결 확인. 안 되면 SQL Editor에 `schema.sql` 직접 붙여넣기 |
| `video_details` 조회 시 컬럼 에러 | 뷰 컬럼명이 바뀜 | `v.id AS video_id`, `collected_at AS snapshot_at` 별칭 유지. 컬럼명 변경 금지 |
| Gemini 키를 `.env`에 넣어야 하나? | 키 위치 오해 | 아니요. Gemini 키는 앱 실행 후 **Admin 페이지 UI**에서 등록 (`admin_settings`) |
| Supabase 프로젝트가 안 만들어짐 | MCP 커넥터 없음 | `/mcp`에서 Supabase 연결부터. 폴백은 supabase.com에서 New project(Seoul) 수동 생성 |
| PRD에 기능을 더 넣고 싶음 | 범위 욕심 | 1차는 Outlier + 트렌드만. 알림·멀티플랫폼은 PRD의 "안 만드는 것"에 남겨둠 |
| 구체화 후에도 공식이 "배율×10"만 나옴 | `+vsRatio` 누락 | 통합 사양서에 `(views/avg)*10 + vsRatio` 명시 확인. 안 그러면 정렬 순서가 달라짐 |
| 7D 트렌드가 비어 보일까 걱정 | 미래 함정 미리 인지 | Trends는 `published_at` 기준 집계. 다음 클립에서 다룰 내용이니 지금은 스키마만 |
| `summarize-videos`로 만들어야 하나 | 레거시 함수 혼동 | AI 태깅은 `generate-tags`. `summarize-videos`는 레거시 — 만들지 않음 |

`막혔어요` 또는 `도와줘`로 도움을 요청할 수 있습니다.

---

## 다음 클립

→ [대시보드 만들기 — 터진 영상 잡아내는 화면](#part-7-07-youtube-dashboard)

다음 클립에서는 오늘 깔아둔 설계도 위에 진짜 코드를 얹습니다. 정리한 통합 사양서를 `/kkirikkiri`에 넣어 7페이지 화면과 수집 Edge Function을 생성하고, YouTube에서 실제 영상을 가져와 매시간 스냅샷을 쌓아요. 그런 다음 프론트에서 Outlier Score를 계산해 "터진 영상"을 화면에 띄웁니다. 코드 생성은 kkirikkiri가, 키·DB 연결과 검증은 클로드코드가 맡습니다. 오늘 사양을 정확히 조여둔 만큼, 다음 클립의 결과는 레퍼런스 앱과 같은 모습으로 나올 거예요.
