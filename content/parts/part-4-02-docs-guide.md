---
course_clip_ref: "Part 4 / Ch 01 / Clip 2"
result_path: "50-my-work/Part04-강화하기/실습15-공식문서확인/"
next_clip_id: "part-4-03-kkirikkiri"
---

# Part 4 / Clip 2: docs-guide — 공식 문서 기반으로 답변 확인하기

> 강의 영상: Part 4 / Ch 01 / Clip 2 (~18분)
> 만드는 것: 일반 답변과 docs-guide 답변 비교, Vercel과 클로드코드 연결 지점 확인, 새 도구를 배울 때 쓰는 질문 흐름 정리

---

## 이 클립에서 만드는 것

클로드코드에 라이브러리 사용법을 물었는데, 답은 그럴듯한데 막상 따라 하면 안 되는 경우가 있습니다. 예전 버전 문법이거나, 실제로는 없는 함수일 때도 있고요. **이유는 단순합니다. 그냥 물어보면 LLM 모델이 학습 시점에 이미 알고 있는 지식으로만 답하기 때문이에요.** 학습 시점이 1년 전이면 그 이후에 바뀐 API는 모르고, 모르는 부분을 그럴듯하게 지어내기도 합니다. 보통 이런 걸 **할루시네이션**이라고 부릅니다.

docs-guide는 바로 이 문제를 풀려고 만든 플러그인입니다. 질문을 받으면 모델 기억이 아니라 **공식 문서 사이트에서 실시간으로 내용을 가져와** 답하고, 답변 끝에 출처 URL을 붙여요. 최신성 보장 + 할루시네이션 방어, 둘 다 한 번에 해결합니다.

이번 클립에서는 Part 3에서 썼던 Vercel을 다시 다룹니다. 그때 포트폴리오를 Vercel에 배포했지만, Vercel이 정확히 어떤 도구인지는 대충 넘겼죠. 이번에는 같은 질문을 일반 답변과 docs-guide 답변으로 각각 받아보고, 차이를 직접 비교합니다.

비교하면서 확인할 변화는 세 가지입니다.

- AI가 "보통", "아마도" 같은 말로 답해도 그냥 넘기던 상태에서, 출처 URL이 없는 답은 한 번 의심하는 쪽으로 바뀝니다.
- 새 도구를 만나면 검색부터 하던 흐름을, docs-guide로 공식 문서 기반 설명을 먼저 받는 흐름으로 바꿉니다.
- 도구가 클로드코드와 잘 맞는지 몰라서 감으로 선택하던 방식 대신, MCP나 `llms.txt` 같은 연결 자원까지 확인합니다.

오늘 예시는 Vercel이지만, 가져가야 할 건 도구 이름이 아닙니다. 모르는 도구는 docs-guide로 먼저 이해하고 쓰는 흐름입니다. 앞으로 Supabase, OpenAI SDK, Tailwind 같은 도구를 만날 때도 같은 방식으로 확인하면 됩니다.

---

## 핵심 개념

### docs-guide는 AI 기억이 아니라 문서를 봅니다

일반 답변은 AI가 학습 과정에서 익힌 내용을 바탕으로 나옵니다. 그 내용이 1년 전 버전일 수도 있고, 처음부터 잘못 섞였을 수도 있습니다. docs-guide는 질문을 받으면 공식 문서 사이트로 가서 실제 페이지를 가져옵니다.

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

여기서 봐야 할 안전장치는 두 가지입니다. 먼저 내가 쓰는 버전을 확인합니다. `package.json`이나 `requirements.txt`를 읽고, 설치된 버전에 맞는 문서를 찾습니다. 그리고 답변 끝에 출처가 남습니다. URL이 없거나 엉뚱하면 바로 의심할 수 있습니다.

> 버전 기준점: 이 자습서는 React 19, Next.js 15, Vercel 최신 문서 기준으로 시연합니다. 라이브러리가 업데이트되어도 docs-guide는 프로젝트의 `package.json`을 보고 설치된 버전에 맞춰 답합니다.

### `llms.txt`는 AI용 문서 색인입니다

`llms.txt`는 AI가 문서를 읽기 쉽게 만든 색인 파일입니다. `robots.txt`처럼 사이트 루트에 두고, 안에는 문서 페이지 목록이 들어갑니다. docs-guide는 먼저 이 파일을 찾습니다. 없으면 GitHub raw, `sitemap.xml`, WebSearch 순서로 다른 경로를 시도합니다.

이 강의에서 다룰 React, Next.js, Vercel, Stripe, Django, FastAPI, Prisma 같은 라이브러리는 미리 매핑되어 있습니다. 내가 쓰는 라이브러리가 지원되는지 궁금하면 `/docs-guide`로 물어보면 됩니다.

