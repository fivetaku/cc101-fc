---
course_clip_ref: "Part 7 / Ch 03 / Clip 7"
result_path: "50-my-work/Part07-실전/실습38-대시보드만들기/ (앱 본체는 ~/trendboard)"
next_clip_id: "part-7-08-youtube-deploy"
---

# Part 7 / Clip 7: 대시보드 만들기 — 터진 영상 잡아내는 화면

> 강의 영상: Part 7 / Ch 03 / Clip 7 (~25분)
> 만드는 것: 로컬에서 도는 Outlier 분석 대시보드 (`~/trendboard` — 프론트 7페이지 + Edge Function 6종 + 수집 데이터 + AI 요약)
> 시연 주제: AI 분야 유튜브 채널 5개의 "채널 평균 대비 터진 영상"

---

## 이 클립에서 만드는 것

유튜브 대시보드는 Part 7의 세 번째 프로젝트인데, 이번 클립이 그 본론이에요. 지난 clip-06에서 PRD 4종을 뽑아 "실제 동작 사양"으로 못박았죠. Outlier Score 공식, `video_details` 뷰 컬럼명, Edge Function 6종, 체인 구조까지 박힌 **통합 사양서 한 장**이 손에 있을 거예요. 오늘은 그 위에 실제 코드를 얹고, 본인 Supabase에 연결해서 굴립니다.

끝 그림은 한 문장이에요. **"이 영상은 채널 평균보다 2.2배 터졌다"가 숫자로 뜨는 대시보드가 본인 노트북에서 돈다.** 채널 5개를 등록하면 매시간 수집된 조회수가 쌓이고, Outliers 페이지가 Score 내림차순으로 정렬해 보여줘요. 영상마다 Gemini가 한 줄 요약과 키워드 배지를 달아줍니다.

| Before (clip-06 끝) | After (clip-07 끝) |
|---|---|
| 통합 사양서 한 장 + 빈 Supabase 뼈대 | 본인 데이터가 쌓이고 Outlier가 숫자로 뜨는 화면 |
| 키 발급(YouTube·Gemini)만 손에 있음 | 키가 백엔드에 연결돼 수집·요약이 실제로 돈다 |
| "어떻게 만들지" 머릿속 설계 | 로그 보고 고치는 디버깅 경험 |

오늘 흐름의 뼈대는 **생성 → 연결 → 수집 → 검증** 입니다. 코드는 `/kkirikkiri`가 통째로 만들고, 그걸 본인 Supabase에 연결하고 굴리며 고치는 건 클로드코드와 함께해요. 그래서 이번 클립에서 가장 중요한 한 줄을 먼저 박아둘게요.

> **코드 생성은 kkirikkiri, 연결·운영은 클로드코드.** 한 방에 백엔드·배포까지 완성되는 마법 버튼은 없습니다. 만든 걸 굴리며 고치는 그 단계가 바이브코딩의 본체예요.

이번 클립에서 할 일은 6단계입니다. kkirikkiri로 코드 생성 → Supabase 연결 → Edge Function 배포 + Gemini 키 → 채널 등록·수집 → Outlier 대시보드 검증 → Gemini 요약·UI 개선.

---

## 핵심 개념

### kkirikkiri는 "한 방 완성 버튼"이 아니다

이게 오늘의 정직성 가드이자 가장 중요한 개념이에요. `/kkirikkiri`는 자연어 한 문장으로 에이전트 팀을 짜서 코드를 병렬로 생성합니다. 프론트 7페이지와 Edge Function 6종을 나눠 받아 동시에 써내려가요. 강력하긴 한데, **할 수 있는 것과 못 하는 것이 분명히 갈립니다.**

| | kkirikkiri (생성) | 클로드코드 (연결·운영) |
|---|---|---|
| 하는 일 | 프론트 7페이지 + Edge Function 6종 코드 + `schema.sql` 마이그레이션 작성 | Supabase 연결·배포·수집·디버깅 |
| 못 하는 일 | 인프라 연결, 키 등록, 체인 검증, 로그 기반 수정 | (코드를 처음부터 통째로 쓰는 건 kkirikkiri 몫) |
| 결과 | 로컬에 코드는 있지만 아직 아무것도 안 굴러감 | 실제 데이터가 쌓이고 화면이 그려짐 |

kkirikkiri가 만든 코드가 처음부터 완벽히 돌지 않아도 정상이에요. 특히 Edge Function 체인과 `video_details` 뷰 타입은 연결한 다음에 고치게 됩니다. **불완전한 생성물을 연결하며 고치는 그 단계**가 진짜 실습이고, 바이브코딩의 묘미도 거기 있어요.

