---
course_clip_ref: "Part 4 / Ch 01 / Clip 1"
result_path: "50-my-work/Part04-강화하기/실습14-플러그인설치/"
next_clip_id: "part-4-02-docs-guide"
---

# Part 4 / Clip 1: 플러그인 설치하기

> 강의 영상: Part 4 / Ch 01 / Clip 1 (~15분)
> 만드는 것: GPTaku 마켓플레이스 추가 + 플러그인 3개(docs-guide / kkirikkiri / vibe-sunsang) 설치

---

## 이 클립에서 하는 일

Part 3에서는 클로드코드와 대화하면서 보고서, 카드뉴스, 영상, 포트폴리오를 만들어봤습니다. Part 4부터는 방향이 조금 달라집니다. 새 결과물을 만드는 대신, 클로드코드에 기능을 더 붙입니다.

방법은 플러그인 설치입니다. 앱스토어에서 앱을 받아 쓰는 것과 비슷해요. 누군가 만들어둔 명령어, 스킬, 에이전트를 내 클로드코드에 가져와서 쓰는 방식입니다.

설치 전에는 같은 질문도 매번 처음부터 설명해야 합니다. 설치 후에는 플러그인이 작업 흐름을 어느 정도 잡아줍니다. 공식 문서를 매번 직접 찾아보던 일도 다음 클립부터는 docs-guide로 처리해볼 수 있고, 네 번째 클립에서는 내 사용 패턴을 외부 점검 도구로 확인해봅니다.

이번 클립에는 BUILD 5단계를 적용하지 않습니다. 결과물을 만드는 시간이 아니라 도구를 설치하는 시간이니까요. `/plugin` TUI를 열고, 마켓플레이스를 추가하고, 플러그인 세 개를 설치하면 끝입니다.

여기서 가져가야 할 것은 두 가지입니다. 플러그인은 클로드코드에 붙이는 확장 묶음이라는 것. 그리고 마켓플레이스를 한 번 추가하면 그 안의 플러그인을 골라 설치할 수 있다는 것.

---

## 핵심 개념

### 플러그인은 클로드코드 확장 묶음입니다

공식 문서는 플러그인을 이렇게 설명합니다.

> "Plugins let you extend Claude Code with custom functionality that can be shared across projects and teams."

쉽게 말하면, 누군가 만든 슬래시 명령, 스킬, 에이전트 같은 것들을 한 묶음으로 패키징해서 GitHub에 올려두고, 다른 사람이 한 번에 가져다 쓰게 만든 배포 단위입니다. 앱스토어에서 앱을 받는 감각과 거의 같습니다.

플러그인 안에는 여러 재료가 들어갈 수 있습니다. 지금 전부 외울 필요는 없습니다. Part 4에서는 슬래시 명령과 스킬 정도만 보면 됩니다. 나머지는 Part 5에서 직접 만져보면서 익힙니다.

- 슬래시 명령 — `commands/*.md`에 들어 있고, `/명령어`로 직접 호출합니다.
- 스킬 — `skills/*/SKILL.md`에 들어 있는 자동화 작업 흐름입니다.
- 서브에이전트 — `agents/*.md`에 들어 있으며, 특정 작업을 맡는 AI 페르소나입니다.
- Hook — `hooks/*.json`에 정의하는 이벤트 자동화입니다.
- MCP 서버 — `.mcp.json`으로 외부 서비스와 연결합니다.
- LSP 서버 — `lsp/*`에 들어가며 코드 자동완성이나 정의 점프에 쓰입니다.

### 마켓플레이스는 플러그인 카탈로그입니다

여기서 한 번 헷갈리기 쉽습니다. 처음부터 플러그인 하나를 바로 설치하는 게 아니라, 먼저 마켓플레이스를 추가합니다. 마켓플레이스를 등록하면 그 안에 들어 있는 플러그인들을 골라 설치할 수 있습니다.

```text
[제작자]                              [사용자]
명령·스킬·에이전트   →   [GitHub]   →   /plugin TUI
한 묶음 push                          → 마켓플레이스 추가
                                      → 플러그인 검색·설치
```

