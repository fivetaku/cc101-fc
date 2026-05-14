---
course_clip_ref: "Part 4 / Ch 01 / Clip 1"
result_path: "50-my-work/Part04-강화하기/실습14-플러그인설치/"
next_clip_id: "part-4-02-docs-guide"
---

# Part 4 / Clip 1: 플러그인 설치하기

> 강의 영상: Part 4 / Ch 01 / Clip 1 (~15분)
> 만드는 것: GPTaku 마켓플레이스 추가 + 플러그인 3개(docs-guide / kkirikkiri / vibe-sunsang) 설치

---

## 🎯 이 클립에서 만드는 것

Part 3에서는 클로드코드와 **대화만으로** 보고서, 카드뉴스, 영상, 포트폴리오까지 만들어봤죠. 이번 Part부터는 결이 좀 달라요. 결과물을 새로 만드는 게 아니라, **클로드코드 자체를 더 강하게** 만듭니다.

방법은 간단해요. 플러그인을 설치합니다. 앱스토어에서 앱 받아 쓰는 거랑 같은 감각이에요. 누군가 미리 만들어둔 기능을 한 번에 가져와서 내 클로드코드에 붙여요.

| Before | After |
|---|---|
| 같은 질문을 매번 처음부터 다시 설명 | 플러그인이 흐름을 잡아주니 한 줄로 시작 |
| 공식 문서 매번 검색해서 확인 | 공식 문서 기반으로 답을 받음 (다음 클립) |
| 내 사용 패턴이 어떤지 감 없음 | 외부 점검 도구로 진단받음 (네 번째 클립) |

이번 클립은 **BUILD 5단계 적용하지 않습니다**. 결과물을 만드는 시간이 아니라 도구를 설치하는 시간이라 그래요. `/plugin` TUI를 열고 4단계만 따라가면 끝납니다.

저는 여기서 이 점만 잡고 가면 충분하다고 봐요. 플러그인이 뭔지 한 줄로 말할 수 있다, 마켓플레이스 한 번 추가했더니 그 안의 플러그인 여러 개를 골라 설치할 수 있더라, 이 두 가지.

---

## 💡 핵심 개념

### 플러그인은 클로드코드 확장 묶음입니다

공식 문서는 이렇게 정의해요.

> "Plugins let you extend Claude Code with custom functionality that can be shared across projects and teams."

풀어 쓰면, 누군가 만든 슬래시 명령·스킬·에이전트 같은 것들을 **한 묶음으로 패키징**해서 GitHub에 올려두면, 다른 사람이 한 번에 가져다 쓰는 배포 단위예요. 앱스토어에서 앱 받아 쓰는 그 감각 맞습니다.

플러그인 안에 들어갈 수 있는 재료는 여섯 가지인데, 다 외울 필요는 없어요. 이번 Part에서는 슬래시 명령과 스킬 정도만 보면 됩니다. 나머지는 Part 5에서 직접 만져보면서 익히게 돼요.

| 구성요소 | 위치 | 한 줄 설명 |
|---|---|---|
| 슬래시 명령 | `commands/*.md` | `/명령어`로 직접 호출 |
| 스킬 | `skills/*/SKILL.md` | 자동화 작업 흐름 |
| 서브에이전트 | `agents/*.md` | 특정 작업용 AI 페르소나 |
| Hook | `hooks/*.json` | 이벤트 자동화 |
| MCP 서버 | `.mcp.json` | 외부 서비스 연결 |
| LSP 서버 | `lsp/*` | 코드 자동완성·정의 점프 |

### 마켓플레이스는 플러그인 카탈로그입니다

여기서 헷갈리기 쉬워요. 플러그인 하나를 설치하는 게 아니라, 먼저 **마켓플레이스**를 추가해요. 마켓플레이스 한 번 등록하면, 그 안의 플러그인을 여러 개 골라 설치할 수 있습니다.

