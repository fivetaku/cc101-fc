---
course_clip_ref: "Part 5 / Ch 01 / Clip 2"
result_path: "50-my-work/Part05-뜯어보기/실습19-커맨드서브에이전트/"
next_clip_id: "part-5-03-mcp-cli"
---

# Part 5 / Clip 2: 커맨드 & 서브에이전트 — 스킬의 재료들 알아보기

> 강의 영상: Part 5 / Ch 01 / Clip 2 (~20분)
> 만드는 것: `/study-progress` 커맨드 + `practice-coach` 서브에이전트 (학습 워크스페이스에 남겨두는 본인 자산)

---

## 🎯 이 클립에서 만드는 것

Part 4에서 `/docs-guide`, `/kkirikkiri` 써보셨죠. `/`로 부르는 그게 **커맨드**예요. 그런데 그 안에서 여러 명이 토론하듯이 일하던 것 — 그게 **서브에이전트**고요. 이 둘이 어떻게 만들어지는지, 오늘 직접 만들어봅니다.

먼저 큰 그림 하나만 잡고 가요. 클로드코드를 키우는 자산은 **세 가지 가족**입니다.

| 자산 | 비유 | 한 줄 |
|---|---|---|
| **커맨드** | 매크로 | 자주 치는 긴 프롬프트를 `/이름` 한 줄로 |
| **서브에이전트** | 전문가 | 특정 분야 전담 직원 — 자동 위임 |
| **스킬** | 매뉴얼 | 작업 절차서 — 여러 단계 자동화 (Part 6에서 제대로 제작) |

오늘은 그중 **두 개**를 만듭니다. 커맨드 하나 + 서브에이전트 하나. 매뉴얼(스킬)은 Part 6에서 따로 만들어요.

> **자산 위치 안내**: 오늘 만드는 커맨드와 서브에이전트는 **학습 워크스페이스(`my-cc-study/.claude/commands/`, `agents/`)** 안에 만듭니다. 강의 워크스페이스(`~/fastcampus-cc/`) 쪽은 강사가 관리하는 자산이라 손대지 않아요. 클로드코드를 어디서 켜느냐에 따라 어느 폴더의 자산을 보는지 달라지니, 항상 학습 워크스페이스 안에서 실습 진행해주세요.

| Before | After |
|---|---|
| 슬래시 커맨드가 마법처럼 동작하는 것처럼 보임 | 마크다운 파일 1장에 frontmatter + 본문 + `$ARGUMENTS`만 있으면 됨을 직접 확인 |
| 서브에이전트가 뭐가 다른지 헷갈림 | 자연어로 자동 위임 + 별도 컨텍스트 분리를 실제로 체감 |
| Part 6에서 만들 스킬이 어떤 재료로 구성되는지 막연함 | 두 재료(커맨드 + 서브에이전트)를 직접 만져봐서 Part 6 청사진이 잡힘 |

만들 자산 두 개는 본인 공부 흐름에 바로 쓰는 친구들이에요.

- `/study-progress` — 진도 보고서를 자동으로 정리해주는 슬래시 커맨드
- `practice-coach` — 본인 실습 결과물을 평가하는 학습 코치 서브에이전트

둘 다 Part 6, 7 끝까지 계속 쓰고, 강의 끝나도 본인 업무에 응용 가능합니다.

---

## 💡 핵심 개념

### 슬래시 커맨드는 마크다운 파일 한 장입니다

먼저 강의 워크스페이스에 이미 있는 `/stuck` 커맨드를 봅니다. 안티그래비티 에디터에서 `~/fastcampus-cc/.claude/commands/stuck.md`를 열어보세요. 안에 든 내용이 이렇게 생겼어요.

```markdown
---
description: 에러나 문제 상황 진단을 시작합니다. "막혔어요"로 자동 트리거.
---

사용자가 막힌 상황입니다. 다음 순서로 도와주세요:

1. 어떤 에러 메시지인지 정확히 묻기
2. 어떤 동작 후 발생했는지 확인
3. 가능한 원인 3가지 후보 제시
4. 가장 가능성 높은 것부터 시도

$ARGUMENTS
```