### 두 번째 질문에서 차이가 커집니다

처음에는 "이 도구가 뭐야?" 정도로 정의를 받습니다. 그다음에 "클로드코드에서 쓰면 어떤 장점이 있어?"라고 한 번 더 물어보세요. 여기서 일반 답변과 차이가 확 벌어집니다.

Vercel은 `agent-resources` 페이지를 따로 운영합니다. 이 페이지에는 클로드코드용 MCP 서버, AI Gateway, Skills, CLI Workflows 같은 자료가 정리되어 있습니다. 일반 답변은 이런 페이지의 존재를 모른 채 답할 수 있습니다. docs-guide는 공식 문서를 직접 가져오니 이 정보까지 확인할 수 있습니다.

---

## 진행 흐름

### 1. 같은 질문을 그냥 클로드코드에 던지기

먼저 docs-guide를 쓰지 않고 일반 답변부터 받습니다. 비교할 기준을 만드는 단계입니다.

```text
Part 03에서 내 포트폴리오를 Vercel에 배포했는데
사실 Vercel이 뭐 하는 도구인지 잘 몰라.
Vercel이 뭐고 주요 기능이 뭔지 알려줘.
```

답변은 보통 이런 식으로 나옵니다.

```text
Vercel은 정적 사이트와 서버리스 함수를 호스팅하는 클라우드 플랫폼입니다.
주요 기능:
- Git 연동 자동 배포
- 글로벌 CDN
- HTTPS 자동
- 도메인 연결
배포 작업은 보통 코드를 GitHub에 올리고 Vercel에서 import해서 빌드합니다.
```

그럴듯하지만 출처가 없습니다. "보통" 같은 말도 섞여 있고, 기능도 몇 개만 나옵니다. 이 답을 워크스페이스의 `vercel-overview-plain.md`로 저장합니다. 뒤에서 docs-guide 답변과 비교할 때 씁니다.

### 2. 같은 질문을 docs-guide로 다시 던지기

이제 같은 질문을 `/docs-guide`로 다시 물어봅니다.

```text
/docs-guide:docs-guide Vercel이 뭐하는 건지, 주요 기능이 뭔지 알려줘.
```

docs-guide가 `vercel.com/docs/llms.txt`를 가져온 뒤 답하는 과정을 볼 수 있습니다. 예시는 아래처럼 나옵니다.

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

차이가 바로 보입니다. 공식 정의를 인용했고, 기능을 여섯 범주로 나눴고, 답변 끝에 출처 URL이 있습니다. 이 답은 `vercel-overview-docs.md`로 저장합니다.

### 3. 한 번 더 묻기: 클로드코드에서 Vercel을 쓰면 좋은 점

여기서 멈추면 아쉽습니다. docs-guide의 장점은 후속 질문에서 더 잘 드러납니다.

```text
/docs-guide:docs-guide 클로드코드에서 Vercel을 쓰면 어떤 장점이 있어?
```

이번에는 docs-guide가 `vercel.com/docs/agent-resources` 페이지를 가져옵니다. 일반 답변만으로는 놓치기 쉬운 내용이 여기서 나옵니다.

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

이런 페이지가 따로 있다는 사실 자체가 중요합니다. 이 답은 `vercel-claude-synergy.md`로 저장합니다.

### 4. 두 답변을 다섯 관점으로 비교하기

이제 받은 답 두 개를 비교합니다. 다시 클로드코드에 요청합니다.

```text
방금 받은 일반 답변이랑 docs-guide 답변 두 개를
정의 정확성·기능 범위·출처·버전·추측 흔적 다섯 관점으로 비교 표 만들어줘.
```

결과는 이런 형태가 됩니다.

```text
관점: 정의 정확성
- 일반 답변: "정적 사이트 호스팅"처럼 추상적으로 설명
- docs-guide: "AI Cloud"라는 공식 정의 확인

관점: 기능 범위
- 일반 답변: Git, CDN, HTTPS 정도로 제한됨
- docs-guide: 6개 카테고리로 정리

관점: 출처
- 일반 답변: 없음
- docs-guide: source URL 표시

관점: 버전
- 일반 답변: 명시 없음
- docs-guide: 문서 기준 확인 가능

관점: 추측 흔적
- 일반 답변: "보통", "아마도" 같은 표현이 섞일 수 있음
- docs-guide: 문서에 근거한 단정형 설명
```

이 내용을 `comparison.md`로 저장합니다. 한 화면에 차이를 정리해두면, 다음에 새 도구를 만났을 때 docs-guide를 켜야 할지 훨씬 빨리 판단할 수 있습니다.