이번 클립에서 추가할 마켓플레이스는 GPTaku 하나입니다. URL은 `https://github.com/fivetaku/gptaku_plugins.git`입니다. 강사인 지피타쿠가 직접 만들어 운영하는 마켓플레이스입니다.

여기에 들어 있는 플러그인은 다음과 같습니다.

- docs-guide — AI 기억에만 기대지 않고 공식 문서를 실시간으로 가져와 답합니다.
- kkirikkiri — 자연어 한마디로 AI 에이전트 팀을 구성하고 실행합니다.
- 바선생(vibe-sunsang) — 클로드코드 대화 기록을 분석해 성장 리포트와 멘토링을 제공합니다.
- deep-research — 여러 에이전트가 병렬로 검색해 출처가 있는 리서치 리포트를 만듭니다.
- insane-design — 웹사이트의 CSS를 가져와 디자인 토큰, 컬러, 타이포그래피로 정리합니다.
- insane-search — 차단되거나 접근이 까다로운 사이트에서 정보를 가져오는 검색 도구입니다.
- git-teacher — Git 명령을 강의처럼 설명하고 안전하게 실행하도록 돕습니다.
- pumasi — Claude는 PM·아키텍트 역할을 맡고, Codex CLI들이 개발자로 병렬 작업합니다.
- nopal — Gmail, Calendar, Drive, Docs 같은 Google Workspace를 자연어로 조작합니다.
- show-me-the-prd — 한 문장 아이디어를 인터뷰로 풀어 PRD 문서 묶음으로 만듭니다.
- skillers-suda — 네 명의 전문가가 토론하면서 클로드코드 스킬을 만들어줍니다.

이번 Part 4에서 직접 다룰 것은 docs-guide, kkirikkiri, vibe-sunsang 세 개입니다. 나머지는 강의를 끝낸 뒤 자기 업무에 맞춰 골라 쓰면 됩니다. 다음 세 클립에서는 이 세 플러그인을 하나씩 써봅니다.

### 이번에 설치하는 세 플러그인 미리보기

지금 세부 기능을 외울 필요는 없습니다. 어떤 용도로 쓰는지만 잡고 넘어가면 됩니다.

docs-guide는 공식 문서를 실시간으로 찾아봅니다. 예를 들어 AI에게 "Next.js App Router는 어떻게 써?"라고 물으면 보통은 모델 기억으로 답합니다. 그 기억이 1년 전 버전일 수도 있죠. docs-guide는 질문이 들어오면 공식 문서 사이트에서 내용을 가져옵니다.

- 프로젝트의 `package.json`이나 `requirements.txt`를 읽고 내가 쓰는 버전을 감지합니다.
- React, Next.js, Vue, Django, Stripe 등 68개 이상 라이브러리를 미리 매핑해둡니다.
- 응답 끝에 출처 URL, 감지된 버전, 문서를 가져온 방법을 표시합니다.

kkirikkiri는 AI 에이전트 팀을 자동으로 구성합니다. "리서치 팀 만들어줘"라고 한 줄만 던지면, 끼리끼리가 2~3개 질문으로 인터뷰하고 환경을 살핀 뒤 팀을 짜서 실행합니다.

- 리서치, 개발, 분석, 콘텐츠, PM 프리셋을 제공합니다.
- Claude, Codex CLI, Gemini CLI를 한 팀에 섞어 역할을 나눌 수 있습니다.
- 1라운드 결과가 부족하면 최대 3라운드까지 팀을 다시 짭니다.
- 잘 동작한 팀원은 저장해 다른 프로젝트에서도 재사용할 수 있습니다.

vibe-sunsang, 즉 바선생은 내 AI 활용 방식을 점검합니다. 클로드코드는 대화 기록을 `~/.claude/projects/`에 자동 저장합니다. 바선생은 그 기록을 읽고 내가 AI를 어떻게 쓰고 있는지 분석합니다.