구조가 세 부분으로 나뉘어요.

| 부분 | 내용 |
|---|---|
| frontmatter (`---` 사이) | `description`. 클로드코드가 이 커맨드 언제 쓸지 판단하는 기준 |
| 본문 | AI에게 줄 프롬프트. 평소 채팅창에 입력하던 거랑 똑같음 |
| `$ARGUMENTS` | 사용자가 커맨드 뒤에 붙이는 입력 받는 자리 |

`/stuck npm 설치 안 됨`이라고 입력하면 `$ARGUMENTS`가 `npm 설치 안 됨`으로 치환돼요. **파일명이 곧 커맨드명**이라 `stuck.md` → `/stuck`이에요.

이 파일은 보기만 하고 닫습니다. 강의 워크스페이스의 자산이라 손대지 않아요.

### 서브에이전트는 별도 컨텍스트의 전문가입니다

서브에이전트는 한 가지가 더 있습니다. **자동 위임**과 **컨텍스트 분리**예요.

- **자동 위임**: `/agent` 같은 명시 호출 없이도, 자연어로 "이런 평가해줘"라고 부탁하면 클로드코드가 알아서 적절한 서브에이전트를 발동시킴
- **컨텍스트 분리**: 서브에이전트가 작업할 때는 자기 고유 컨텍스트 윈도우를 따로 쓰기 때문에 메인 대화가 깨끗하게 유지됨

서브에이전트 파일은 `.claude/agents/이름.md`에 둡니다. 슬래시 커맨드와 거의 같은 구조인데, frontmatter에 필드가 몇 개 더 들어가요.

### 외부 잘 만든 패턴을 가져다 변형하기

서브에이전트는 직접 처음부터 짜는 것보다 **잘 만들어진 거 분석해서 패턴 익히기**가 빠릅니다. 이번 클립에서는 `agency-agents`라는 외부 레포(별 95,000개, 200+ 에이전트)에서 한 명을 골라 패턴을 추출한 다음, 그 틀에 본인 코치를 만들어요. Part 4에서 docs-guide로 공식 문서 가져왔던 그 패턴이 여기서도 똑같이 적용됩니다.

---

## 🚶 진행 흐름

### 1. `/part05` 호출 → Clip 2 선택

강의 워크스페이스에서 클로드코드를 켜고 시작합니다.

```text
/part05
```

Clip 2를 선택하면 스킬이 작업 폴더와 학습 워크스페이스 안 자산 폴더를 자동으로 만들어줘요.

```text
✓ 50-my-work/Part05-뜯어보기/실습19-커맨드서브에이전트/ 준비 완료
✓ ~/fastcampus-cc/50-my-work/Part05-뜯어보기/my-cc-study/.claude/{commands,agents}/ 준비 완료
```

학습 워크스페이스(`my-cc-study/`) 안에 `.claude/commands/`와 `.claude/agents/` 폴더가 생겼어요. 오늘 만드는 자산은 여기 쌓입니다.

### 2. 강의 워크스페이스 `/stuck` 커맨드 뜯어보기

이미 본 그 파일을 한 번 더 짚고 갑니다. 안티그래비티 에디터에서 `stuck.md`를 열고 세 부분(frontmatter / 본문 / `$ARGUMENTS`)을 눈으로 확인하세요. **읽기만 하고 닫습니다.** 수정 X.

### 3. `/study-progress` 커맨드 만들기

이제 본인 거 하나 만들어봅니다. 학습 워크스페이스 안 클로드코드 세션에서 입력합니다.