### 데이터 흐름 — `collect-data` 한 콜이 진입점

이 앱의 데이터는 백엔드(Edge Function)가 만들어 PostgreSQL에 쌓고, 프론트가 그걸 읽습니다. 핵심은 **자동화 진입점이 `collect-data` 하나**라는 거예요. 이 함수 하나만 부르면 태깅·트렌드까지 HTTP 체인으로 연쇄됩니다.

```text
collect-data        : channels(활성) → YouTube playlistItems + videos
                      → videos UPSERT + video_snapshots INSERT → 채널 avg_views 재계산
   │  (HTTP 체인, Bearer service_role)
   ├─ generate-tags     : 요약 없는 영상 → Gemini → content_summaries UPSERT  ※ summarize-videos 아님
   ├─ extract-trends {7}: 키워드 빈도·성장률 집계 → trend_topics
   └─ extract-trends {30}

generate-strategy   : (별도 트리거) video_details outlier 상위 + trend_topics → Gemini → strategy_results
```

Edge Function은 6종입니다. `fetch-channel`(채널 등록), `collect-data`(수집 진입점), `generate-tags`(AI 요약·태깅), `extract-trends`(키워드 집계), `generate-strategy`(전략), `manage-settings`/`verify-admin`(설정·로그인). 여기서 함정 하나를 미리 짚어둘게요. **AI 태깅 함수는 `generate-tags`이고, `summarize-videos`는 레거시**입니다. 체인에 연결되는 건 `generate-tags`예요. kkirikkiri가 가끔 옛 이름으로 만드는데, 그러면 연결 단계에서 바로잡으면 됩니다.

### `video_details` 뷰 — 프론트가 읽는 단일 소스

프론트의 분석 4페이지(Overview·Videos·Outliers·Trends)는 테이블을 직접 조인하지 않아요. **`video_details`라는 뷰 하나**를 `select`로 읽어서 화면을 그립니다. 영상 + 채널 + 가장 최신 스냅샷 + AI 요약을 미리 조인해 둔 뷰예요.

이 뷰에서 **컬럼명 두 개가 결정적**입니다. 여기가 어긋나면 화면이 통째로 깨져요.

```text
video_details 뷰의 핵심 컬럼명
─────────────────────────────
영상 PK     : id  ❌  →  video_id  ✅   (뷰에서 v.id AS video_id)
스냅샷 시각 : collected_at  ❌  →  snapshot_at  ✅  (collected_at AS snapshot_at)
```

프론트가 `key={v.video_id}`로 리스트를 그리거든요. 그래서 뷰 컬럼명이 `id`나 `collected_at`으로 어긋나 있으면 select는 통과해도 화면이 빈칸이 됩니다. clip-06 사양서에 이 두 이름을 박아둔 이유가 이거예요. 연결 단계에서 `select video_id, snapshot_at from video_details`가 에러 없이 나오는지 꼭 확인하세요.

### Outlier Score 공식 — 단순 "배율 × 10"이 아니다

대시보드의 심장은 Outlier Score입니다. "채널 평균보다 몇 배 터졌나"를 점수로 환산하는 식이에요. 여기에도 함정이 하나 있어요. **단순 배율 × 10이 아니라 V/S Ratio를 더합니다.**

```ts
const views = row.views ?? 0;
const avg   = row.channel_avg_views ?? 0;   // 채널 평균 조회수
const subs  = row.subscriber_count ?? 0;

// Ch. Avg 배율 — 평균보다 몇 배 (1.6x, 2.2x)
const chAvgMultiplier = avg > 0 ? (views / avg) : 0;

// V/S Ratio — 구독자 대비 조회수 % (작은 채널의 떡상 감지)
const vsRatio = subs > 0 ? (views / subs) * 100 : 0;

// ★ Outlier Score — 배율×10 + V/S Ratio  (avg가 0이면 V/S Ratio만)
const outlierScore = avg > 0 ? (views / avg) * 10 + vsRatio : vsRatio;

// 분류
const isOutlier     = chAvgMultiplier >= 1.5;  // 채널 평균 1.5배 이상
const isMegaOutlier = chAvgMultiplier >= 5.0;  // 5배 이상 (Top 0.1%)
```

