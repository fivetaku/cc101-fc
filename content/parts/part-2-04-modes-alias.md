---
course_clip_ref: "Part 2 / Clip 4"
result_path: "50-my-work/Part02-시작하기/실습04-모드소개-Alias/"
next_clip_id: "part-3-01-conversation-5steps"
---

# Part 2 / Clip 4: 모드 + Alias

> 강의 영상: Part 2 / Clip 4 (~10분)
> 만드는 것: Claude Code 권한 모드 이해 + `cc`, `ccd`, `ccr` alias 설정

---

## 🎯 이 클립에서 만드는 것

매번 “이거 해도 돼요?”라고 묻는 게 안전하긴 한데, 계속 쓰다 보면 조금 답답하죠. 이 클립에서는 Claude Code를 더 빠르고 편하게 쓰기 위한 두 가지를 잡습니다. 첫째, 작업 성격에 따라 권한 모드를 바꾸는 법. 둘째, 매번 `claude`를 입력하지 않고 짧은 별명으로 실행하는 alias입니다.

Clip 3에서 다운로드 폴더를 정리하면서 Claude Code가 실행 전에 “이 작업을 해도 될까요?”라고 확인하는 장면을 봤습니다. 그 확인 방식은 모드에 따라 달라져요. 처음에는 묻는 게 좋습니다. 그런데 계속 쓰다 보면 작은 편집마다 멈추는 흐름이 꽤 답답해집니다.

끝나고 나면 여러분에게 맞는 권한 모드를 고르고, 터미널에서 `cc`만 입력해 Claude Code를 실행할 수 있어야 합니다. 익숙한 분들은 `ccd`, `ccr`처럼 Bypass와 resume을 섞은 alias도 같이 등록할 수 있어요. 저는 첫날에는 `cc`부터 추천합니다.

---

## 💡 핵심 개념

### 권한 모드는 자동차 기어다

권한 모드는 Claude Code가 파일을 읽고, 수정하고, 명령을 실행할 때 얼마나 자주 사용자에게 확인할지 정하는 장치입니다. 자동차 기어처럼 생각하면 쉬워요. 처음에는 수동으로 천천히 가고, 익숙해지면 자동으로 바꾸고, 복잡한 길에서는 네비게이션을 먼저 봅니다.

| 모드 | 자동차 비유 | 행동 | 추천 상황 |
|---|---|---|---|
| Default | 수동 기어 | 대부분의 행동마다 확인 | 첫 실행, 낯선 프로젝트 |
| Accept-edits | 자동 기어 | 안전한 파일 편집은 자동, 위험한 작업은 확인 | 입문자 기본값 |
| Plan | 네비게이션 | 실행 전 계획을 먼저 보여줌 | 큰 수정, 구조 변경, 불안한 작업 |
| Auto | 풀 자동 | 위험한 작업 위주로 확인 | Max 사용자, 반복 실습 |
| Bypass | 레이싱 모드 | 거의 묻지 않고 진행 | 격리된 환경, 충분히 익숙한 사용자 |

강의 기본 권장은 단순합니다. Pro 사용자는 Accept-edits로 시작하면 흐름이 부드럽고, Max 사용자는 Auto를 써도 좋아요. Bypass는 강력합니다. 솔직히 편해요. 다만 첫날 기본값으로 두지는 않습니다. 이런 모드가 있다는 걸 알고, 나중에 본인이 책임질 수 있는 환경에서 선택하면 됩니다.

### Shift+Tab으로 모드를 바꾼다

Claude Code가 실행 중인 상태에서 `Shift+Tab`을 누르면 모드가 순환합니다. 입력창 안에서 눌러야 해요.

```text
Default -> Accept-edits -> Plan -> Default
```

Status Line을 보면 현재 모드가 바뀌는 걸 확인할 수 있습니다. Bypass는 일반 사이클에 들어있지 않아요. 실행할 때 별도 플래그를 붙이거나 alias로 따로 만들어둡니다.

