---
course_clip_ref: "Part 5 / Ch 01 / Clip 4"
result_path: "50-my-work/Part05-뜯어보기/실습21-Hook/"
next_clip_id: "part-5-05-github"
---

# Part 5 / Clip 4: Hook — 자동화의 방아쇠 설정하기

> 강의 영상: Part 5 / Ch 01 / Clip 4 (~20분)
> 만드는 것: 학습 워크스페이스 `.claude/settings.json`에 Hook 3개 (Stop 알림음 + SessionStart 환영 + PreToolUse 안전장치)

---

## 🎯 이 클립에서 만드는 것

스마트홈 써보신 분 있으세요? "집에 들어가면 자동으로 불 켜짐", "아침 7시 커피머신 작동" 같은 거. 이게 **이벤트가 일어나면 자동 실행**되는 거잖아요. Hook이 딱 그거예요. 클로드코드에서 일어나는 특정 이벤트에 자동으로 뭐가 실행되게 만드는 장치입니다.

```text
[이벤트 발생]              [자동 실행]
대화 시작              →   오늘 할 일 출력
도구 실행 직전        →   위험 명령 차단
AI 응답 완료          →   알림음 재생
세션 끝                →   대화 요약 저장
```

오늘은 학습 워크스페이스에 Hook 세 개를 만들어요. 결이 각각 달라요.

| 결 | Hook | 효과 |
|---|---|---|
| **편의** | Stop — 응답 완료 알림음 | 백그라운드 작업 시켜놓고 다른 일 하다가 소리로 알 수 있음 |
| **습관** | SessionStart — 환영 메시지 | 매일 클로드코드 켤 때마다 본인 진도 자동 안내 |
| **안전** | PreToolUse — 위험 명령 차단 | `rm -rf /` 같은 명령을 실행 전에 자동으로 막아줌 |

| Before | After |
|---|---|
| 백그라운드 작업이 끝났는지 화면 계속 봐야 함 | 응답 끝나면 자동으로 소리가 울림 |
| 매일 클로드코드 켤 때마다 "어디부터 다시 해야 하지?" 헤맴 | 켜자마자 환영 메시지 + 진도 커맨드 안내 자동 |
| 자동 모드 쓰면 혹시 위험 명령 실행할까 봐 불안 | 위험 패턴은 실행 직전에 자동 차단 |

세 개 다 합쳐도 `settings.json` 한 파일이 본인 작업 환경의 DNA가 됩니다. 다른 컴퓨터에서 이 파일 하나만 옮기면 같은 환경이 재현돼요.

---

## 💡 핵심 개념

### Hook은 이벤트-반응 패턴입니다

Hook은 **이벤트가 발생할 때 자동 실행되는 셸 명령**이에요. "문 열리면 불 켜지는 센서" 같은 거. 클로드코드에는 이벤트가 여러 종류 있는데, 우리가 자주 쓰는 건 다섯 개 정도예요.

| 이벤트 | 언제 발생 | 활용 예 |
|---|---|---|
| `UserPromptSubmit` | 사용자가 메시지 입력 직후 | 메시지 로깅, 키워드 검사 |
| `PreToolUse` | AI가 도구 실행 직전 | 위험 명령 차단, 권한 확인 |
| `PostToolUse` | 도구 실행 완료 후 | 결과 알림, 자동 포매팅 |
| `Stop` | AI 응답 완료 | 완료 알림음, 상태 저장 |
| `SessionStart` | 새 세션 시작/재개 | 환영 메시지, 컨텍스트 주입 |

오늘 만들 세 개는 **Stop**, **SessionStart**, **PreToolUse**입니다.

### 설정은 `settings.json` 한 파일에

Hook은 워크스페이스 `.claude/settings.json` 파일에 등록해요. 학습 워크스페이스라 `my-cc-study/.claude/settings.json`에 작성합니다. 강의 워크스페이스 쪽은 손대지 않아요.

기본 구조는 이렇게 생겼어요.

```json
{
  "hooks": {
    "이벤트이름": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "실행할 셸 명령"
          }
        ]
      }
    ]
  }
}
```

`matcher`는 어떤 경우에 발동할지 좁히는 필터예요. `*`은 모든 경우, `Bash`는 Bash 도구 호출 직전만 등으로 좁힙니다.

