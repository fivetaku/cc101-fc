---
course_clip_ref: "Part 5 / Ch 01 / Clip 3"
result_path: "50-my-work/Part05-뜯어보기/실습20-MCP-CLI/"
next_clip_id: "part-5-04-hook"
---

# Part 5 / Clip 3: MCP & CLI — 외부 도구 연결하기

> 강의 영상: Part 5 / Ch 01 / Clip 3 (~30분)
> 만드는 것: Playwright MCP 연결 + gws CLI 인증 + 브라우저 스크린샷 / 일정·메일 조회 결과

---

## 🎯 이 클립에서 만드는 것

지금까지 만든 자산(CLAUDE.md, 커맨드, 서브에이전트)은 다 클로드코드 안에서만 돌아갔어요. 그런데 클로드코드를 진짜 강력하게 만드는 건 **외부 도구를 꽂는 순간**입니다.

예를 들어 "내 캘린더 일정 확인하고 다음 주 회의 시간 추천해줘" — 이건 클로드코드 혼자 못해요. 구글 캘린더에 접속해야 하니까요. "경쟁사 사이트 5개 비교 분석해줘"도 못해요. 브라우저로 들어가 봐야 하니까. 이번 클립은 그 두 가지를 가능하게 만드는 두 방식을 봅니다.

| 방식 | 비유 | 한 줄 |
|---|---|---|
| **MCP** (Model Context Protocol) | AI에 꽂는 소켓 | 외부 서비스를 표준 규격으로 AI가 다루게 함 |
| **CLI** (Command Line Interface) | AI가 직접 호출하는 도구 | 터미널 명령으로 작동하는 도구를 AI가 자연어로 부름 |

오늘 꽂아볼 두 친구는 이래요. **두 친구의 학습 강도는 다릅니다.**

| 분류 | 도구 | 강도 |
|---|---|---|
| **필수 실습** | **MCP — Playwright** | 직접 설치하고 스크린샷·추출까지 |
| **선택 실습 / 강사 시연** | **CLI — gws CLI** | OAuth 인증이 복잡해서 강사 시연만 봐도 OK. 본인 진행은 강의 후 자가 |

| Before | After |
|---|---|
| AI한테 "이 사이트 봐줘" 부탁하면 못 함 | Playwright로 브라우저 열어서 직접 본 다음 정리 |
| 캘린더 일정 확인하려면 브라우저 별도 켜야 함 | "오늘 일정 정리해줘" 한 마디로 마크다운 보고서 |
| 외부 도구가 왜 필요한지 막연함 | MCP·CLI 두 방식의 차이와 어울리는 자리를 구분 |

Playwright는 모두가 따라 해주세요. gws는 OAuth 5단계가 매번 막히는 학생이 많아서, 영상 시연만 보고 흐름을 잡으셔도 됩니다.

---

## 💡 핵심 개념

### MCP는 AI에 꽂는 표준 소켓입니다

이름은 어렵지만 개념은 단순해요. **Model Context Protocol** — AI(모델)에 외부 도구를 꽂는 표준 규격입니다. 한 번 꽂으면 자연어로 다룰 수 있어요. Notion MCP 꽂으면 "내 Notion에서 어제 메모 찾아줘" 같이 부탁할 수 있는 거죠.

```text
Claude Code ──[MCP]── Playwright (브라우저)
            ──[MCP]── Notion (문서)
            ──[MCP]── Slack (메시지)
            ──[MCP]── 내가 만든 도구
```

MCP는 `.mcp.json` 파일 한 장에 서버를 등록하는 방식으로 연결합니다. 워크스페이스 루트에 두면 그 워크스페이스에서만 동작해요.

### CLI는 AI가 bash로 직접 호출하는 도구입니다

MCP가 "소켓"이라면 CLI는 "AI가 직접 호출하는 명령줄 도구"예요. AI가 터미널에서 명령 쳐서 결과를 받는 방식입니다.

```text
MCP:  AI ↔ MCP 서버 ↔ 외부 서비스
CLI:  AI → bash → CLI 도구 → 외부 서비스
```

gws CLI는 Gmail, 캘린더, 드라이브, 시트, 독스, 슬라이드, 미트, 챗, 태스크까지 9개 서비스를 한 도구로 다뤄요. AI가 자연어 요청을 받으면 알맞은 `gws` 명령어를 bash로 만들어 실행하고, 결과를 정리합니다.

### MCP와 CLI는 결이 다릅니다

둘 중 하나가 더 좋은 게 아니라 어울리는 자리가 따로 있어요.

| 구분 | MCP | CLI |
|---|---|---|
| 연결 방식 | `.mcp.json`에 서버 등록 | 시스템에 설치 (npm 등) |
| 호출 | 자연어 → MCP 서버가 처리 | 자연어 → AI가 bash 명령 작성 → 실행 |
| 장점 | 표준 규격, 도구 풍부 | 직접적, 시스템 도구 자유 활용 |
| 어울리는 자리 | 표준화된 외부 서비스 | 개인 도구·시스템 명령 |