```text
.claude/commands/study-progress.md 파일 만들어줘.

목적: 이 워크스페이스의 강의 진도를 정리하는 슬래시 커맨드.

동작:
- progress.json을 읽어 완료한 실습 번호와 레벨 확인
- 50-my-work/ 폴더를 스캔해서 만든 결과물 목록 정리
- 다음 형식으로 보고서 출력:
  ## 이번 주 진도
  - 완료한 실습:
  - 만든 결과물:
  - 현재 레벨:
  - 다음 추천:

frontmatter:
- description에 "강의 진도 정리" 키워드 포함

본문 끝에 $ARGUMENTS 자리 마련 — 사용자가 추가 메모 입력할 수 있게.
```

AI가 이런 파일을 만들어줘요.

```markdown
---
description: 강의 진도를 정리합니다. progress.json + 50-my-work를 읽어 이번 주 보고서를 만듭니다. "내 진도 정리해줘"로도 발동.
---

이 워크스페이스의 강의 진도를 정리해주세요.

다음 정보를 수집하세요:
1. progress.json을 읽어 completed_parts, practice_completed, level 확인
2. 50-my-work/ 폴더를 스캔해 만든 결과물 목록 확인
3. 가장 최근 작업한 실습 확인

다음 형식으로 보고서를 출력하세요:

## 이번 주 진도
- 완료한 실습: (실습 번호 + 제목)
- 만든 결과물: (파일/폴더 목록)
- 현재 레벨: (AI Starter / Intermediate / Advanced / Native)
- 다음 추천: (커리큘럼 기준 다음 단계)

추가 요청사항: $ARGUMENTS
```

만들어졌으면 바로 호출해서 동작 확인.

```text
/study-progress
```

본인 진짜 데이터 기반으로 이런 보고서가 나옵니다.

```text
## 이번 주 진도
- 완료한 실습:
  - 실습 1-13 (Part 02~03)
  - 실습 14-17 (Part 04 강화하기)
  - 실습 18 (Part 05 CLAUDE.md)
- 만든 결과물:
  - charts/ — 데이터 분석 차트 8장
  - vercel-overview-docs.md — docs-guide 답변
  - discovery-report.md — kkirikkiri 진단 리포트
  - CLAUDE.md — 본인 업무 매뉴얼
- 현재 레벨: AI Intermediate (Part 05 진행 중)
- 다음 추천: 실습 19 (커맨드 & 서브에이전트) — 지금 이거 진행 중!
```

매주 월요일 아침에 한 줄로 한 주 정리 끝나는 거예요. 회사 업무에도 같은 패턴 응용 가능합니다. `/weekly-report`, `/sales-summary`, `/team-update` — 안에 데이터만 바꾸면 똑같은 구조예요.

### 4. agent-agency 레포 분석 — 서브에이전트 패턴 추출

직접 짜기 전에 잘 만들어진 거 한 명 분석합니다. docs-guide로 외부 파일을 가져와 패턴 뽑아내는 흐름이에요.

```text
/docs-guide:docs-guide 이 서브에이전트 파일의 구조와 패턴 분석해줘:

https://github.com/msitarzewski/agency-agents/blob/main/engineering/engineering-code-reviewer.md

특히 다음을 정리:
1. frontmatter에 어떤 필드들이 있고 각각 무슨 역할인지
2. 본문 섹션 구조 (어떤 순서로 뭐가 들어가는지)
3. 자동 위임이 잘 되도록 description을 어떻게 썼는지
```

분석 결과가 이런 식으로 나옵니다.

```text
[frontmatter — 5필드 표준]
1. name           — 서브에이전트 식별 이름
2. description    — 자동 위임 판단 기준 ("expert", "feedback" 같은
                   매칭 키워드를 description에 박아둠)
3. color          — UI 표시 색상
4. emoji          — 아이콘
5. vibe           — 톤/스타일 한 줄

[본문 — 5섹션 표준]
1. Identity & Memory   — 정체성 (역할, 성격, 경험)
2. Core Mission        — 핵심 목표 (체크할 것)
3. Critical Rules      — 행동 규칙
4. Review Checklist    — 우선순위 매트릭스
5. Communication Style — 답변 톤

[자동 위임 잘 되는 description 패턴]
- "Expert {분야} who {핵심 동작}, focused on {목표}"
- 자연어 트리거 키워드를 description에 박아두기
```