```text
[제작자]                              [사용자]
명령·스킬·에이전트   →   [GitHub]   →   /plugin TUI
한 묶음 push                          → 마켓플레이스 추가
                                      → 플러그인 검색·설치
```

이번 클립에서 추가할 마켓플레이스는 **GPTaku** 하나입니다. URL은 `https://github.com/fivetaku/gptaku_plugins.git` 이고, 강사인 지피타쿠가 직접 만들어 운영하는 마켓플레이스예요. 그 안에 들어 있는 플러그인은 이런 친구들입니다.

| 플러그인 | 한 줄 설명 |
|---|---|
| **docs-guide** | 공식 문서를 AI 기억이 아니라 **실시간으로** 가져와서 정확한 답을 줌 |
| **kkirikkiri** | 자연어 한마디로 AI 에이전트 팀을 자동으로 구성·실행 |
| **vibe-sunsang** | 내가 클로드코드와 나눈 대화 기록을 분석해 성장 멘토링·리포트 제공 |
| deep-research | 멀티에이전트 병렬 검색으로 출처 검증된 리서치 리포트 생성 |
| insane-design | 임의 웹사이트의 CSS를 긁어와 디자인 시스템(토큰·컬러·타이포)으로 추출 |
| insane-search | 차단·블록된 사이트도 우회해서 정보를 가져오는 검색 도구 |
| git-teacher | Git 명령을 강의처럼 설명하고 안전하게 실행 |
| pumasi | Claude가 PM·아키텍트, Codex CLI들이 외주 개발자로 병렬 코딩 |
| nopal | Gmail·Calendar·Drive·Docs 같은 Google Workspace를 자연어로 조작 |
| show-me-the-prd | 한 문장 아이디어를 인터뷰로 받아 PRD 4종 문서 생성 |
| skillers-suda | 4명의 전문가가 토론하면서 동작하는 클로드코드 스킬을 만들어줌 |

위 표에서 굵게 표시된 **세 개**가 이번 Part 4에서 직접 만져볼 친구들이에요. 나머지는 강의 끝나고 본인 업무에 맞춰 골라 쓰면 됩니다. 다음 세 클립에서는 한 번에 한 친구씩, 같은 흐름으로 갑니다.

### 이번에 설치하는 세 플러그인 미리보기

지금부터 자세히 외울 필요는 없어요. "아, 저런 친구구나" 정도만 잡고 다음 클립으로 넘어가시면 됩니다.

**docs-guide — 공식 문서 실시간 조회**

AI에게 "Next.js App Router는 어떻게 써?"라고 물으면 자기 기억으로 답해요. 문제는 그 기억이 1년 전 버전일 수 있다는 거예요. docs-guide는 질문이 들어오면 진짜 공식 문서 사이트에서 실시간으로 내용을 가져옵니다.

- 프로젝트의 `package.json` / `requirements.txt`를 읽어서 **내가 쓰는 버전**을 자동 감지
- React, Next.js, Vue, Django, Stripe 등 **68개 이상 라이브러리** 사전 매핑
- 응답 끝에 **출처 URL, 감지된 버전, 가져온 방법**을 항상 표시

**kkirikkiri — AI 에이전트 팀 자동 구성**

"리서치 팀 만들어줘"라고 한 줄 던지면, 끼리끼리가 2~3개 질문으로 인터뷰하고 환경을 스캔한 다음 팀을 짜서 바로 실행합니다.

- 5종 프리셋: 리서치 / 개발 / 분석 / 콘텐츠 / PM
- **멀티 모델 협업**: Claude + Codex CLI + Gemini CLI를 한 팀에 섞어서 역할 분담
- 1라운드 결과가 부족하면 자동으로 팀 재구성 (최대 3라운드)
- 잘 동작한 팀원은 저장해서 다른 프로젝트에서도 재사용

**vibe-sunsang (바선생) — 내 AI 활용 점검**