V/S Ratio를 더하는 이유는, 같은 배율이어도 구독자 대비 더 멀리 퍼진 영상의 Score가 높아야 하기 때문이에요. 단순 "배율 × 10"으로만 만들면 실제 앱과 정렬 순서가 달라집니다. 그리고 **모든 지표는 DB가 아니라 프론트(JS)에서 계산**해요. 뷰는 원천값(views, channel_avg_views, subscriber_count)만 주고, Score·배율·V/S는 화면에서 계산합니다.

자주 나오는 증상 하나를 미리 알려둘게요. **신규 채널은 수집 직후 `avg_views`가 0**입니다. 그러면 Score가 V/S Ratio만으로 잡혀요. 0으로 나누기를 막느라 그렇게 설계한 거라 정상입니다. collect-data를 한두 번 더 돌리면 평균이 채워집니다.

### 키는 백엔드에만 — 프론트·깃에 노출 금지

서비스를 만들 때 가장 사고가 나기 쉬운 지점이에요. 키 세 종류의 자리가 정해져 있습니다.

| 키 | 어디에 두나 | 절대 안 되는 것 |
|---|---|---|
| `SERVICE_ROLE_KEY` | Edge Function에 자동 주입 (설정 불필요) | 프론트·깃 노출 |
| `YOUTUBE_API_KEY` | Supabase Secret (백엔드만) | 프론트에 박기 |
| `gemini_api_key` | `admin_settings` 테이블 (RLS로 anon 차단) | 코드에 하드코딩 |
| `VITE_SUPABASE_PUBLISHABLE_KEY` (= anon) | `.env.local` → 프론트 OK | (공개 가능한 키라 예외) |

프론트에는 공개 가능한 anon 키만 들어가요. `service_role`·YouTube·Gemini 키는 전부 백엔드에서만 씁니다. `gemini_api_key`는 아예 DB의 `admin_settings`에 저장하고, RLS로 anon이 못 읽게 막아둬요. Admin 로그인을 거친 `manage-settings` 함수(service_role)만 읽고 씁니다. 연결이 끝나면 `anon`으로 `select gemini_api_key`가 안 보이는지 확인하세요. 이게 보안 검증이에요.

> YouTube 수집은 `playlistItems.list`(1 unit)로 합니다. `search.list`(100 units)는 쿼터를 100배 잡아먹어요 — **절대 쓰지 않습니다.** kkirikkiri가 search 기반으로 만들면 연결 단계에서 playlistItems 방식으로 바로잡습니다.

---

## 진행 흐름

영상과 함께 따라치는 6단계입니다. 영상에서 한 줄 입력하면 본인도 같은 줄을 입력하고, 결과를 같이 확인하는 방식이에요. 각 STEP의 입력은 실제로 동작하는 프롬프트니까 그대로 복사해서 쓰세요.

> 모든 수강생은 **자기 Supabase·자기 키**로 연동합니다. 공용 DB를 같이 쓰는 게 아니에요. 본인만의 개인 대시보드라 데이터도 본인 DB에 쌓입니다. 라이브 수집이 느리거나 막히면, 영상 화면으로 결과만 먼저 보고 본인 수집은 백그라운드로 두고 진행하세요.

### 1. `/kkirikkiri`로 코드 생성

한 줄씩 시키는 게 아니라 에이전트 팀에게 통째로 맡깁니다. clip-06에서 정리한 통합 사양서를 그대로 받아 화면과 함수를 나눠 만들죠.

**복사용 입력:**

```text
/kkirikkiri clip-06에서 정리한 통합 사양서대로 TrendBoard를 구현해줘.
Vite+React+TS+shadcn 다크 테마 프론트 7페이지, Supabase Edge Function 6종,
assets/schema.sql 마이그레이션까지. 03 문서의 DO/DON'T를 지켜줘.
```

kkirikkiri가 2~3개 질문을 던지고 에이전트 팀을 짜서 병렬로 돌립니다. 7페이지(Overview·Channels·Videos·Outliers·Trends·Content Strategy·Admin)와 사이드바 골격, Edge Function 6종 코드가 나와요.

| 확인 | 7페이지 + 사이드바 골격 생성 / Edge Function 6종 코드 생성. 불완전해도 정상 — 다음 STEP에서 연결하며 고침 |

생성물은 `~/trendboard`에 떨어집니다. 이 시점의 코드는 아직 아무 데도 연결돼 있지 않아요. 로컬에 파일만 덩그러니 있는 상태죠.

### 2. Supabase 연결

이제 클로드코드와 대화하며 본인 Supabase에 코드를 붙입니다. Supabase 커넥터가 `/mcp`에 연결돼 있으면 프로젝트 생성부터 스키마 적용까지 한 번에 끝나요.