분석 결과를 `50-my-work/.../agent-agency-pattern.md`로 저장합니다.

### 5. `practice-coach` 서브에이전트 만들기

이제 추출한 패턴 그대로 본인 코치를 만들어요.

```text
.claude/agents/practice-coach.md 파일 만들어줘.

방금 분석한 engineering-code-reviewer.md 패턴 그대로 따라서:

frontmatter:
- name: practice-coach
- description: Claude Code 강의 실습 결과물을 평가하고 다음 단계를 추천합니다.
              "내 실습 평가해줘", "다음 뭐 해야 해?", "잘하고 있나?" 같은
              요청에 자동 발동.
- tools: Read, Glob
- color: green
- emoji: 🎯
- vibe: Evaluates like a supportive mentor — celebrates wins, points growth
        areas without judgment.

본문 섹션 5개:
1. Identity & Memory — 클로드코드 학습 코치 역할
2. Core Mission — 평가 기준 5가지 (실습 완료도 / 결과물 품질 / 대화 패턴 / 다음 단계 / 격려 포인트)
3. Critical Rules — 잘한 점 먼저 / 구체적 근거 / 다음 단계 명확하게 / 격려 톤
4. Review Checklist — 🔴 핵심 누락 / 🟡 개선 / 💭 보너스
5. Communication Style — 한국어 존댓말, 친근하게, 끝에 다음 행동 1개 제안
```

파일이 만들어졌으면 진짜로 동작하는지 확인. **여기서 봐야 할 건 직접 호출이 아니라 자연어 자동 위임이에요.** `/practice-coach`라고 안 부르고, 그냥 자연어로 부탁해봅니다.

```text
지금까지 한 실습들 평가해줘. 50-my-work/ 폴더 보고.
```

클로드코드가 자동으로 practice-coach를 발동시켜요. 별도 컨텍스트에서 작업이 돌아가고, 메인 대화에는 결과 요약만 옵니다.

```text
[practice-coach 활성화]
[Reading 50-my-work/ ...]

🎯 실습 평가 리포트

[잘한 점 ✨]
- Part 03 데이터 분석에서 BUILD 5단계 한 사이클 잘 돌렸어요.
  특히 STEP 5 부분 수정에서 "다른 건 그대로" 명시한 게 ◎
- Part 04 kkirikkiri 시연에서 코스메틱 마케터로 본인 직무 변형
  잘 적용. 우선순위 1-2개도 명확.

[개선 제안 🟡]
- Part 03 보고서 작성 결과물에 README.md가 비어있어요.
  실습 메타정보 (날짜/모드/모델) 채우면 나중에 회고할 때 좋아요.

[다음 단계 →]
다음 클립(20번 — MCP & CLI) 시작 전에 이 리포트 한 번 더
"내 실습 평가해줘"로 호출해서 위 개선 제안 반영했는지 확인.

[격려 한 줄]
17개 실습 완주하셨어요. 절반 넘었습니다. 이 페이스면 Part 06
끝나고 본인만의 스킬 1개는 무조건 나옵니다.
```

평가 작업이 별도 컨텍스트에서 일어났다는 게 핵심이에요. 메인 대화에는 요약만 돌아오니까 본인 작업이 깨끗하게 유지됩니다.

### 6. 세 자산 가족 관계 정리

오늘 만든 두 자산과 Part 6에서 만들 스킬을 한 표로 비교합니다.