- 작업 분해, 검증, 오케스트레이션, 실패 대응, 맥락 관리, 메타인지 6축으로 평가합니다.
- Builder, Explorer, Designer, Operator 네 가지 워크스페이스 유형을 구분합니다.
- L1~L7 레벨을 0.5 단위로 기록해 주간·월간 변화를 추적합니다.
- 멘토링 모드에서 요청 품질 채점, 안티패턴 진단, 개념 학습, 종합 코칭을 제공합니다.

### 보안 한 줄

플러그인은 내 컴퓨터에서 코드를 실행할 수 있습니다. 공식 문서도 이 부분은 분명히 경고합니다.

> "Plugins are highly trusted components that can execute arbitrary code on your machine with your user privileges."

겁먹을 필요는 없지만, 아무 출처에서나 설치하면 안 됩니다. 신뢰할 수 있는 마켓플레이스에서만 설치하는 습관을 들이세요. 이 강의에서 GPTaku를 쓰는 이유도 강사가 직접 만든 출처이기 때문입니다.

---

## 진행 흐름

### 1. `/plugin` TUI 열기

먼저 클로드코드 안에서 `/plugin`을 입력합니다. 명령어로 직접 설치할 수도 있지만, 처음에는 TUI, 즉 텍스트 UI가 훨씬 보기 쉽습니다.

```text
/plugin
```

TUI가 열리면 위쪽에 `Discover`, `Installed`, `Marketplaces`, `Errors` 네 탭이 보입니다. 우리는 `Marketplaces` 탭부터 들어갑니다. 그래야 나중에 `Discover` 탭에 플러그인 목록이 채워집니다.

```text
┌─ Claude Code Plugins ─────────────────────────┐
│ [Discover] [Installed] [Marketplaces] [Errors]│
├───────────────────────────────────────────────┤
│ (현재 설치된 플러그인 목록)                    │
│   (없음)                                       │
└───────────────────────────────────────────────┘
```

### 2. Marketplaces 탭에서 GPTaku 추가

`Marketplaces` 탭으로 이동해 `Add marketplace`를 선택합니다. URL 입력란이 뜨면 GPTaku GitHub 주소를 그대로 붙여 넣습니다.

```text
https://github.com/fivetaku/gptaku_plugins.git
```

엔터를 누르면 등록이 끝납니다. 클로드코드가 GitHub에서 플러그인 목록을 가져옵니다.

```text
✓ Marketplace added: gptaku_plugins
  플러그인 목록을 가져왔습니다.
```

### 3. Discover 탭에서 플러그인 3개 설치

`Discover` 탭으로 가면 GPTaku 안의 플러그인 목록이 보입니다. 여기서 docs-guide, kkirikkiri, vibe-sunsang 세 개만 설치합니다. 순서는 docs-guide → kkirikkiri → vibe-sunsang으로 갑니다.

```text
[Discover]
├─ docs-guide        — 공식 문서 기반 답변
├─ kkirikkiri        — AI 에이전트 팀 자동 구성
├─ vibe-sunsang      — AI 활용 점검
├─ deep-research
├─ insane-search
├─ insane-design
└─ ... (그 외)
```

먼저 docs-guide를 선택하고 `Install`을 누릅니다. 설치 중 권한 요청이 뜰 수 있습니다. 이 강의에서는 GPTaku 마켓플레이스를 신뢰한다는 전제로 `y`를 눌러 진행합니다.

```text
> Install docs-guide@gptaku_plugins?
> (y/n) y
✓ Installed: docs-guide
```

같은 방식으로 kkirikkiri와 vibe-sunsang도 설치합니다. 한 번에 하나씩 진행되는 것이 정상입니다. 세 개가 끝나면 이런 상태가 됩니다.

```text
✓ docs-guide installed
✓ kkirikkiri installed
✓ vibe-sunsang installed
```

### 4. Installed 탭 확인 + 슬래시 명령 호출

이제 설치 여부를 확인합니다. `Installed` 탭으로 이동했을 때 방금 설치한 세 개가 모두 보여야 합니다.

