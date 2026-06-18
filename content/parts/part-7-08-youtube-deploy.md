---
course_clip_ref: "Part 7 / Ch 03 / Clip 8"
result_path: "50-my-work/Part07-실전/실습39-배포하기/"
next_clip_id: "part-8-01-growth-report"
---

# Part 7 / Clip 8: 배포하기 — 매시간 도는 자동 수집 서비스

> 강의 영상: Part 7 / Ch 03 / Clip 8 (~22분)
> 만드는 것: 공개 URL(Vercel) + 매시간 자동 수집(Supabase pg_cron) + 트렌드 화면 마무리 + 운영하며 개선
> 시연 주제: 본인 관심 분야 유튜브 채널 5개로 도는 Outlier 대시보드

---

## 이 클립에서 만드는 것

Clip 7에서 본인 컴퓨터 안에서 도는 트렌드 대시보드를 만들었어요. 채널을 등록하면 영상을 수집하고, "이건 채널 평균 2.2배 터졌다"가 숫자로 뜨고, AI 요약까지 붙는 화면이었습니다. 한계가 딱 하나 있었죠. **본인 컴퓨터에서, 본인이 켜야만** 돌아간다는 것.

이번 클립은 그 로컬 대시보드를 두 단계로 끌어올립니다. 먼저 인터넷에 올려서 **어디서든 접속되는 공개 URL**로 만들고, 그다음 본인이 안 켜도 **매시간 알아서 데이터가 쌓이는 자동 수집 서비스**로 바꿉니다. 이 클립이 끝나면 본인 분석 도구가 인터넷에 살아 있고, 자는 동안에도 시계열 데이터가 쌓여 있어요.

여기서 헷갈리기 쉬운 게 하나 있어요. "그냥 정적 페이지를 다시 올리는 것"과 "매시간 도는 서비스를 운영하는 것"은 완전히 다릅니다.

| | 단순 재배포 | TrendBoard 운영 |
|---|---|---|
| 무엇이 도나 | 정적 페이지를 다시 올림 | 매시간 조회수를 기록해 시계열로 누적 |
| 효과 | 최신 내용 반영 | 데이터가 쌓일수록 Outlier 판정이 정확 |
| 자동화 위치 | 없음 (수동) | 클라우드 cron (본인 컴퓨터 안 켜도 됨) |

이 차이가 핵심이에요. TrendBoard는 **백엔드(Supabase)가 있는 원본**이라, "내 컴퓨터에 cron을 거는" 방식이 아니라 **서버 cron(pg_cron)이 정답**입니다. 매시간 도는 것도 단 하나, `collect-data` 함수뿐이에요. 그 안에서 `generate-tags`, `extract-trends`까지 체인으로 알아서 따라옵니다.

이번 클립에서 할 일은 네 단계입니다. **트렌드 화면 마무리 → GitHub + Vercel 배포 → Edge Function 배포 + 매시간 pg_cron → 운영하며 말로 개선.** Part 7의 마지막 클립이자, 세 번째이자 마지막 프로젝트의 완성이기도 해요.

---

## 핵심 개념

### "한 번 만든 앱"이 "매시간 도는 서비스"가 되는 지점

지금까지 Part 7에서 만든 세 프로젝트를 떠올려 보세요. 워크스페이스도, LLM Wiki도, Clip 7의 대시보드도 전부 "본인이 부르면 도는" 도구였습니다. 이번 클립의 cron 등록 한 줄이 그 성격을 바꿔요.

```text
[Clip 7까지]
나 → 클로드코드/대시보드 호출 → 결과
     (내가 부를 때만 돈다)

[Clip 8 이후]
Supabase pg_cron (매시간 정각)
     ↓
collect-data 1콜
     ↓
generate-tags → extract-trends(7일) → extract-trends(30일)  ← 체인 자동
     ↓
video_snapshots에 시계열 한 줄 더 쌓임
     (내가 안 켜도 돈다)
```

본인이 자는 동안에도, 노트북을 닫아둔 주말에도 매시간 데이터가 쌓입니다. 데이터가 쌓일수록 채널 평균 조회수(`avg_views`) 계산이 안정되고, "평균 대비 몇 배 터졌나"라는 Outlier 판정이 정확해져요. **시계열을 운영한다**는 게 이런 뜻입니다.

### 체인 구조 — collect-data 하나만 부르면 끝나는 이유