### 설정 변경 후에는 클로드코드 재시작

Hook은 클로드코드 시작 시 로드돼요. `settings.json` 수정한 다음에는 반드시 `exit`로 나가고 `claude`로 다시 켜야 적용됩니다. 안 그러면 변경이 안 잡혀요.

---

## 🚶 진행 흐름

### 1. `/part05` 호출 → Clip 4 선택

강의 워크스페이스에서 클로드코드를 켜고 시작합니다.

```text
/part05
```

Clip 4 선택하면 작업 폴더가 준비돼요.

```text
✓ 50-my-work/Part05-뜯어보기/실습21-Hook/ 준비 완료
✓ ~/fastcampus-cc/50-my-work/Part05-뜯어보기/my-cc-study/.claude/settings.json 확인됨
```

### 2. Stop hook — 응답 완료 알림음 (편의)

첫 번째는 편의 결이에요. AI가 응답 끝나면 알림음이 울리게 합니다. 백그라운드로 작업 시켜놓고 다른 일 하다가 끝났는지 알기 좋아요.

학습 워크스페이스 클로드코드 세션에서 입력합니다.

```text
my-cc-study/.claude/settings.json에 Stop hook을 추가하려는데 어떻게 해?
AI 응답이 끝나면 Mac의 afplay로 알림음 재생.
```

본인 OS에 맞는 명령을 골라서 부탁하세요. 표에서 한 줄 복사한 다음 위 입력에 끼워 넣으면 됩니다.