### Alias는 실행 단축키다

alias는 긴 명령에 붙이는 짧은 별명입니다. 터미널에 매번 `claude`를 입력하는 대신 `cc`만 입력해 실행할 수 있어요. 작은 차이인데, 매일 쓰면 꽤 큽니다.

| 별명 | 실제 명령 | 용도 |
|---|---|---|
| `cc` | `claude` | 기본 실행 |
| `ccd` | `claude --dangerously-skip-permissions` | Bypass로 바로 실행 |
| `ccr` | `claude --resume --dangerously-skip-permissions` | 이전 세션 이어서 Bypass 실행 |

처음에는 `cc` 하나만 등록해도 충분합니다. `ccd`와 `ccr`은 반복 작업이 많고, 현재 폴더가 안전하다는 확신이 있을 때 쓰면 돼요.

---

## 🚶 진행 흐름

### 1. Shift+Tab으로 모드 사이클 확인

Claude Code 실행 상태에서 `Shift+Tab`을 눌러봅니다. 한 번 누를 때마다 Status Line의 모드 표시가 바뀌어요.

```text
Shift+Tab
```

Default, Accept-edits, Plan을 한 바퀴 돌려봅니다. 바뀐 모드가 실제로 Status Line에 표시되는지 확인하세요.

### 2. `/powerup`으로 권한 모드 학습

이번엔 Claude Code 안에서 `/powerup`을 실행합니다. 문서로만 읽는 것보다 직접 보여주는 설명이 더 빠르게 들어와요.

```text
/powerup
```

토픽 목록에서 권한 모드와 관련된 항목을 선택합니다. Claude Code가 자기 자신을 예시와 함께 설명해주기 때문에 감이 빨리 옵니다.

### 3. 본인 기본 모드 선택

처음에 뭐 고를지 헷갈리면, 저는 이렇게 추천합니다.

| 사용자 상황 | 추천 모드 | 이유 |
|---|---|---|
| 오늘 처음 시작 | Default 또는 Accept-edits | 안전장치를 눈으로 확인하기 좋음 |
| Pro 구독자 | Accept-edits | 속도와 확인의 균형이 좋음 |
| Max 구독자 | Auto | 반복 실습에서 흐름이 덜 끊김 |
| 큰 리팩터링 전 | Plan | 먼저 계획을 보고 승인할 수 있음 |
| 격리된 실습 폴더 | Bypass 선택 가능 | 위험을 감당할 수 있는 환경에서만 |

모드를 바꾼 뒤 간단한 요청을 하나 넣어 확인합니다. 실제로 어떻게 묻고 멈추는지 보는 게 중요해요.

```text
현재 폴더를 살펴보고 어떤 파일이 있는지 요약하려는데, 먼저 어떤 방식으로 확인할지 알려줘
```

### 4. Claude Code 종료 후 alias 설정

alias는 Claude Code 밖, 일반 터미널에서 설정합니다. 먼저 Claude Code를 종료합니다.

```text
/exit
```

Mac은 `~/.zshrc`, Windows WSL은 `~/.bashrc`에 alias를 추가합니다. 여기서 운영체제별 파일이 다르다는 점만 조심하면 돼요.

Mac 기본형:

```bash
echo 'alias cc="claude"' >> ~/.zshrc
source ~/.zshrc
```

Windows WSL 기본형:

```bash
echo 'alias cc="claude"' >> ~/.bashrc
source ~/.bashrc
```

풀 패키지를 등록하려면 아래처럼 추가합니다. Bypass를 아직 안 쓸 생각이면 `cc`만 등록해도 됩니다.

Mac 풀 패키지:

```bash
cat >> ~/.zshrc << 'EOF'
alias cc='claude'
alias ccd='claude --dangerously-skip-permissions'
alias ccr='claude --resume --dangerously-skip-permissions'
EOF
source ~/.zshrc
```