**복사용 입력:**

```text
사양대로 Supabase에 연결하려는데 어떻게 하면 될까?
프로젝트가 없으면 MCP로 만들고, URL과 anon 키를 .env.local에 넣어줘(.gitignore에 추가).
클라이언트 연결 확인하고, clip-06에서 적용한 assets/schema.sql 스키마가
video_details 뷰까지 맞는지 확인해줘.
```

프로젝트명·리전(`trendboard`/Seoul)은 clip-06 사양서에 박혀 있으니 다시 안 쳐도 돼요. 클로드코드가 MCP로 프로젝트를 만들고, 키를 `.env.local`에 쓰고, 스키마 마이그레이션까지 합니다. 단, 프로젝트 생성 직전에 **"비용 $0, 만들까요?" 확인이 한 번** 떠요 — 안전장치라 자동으로 못 건너뜁니다. 여기만 `y`로 넘기면 돼요.

| 확인 | Table Editor에 7테이블 + `video_details` 뷰 / `select video_id, snapshot_at from video_details` 에러 없음 / `.env.local`이 gitignore에 포함(공개 가능한 anon만) |

### 3. Edge Function 배포 + Gemini 키

함수 6종을 본인 Supabase에 배포하고 키를 연결합니다. 여기서 **딱 한 곳만 수동**이라는 걸 기억하세요.

**복사용 입력:**

```text
Edge Function 6종을 MCP로 배포하려는데 어떻게 할까?
SUPABASE_URL과 SERVICE_ROLE_KEY는 함수에 자동 주입이라 설정이 필요 없고,
YOUTUBE_API_KEY만 Secret으로 넣어야 하는데 그 방법(대시보드/CLI)을 알려줘.
그다음 앱 띄워서 Admin 로그인(기본 trendboard2026, 바로 변경)하고 Gemini 키를 저장하자.
```

함수 6종 배포는 클로드코드가 MCP로 합니다. `SUPABASE_URL`·`SERVICE_ROLE_KEY`는 함수 실행 환경에 자동 주입되니 본인이 건드릴 게 없어요. **딱 하나, `YOUTUBE_API_KEY` Secret 등록만 MCP로 안 됩니다.** 대시보드의 Edge Functions → Secrets 메뉴에서 넣거나 CLI로 넣으세요.

```bash
supabase secrets set YOUTUBE_API_KEY=발급받은_키
```

그다음 앱을 띄워 Admin 페이지에 로그인합니다. 기본 비밀번호는 `trendboard2026`인데, **로그인하자마자 바로 변경**하세요. Admin에서 Gemini 키를 저장하면 `admin_settings`에 들어가고, 이후 `generate-tags`가 그 키로 Gemini를 호출합니다.

| 확인 | 함수 6종 배포(MCP) / `YOUTUBE_API_KEY` Secret 등록 / Admin 로그인 → Gemini 키 저장 / anon으로 `gemini_api_key` select 안 보임(RLS) |

### 4. 채널 등록 → 수집 (디버깅 핵심)

여기가 가장 많이 막히는 단계이자 오늘의 핵심이에요. 테스트 채널을 등록하고 수집을 돌려봅니다.

**복사용 입력:**

```text
테스트 채널 5개 등록하고 collect-data를 수동 실행하려는데 어떻게 할까?
videos·video_snapshots가 채워지고 channels.avg_views > 0이 되는지,
generate-tags 체인이 이어져 content_summaries에 키워드가 생기는지 확인해줘.
안 되면 Supabase Edge Function 로그를 보고 고쳐줘.
```

채널을 등록하면 `fetch-channel`이 채널 정보를 가져오고, 등록 직후 그 채널만 `collect-data`로 즉시 수집합니다. 수집이 돌면 `videos`·`video_snapshots`에 행이 쌓이고, 체인으로 `generate-tags`까지 이어져 `content_summaries`에 키워드가 생겨요.

여기서 막히면 **추측하지 말고 로그를 그대로 붙여넣으세요.** 이게 바이브코딩 디버깅의 본질입니다.

```text
[막혔을 때 — 에러 로그를 그대로 클로드코드에 붙여넣기]

Supabase 대시보드 → Edge Functions → 해당 함수 → Logs 복사
   ↓
클로드코드에 붙여넣고 "이 로그 보고 고쳐줘"
   ↓
클로드코드가 원인 짚고 코드 수정 → 재배포 → 재실행
```

