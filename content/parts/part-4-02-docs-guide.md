---
course_clip_ref: "Part 4 / Ch 01 / Clip 2"
result_path: "50-my-work/Part04-강화하기/실습15-공식문서확인/"
next_clip_id: "part-4-03-kkirikkiri"
---

# Part 4 / Clip 2: docs-guide — 공식 문서 기반으로 정확한 답변 받기

> 강의 영상: Part 4 / Ch 01 / Clip 2 (~18분)
> 만드는 것: 일반 답변과 docs-guide 답변 비교 + Vercel 클로드코드 시너지 발견 + 새 도구 학습 흐름 정리

---

## 🎯 이 클립에서 만드는 것

클로드코드한테 라이브러리 사용법 물어봤더니 그럴듯한 답이 나왔는데, 막상 따라 해보면 안 됐던 적 있죠? 옛날 버전 문법이거나 아예 없는 함수였던 거예요. AI가 자기 기억으로 그럴듯하게 지어낸 답이라 그래요. 이걸 **할루시네이션**이라고 부릅니다.

docs-guide는 그 문제를 풀려고 만들어진 플러그인이에요. 질문 들어오면 진짜 공식 문서 사이트에서 내용을 직접 가져온 다음 답해요. 출처 URL까지 같이 보여주고요.

이번 클립에서는 Part 3에서 썼던 **Vercel**을 다시 꺼냅니다. 그때 포트폴리오를 Vercel에 배포했는데, 사실 Vercel이 뭐 하는 도구인지 잘 모르고 쓰셨잖아요. 이걸 일반 답변과 docs-guide 답변으로 각각 받아보고, 차이가 어떻게 나는지 직접 봐요.

| Before | After |
|---|---|
| AI가 "보통", "아마도" 같은 모호한 답을 줘도 그러려니 함 | 답 끝에 출처 URL이 안 보이면 의심하는 습관 생김 |
| 새 도구 만나면 검색 → 문서 페이지 직접 읽기 | 새 도구 만나면 docs-guide로 먼저 물어봄 |
| 도구가 클로드코드랑 잘 맞는지 모르고 선택 | docs-guide로 시너지 자원(MCP, llms.txt 등)까지 확인 가능 |

오늘 주제는 Vercel이지만, 진짜 핵심은 **"모르는 도구는 docs-guide로 먼저 이해한 다음에 쓰기"** 라는 흐름입니다. Vercel은 시연일 뿐이에요. Supabase, OpenAI SDK, Tailwind 같이 앞으로 만날 도구마다 같은 방식을 반복하시면 됩니다.

---

## 💡 핵심 개념

### docs-guide는 AI 기억이 아니라 실시간 문서를 봅니다

일반 답변은 AI가 학습 시점에 외워둔 기억으로 답합니다. 그 기억은 1년 전 버전일 수도 있고, 처음부터 잘못 외웠을 수도 있어요. docs-guide가 다른 점은 단순합니다. 질문이 들어오면 공식 문서 사이트로 가서 실제 페이지를 가져옵니다.

```text
사용자: "React useEffect cleanup 공식문서 기반으로 설명해줘"
   ↓
Step 0: 프로젝트 의존성 확인 (package.json → React 19 감지)
   ↓
Step 1: 알려진 사이트 목록 확인 (react.dev — 68개 검증된 URL 중 매칭)
   ↓
Step 2: react.dev/llms.txt 가져오기 (문서 페이지 인덱스)
   ↓
Step 3: 관련 페이지 URL 찾기 (→ /reference/react/useEffect)
   ↓
Step 4: 해당 페이지 WebFetch
   ↓
답변: 설명 + 코드 예제
Source: https://react.dev/reference/react/useEffect
(version: React 19 | method: llms.txt)
```

이 흐름의 안전장치는 두 가지예요. 하나는 **내가 쓰는 버전이 자동 감지된다**는 거. `package.json`이나 `requirements.txt`를 읽어서 설치된 버전을 보고, 그 버전 문서를 가져옵니다. 다른 하나는 **답변 끝에 출처가 박혀 있다**는 거. URL이 없거나 이상하면 바로 의심할 수 있어요.