클로드코드는 모든 대화를 `~/.claude/projects/`에 자동 저장합니다. 바선생은 그 기록을 읽고 "당신이 어떻게 AI를 쓰고 있는지"를 분석해요.

- 6축 평가: 작업 분해(DECOMP) / 검증(VERIFY) / 오케스트레이션(ORCH) / 실패 대응(FAIL) / 맥락 관리(CTX) / 메타인지(META)
- 워크스페이스 유형 4가지: Builder / Explorer / Designer / Operator — 유형마다 가중치 다름
- 7단계 레벨 (L1~L7, 0.5 단위)로 매주·매월 성장 추적
- 멘토링 모드: 요청 품질 채점, 안티패턴 진단, 개념 학습, 종합 코칭

### 보안 한 줄

플러그인은 여러분 컴퓨터에서 코드를 실행할 수 있는 권한을 가져요. 그래서 공식 문서도 강하게 경고합니다.

> "Plugins are highly trusted components that can execute arbitrary code on your machine with your user privileges."

여기서 너무 겁먹을 필요는 없어요. 다만 **신뢰할 수 있는 마켓플레이스에서만** 설치하는 습관은 들이는 게 좋습니다. 이 강의에서 GPTaku를 쓰는 건 강사가 직접 만든 검증된 출처라서 그래요.

---

## 🚶 진행 흐름

### 1. `/plugin` TUI 열기

먼저 클로드코드 안에서 `/plugin`만 입력합니다. 명령어 직접 입력 방식도 있긴 한데, 처음에는 TUI(텍스트 UI)가 훨씬 직관적이에요.

```text
/plugin
```

TUI가 열리면 위에 탭 네 개가 보입니다. **Discover, Installed, Marketplaces, Errors**. 우리는 **Marketplaces** 탭부터 갈 거예요. 그래야 그 다음 Discover 탭에 플러그인 목록이 채워지거든요.

```text
┌─ Claude Code Plugins ─────────────────────────┐
│ [Discover] [Installed] [Marketplaces] [Errors]│
├───────────────────────────────────────────────┤
│ (현재 설치된 플러그인 목록)                    │
│   (없음)                                       │
└───────────────────────────────────────────────┘
```

### 2. Marketplaces 탭에서 GPTaku 추가

Marketplaces 탭으로 옮겨서 **Add marketplace**를 선택합니다. URL 입력란이 뜨면 GPTaku GitHub 주소를 그대로 붙여 넣어요.

```text
https://github.com/fivetaku/gptaku_plugins.git
```

엔터 치면 등록 끝입니다. 클로드코드가 GitHub에서 플러그인 목록을 가져와요.

```text
✓ Marketplace added: gptaku_plugins
  플러그인 목록을 가져왔습니다.
```

### 3. Discover 탭에서 플러그인 3개 설치

Discover 탭으로 옮기면 GPTaku 안의 플러그인 목록이 보입니다. 여러 개가 있는데, 우리는 **docs-guide → kkirikkiri → vibe-sunsang** 순서로 세 개만 설치할 거예요.

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

docs-guide부터 선택하고 **Install** 누릅니다. 설치 도중에 권한 요청이 뜰 수 있어요. `y`로 진행하면 됩니다. 신뢰할 수 있는 마켓플레이스만 설치한다는 원칙만 지키면 안전해요.

```text
> Install docs-guide@gptaku_plugins?
> (y/n) y
✓ Installed: docs-guide
```

같은 방식으로 **kkirikkiri**, **vibe-sunsang**도 차례로 설치합니다. 한 번에 하나씩 진행되는 게 정상이에요. 세 개가 다 끝나면 이런 모양이 됩니다.

```text
✓ docs-guide installed
✓ kkirikkiri installed
✓ vibe-sunsang installed
```

### 4. Installed 탭 확인 + 슬래시 명령 호출

설치가 됐는지 확인할 차례예요. Installed 탭으로 옮기면 방금 설치한 세 개가 다 보여야 합니다.