**MCP가 없는 도구는 CLI로, CLI 없는 서비스는 MCP로** — 이렇게 보면 됩니다.

---

## 🚶 진행 흐름

### 1. `/part05` 호출 → Clip 3 선택

강의 워크스페이스에서 클로드코드를 켜고 시작합니다.

```text
/part05
```

Clip 3 선택하면 학습 워크스페이스 안에 작업 폴더가 준비돼요.

```text
✓ 50-my-work/Part05-뜯어보기/실습20-MCP-CLI/ 준비 완료
✓ ~/fastcampus-cc/50-my-work/Part05-뜯어보기/my-cc-study/.claude/ 디렉토리 확인됨
```

### 2. Playwright MCP 연결 (필수)

학습 워크스페이스 안 클로드코드 세션에서 `.mcp.json`을 만들어달라고 부탁합니다.

```text
my-cc-study/에 Playwright MCP를 연결하려는데 어떻게 해?
.mcp.json 파일 만들어서 연결해줘.
```

AI가 이런 파일을 만들어줘요.

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

`npx`로 설치 없이 바로 실행하는 방식이라, 처음 한 번만 다운로드되고 그 다음부터는 빠르게 켜집니다. 적용하려면 클로드코드를 재시작해요.

```bash
exit
claude
```

새로 시작하면 시작 로그에 Playwright가 활성화된 게 보입니다.

```text
[MCP] Connecting to playwright...
[MCP] ✓ playwright (active)
  Available tools: browser_navigate, browser_screenshot, browser_click, ...
```

활성화 끝. 이제 브라우저 자동화를 자연어로 부탁할 수 있어요.

본인이 평소 쓰는 브라우저(Comet, Edge, Brave 등 Chromium 계열)로 연결하고 싶으면 자연어로 부탁하시면 됩니다. 예: "지금 나는 Comet 브라우저 쓰는데, 그걸로 Playwright 연결해줘." MCP 설정에 `executablePath`를 추가하는 식으로 자동 처리돼요.

### 3. Playwright로 스크린샷 + 데이터 추출 (필수)

진짜 동작하는지 한 번 써봅니다. 시연용으로 공개 페이지 하나 골랐어요.

```text
Playwright로 https://news.hada.io 열어서 첫 페이지 스크린샷 찍고,
my-cc-study/sandbox/hada-screenshot.png에 저장해줘.
```

AI가 Playwright로 브라우저를 열고 페이지를 로드한 다음 스크린샷을 저장합니다.

```text
[Playwright] Navigating to https://news.hada.io
[Playwright] Page loaded (200 OK)
[Playwright] Screenshot saved: .../sandbox/hada-screenshot.png
```

안티그래비티 파일 트리에서 `hada-screenshot.png`를 열어보세요. AI가 직접 브라우저로 들어가 본 결과예요. 이게 MCP의 힘입니다.

한 단계 더 — 텍스트 추출까지.

```text
방금 그 페이지에서 상단 5개 게시물 제목만 뽑아서
my-cc-study/sandbox/hada-titles.md에 리스트로 정리해줘.
```

```markdown
# Hada News Top 5 (수집: 2026-05-10)

1. (게시물 1 제목)
2. (게시물 2 제목)
3. ...
```

사람이 직접 사이트 들어가서 복붙하던 거 AI가 대신 해줍니다. 본인 업무에 응용할 거리가 보일 거예요. 경쟁사 가격 비교, 공지사항 변경 모니터링, 리서치용 페이지 캡처 같은 데 바로 쓸 수 있어요.

### 4. gws CLI 설치 (선택 / 강사 시연)

다음은 CLI입니다. 설치는 한 줄이에요.

```bash
npm install -g @googleworkspace/cli
gws --version
```

```text
gws 0.19.0
```

여기서부터는 강사 시연 위주로 보세요. 인증 흐름이 인터랙티브라 클로드코드 안에서 못 돌립니다. 터미널에서 직접 진행해야 해요.

```bash
gws auth setup
```

설정 흐름은 다섯 단계.

```text
Step 1/5: gcloud CLI 확인
Step 2/5: Google 계정 선택
Step 3/5: GCP 프로젝트 생성
Step 4/5: 9개 API 활성화 (Gmail/Calendar/Drive/Sheets/...)
Step 5/5: OAuth 클라이언트 ID 생성 + 테스트 사용자 추가
```

마지막에 `gws auth login` 치면 브라우저가 열리고 Google 로그인 → 권한 승인 → 인증 완료. 상태 확인은 이렇게.

```bash
gws auth status
```

```text
✓ Authenticated
  Account: example@gmail.com
  Enabled APIs: 9
```

여기까지가 강사 시연 영역입니다. 학생은 영상 후 자가 진행해도 돼요.

### 5. gws CLI로 일정·메일 조회 (선택 — 본인 인증한 학생만)

