---
course_clip_ref: "Part 2 / Clip 1"
result_path: "50-my-work/Part02-시작하기/실습01-Mac환경설치/"
next_clip_id: "part-2-02-windows-install"
---

# Part 2 / Clip 1: Mac 환경 설치

> 강의 영상: Part 2 / Clip 1 (~20분)
> 만드는 것: 안티그래비티 IDE에서 agent와 대화하며 Mac용 Claude Code 실행 환경 만들기

---

## 🎯 이 클립에서 만드는 것

Mac 사용자분들은 여기서부터 진짜 시작입니다. 그런데 첫 화면부터 터미널에 긴 명령어를 줄줄 치는 강의, 아닙니다. 이 클립에서는 Mac에서 Claude Code를 처음 실행할 수 있는 기본 환경을 만들어요. 흐름은 **안티그래비티 IDE → Homebrew → Git → Node.js → IDE 안의 agent를 활용한 Claude Code 설치 → 인증 → 기본 조작 확인**까지예요.

제가 이 클립에서 제일 강조하고 싶은 건 순서예요. 터미널에 명령어 직접 치는 게 아니에요. 안티그래비티 IDE를 먼저 깔고, 빈 폴더를 열고, 그 안의 agent한테 “Claude Code 설치하려는데 어떻게 해?”라고 묻습니다. 그러면 agent가 방법을 설명해주고, 여러분은 읽고 동의한 다음 실행하면 돼요.

끝나고 나면 `brew`, `git`, `node`, `npm`, `claude`가 전부 동작해야 합니다. 마지막에는 Claude 계정 인증까지 하고, 테스트 폴더에서 첫 인사까지 확인합니다. 여기까지 되면 Mac 설치는 끝이에요.

---

## 💡 핵심 개념

### 설치도 대화로 진행한다

여기서 중요한 건 “Mac에 Claude Code 까는 명령어”가 아닙니다. 진짜 핵심은 **설치 과정을 안티그래비티 agent와 같이 풀어가는 습관**이에요. 앞으로 제가 계속 반복할 패턴도 이거예요.

```text
Mac에 Homebrew 설치하려는데 어떻게 해?
```

```text
Claude Code를 네이티브 방식으로 설치하려는데, 내 환경에서 안전하게 진행할 순서와 확인 방법까지 알려줘
```

이렇게 먼저 물어보면 agent가 뭘 설치하는지, 어떤 명령을 실행하는지, 끝나고 뭘로 확인할지 설명해줍니다. 그다음 여러분이 이해하고 OK 하면 실행해요. 솔직히 처음엔 조금 느려 보여요. 그런데 초반에는 이게 훨씬 안전합니다.

### 도구들의 역할

| 도구 | 역할 | 이 클립에서 필요한 이유 |
|---|---|---|
| 안티그래비티 IDE | agent와 대화하며 작업하는 개발 환경 | 설치를 자연어로 안내받는 첫 화면 |
| Homebrew | Mac용 패키지 관리자 | Git, Node.js 같은 도구를 깔 때 쓰는 도우미 |
| Git | 변경 이력 관리 도구 | Claude Code가 프로젝트 변화를 따라갈 때 필요 |
| Node.js | JavaScript 실행 환경 | 이후 웹·자동화 실습에서 자주 쓰는 엔진 |
| Claude Code | 터미널 기반 자율 에이전트 | 강의 전체에서 대화로 일을 시킬 주인공 |

Homebrew를 깔다 보면 Mac에서 Command Line Developer Tools와 Git이 같이 준비되는 경우가 많아요. 그래도 저는 항상 `git --version`으로 확인합니다. 설치된 것처럼 보여도 버전 출력이 떠야 완료예요.

---

## 🚶 진행 흐름

### 1. 안티그래비티 IDE 설치

첫 단추는 안티그래비티입니다. 브라우저에서 안티그래비티 다운로드 페이지에 접속해 macOS용 설치 파일을 받고, 설치 후 Google 계정으로 로그인해요.

중요한 게 하나 있어요. **폴더를 열어야 agent가 제대로 작동합니다.** 처음에는 실습용 빈 폴더 하나 만들고 열어두면 됩니다.

```text
Open Folder를 눌러 새 실습 폴더를 만들고 열어주세요. 폴더가 열린 상태에서 agent 채팅창이 보이면 다음 단계로 갑니다.
```

### 2. Homebrew와 Git 준비

이제 Homebrew입니다. 여러분이 외워야 할 명령어부터 던지는 게 아니라, 안티그래비티 채팅창에 먼저 물어봅니다.

```text
Mac에 Homebrew 설치하려는데 어떻게 해? 설치 후 brew와 git이 제대로 잡혔는지 확인하는 방법까지 알려줘
```