```text
[Installed]
├─ ✓ docs-guide      — gptaku_plugins
├─ ✓ kkirikkiri      — gptaku_plugins
└─ ✓ vibe-sunsang    — gptaku_plugins
```

세 개가 보이면 TUI를 닫습니다. 그다음 슬래시 명령을 하나씩 호출해서 실제로 로딩되는지 확인합니다.

```text
/docs-guide
/kkirikkiri
/vibe-sunsang
```

각 플러그인이 무엇이든 응답을 내면 정상입니다. 지금은 깊게 사용할 필요 없습니다. "호출했을 때 답이 온다"까지만 보면 됩니다.

---

## 결과물

이번 클립에서는 별도 파일을 새로 만들지 않습니다. 대신 결과물 폴더에 진행 기록을 남깁니다.

```text
50-my-work/Part04-강화하기/
└── 실습14-플러그인설치/
    └── README.md
```

`README.md`에는 다음 내용을 적습니다. 거창한 문서가 아니라, 내가 무엇을 설치했는지 남기는 메모입니다.

- 완료 시각 — 설치를 끝낸 시간
- 마켓플레이스 — `gptaku_plugins`와 URL
- 설치한 플러그인 — docs-guide / kkirikkiri / vibe-sunsang
- 호출 확인 — 세 슬래시 명령의 응답 확인 여부
- 회고 — 가장 인상적이었던 한 줄

`완료` 또는 `/wrap`을 입력하면 part04 스킬이 `README.md`와 `progress.json`을 정리합니다. 직접 손으로 길게 작성할 일은 거의 없습니다.

---

## 자주 막히는 포인트

`/plugin`을 입력해도 TUI가 열리지 않으면 클로드코드 버전이 오래됐을 가능성이 큽니다. 최신 버전으로 업데이트한 뒤 다시 시도합니다.

`Marketplaces` 탭에서 URL 등록에 실패하면 인터넷 연결이나 GitHub 상태를 먼저 확인합니다. 잠깐 뒤 다시 등록하면 해결되는 경우도 많습니다.

설치 중 권한 요청이 계속 뜨는 것은 클로드코드 보안 정책 때문입니다. 신뢰할 수 있는 마켓플레이스라면 `y`로 진행합니다. 이 원칙만큼은 꼭 지키세요. 출처를 모르면 설치하지 않습니다.

설치했는데 `Installed` 탭에 보이지 않을 때는 캐시가 늦게 반영된 것일 수 있습니다. TUI를 닫고 `/reload-plugins`를 실행하거나 클로드코드를 재시작합니다.

슬래시 명령을 호출했는데 응답이 없으면 플러그인 로딩에 실패했을 수 있습니다. `/plugin`의 `Installed` 탭에서 상태를 확인하고, 필요하면 해당 플러그인을 다시 설치합니다.

잘못 설치한 플러그인은 `Installed` 탭에서 해당 플러그인을 선택한 뒤 `Uninstall`하면 됩니다.

플러그인 비용이 걱정된다면 이렇게 이해하면 됩니다. 플러그인 자체는 무료입니다. 다만 클로드코드 사용에는 기존 구독이나 사용량 비용이 따릅니다.

명령어로 바로 설치하는 방식도 있습니다.

```text
/plugin marketplace add [URL]
/plugin install [이름]@[마켓]
```

다만 처음에는 TUI로 눈으로 확인하면서 진행하는 편이 덜 헷갈립니다.

---

## 다음 클립

다음은 Part 4 / Clip 2, docs-guide입니다. 방금 설치한 첫 번째 플러그인을 직접 써봅니다.

다음 클립에서는 일반 질문으로 받은 답과 docs-guide로 받은 답을 비교합니다. 같은 질문인데 답이 어떻게 달라지는지, 왜 공식 문서를 보고 답하게 만드는 게 중요한지 바로 확인할 수 있습니다.

---
tone: null
tone_source: profile_only
tone_evidence: []
tone_confidence: null
---