```text
[Installed]
├─ ✓ docs-guide      — gptaku_plugins
├─ ✓ kkirikkiri      — gptaku_plugins
└─ ✓ vibe-sunsang    — gptaku_plugins
```

세 개 다 확인됐으면 TUI를 닫고, 슬래시 명령을 하나씩 호출해서 진짜로 작동하는지 봅니다. 한 번씩만 부르면 돼요. 본격적으로 쓰는 건 다음 세 클립에서 합니다.

```text
/docs-guide
/kkirikkiri
/vibe-sunsang
```

각 플러그인이 응답하면 정상이에요. 어떤 응답이 나오든 상관없어요. **"호출하면 무언가 답이 온다"** 만 확인하면 됩니다.

---

## 📦 결과물

이번 클립은 따로 파일을 만들지는 않습니다. 대신 결과물 폴더에 진행 기록을 남겨요.

```text
50-my-work/Part04-강화하기/
└── 실습14-플러그인설치/
    └── README.md
```

README.md에 들어가는 내용은 이 정도입니다. 거창한 문서가 아니라 "내가 뭘 설치했는지" 기억하기 위한 메모예요.

| 항목 | 기록 내용 |
|---|---|
| 완료 시각 | 설치 끝낸 시간 |
| 마켓플레이스 | `gptaku_plugins` (URL 포함) |
| 설치한 플러그인 | docs-guide / kkirikkiri / vibe-sunsang |
| 호출 확인 | 세 개 슬래시 명령 응답 확인 여부 |
| 회고 | 가장 인상적이었던 한 줄 |

`완료` 또는 `/wrap`을 입력하면 part04 스킬이 README와 progress.json을 자동으로 정리해줍니다. 직접 손으로 쓸 일은 거의 없어요.

---

## 🆘 자주 막히는 포인트

| 증상 | 원인 | 해결 |
|---|---|---|
| `/plugin` 입력해도 TUI가 안 열림 | 클로드코드 버전이 오래됨 | 클로드코드 최신 버전 업데이트 후 재시도 |
| Marketplaces 탭에서 URL 등록 실패 | 인터넷 연결 또는 GitHub 일시 장애 | 인터넷 확인하고 다시 등록 |
| 설치 중에 권한 요청이 계속 뜸 | 클로드코드 보안 정책 | `y`로 진행. 신뢰할 수 있는 마켓플레이스에서만 설치 |
| Installed 탭에 안 보임 | 설치 직후 캐시 미반영 | TUI 닫고 `/reload-plugins` 또는 클로드코드 재시작 |
| 슬래시 명령 호출했는데 응답이 없음 | 플러그인 로딩 실패 | `/plugin` Installed 탭 상태 확인 후 재설치 |
| 잘못된 플러그인 설치 | 실수 | TUI Installed 탭에서 해당 플러그인 → Uninstall |
| "플러그인 안전한가요?" | 보안 걱정 | 클로드코드 안에서만 동작. 신뢰할 수 있는 출처에서만 설치 |
| "유료인가요?" | 비용 걱정 | 플러그인 자체는 무료. 클로드코드 구독료만 있으면 됩니다 |
| 명령어 직접 입력 방식이 더 빠른지 | 옵션 비교 | 가능합니다. `/plugin marketplace add [URL]` + `/plugin install [이름]@[마켓]`. 다만 처음에는 TUI가 직관적이에요 |

---

## 🔗 다음 클립

→ **[Part 4 / Clip 2: docs-guide — 공식 문서 기반으로 정확한 답변 받기](#part-4-02-docs-guide)** — 방금 설치한 첫 번째 플러그인을 직접 써봅니다.

다음 클립에서는 일반 질문과 docs-guide로 받은 답을 비교해요. 같은 질문에 답이 어떻게 달라지는지, 왜 공식 문서 기반으로 받는 게 안전한지 한 번에 보입니다.