> **버전 기준점 (작성 시점)**: 이 자습서는 React 19, Next.js 15, Vercel 최신 문서 기준으로 시연합니다. 시간이 흘러 라이브러리가 업데이트돼도 docs-guide는 본인 프로젝트의 `package.json`을 보고 그때그때 설치된 버전으로 답하니, 자료가 안 맞을 일은 없습니다.

### llms.txt는 AI를 위한 문서 색인입니다

여기서 핵심 단어 하나 짚고 갈게요. `llms.txt`는 AI가 문서를 쉽게 읽을 수 있게 만들어진 표준입니다. `robots.txt`처럼 사이트 루트에 두는데, 안에는 그 사이트 모든 문서 페이지의 색인이 들어 있어요. docs-guide는 우선 이 파일을 찾고, 없으면 GitHub raw → sitemap.xml → WebSearch 순서로 대체합니다.

이 강의에서 다룰 라이브러리 중 React, Next.js, Vercel, Stripe, Django, FastAPI, Prisma 같은 친구들은 다 사전 매핑되어 있어요. 본인 분야 라이브러리가 목록에 있는지 궁금하면 `/docs-guide`로 한 번 물어보면 바로 알 수 있습니다.

### 두 번째 질문이 더 깊이 들어갑니다

docs-guide의 진짜 가치는 두 번째 질문에서 나와요. 처음에는 "이 도구가 뭐 하는 거야?" 정도로 정의를 받습니다. 그 다음에 "**클로드코드에서 쓰면 어떤 장점이 있어?**"라고 한 번 더 물어보면, 일반 답변으로는 절대 안 나오는 깊이가 나옵니다.

Vercel의 경우 `agent-resources` 페이지를 따로 운영해요. 거기에 클로드코드 전용 MCP 서버, AI Gateway, Skills, CLI Workflows 같은 자원이 정리돼 있습니다. 일반 답변은 이런 페이지가 있는지조차 모르고 답하니까 절대 안 나와요. docs-guide는 공식 문서를 직접 가져오니 이 정보가 자연스럽게 보입니다.

---

## 🚶 진행 흐름

### 1. 같은 질문을 그냥 클로드코드에 던지기

먼저 docs-guide를 안 쓰고 일반 답변부터 받아봅니다. 비교 대상을 만드는 과정이에요.

```text
Part 03에서 내 포트폴리오를 Vercel에 배포했는데
사실 Vercel이 뭐 하는 도구인지 잘 몰라.
Vercel이 뭐고 주요 기능이 뭔지 알려줘.
```

답이 오면 한 번 읽어보세요. 보통 이런 결로 나옵니다.

```text
Vercel은 정적 사이트와 서버리스 함수를 호스팅하는 클라우드 플랫폼입니다.
주요 기능:
- Git 연동 자동 배포
- 글로벌 CDN
- HTTPS 자동
- 도메인 연결
배포 작업은 보통 코드를 GitHub에 올리고 Vercel에서 import해서 빌드합니다.
```

그럴듯하긴 한데, "보통"이라는 모호한 단어가 나오고 출처가 없어요. 기능도 3~4개만 적혔습니다. 받은 답을 워크스페이스의 `vercel-overview-plain.md`로 저장해두세요. 뒤에서 비교할 때 씁니다.

### 2. 같은 질문을 docs-guide로 다시 던지기

이제 똑같은 질문을 `/docs-guide`로 다시 물어봅니다.

```text
/docs-guide:docs-guide Vercel이 뭐하는 건지, 주요 기능이 뭔지 알려줘.
```

docs-guide가 `vercel.com/docs/llms.txt`를 가져온 다음 답하는 게 보일 거예요. 답이 이렇게 옵니다.

```text
Vercel — 공식 정의

"Vercel is the AI Cloud, a unified platform for building, 
 deploying, and scaling AI-powered applications."

→ 한국어: 웹 앱·AI 앱·AI 에이전트를 만들고 배포하고 자동 확장해주는 통합 클라우드.

[핵심 기능 6 카테고리]
1. 앱 빌드     — Next.js·React·Functions·이미지 최적화
2. AI 인프라   — v0·AI SDK·AI Gateway·MCP 서버·Agent 호스팅
3. 팀 협업     — Toolbar·Comments·Draft mode
4. 보안        — Deployment Protection·WAF·Bot Management
5. 배포·확장   — Delivery Network·Rolling Releases·Instant Rollback
6. 모니터링    — Observability suite (로그·추적·Speed Insights)

source: https://vercel.com/docs
method: llms.txt index → direct fetch
```