매시간 cron이 부르는 함수가 왜 `collect-data` 하나뿐인지 짚고 갑니다. Clip 7에서 Edge Function들을 만들 때, `collect-data` 끝에 다음 함수들을 차례로 호출하는 체인을 심어뒀거든요.

```text
collect-data
 ├─ YouTube playlistItems.list로 영상 메타·조회수 수집 → video_snapshots INSERT
 └─ 끝에서 HTTP 체인 (Bearer: service_role)
     ├─ POST generate-tags                  (요약·키워드·content_tags)
     ├─ POST extract-trends {period_days: 7}
     └─ POST extract-trends {period_days: 30}
```

각 호출은 `await`하되, 한 단계가 실패해도 전체는 성공 응답을 돌려주도록 짜여 있어요(개별 채널 실패 시 건너뛰기). 그래서 cron이 부를 대상은 **체인의 머리인 `collect-data` 하나**면 충분합니다. 머리만 당기면 몸통이 따라오는 구조예요.

한 가지 짚어둘 게 있어요. 이 수집 엔진은 YouTube의 `search.list`를 쓰지 않습니다. `search.list`는 호출 한 번에 쿼터(API 사용량)를 크게 먹어서, 매시간 돌리면 금방 한도가 터져요. 대신 채널의 업로드 재생목록을 읽는 `playlistItems.list`를 씁니다. "매시간 도는 서비스"가 쿼터로 죽지 않게 하려는 설계예요.

### 키는 어디에 두나 — 프론트 vs 백엔드 (가장 중요)

배포에서 단 하나만 기억해야 한다면 이겁니다. **공개되어도 되는 키만 프론트에, 비밀 키는 백엔드에.** Vercel에 올라가는 프론트엔드 환경변수는 빌드되면 브라우저로 그대로 노출돼요. 누구나 개발자 도구로 들여다볼 수 있다는 뜻입니다. 그래서 키를 어디 두느냐가 보안의 거의 전부예요.

| 키 | 어디에 | 노출돼도 되나 | 이유 |
|---|---|---|---|
| `VITE_SUPABASE_URL` | Vercel(프론트) | OK | 프로젝트 주소일 뿐 |
| `VITE_SUPABASE_PUBLISHABLE_KEY` (anon) | Vercel(프론트) | OK | RLS로 보호됨 |
| `YOUTUBE_API_KEY` | Supabase Secrets(백엔드) | **금지** | 쿼터·과금 직결 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Secrets(백엔드) | **절대 금지** | RLS를 우회하는 만능 키 |
| Gemini API 키 | 앱 Admin 페이지(`admin_settings`) | **금지** | 과금 직결 |

`VITE_`로 시작하는 두 개(URL·anon)만 Vercel에 넣습니다. anon 키는 공개돼도 안전해요. Supabase의 RLS(Row Level Security)가 막아주거든요. 반면 `service_role` 키는 RLS를 통째로 우회하는 만능 열쇠라, 프론트나 깃허브에 단 한 번이라도 올라가면 데이터베이스 전체가 열립니다. 그래서 비밀 키 셋은 **Edge Function Secrets(백엔드)에만** 두고, Gemini 키는 배포 후 앱 Admin 페이지에서 한 번만 저장하세요.

> 이 원칙은 Part 7 전체를 관통하는 "코드 생성은 kkirikkiri, 연결·운영은 클로드코드"의 운영 쪽 핵심이에요. 코드 한 방으로 배포까지 끝나는 게 아닙니다. 키를 어디 둘지 판단하고 검증하는 그 단계가 본인 몫이에요.

### pg_cron이 막히면 — 두 가지 대체 경로

매시간 자동화에는 길이 세 가지 있고, 위에서부터 권장입니다. 환경에 따라 pg_cron이 막힐 수 있으니 대체안을 미리 알아두세요.

| 방법 | 어떻게 | 언제 |
|---|---|---|
| A. Supabase pg_cron | SQL Editor에서 `cron.schedule` 등록 | 권장 — 가능하면 이쪽 |
| B. 외부 cron (cron-job.org) | URL에 매시간 POST 거는 무료 서비스 | pg_cron이 막힐 때 |
| C. GitHub Actions | 매시간 워크플로로 함수 URL을 curl | 수집 스크립트형일 때 |