agent가 안내하는 설명을 읽고 진행합니다. 설치 중 Command Line Developer Tools 팝업이 나오면 `Install`을 누르면 돼요. 끝나면 아래 명령으로 확인합니다.

```bash
brew --version
git --version
```

두 명령 모두 버전이 나오면 다음 단계로 갑니다. 안 나오면 아직 끝난 게 아니에요.

### 3. Node.js LTS 설치

Node.js는 Claude Code 자체를 실행하는 데 꼭 필요한 건 아닙니다. 다만 이후 실습에서 웹 프로젝트와 외부 도구를 다룰 때 거의 계속 나와요. 그래서 미리 깔아둡니다. 역시 명령을 외우지 말고 agent에게 묻습니다.

```text
Mac에 Node.js LTS를 설치하려는데 Homebrew 기준으로 어떻게 진행하면 돼? 설치 후 node와 npm 확인 방법도 알려줘
```

확인은 아래처럼 합니다.

```bash
node -v
npm -v
```

### 4. Claude Code 설치와 인증

여기서도 인터넷에서 찾은 설치 명령을 바로 복사하지 않습니다. 안티그래비티 IDE 안의 agent에게 먼저 물어보고, 제가 이해한 뒤 실행하는 흐름으로 갑니다.

```text
Claude Code를 설치하려는데, Mac에서 권장되는 네이티브 설치 방식과 설치 후 PATH 확인, 첫 실행 인증 절차까지 순서대로 알려줘
```

agent가 안내한 내용을 읽고, 실행할 명령이 뭘 바꾸는지 확인한 뒤 진행합니다. 설치가 끝나면 터미널을 새로 열거나 셸 설정을 다시 불러옵니다.

```bash
source ~/.zshrc
claude --version
```

버전이 출력되면 설치는 성공입니다. 이제 테스트 폴더에서 처음 실행해봅니다.

```bash
mkdir -p ~/projects/cc101-test
cd ~/projects/cc101-test
claude
```

브라우저가 열리면 Claude 계정으로 로그인합니다. 터미널에 프롬프트가 돌아오면 간단히 인사해보세요.

```text
hello
```

---

## 📦 결과물

설치가 끝났으면 기록을 남깁니다. 저장 위치는 `50-my-work/Part02-시작하기/실습01-Mac환경설치/`예요.

```text
실습01-Mac환경설치/
└── README.md          # 설치 완료 시각, 검증 출력, 인증 여부 기록
```

완료 기준은 단순합니다. “설치한 것 같다”가 아니라, 버전이 실제로 떠야 해요.

| 항목 | 확인 명령 |
|---|---|
| Homebrew | `brew --version` |
| Git | `git --version` |
| Node.js | `node -v` |
| npm | `npm -v` |
| Claude Code | `claude --version` |

마지막 점검은 한 번에 실행해도 됩니다.

```bash
brew --version
git --version
node -v
npm -v
claude --version
```

---

## 🆘 자주 막히는 포인트

| 증상 | 원인 | 해결 |
|---|---|---|
| 안티그래비티에서 agent 입력창이 안 보임 | 폴더를 안 열었거나 로그인 전 | `Open Folder`로 빈 폴더를 열고 Google 계정 로그인을 확인하면 돼요 |
| Homebrew 설치 후 `brew`를 못 찾음 | PATH가 아직 터미널에 안 들어옴 | agent에게 PATH 반영 방법을 묻고, 터미널을 새로 열거나 `source ~/.zshrc`를 실행 |
| `git --version`이 실패함 | Command Line Developer Tools 설치가 덜 끝남 | 설치 팝업을 끝내고 다시 확인 |
| `node -v`는 되는데 `npm -v`가 실패함 | Node.js 설치가 덜 반영됨 | 터미널을 다시 열고 확인, 필요하면 agent에게 재점검 요청 |
| `claude --version`이 안 됨 | 설치 경로가 셸에 아직 안 잡힘 | 터미널 재시작, `source ~/.zshrc`, PATH 확인 |
| 인증 브라우저가 안 열림 | 기본 브라우저 연결이 꼬임 | 터미널에 표시된 URL을 복사해서 브라우저 주소창에 붙여넣기 |
| 설치 중 낯선 명령이 나와 불안함 | 뭘 바꾸는지 모르고 실행하려 함 | agent에게 “이 명령이 무엇을 바꾸는지 설명해 줄 수 있어?”라고 먼저 묻기 |

---

## 🔗 다음 클립

다음은 **[Part 2 / Clip 2: Windows 환경 설치](#part-2-02-windows-install)** 입니다. Windows 사용자분들은 여기서 WSL과 Ubuntu 설치로 이어가면 돼요.

Mac 사용자라면 Clip 2는 건너뛰고 **Part 2 / Clip 3: 첫 실행**으로 넘어가면 됩니다. 설치가 끝났으니 이제 진짜로 Claude Code를 만져볼 차례예요.