차이가 명확해요. 공식 정의가 정확하게 인용됐고, 기능이 6개 카테고리로 정리됐고, 답 끝에 출처 URL이 박혀 있습니다. 이 답을 `vercel-overview-docs.md`로 저장합니다.

### 3. 한 번 더 깊이 — 클로드코드 시너지 묻기

여기서 멈추면 절반밖에 못 본 거예요. docs-guide의 진짜 깊이는 다음 질문에서 나옵니다.

```text
/docs-guide:docs-guide 클로드코드에서 Vercel을 쓰면 어떤 장점이 있어?
```

이번에는 docs-guide가 `vercel.com/docs/agent-resources` 페이지를 가져옵니다. 일반 답변으로는 절대 못 보는 깊이가 여기서 나와요.

```text
Vercel은 클로드코드를 "공식 1급 클라이언트"로 대우합니다.

[클로드코드 ↔ Vercel 5가지 시너지]

1. llms-full.txt
   Vercel 전체 문서를 LLM이 읽기 좋게 모아둔 파일
   공식 가이드: "Claude Code: Use the WebFetch tool to fetch the content"

2. Vercel MCP 서버
   클로드코드가 Vercel 계정에 직접 접속
   → 문서 검색 / 프로젝트 관리 / 배포 로그 보기 / 도메인 체크
   → "내 어제 배포 왜 실패했어?" 클로드코드가 직접 로그 가져와 분석

3. AI Gateway
   클로드코드가 AI Gateway 통해 여러 모델 호출
   공식 명시: "Claude Code, OpenAI Codex, Cline, and Roo Code"
   → API 키 한 곳 관리 + 모델 장애 시 자동 fallback

4. Skills.sh
   npx skills add owner/repo로 클로드코드 능력 한 줄 확장

5. CLI Workflows
   클로드코드용 검증된 작업 레시피 공식 제공
   예: 프로덕션 500 에러 디버깅 / 배포 롤백 / 느린 함수 디버깅

source: https://vercel.com/docs/agent-resources
```

이런 페이지가 따로 있다는 걸 docs-guide 없이는 알기 어렵습니다. 이 답을 `vercel-claude-synergy.md`로 저장하세요.

### 4. 두 답변을 다섯 관점으로 비교

이제 받은 답 두 개를 정리할 차례예요. 한 번 더 물어봅니다.

```text
방금 받은 일반 답변이랑 docs-guide 답변 두 개를
정의 정확성·기능 범위·출처·버전·추측 흔적 다섯 관점으로 비교 표 만들어줘.
```

이렇게 나옵니다.

```text
| 관점 | 일반 답변 | docs-guide |
|------|-----------|------------|
| 정의 정확성 | △ "정적 사이트 호스팅" 추상 | ✓ "AI Cloud" 공식 정의 |
| 기능 범위 | △ Git·CDN·HTTPS만 (3-4개) | ✓ 6 카테고리 전부 |
| 출처 명시 | ❌ 없음 | ✓ source URL |
| 버전 명시 | ❌ | ✓ 명시 |
| 추측 흔적 | △ "보통", "아마도" 등장 | ✓ 단정형 표현 |
```

표를 `comparison.md`로 저장합니다. 차이를 한 화면에 정리해두면 다음에 또 다른 도구 만났을 때 "아, docs-guide 켜야겠다" 하는 판단이 빠릅니다.

### 5. 어디에 쓸지 정리

오늘 시연은 Vercel이었지만, 진짜 가져갈 건 흐름 자체입니다. 이걸 정리해서 본인 습관으로 만들어요.

```text
docs-guide를 어떤 상황에서 쓰면 좋은지 정리해줘.
```

이런 답이 나옵니다.