흔한 증상 셋은 미리 알아두면 당황할 일이 없어요.

- **YouTube 403** → YouTube Data API v3가 비활성이거나 쿼터 초과. 콘솔에서 API 활성화 확인. `search.list`를 쓰고 있으면 안 됩니다.
- **Score 전부 0** → `avg_views`가 아직 0(신규 채널이면 정상). collect-data를 한두 번 더 돌리면 채워져요.
- **키워드 배지 안 뜸** → Admin에 Gemini 키를 저장 안 했거나, `summarize-videos`를 부르고 있음. 체인에 연결되는 건 `generate-tags`예요.

| 확인 | videos/snapshots 채워짐 / `avg_views > 0` / `content_summaries`에 키워드 / Shorts·Long 구분 |

> 라이브 수집이 느리면 영상 결과 화면을 먼저 봅니다 — "이렇게 데이터가 차면 다음 화면이 이렇게 됩니다." 본인 수집은 백그라운드로 두고 다음 STEP으로 넘어가도 됩니다. 수집은 본인 Supabase에 계속 쌓이고 있어요.

### 5. Outlier 대시보드 검증

데이터가 차면 Outliers 페이지가 화면을 그립니다. 이제 지표 공식이 사양대로 맞는지 검증해요.

**복사용 입력:**

```text
Outliers 페이지에서 Score 정렬·Ch.Avg 배율·필터가 02 공식대로 맞는지 확인하려는데 어떻게 볼까?
특히 outlierScore가 (views/avg)*10 + vsRatio인지(단순 배율×10 아님),
Tier 랭킹("#1 of N"), content_tags 컬러 배지까지 봐줘.
```

Outlier 테이블은 video_details를 읽어 프론트에서 지표를 계산합니다. Tier 랭킹은 `keywords[0]`로 영상을 그룹핑한 뒤 그룹 안에서 Score 내림차순 순위를 매겨 "#1 of 33" 식으로 보여줘요. content_tags는 7종(`Numbers`·`Free`·`Question`·`Time`·`Money`·`Success`·`Change`)이고 컬러 배지로 나옵니다.

| 확인 | Score 내림차순 정렬 / Ch.Avg 배율 초록 표시 / Format(Shorts·Long) 필터 / Tier "#1 of N" |

### 6. Gemini 요약 + 말로 개선

요약이 빠진 영상에 AI 요약을 채우고, 화면을 말로 다듬는 마무리 단계입니다.

**복사용 입력:**

```text
generate-tags로 요약 없는 영상에 한 줄 요약·키워드·태그를 생성해서
테이블에 컬러 배지로 보여주려는데 어떻게 할까?
그리고 Mega Outlier(5배 이상)는 빨간 배지로, 썸네일을 더 크게 바꿔줘.
```

`generate-tags`가 Gemini(`gemini-2.5-flash-lite`, temperature 0.3)로 요약 없는 영상을 배치(기본 20개)로 태깅합니다. 호출이 많으면 **429 rate limit**이 날 수 있어요. 이때는 15초 대기 후 재시도하고, 호출 간 1.5초 sleep을 두는 식으로 처리합니다. 요약이 채워지면 테이블에 컬러 배지가 떠요. 그다음 "Mega는 빨간 배지", "썸네일 더 크게" 같은 UI 개선을 말로 시키면 클로드코드가 바로 반영합니다. 이게 바이브코딩의 마무리 손질이에요.

| 확인 | `content_summaries`에 요약·키워드 / 테이블에 컬러 배지 / 말로 시킨 UI 개선 반영 |

---

## 결과물

이번 클립이 끝나면 아래가 남습니다. 앱 본체는 별도 폴더 `~/trendboard`에 짓고, 진도 기록만 `50-my-work`에 남기는 구조죠.

| 결과물 | 위치 | 설명 |
|---|---|---|
| 프론트 7페이지 | `~/trendboard/src/pages/` | Overview·Channels·Videos·Outliers·Trends·Strategy·Admin |
| Edge Function 6종 | `~/trendboard/supabase/functions/` | fetch-channel·collect-data·generate-tags·extract-trends·generate-strategy·manage-settings(+verify-admin) |
| `.env.local` | `~/trendboard/.env.local` | `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY`(=anon) (gitignore 포함) |
| 수집 데이터 | 본인 Supabase | channels·videos·video_snapshots·content_summaries |
| `README.md` | `50-my-work/Part07-실전/실습38-대시보드만들기/` | 진도 메타 + 회고 (자동 작성) |