| 구분 | 커맨드 | 서브에이전트 | 스킬 (Part 6) |
|---|---|---|---|
| 비유 | 매크로 | 전문가 | 매뉴얼 |
| 호출 방식 | `/이름` 명시 | 자연어 → 자동 위임 | 자연어 → 자동 발동 |
| 파일 구조 | `.claude/commands/이름.md` (파일 1개) | `.claude/agents/이름.md` (파일 1개) | `.claude/skills/이름/SKILL.md` (폴더 + 추가 파일) |
| 컨텍스트 | 메인과 같음 | 분리됨 | 메인과 같음 (forked 가능) |
| 오늘 만든 것 | `/study-progress` | `practice-coach` | — (Part 6) |

셋이 독립적이지만 조합 가능합니다. 스킬 안에서 서브에이전트를 호출할 수도 있고, 서브에이전트가 스킬을 미리 로드할 수도 있어요. **"스킬의 구성요소"라기보다 가족 관계**라고 보시면 됩니다.

---

## 📦 결과물

| 결과물 | 위치 | 설명 |
|---|---|---|
| `study-progress.md` | `my-cc-study/.claude/commands/` | 진도 정리 슬래시 커맨드 |
| `practice-coach.md` | `my-cc-study/.claude/agents/` | 학습 코치 서브에이전트 |
| `agent-agency-pattern.md` | `실습19-커맨드서브에이전트/` | 외부 레포 분석 결과 |
| `progress-report.md` | `실습19-커맨드서브에이전트/` | `/study-progress` 호출 결과 |
| `coach-feedback.md` | `실습19-커맨드서브에이전트/` | practice-coach 자동 위임 결과 |
| `README.md` | `실습19-커맨드서브에이전트/` | 실습 메타 + 자산 요약 |

`완료` 입력하면 progress.json에 `commands_created`와 `agents_created`가 자동 기록돼요. Part 6 시작할 때 자동으로 참고됩니다.

---

## 🆘 자주 막히는 포인트

| 증상 | 원인 | 해결 |
|---|---|---|
| `/study-progress` 호출이 인식 안 됨 | 클로드코드 재시작 안 함 | `exit` 후 `claude` 재실행. 슬래시 커맨드는 세션 시작 시 로드 |
| 호출은 되는데 보고서가 비어 있음 | progress.json이나 50-my-work에 데이터 없음 | 정상. 초반엔 비어 있어도 OK |
| `$ARGUMENTS`가 작동 안 함 | 대소문자 오타 | 정확히 `$ARGUMENTS`(대문자) |
| agent-agency 레포 fetch 실패 | URL 변경 또는 네트워크 | docs-guide 일반 검색으로 대체. 또는 강사 시연 자료 참고 |
| `practice-coach` 자동 위임 안 됨 | description이 너무 모호 | "내 실습 평가해줘" 같은 자연어 트리거 키워드를 description에 명시 추가 |
| 자동 위임 안 되고 메인에서 처리됨 | tools 없거나 description 매칭 약함 | description 강화 + frontmatter에 `tools: Read, Glob` 명시 |
| 평가 리포트가 두루뭉술 | tools 없어서 파일 못 읽음 | `tools: Read, Glob` 확인 |
| 본인 직무가 엔지니어가 아님 | 다른 카테고리 적용 가능 | `marketing/`, `design/`, `sales/` 등 어디든 OK. 패턴은 동일 |
| 자동 위임 vs 직접 호출이 헷갈림 | 처음 사용 | 직접 호출은 `@practice-coach 평가해줘`, 자동 위임은 그냥 "평가해줘" |
| 영문 이름이 거부감 | 한글 익숙 | 한글도 작동은 하지만 한영 전환이 흐름을 끊음. 표준은 영문 kebab-case |

---

## 🔗 다음 클립

→ **[Part 5 / Clip 3: MCP & CLI — 외부 도구 연결하기](#part-5-03-mcp-cli)**

다음 클립에서는 외부 도구를 클로드코드에 꽂는 방법을 봅니다. Perplexity, Notion, Gmail 같은 거. 오늘 만든 `practice-coach`도 외부 데이터를 끌어오면 한층 강력해져요.