Windows WSL 풀 패키지:

```bash
cat >> ~/.bashrc << 'EOF'
alias cc='claude'
alias ccd='claude --dangerously-skip-permissions'
alias ccr='claude --resume --dangerously-skip-permissions'
EOF
source ~/.bashrc
```

### 5. 작동 확인

새 터미널을 열거나 설정 파일을 다시 불러온 뒤 `cc`를 입력합니다.

```bash
cc
```

Claude Code가 실행되면 성공입니다. 이미 다른 프로그램이 `cc`라는 이름을 쓰고 있다면 `clc`, `claudie`처럼 다른 별명을 선택하면 돼요. 이때도 무작정 고치지 말고 Claude Code나 안티그래비티 agent에게 현재 alias 목록을 확인하는 방법을 물어보면 됩니다.

---

## 📦 결과물

마지막 결과물은 선택한 모드와 alias 기록입니다. 저장 위치는 `50-my-work/Part02-시작하기/실습04-모드소개-Alias/`예요.

```text
실습04-모드소개-Alias/
└── README.md          # 선택한 모드, alias 설정 여부, OS별 설정 파일 기록
```

README에는 다음 내용을 기록합니다. 나중에 새 터미널에서 `cc`가 안 먹힐 때, 이 기록이 꽤 도움이 됩니다.

| 항목 | 기록 내용 |
|---|---|
| 선택한 기본 모드 | Default, Accept-edits, Plan, Auto 중 하나 |
| Bypass 이해 여부 | `ccd`, `ccr` 등록 여부와 사용 조건 |
| 설정 파일 | Mac은 `~/.zshrc`, WSL은 `~/.bashrc` |
| alias 확인 | `cc` 입력 시 Claude Code가 실행되는지 |
| 다음 학습 준비 | Part 3로 넘어갈 준비 완료 여부 |

`progress.json`에는 Part 02 완료, 실습 4 완료, 선호 모드, alias 설정 여부가 반영됩니다. 이 클립까지 끝나면 설치와 첫 조작 준비가 마무리돼요.

---

## 🆘 자주 막히는 포인트

| 증상 | 원인 | 해결 |
|---|---|---|
| `Shift+Tab`을 눌러도 변화가 없음 | Claude Code 밖에서 누름 | Claude Code 실행 상태의 입력창에서 다시 시도 |
| 모드가 어디에 표시되는지 모르겠음 | Status Line을 안 봄 | 입력창 아래 Status Line에서 현재 모드 확인 |
| Bypass가 사이클에 없음 | Bypass는 일반 모드 순환에 없음 | 별도 실행 플래그나 alias로 사용 |
| `cc` 입력 시 `command not found` | 설정 파일을 아직 안 불러옴 | `source ~/.zshrc` 또는 `source ~/.bashrc` 실행 |
| `cc`가 다른 프로그램을 실행함 | 이미 같은 이름의 alias나 명령이 있음 | 다른 별명을 정하고 설정 파일에서 충돌 확인 |
| `.zshrc`와 `.bashrc`가 헷갈림 | Mac과 WSL 설정 파일이 다름 | Mac은 `~/.zshrc`, WSL Ubuntu는 `~/.bashrc` |
| `ccd`가 불안함 | Bypass가 확인을 거의 생략함 | 입문 단계에서는 `cc`만 쓰고 Accept-edits를 기본으로 유지 |
| alias를 잘못 추가함 | 따옴표나 줄바꿈이 깨짐 | 설정 파일에서 해당 줄을 확인하고 다시 source 실행 |

---

## 🔗 다음 클립

다음은 **[Part 3 / Clip 1: 대화 패턴 5단계](#part-3-01-conversation-5steps)** 입니다. Part 02에서 설치, 첫 실행, 권한 모드, alias까지 끝냈으니 이제 대화만으로 실제 결과물을 만드는 흐름으로 들어갑니다. 여기부터가 진짜 재미있는 구간이에요.