세 방법 모두 결국 하는 일은 똑같아요. **매시간 정각에 `collect-data` URL로 POST 요청 한 번** 보내는 거죠. pg_cron은 `pg_net` 확장이 필요한데, 이게 활성화 안 되는 환경이면 B(cron-job.org)로 가면 됩니다. 효과는 같아요.

### Supabase Free 티어의 7일 함정 — cron이 곧 keep-alive

Supabase 무료 플랜에는 함정이 하나 있어요. **7일간 요청이 한 번도 없으면 프로젝트가 일시중지**됩니다. 그런데 매시간 cron이 돌면 1시간마다 요청이 들어가니까 사실상 자동으로 막혀요. 자동 수집이 곧 keep-alive 역할을 겸하는 셈이죠. cron을 제대로 걸어두면 이 함정은 신경 쓸 일이 없습니다.

---

## 진행 흐름

### 1. `/part07` 호출 → Clip 8 선택

강의 워크스페이스에서 클로드코드를 켜고 시작합니다.

```text
/part07
```

자동 셋업이 진도 폴더를 만들고, Clip 7에서 만든 `trendboard/` 코드가 있는지 확인해줘요.

```text
✓ trendboard/ 발견 — Clip 7 대시보드 코드 확인
✓ ~/fastcampus-cc/50-my-work/Part07-실전/실습39-배포하기/ 진도 폴더 준비 완료
ℹ Vercel·GitHub 로그인 필요. 자동화는 Supabase pg_cron(매시간)
```