`완료` 또는 `/wrap`을 입력하면 스킬이 정리합니다.

- `README.md` 자동 작성 — 오늘 한 6단계 + "생성 vs 연결" 정리 + 본인 회고 한 줄
- `progress.json`의 `practice_completed`에 `"실습 38"` 추가, `current_clip`은 `null`로
- WRAP 검증 — `~/trendboard/src/pages`와 `~/trendboard/supabase/functions`가 있는지 확인하고, Outliers 페이지에서 Score 정렬·키워드 배지를 직접 보도록 안내

회고는 한 줄이면 충분해요. **"kkirikkiri 생성과 클로드코드 연결, 둘의 역할 차이를 한 줄로."** 이 한 줄이 다음에 다른 서비스를 만들 때 본인의 첫 판단 기준이 됩니다.

---

## 자주 막히는 포인트

| 증상 | 원인 | 해결 |
|---|---|---|
| kkirikkiri 결과가 불완전 | 생성은 코드까지만 — 연결·체인은 다음 단계 | 정상입니다. 연결하며 클로드코드로 고침. 한 방 완성 기대 X |
| `select video_details` 통과하는데 화면이 빈칸 | 뷰 컬럼명이 `id`·`collected_at`으로 어긋남 | 뷰가 `v.id AS video_id`, `collected_at AS snapshot_at`인지 확인 |
| Score가 전부 0 | `avg_views`가 아직 0 (신규 채널) | collect-data 1~2회 더 실행하면 채워짐. 정상 동작 |
| 키워드 배지가 안 뜸 | Gemini 키 미저장 또는 `summarize-videos` 호출 | Admin에 Gemini 키 저장 확인 → 체인은 `generate-tags`(summarize-videos 아님) |
| YouTube 403 | YouTube Data API v3 미활성 또는 쿼터 초과 | 콘솔에서 API 활성화 + 쿼터 확인. `search.list` 쓰면 안 됨 |
| YouTube 쿼터가 금방 소진됨 | `search.list`(100 units) 사용 | `playlistItems.list`(1 unit)로 수집하도록 수정 |
| `generate-tags`가 429 | Gemini rate limit | 15초 대기 후 재시도, 호출 간 1.5초 sleep |
| `YOUTUBE_API_KEY`가 MCP로 안 들어감 | Secret 등록은 MCP 미지원 | 대시보드 Edge Functions → Secrets 또는 `supabase secrets set` |
| anon으로 `gemini_api_key`가 보임 | RLS 정책 누락 | `admin_settings` RLS — anon은 `admin_password`·`gemini_api_key` 차단 확인 |
| Supabase 프로젝트 생성에서 멈춤 | "비용 $0, 만들까요?" 안전장치 | 자동으로 못 건너뜀. `y`로 1회 승인 |
| Outlier 정렬 순서가 실제와 다름 | Score를 "배율×10"으로만 계산 | `(views/avg)*10 + vsRatio`로 수정 (V/S Ratio 누락) |
| Admin 로그인이 기본 비번 그대로 | `trendboard2026` 미변경 | 로그인 직후 즉시 변경 — 운영 전 필수 |
| 라이브 수집이 너무 느림 | 채널 영상이 많음(초기 최대 50개/채널) | 영상 결과 화면으로 먼저 보고, 본인 수집은 백그라운드로 |

막히면 `막혔어요` 또는 `도와줘`로 도움을 요청하면 돼요. 핵심은 늘 같습니다 — **에러 로그를 그대로 붙여넣고 고치는 것.** 추측이 아니라 로그로.

---

## 다음 클립

→ [배포하기 — 매시간 도는 자동 수집 서비스](#part-7-08-youtube-deploy)

지금 본인 대시보드는 노트북에서만 돕니다. 노트북을 끄면 수집도 멈춰요. 다음 클립에서는 이 앱을 GitHub에 올리고 Vercel에 배포해서 **공개 URL**로 띄웁니다. 그리고 `pg_cron`으로 매시간 `collect-data` 한 콜을 자동으로 부르게 만들어요. 진입점이 `collect-data` 하나라는 게 여기서 빛을 발합니다 — cron이 이것만 부르면 태깅·트렌드까지 체인으로 알아서 굴러가니까요. 배포할 때 가장 조심할 한 가지는 오늘 배운 그대로예요. **프론트와 깃에는 공개 가능한 anon 키만 — service_role·YouTube·Gemini 키는 백엔드에만.** 노트북을 꺼도 매시간 스스로 도는 진짜 서비스, 다음 클립에서 완성합니다.