### 5. 언제 쓸지 정리하기

오늘 시연 주제는 Vercel이지만, 실제로 남겨야 할 건 반복 가능한 습관입니다.

```text
docs-guide를 어떤 상황에서 쓰면 좋은지 정리해줘.
```

답변은 이런 식으로 정리할 수 있습니다.

```text
docs-guide를 쓰면 좋은 상황

1. 처음 쓰는 도구나 라이브러리를 호출하기 전
   - 예: Vercel, Supabase, OpenAI SDK, Tailwind, FastAPI

2. 바이브코딩 중 클로드코드가 새 라이브러리를 import했을 때
   - 환각 답변을 줄이기 위해 공식 문서 확인

3. 라이브러리 버전을 올린 뒤 코드가 깨졌을 때
   - 예전 문법과 현재 문법 차이 확인

4. 기능, 옵션, 메서드 시그니처를 정확히 알아야 할 때

5. 도구 선택 단계에서 클로드코드와의 연결 지점을 확인할 때
   - agent-resources, MCP 지원, llms.txt 제공 여부 등
```

특히 5번이 이번 Vercel 예시의 핵심입니다. Part 6, Part 7에서 Supabase 같은 도구를 만날 때도 같은 방식으로 확인하면 됩니다.

---

## 결과물

작업 폴더는 `50-my-work/Part04-강화하기/실습15-공식문서확인/`입니다. 안에는 파일 다섯 개가 남습니다.

```text
실습15-공식문서확인/
├── vercel-overview-plain.md       # 일반 답변
├── vercel-overview-docs.md        # docs-guide 답변 (정의 + 6 카테고리)
├── vercel-claude-synergy.md       # docs-guide 추가 답변 (5가지 시너지)
├── comparison.md                  # 다섯 관점 비교
└── README.md                      # 실습 메타 + 회고
```

`완료` 또는 `/wrap`을 입력하면 part04 스킬이 `README`와 `progress.json`을 정리합니다. `README`에는 아래 내용이 들어갑니다.

- 시연 주제: Vercel
- 사용한 출처 URL: `vercel.com/docs`, `vercel.com/docs/agent-resources`
- 비교 기준: 정의, 기능, 출처, 버전, 추측 흔적
- 발견한 연결 자원: `llms-full.txt`, MCP 서버, AI Gateway, Skills, CLI Workflows
- 반복 적용 가이드: 어떤 도구에 같은 흐름을 쓸지
- 회고 한 줄: 가장 인상적이었던 차이

---

## 자주 막히는 포인트

`/docs-guide` 호출이 인식되지 않으면 먼저 Clip 1에서 설치를 했는지 확인합니다. `/plugin`의 Installed 탭을 보고, 없으면 다시 설치합니다.

docs-guide 답변에 출처가 없을 때는 해당 라이브러리가 지원 목록에 없을 수 있습니다. README에서 지원 라이브러리를 확인하고, 없으면 다른 도구로 실습하세요.

Vercel 답변이 일반 답변과 크게 다르지 않다면 후속 질문이 얕았을 가능성이 큽니다. Supabase나 Tailwind처럼 문서 구조가 뚜렷한 도구로 같은 흐름을 다시 해봐도 됩니다.

Step 3에서 `agent-resources` fetch가 실패하면 URL이 바뀌었거나 잠깐 장애가 난 상황일 수 있습니다. 이때는 일반 Vercel 문서로 대체하고, Step 3는 건너뛰어도 됩니다.

답변이 너무 길어서 비교하기 어렵다면 이렇게 다시 요청하세요.

```text
핵심만 5줄로 요약해줘.
```

출처 URL이 클릭되지 않는 터미널도 있습니다. 그럴 때는 우클릭해서 링크를 열거나, URL을 복사해 브라우저에 붙여 넣으면 됩니다.

다른 도구에도 그대로 응용할 수 있습니다. 최근 처음 써본 도구나 곧 쓸 도구를 하나 골라 같은 방식으로 질문해보세요.

`llms.txt`가 헷갈리면 "AI용 문서 색인 파일"이라고 기억하면 됩니다. 사이트 루트에 두는 파일이라는 점에서 `robots.txt`와 비슷합니다.

---

## 다음 클립

→ [Part 4 / Clip 3: kkirikkiri — 자연어로 AI 팀 구성하기](#part-4-03-kkirikkiri)

다음 클립에서는 자연어 한마디로 AI 에이전트 팀을 구성하는 플러그인을 사용합니다. 오늘 다룬 docs-guide도 그 팀 안에서 한 명의 팀원처럼 다시 등장합니다.