```text
docs-guide 켜야 할 상황

1. 처음 쓰는 도구·라이브러리 호출 직전
   - 예: Vercel·Supabase·OpenAI SDK·Tailwind·FastAPI

2. 바이브코딩 중 클로드코드가 새 라이브러리 import 했을 때
   - 환각 답변 방어

3. 라이브러리 버전 업그레이드 후 동작 안 할 때
   - 옛 문법 vs 최신 문법 차이 확인

4. 기능·옵션·메서드 시그니처 정확히 알아야 할 때

5. 도구 선택 단계 — 클로드코드 시너지 확인
   - "이 도구가 클로드코드랑 얼마나 잘 맞나?"
   - agent-resources / MCP 지원 / llms.txt 제공 여부 등
```

특히 5번이 오늘 Vercel에서 직접 체험한 부분이에요. Part 6, 7에서 만날 Supabase 같은 도구도 같은 방식으로 안전하게 학습하면 됩니다.

---

## 📦 결과물

폴더는 `50-my-work/Part04-강화하기/실습15-공식문서확인/`이고 안에 파일 다섯 개가 남습니다.

```text
실습15-공식문서확인/
├── vercel-overview-plain.md       # 일반 답변
├── vercel-overview-docs.md        # docs-guide 답변 (정의 + 6 카테고리)
├── vercel-claude-synergy.md       # docs-guide 추가 답변 (5가지 시너지)
├── comparison.md                  # 다섯 관점 비교 표
└── README.md                      # 실습 메타 + 회고
```

`완료` 또는 `/wrap` 입력하면 part04 스킬이 README와 progress.json을 정리해줍니다. README에는 이 정보가 들어가요.

| 항목 | 기록 내용 |
|---|---|
| 시연 주제 | Vercel |
| 사용한 출처 URL | `vercel.com/docs` + `vercel.com/docs/agent-resources` |
| 다섯 관점 비교 결과 | 정의/기능/출처/버전/추측 흔적 |
| 발견한 시너지 자원 | llms-full.txt / MCP 서버 / AI Gateway / Skills / CLI Workflows |
| 반복 적용 가이드 | 어떤 도구에 같은 흐름을 쓸지 |
| 회고 한 줄 | 가장 인상적이었던 차이 한 줄 |

---

## 🆘 자주 막히는 포인트

| 증상 | 원인 | 해결 |
|---|---|---|
| `/docs-guide` 호출하니 인식 안 됨 | Clip 1에서 docs-guide 설치 안 됨 | `/plugin` Installed 탭 확인 → 미설치면 재설치 |
| docs-guide 답변에 출처가 없음 | 해당 라이브러리가 지원 목록에 없음 | README에서 지원 라이브러리 확인. 없으면 다른 주제로 |
| Vercel 답변이 일반 답변과 차이가 작음 | docs-guide가 깊게 안 들어감 | Supabase, Tailwind 같은 다른 도구로 같은 흐름 시도 |
| Step 3에서 agent-resources fetch 실패 | URL 변경 또는 일시 장애 | 일반 vercel docs로 대체. Step 3는 생략해도 OK |
| 답변이 너무 길어 비교가 어려움 | docs-guide가 상세 문서 fetch | "핵심만 5줄로 요약 다시"라고 재요청 |
| 출처 URL 클릭 안 됨 | 터미널 환경 차이 | 우클릭 → 링크 열기, 또는 URL 복사해서 브라우저에 |
| 본인 다른 도구로 응용하고 싶음 | 일반 적용 가능 | 최근 처음 써본 도구나 앞으로 쓸 도구로 같은 흐름 |
| llms.txt가 뭔지 헷갈림 | 처음 듣는 용어 | AI용 문서 색인 파일이에요. `robots.txt`처럼 사이트 루트에 둠 |

---

## 🔗 다음 클립

→ **[Part 4 / Clip 3: kkirikkiri — 자연어로 AI 팀 구성하기](#part-4-03-kkirikkiri)** — 두 번째 플러그인을 만나봅니다.

다음 클립에서는 자연어 한마디로 AI 에이전트 팀을 자동으로 구성하는 친구를 써봐요. 오늘 배운 docs-guide도 그 팀 안에서 한 명의 팀원으로 다시 등장합니다.