| OS | Stop 알림음 명령 |
|---|---|
| macOS | `afplay /System/Library/Sounds/Glass.aiff` |
| Windows | `powershell -c "[console]::beep(500,300)"` |
| Linux | `notify-send 'Claude' '응답 완료'` (또는 `paplay /usr/share/sounds/freedesktop/stereo/complete.oga`) | AI가 이런 settings.json을 만들어줍니다.

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "afplay /System/Library/Sounds/Glass.aiff"
          }
        ]
      }
    ]
  }
}
```

구조 단순해요. `Stop` 이벤트가 발생하면, 모든 경우(`matcher: *`)에 대해 `command`가 실행됩니다.

재시작하고 동작 확인.

```bash
exit
claude
```

```text
1+1 뭐야?
```

응답 끝날 때 Glass 사운드가 울리면 정상이에요. 거슬리면 settings.json에서 Stop 블록만 빼면 즉시 꺼집니다.

### 3. SessionStart hook — 세션 시작 환영 (습관)

두 번째는 습관 결. 매일 클로드코드 켜자마자 본인 진도가 자동으로 안내됩니다.

```text
my-cc-study/.claude/settings.json에 SessionStart hook도 추가하려는데 어떻게 해?
세션 시작 시 클립 02에서 만든 /study-progress 결과를 자동으로 한 번 보여주고,
"안녕하세요!" 인사도.
```

기존 Stop hook 옆에 SessionStart가 같이 들어갑니다.

```json
{
  "hooks": {
    "Stop": [
      {"matcher": "*", "hooks": [{"type": "command", "command": "afplay /System/Library/Sounds/Glass.aiff"}]}
    ],
    "SessionStart": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "echo '안녕하세요! 오늘도 화이팅 — 진도 한 번 확인하실까요? /study-progress'"
          }
        ]
      }
    ]
  }
}
```

`echo`로 환영 메시지를 출력하는 단순한 명령이지만, 매일 클로드코드 켤 때마다 자동으로 떠요. 재시작하면 시작 직후 메시지가 보입니다.

```bash
exit
claude
```

응용 거리도 많아요. **날씨**(`curl wttr.in`), **오늘 일정**(Clip 3에서 인증한 gws CLI 호출), **TODO 파일 출력**(`cat ~/todo.md`) 같은 거.

### 4. PreToolUse hook — 위험 명령 차단 (안전)

세 번째는 안전 결. AI가 도구를 실행하기 직전에 검사해서 위험 패턴이면 차단합니다. 자동 모드(Auto, Bypass) 쓸 때 안전망 역할이에요.

```text
my-cc-study/.claude/settings.json에 PreToolUse hook도 추가하려는데 어떻게 해?
Bash 도구 실행 직전에 — 명령어에 'rm -rf /' 또는 'sudo rm'이 포함되면 차단.
exit 2로 차단하고 'BLOCKED: dangerous command'를 출력.
```

세 개를 다 합친 settings.json이 이렇게 완성됩니다.

```json
{
  "hooks": {
    "Stop": [
      {"matcher": "*", "hooks": [{"type": "command", "command": "afplay /System/Library/Sounds/Glass.aiff"}]}
    ],
    "SessionStart": [
      {"matcher": "*", "hooks": [{"type": "command", "command": "echo '안녕하세요! 오늘도 화이팅 — /study-progress'"}]}
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if grep -qE 'rm -rf /|sudo rm' <<< \"$TOOL_INPUT\"; then echo 'BLOCKED: dangerous command'; exit 2; fi"
          }
        ]
      }
    ]
  }
}
```

`matcher: "Bash"`라 Bash 도구 호출 직전만 검사해요. `grep`으로 위험 패턴을 찾고, 발견되면 `exit 2`로 차단합니다.

재시작하고 테스트해봐요. 진짜로 실행되진 않습니다 — Hook이 미리 막으니까요.

```bash
exit
claude
```

```text
'rm -rf /' 명령을 bash로 실행해줘 (테스트 — 실제 실행 안 됨)
```

AI가 Bash 호출을 시도하지만 PreToolUse hook이 발동돼서 `BLOCKED: dangerous command`가 출력되고 실행이 막힙니다. 본인이 실수로 위험한 거 입력해도 한 겹 더 막아주는 안전장치예요.

### 5. Hook 3종 정리

세 개를 한 표로 정리하면 이래요.

| 결 | Hook | 이벤트 | 효과 |
|---|---|---|---|
| 편의 | Stop 알림음 | 응답 완료 | 백그라운드 작업 알림 |
| 습관 | SessionStart 환영 | 세션 시작 | 매일 똑같이 자동 안내 |
| 안전 | PreToolUse 차단 | Bash 실행 직전 | 위험 명령 막기 |

settings.json 한 파일에 본인 작업 습관이 다 담겼어요. 이 파일을 다른 컴퓨터에 옮기면 같은 환경이 그대로 재현됩니다.

### 한 걸음 더 — 스크립트 파일로 분리

위 PreToolUse는 inline 명령이라 점점 길어지면 settings.json이 지저분해져요. 강사가 실제 작업할 때는 별도 Python 스크립트로 빼서 관리합니다.

```bash
# ~/.claude/hooks/block_dangerous.py 같은 위치에 만들기
```

```python
#!/usr/bin/env python3
"""위험한 명령어를 자동 차단하는 Safety Hook"""
import json, re, sys

BLOCKED_PATTERNS = [
    (r"\brm\s+-rf\s+/", "rm -rf /는 시스템 전체 파괴 위험"),
    (r"\bsudo\s+rm\b", "sudo rm은 시스템 파일 위험"),
    (r"git\s+reset\s+--hard", "git reset --hard는 커밋 안 한 작업을 삭제"),
    (r"git\s+push\s+--force", "git push --force는 다른 사람 작업을 덮어쓸 수 있음"),
]

input_data = json.loads(sys.stdin.read())
command = input_data.get("tool_input", {}).get("command", "")

for pattern, reason in BLOCKED_PATTERNS:
    if re.search(pattern, command):
        print(f"BLOCKED: {reason}", file=sys.stderr)
        sys.exit(2)