인증된 gws CLI를 클로드코드가 자연어로 부르게 합니다.

```text
gws CLI로 오늘 내 캘린더 일정 확인해주려는데 어떻게 해?
조회 결과를 my-cc-study/sandbox/today-schedule.md에 정리해줘.
```

AI가 bash로 `gws calendar` 명령을 실행하고 결과를 파싱해서 마크다운으로 저장해요.

```markdown
# 오늘 일정 (2026-05-10)

## 09:30 - 10:30  팀 주간 회의
- 참석자: ...
- 위치: Google Meet

## 14:00 - 15:00  강의 촬영
- 메모: Part 05 클립 03

## 18:00  저녁 약속
```

한 단계 더 — 메일까지.

```text
gws CLI로 안 읽은 메일 중 최근 5개 제목만 정리해주려는데 어떻게 해?
my-cc-study/sandbox/recent-mails.md에 저장.
```

일정과 메일이 한 번에 정리됐어요. 매일 아침 출근하자마자 이거 한 번 돌리면 그날 하루가 한 화면에 정리됩니다. 이걸 슬래시 커맨드 `/morning-briefing`으로 묶으면 매일 똑같이 한 번에 받을 수 있어요. Part 6에서 그렇게 발전시킵니다.

---

## 📦 결과물

**필수 결과물 (모든 학생)**

| 결과물 | 위치 | 설명 |
|---|---|---|
| `.mcp.json` | `my-cc-study/.mcp.json` | Playwright MCP 설정 |
| `hada-screenshot.png` | `my-cc-study/sandbox/` | Playwright 자동화 결과 |
| `hada-titles.md` | `my-cc-study/sandbox/` | Playwright 텍스트 추출 결과 |
| `README.md` | `실습20-MCP-CLI/` | 진도 메타 (스킬 자동 작성) |

**선택 결과물 (gws 인증한 학생만)**

| 결과물 | 위치 | 설명 |
|---|---|---|
| `today-schedule.md` | `my-cc-study/sandbox/` | gws CLI 캘린더 조회 결과 |
| `recent-mails.md` | `my-cc-study/sandbox/` | gws CLI 메일 조회 결과 |

`완료` 입력하면 progress.json의 `mcp_installed`에 `["playwright"]`가 기록됩니다. gws를 인증한 학생은 `cli_installed`에 `["gws"]`도 같이 기록돼요.

---

## 🆘 자주 막히는 포인트

| 증상 | 원인 | 해결 |
|---|---|---|
| `npx @playwright/mcp` 처음 다운로드가 오래 걸림 | 첫 실행 시 패키지 다운로드 (수십 MB) | 정상. 첫 실행만 2~3분, 이후 빠름 |
| `.mcp.json` 만들었는데 활성화 안 됨 | 클로드코드 재시작 안 함 | `exit` 후 `claude` 재실행. 시작 로그에 `[MCP] ✓ playwright` 확인 |
| Playwright 브라우저 다운로드 실패 | 네트워크 또는 권한 | `npx playwright install chromium` 수동 실행 |
| `gws auth setup`이 클로드코드 안에서 안 돌아감 | 인터랙티브 명령 | 터미널에서 직접 실행. Bash 도구로 호출 불가 |
| OAuth "액세스 차단됨" 에러 | 테스트 사용자 추가 안 함 | OAuth 동의 화면 → "Test users" 탭 → 본인 Gmail 추가 (필수) |
| `invalid_scope` 에러 | API 너무 많이 활성화 | 9개만 정확히 활성화 (Drive/Sheets/Gmail/Calendar/Docs/Slides/Tasks/Chat/Meet) |
| `gws` 명령을 못 찾음 | npm 글로벌 경로 PATH 문제 | `which gws` 확인. 없으면 `npm root -g` 경로를 PATH에 추가 |
| 학생이 본인 인증 안 한 채로 gws 호출 | 정상 — 강사 시연만 본 경우 | 영상 후 자가 진행 OK |
| 스크린샷이 빈 페이지로 나옴 | 사이트 로딩 지연 | "스크린샷 찍기 전에 3초 대기" 추가 명령으로 보완 |
| 회사 네트워크 차단 | 방화벽 | 개인 핫스팟 또는 사내 허용 도구 사용 |
| 시연 사이트가 막힘 | 일시 장애 | 다른 공개 페이지로 대체 (github.com, anthropic.com 등) |
| MCP 삭제 방법이 헷갈림 | 관리 방법 | `.mcp.json`에서 해당 블록 제거 후 클로드코드 재시작 |

---

## 🔗 다음 클립

→ **[Part 5 / Clip 4: Hook — 자동화의 방아쇠 설정하기](#part-5-04-hook)**

다음 클립에서는 이벤트가 일어날 때 자동 실행되는 방아쇠를 만들어요. 오늘 꽂은 도구들이 자동으로 발동되게 하는 다음 단계입니다.