대시보드 본체(`trendboard/`)는 별도 폴더에 있고, 진도 기록만 `50-my-work/` 안에 남습니다. Clip 7과 똑같은 두 곳 구조예요. `trendboard/` 코드가 안 보인다면 [Clip 7 — 트렌드 대시보드 만들기](#part-7-07-youtube-dashboard)를 먼저 끝내야 합니다.

### 2. STEP 1 — Trends/Overview 화면 마무리

배포 전에 화면 하나만 더 다듬습니다. 키워드 트렌드예요. 이 화면은 `trend_topics` 같은 별도 테이블을 두지 않고, 이미 수집된 `video_details` 뷰에서 **실시간으로 집계**합니다.

```text
Trends 페이지랑 extract-trends를 마무리하려는데 어떻게 구성할까?
video_details에서 keywords를 실시간 집계(24h/3D/7D/30D 탭), 바 차트 + 키워드 랭킹.
Overview도 카드·차트·최근 Outlier로 마무리하고 싶어.
```

클로드코드가 화면을 마무리해줍니다. 확인할 것은 네 가지예요.

```text
[확인]
- 키워드 랭킹 + 성장률 색상(상승/하락)
- 기간 탭(24h / 3D / 7D / 30D) 전환
- 키워드 빈도 바 차트
- Overview에 요약 카드·차트·최근 Outlier
```

자주 걸리는 함정 하나를 미리 알아두세요. 기간 탭에서 "7D"를 골랐는데 결과가 텅 비는 경우가 있어요. 집계할 때 **`published_at`(영상이 올라온 날) 기준으로 거르면** 오래된 영상이 다 빠져서 그렇습니다. 최근 7일 안에 수집된 데이터를 보려면 **`snapshot_at`(수집한 시각) 기준**으로 필터해야 해요. 결과가 비면 "기간 필터를 snapshot_at 기준으로 바꿔줘"라고 말하면 됩니다.

### 3. STEP 2 — GitHub + Vercel 배포

이제 코드를 인터넷에 올립니다. 순서가 있어요. 깃에 올리기 전에 비밀이 섞이지 않았는지부터 확인합니다.

```text
이 프로젝트를 GitHub에 올리고 Vercel로 배포하려는데 어떻게 할까?
.env.local·node_modules·dist가 .gitignore에 들어 있는지 먼저 확인하고,
Vercel 환경변수에 VITE_SUPABASE_URL·VITE_SUPABASE_PUBLISHABLE_KEY 넣는 법도 알려줘.
```

클로드코드가 `.gitignore`를 점검하고, `gh`로 private 저장소를 만들어 푸시한 다음 Vercel 배포 순서를 안내해줍니다. Vite 프로젝트라 빌드 명령은 `npm run build`, 출력 폴더는 `dist`예요.

```text
[Vercel 배포 순서]
1. vercel.com → Add New → Project → GitHub의 trendboard import
2. Framework: Vite 자동 인식 / Build: npm run build / Output: dist
3. Environment Variables에 VITE_SUPABASE_URL · VITE_SUPABASE_PUBLISHABLE_KEY 추가
4. Deploy → https://trendboard-xxxx.vercel.app 발급
```

> ⚠ Vercel 환경변수에는 **공개 가능한 `VITE_` 2개만** 넣습니다. 비밀 키(YouTube·service_role·Gemini)는 절대 Vercel/프론트에 넣지 마세요 — 그건 다음 STEP에서 Supabase 백엔드 쪽에 들어갑니다. Vercel 프론트 변수는 브라우저로 그대로 노출됩니다.

확인할 것은 세 가지입니다.

```text
[확인]
- 공개 URL 발급 (https://trendboard-xxxx.vercel.app)
- 휴대폰 등 다른 기기에서 접속됨
- 프론트(브라우저 개발자 도구)에 비밀 키가 하나도 없음
```

### 4. STEP 3 — Edge Function 배포 + 매시간 pg_cron (핵심)

이번 클립의 심장입니다. 백엔드 함수를 배포하고 매시간 자동 수집을 켜요. 먼저 Edge Function 배포부터.

```text
Edge Function들(fetch-channel, collect-data, generate-tags, extract-trends,
generate-strategy, manage-settings, verify-admin)을 배포하고,
YOUTUBE_API_KEY만 Secret으로 설정하는 법 알려줘.
(SUPABASE_URL·SERVICE_ROLE_KEY는 자동 주입이라 제외)
```

Clip 7에서 만든 Edge Function 6종을 배포합니다. 이 중 설정·로그인을 맡는 `manage-settings`와 `verify-admin`은 한 쌍이라 6종으로 묶어 부르지만, 실제 배포 명령은 함수 파일 단위로 일곱 번 나눠서 실행합니다. Secret으로는 `YOUTUBE_API_KEY` 하나만 넣으면 돼요. `SUPABASE_URL`과 `SUPABASE_SERVICE_ROLE_KEY`는 Supabase가 Edge Function에 자동으로 주입해주거든요.

```bash
# Supabase CLI — 함수 배포
supabase functions deploy fetch-channel
supabase functions deploy collect-data
supabase functions deploy generate-tags
supabase functions deploy extract-trends
supabase functions deploy generate-strategy
supabase functions deploy manage-settings
supabase functions deploy verify-admin

# Secret — YouTube 키 하나만
supabase secrets set YOUTUBE_API_KEY=AIza...
```

배포가 끝나면 매시간 cron을 겁니다.

```text
매시간 정각에 collect-data를 부르는 Supabase pg_cron 등록 SQL을 만들려는데 어떻게 할까?
안 되면 cron-job.org로 외부 cron 거는 법도 같이 알려줘.
```

클로드코드가 다음과 같은 SQL을 만들어줍니다. Supabase SQL Editor에서 실행해요.

```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

SELECT cron.schedule(
  'collect-youtube-hourly',
  '0 * * * *',  -- 매시간 정각
  $$ SELECT net.http_post(
       url := 'https://YOUR_REF.supabase.co/functions/v1/collect-data',
       headers := '{"Authorization":"Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
     ) $$
);

-- 등록 확인
SELECT * FROM cron.job;
-- 해제할 때: SELECT cron.unschedule('collect-youtube-hourly');
```

`YOUR_REF`(본인 프로젝트 참조)와 `YOUR_SERVICE_ROLE_KEY`를 실제 값으로 교체합니다. 여기서 `service_role` 키가 나오죠. 이건 **DB 안에서만(SQL 안에서만) 쓰이는 것**이라 괜찮아요. 프론트나 깃에 노출되는 게 아니니까요.

`pg_net` 확장이 활성화 안 돼서 pg_cron이 막히면, cron-job.org 같은 무료 외부 cron으로 같은 일을 합니다. URL에 매시간 POST를 거는 방식이에요.

```text
[cron-job.org 설정]
- URL: https://YOUR_REF.supabase.co/functions/v1/collect-data
- Method: POST
- Header: Authorization: Bearer YOUR_SERVICE_ROLE_KEY
- 주기: 매시간
```

확인할 것은 세 가지입니다.

```text
[확인]
- Edge Function 6종 배포 완료 (deploy 명령은 일곱 번)
- pg_cron(또는 외부 cron) 등록됨 (SELECT * FROM cron.job으로 확인)
- 다음 정시에 데이터가 갱신됨 (collect-data → 체인 자동)
```

데이터가 갱신되는 건 다음 정시(예: 14:00)가 돼야 보입니다. 기다리기 싫으면 클로드코드한테 "collect-data를 수동으로 한 번 호출해서 데이터부터 채워줘"라고 하면 돼요. 배포 직후 첫 세팅은 이 순서로 합니다.

```text
1. Vercel URL 접속 → Admin → 비밀번호 설정 → Gemini API 키 저장
2. Channels → 테스트 채널 5개 등록 → 등록 직후 자동 수집 확인
3. 잠시 후 Outliers / Trends에 데이터·요약이 차는지 확인
4. cron 등록 → 다음 날 정시에 자동 갱신 확인
```

### 5. STEP 4 — 운영하며 말로 개선

배포하고 며칠 써보면 아쉬운 게 보여요. 그걸 코드를 직접 고치는 게 아니라 **말로** 고칩니다. 이게 바이브코딩의 운영 단계예요.

```text
24시간 급상승한 영상에 🔥 배지를 달고, 채널 카테고리 필터를 추가하고,
Overview에 '이번 주 가장 터진 영상 3개'를 크게 보여주고 싶은데 어떻게 할까?
```

클로드코드가 기능을 붙여줍니다. 확인할 것은 세 가지예요.

```text
[확인]
- 급상승 영상에 🔥 배지
- 채널 카테고리 필터
- Overview에 이번 주 Top 3 강조
```

한 번 만들고 끝이 아니에요. 매시간 데이터가 쌓이는 살아 있는 서비스니까, **운영하며 계속 다듬는 게** 오히려 정상입니다. 며칠 쓰다 또 아쉬운 게 보이면 같은 방식으로 말로 고치면 돼요.

---

## 결과물

이번 클립이 끝나면 아래가 남습니다.

| 결과물 | 위치 | 설명 |
|---|---|---|
| 공개 URL | `https://trendboard-xxxx.vercel.app` | 어디서든 접속되는 대시보드 |
| `vercel.json` | `~/trendboard/` | Vercel 배포 설정 |
| 배포된 Edge Function 6종 | Supabase(백엔드) | fetch-channel·collect-data·generate-tags·extract-trends·generate-strategy·manage-settings(+verify-admin) |
| pg_cron 등록 | Supabase(DB) | 매시간 정각 `collect-data` 호출 |
| Trends/Overview 화면 | `~/trendboard/src/pages/` | 실시간 키워드 집계 + 카드·차트 |
| `README.md` | `실습39-배포하기/` | 실습 메타 + 운영 구조 + 회고 |

`완료` 또는 `/wrap`을 입력하면 스킬이 결과물을 검증하고 정리합니다.

- 공개 URL 접속과 다음 정시 자동 갱신을 직접 확인하라고 안내해줘요.
- `progress.json`의 `practice_completed`에 `"실습 39"`가, `projects_completed`에 `"trendboard"`가 자동 기록됩니다.
- `README.md`가 자동 생성되고, 마지막에 회고 한 줄("일회성 앱을 매시간 도는 서비스로 만든 핵심")을 자유 입력으로 받아 적어둡니다.

배포 URL이나 cron이 빠졌으면 해당 STEP을 다시 시도하라고 권유해줍니다.

---

## 자주 막히는 포인트

| 증상 | 원인 | 해결 |
|---|---|---|
| Vercel 배포가 막힘 | 빌드 설정/연결 문제 | Part 03 배포 챕터 복습. 클로드코드가 단계별로 안내하게 "어디서 막혔는지" 로그를 붙여넣기 |
| 배포했는데 데이터가 안 보임 | Vercel 환경변수 누락 | `VITE_SUPABASE_URL`·`VITE_SUPABASE_PUBLISHABLE_KEY` 등록 후 **재배포**(변수 추가만으론 반영 안 됨) |
| Trends 7D 탭이 텅 빔 | `published_at` 기준으로 필터함 | 기간 필터를 `snapshot_at`(수집 시각) 기준으로 변경 |
| pg_cron이 등록 안 됨 | `pg_net` 확장 미지원/Free 티어 제약 | `pg_net` 활성화 시도, 안 되면 cron-job.org 외부 cron으로 동일 효과 |
| 다음 정시에 갱신이 안 됨 | cron URL/헤더 오타 | `SELECT * FROM cron.job` 확인 + `collect-data` 수동 호출로 함수 자체는 도는지 분리 검증 |
| YouTube API 403 | API 미활성 또는 쿼터 초과 | Google Cloud에서 YouTube Data API v3 enable 확인, 쿼터 잔량 확인 |
| YouTube quota exceeded | `search.list` 사용/채널·주기 과다 | `playlistItems.list`만 쓰는지 확인, 채널 수·수집 주기 조정 |
| 키워드 배지가 안 보임 | Gemini 키 미저장 / generate-tags 미실행 | Admin에 Gemini 키 저장 → `generate-tags` 수동 호출 |
| Score가 전부 0 | `avg_views`가 아직 0 | 신규 채널은 첫 수집 직후 정상. 수집이 1~2회 더 돌면 채워짐 |
| service_role 키 노출이 걱정됨 | 어디 둬야 할지 헷갈림 | 프론트·깃 절대 금지. Edge Function Secrets와 cron SQL 안에서만 |
| Supabase 프로젝트가 일시중지됨 | 7일 무요청 | 매시간 cron이 돌면 자동 방지. 멈췄으면 재개 후 cron 가동 확인 |
| 비밀 키가 깃에 올라갈 뻔함 | `.gitignore` 누락 | `.env.local`·`node_modules`·`dist`가 `.gitignore`에 있는지 푸시 전 확인 |

막히면 에러 로그를 그대로 클로드코드에 붙여넣고 "이거 고쳐줘"라고 하세요. 추측으로 고치지 말고 로그를 보고 고치는 것, 이게 바이브코딩 디버깅의 원칙이에요. 강의 워크스페이스에서는 `막혔어요` / `도와줘`로 도움을 요청할 수 있습니다.

---

## 다음 클립

### Part 7 마무리 — 세 프로젝트의 완성

Part 7의 세 프로젝트가 모두 끝났습니다. 규모가 점점 커지는 프로젝트 3개였어요. **환경 → 지식 → 서비스** 순이었죠.

| 프로젝트 | 무엇을 | 규모 | 핵심 |
|---|---|---|---|
| ① 워크스페이스 | 본인 작업 환경을 하네스로 | 환경 | CLAUDE.md·커맨드·훅·스킬을 목적 하나로 조립 |
| ② LLM Wiki | 본인 지식을 쌓는 도구 | 지식 | 쌓일수록 강해지는 본인 소유 지식 베이스 |
| ③ TrendBoard | 매시간 도는 분석 서비스 | 서비스 | 배포·자동화·운영 — 진짜 서비스의 형태 |

세 프로젝트의 공통점은, 전부 새로 배운 게 아니라는 점이에요. Part 5에서 만든 하네스 부품(CLAUDE.md·커맨드·훅·스킬)과 Part 6에서 만든 스킬들을 **목적 하나로 조립**한 결과입니다. 하네스는 새로운 도구가 아니었어요. 이미 만들어온 부품들을 어떻게 엮느냐의 문제였던 거죠.

특히 세 번째 프로젝트에서 본인은 "코드 생성은 kkirikkiri, 연결·운영은 클로드코드"를 직접 경험했습니다. 한 방에 완벽한 서비스가 나오지 않아요. 생성된 코드를 인터넷에 올리고, 키를 어디 둘지 판단하고, 매시간 도는 cron을 걸고, 며칠 운영하며 다듬는 그 전 과정이 본인 몫이었어요. 이게 일회성 결과물과 운영되는 서비스를 가르는 선입니다.

### 다음 클립

→ [성장 리포트 — 나의 AI Native 여정](#part-8-01-growth-report) — Part 8 첫 클립입니다.

세 프로젝트를 다 만든 지금, 본인은 강의를 시작할 때와 같은 사람이 아닙니다. 다음 클립에서는 Part 5의 자산 + Part 6의 스킬 + Part 7의 세 프로젝트를 한자리에 모아, 본인의 AI Native 여정이 어디까지 왔는지를 성장 리포트로 점검해요. 그동안 쌓인 클로드코드 사용 기록을 6축으로 다시 진단해서, 처음과 지금이 얼마나 달라졌는지 숫자로 확인하는 시간입니다.

수고하셨습니다. Part 7의 세 프로젝트, 본인 평생 도구가 됐기를 바랍니다.