sys.exit(0)
```

그리고 settings.json의 PreToolUse는 이렇게 짧아져요.

```json
"PreToolUse": [
  {
    "matcher": "Bash",
    "hooks": [
      {"type": "command", "command": "python3 ~/.claude/hooks/block_dangerous.py"}
    ]
  }
]
```

규칙이 늘어나도 settings.json은 그대로고, Python 파일만 손보면 됩니다. **휴지통 보호 hook** 같은 변형도 같은 패턴이에요. `rm`을 매칭하고 `trash` 명령으로 우회하라는 메시지를 출력하면 됩니다.

또 다른 변형으로 **TTS 응답 요약**이 있어요. Mac의 `say -v Yuna` 명령으로 마지막 응답을 한국어 음성으로 읽어주는 방식. Stop hook에 stdin으로 들어오는 JSON에서 `transcript_path`를 받아 마지막 assistant 메시지를 추출해 음성으로 변환하는 짧은 셸 스크립트 하나면 됩니다.

```bash
# ~/.claude/hooks/stop-speak.sh
#!/bin/bash
TRANSCRIPT=$(jq -r '.transcript_path' <<< "$(cat)")
LAST_MSG=$(jq -r 'select(.type=="assistant") | .message.content[0].text' "$TRANSCRIPT" | tail -1 | head -c 80)
say -v Yuna "$LAST_MSG"
```

전체 응답을 다 읽지 않고 앞 80자만 발췌하는 게 가볍고 충분해요. 진짜 "요약"하려면 또 다른 AI 호출이 필요해서 무거워집니다.

---

## 📦 결과물

| 결과물 | 위치 | 설명 |
|---|---|---|
| `settings.json` | `my-cc-study/.claude/settings.json` | Hook 3개 설정 (백업 자산) |
| Stop hook 동작 확인 | 시연 결과 | 응답 후 Glass 사운드 |
| SessionStart hook 동작 확인 | 시연 결과 | 세션 시작 시 환영 메시지 |
| PreToolUse hook 동작 확인 | 시연 결과 | 위험 명령 시도 → BLOCKED |
| `README.md` | `실습21-Hook/` | 진도 메타 (스킬 자동 작성) |

`완료` 입력하면 progress.json의 `hooks_created`에 `["stop-alert", "session-welcome", "rm-guard"]`가 자동 기록됩니다.

---

## 🆘 자주 막히는 포인트

| 증상 | 원인 | 해결 |
|---|---|---|
| Stop hook 설정했는데 알림이 안 울림 | 클로드코드 재시작 안 함 | `exit` 후 `claude` 재실행. Hook은 시작 시 로드 |
| macOS afplay 권한 오류 | 시스템 설정 차단 | 시스템 설정 → 개인정보 보호 → 사운드 접근 허용 |
| Windows에서 afplay 동작 안 함 | macOS 전용 명령 | `powershell -c "[console]::beep(500,300)"`로 교체 |
| Linux에서 afplay 동작 안 함 | macOS 전용 명령 | `notify-send 'Claude' '응답 완료'` 또는 `paplay` |
| 알림이 너무 자주 울려서 거슬림 | Stop이 매번 발동 | matcher를 특정 도구로 좁히거나 settings.json에서 일시 제거 |
| JSON 문법 오류 | 콤마/따옴표 실수 | "settings.json 문법 검증하고 고쳐줘" 재요청 |
| `.claude/settings.json` 파일을 못 찾음 | 숨김 폴더 | 안티그래비티에서 학습 워크스페이스 열고 `.claude/` 펼치기 |
| Hook 설정 실수로 무한 루프 등 | 잘못된 명령 | settings.json에서 해당 Hook 블록 삭제 후 재시작 |
| Hook 삭제하는 법 | 관리 방법 | settings.json에서 해당 이벤트 블록만 제거 |
| 강의 워크스페이스 settings.json을 수정하려고 함 | "내 거" 혼동 | 즉시 차단. 학습 워크스페이스 쪽에만 만듦 |
| PreToolUse 차단 범위가 너무 넓음 | matcher가 모든 명령에 걸림 | "matcher를 특정 명령에만 한정해줘" 재요청 |
| `$TOOL_INPUT`이 작동 안 함 | Hook 환경변수 이름 오류 | 클로드코드 버전 확인. 최신 버전에서 사용 가능 |
| Hook 3개 다 켜놓으니 시작이 느림 | SessionStart에 무거운 명령 | echo 같은 가벼운 명령만 권장. gws CLI 호출은 느릴 수 있음 |

---

## 🔗 다음 클립

→ **[Part 5 / Clip 5: GitHub — git-teacher로 백업하기](#part-5-05-github)**

다음은 Part 5 마지막 클립이에요. 지금까지 만든 `.claude/`, `.mcp.json`, `settings.json`을 GitHub에 백업해서, 다른 컴퓨터에서도 같은 환경을 재현하는 법을 배웁니다.
