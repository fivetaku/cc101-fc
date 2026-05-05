---
course_clip_ref: "Part 2 / Clip 2"
result_path: "50-my-work/Part02-시작하기/실습02-Windows환경설치/"
next_clip_id: "part-2-03-first-run"
---

# Part 2 / Clip 2: Windows 환경 설치

> 강의 영상: Part 2 / Clip 2 (~20분)
> 만드는 것: Windows에서 WSL Ubuntu와 안티그래비티 agent를 활용해 Claude Code 실행 환경 만들기

---

## 🎯 이 클립에서 만드는 것

Windows는 Mac보다 한 겹 더 있습니다. 바로 WSL이에요. 이 클립에서는 Windows 사용자가 Claude Code를 실행할 수 있도록 **안티그래비티 IDE → WSL 설치 → Windows 재시작 → Ubuntu 초기 설정 → agent에게 Claude Code 설치 방법 요청 → 인증 → 첫 실행 확인**까지 가요.

Mac 클립과 똑같이, 핵심은 설치 명령을 외우는 게 아닙니다. Windows에서는 WSL, Ubuntu, PowerShell, 브라우저 인증이 섞여서 “이 명령을 어디에 쳐야 하지?”가 자주 헷갈려요. 그래서 터미널에 `wsl --install`부터 치는 게 아니에요. 안티그래비티 IDE를 먼저 열고, 그 안의 agent한테 “WSL에서 Claude Code 설치하려는데 어떻게 해?”라고 물어보면서 가요.

끝나고 나면 WSL Ubuntu 안에서 `curl`, `git`, `node`, `npm`, `claude`가 동작해야 해요. 제가 계속 강조할 포인트는 하나예요. Claude Code는 Windows 바탕화면이 아니라 **WSL의 Linux 환경 안에서 실행**합니다.

---

## 💡 핵심 개념

### Windows에서는 WSL이 작업 공간이다

Windows에서 Claude Code를 안정적으로 쓰려면 WSL2와 Ubuntu를 작업 공간으로 잡는 게 좋습니다. WSL은 Windows 안에서 Linux를 띄우는 환경이에요. 앞으로 프로젝트 폴더도 가능하면 `~/projects/...`처럼 WSL 홈 아래에 둬요.

```text
WSL2에 Ubuntu를 설치하고 Claude Code를 쓰려는데, 처음부터 끝까지 어떤 순서로 하면 돼?
```

이 질문을 안티그래비티 agent에게 던지면 PowerShell에서 할 일, 재시작 후 Ubuntu에서 할 일, 인증할 때 Windows 브라우저를 써야 하는 지점까지 나눠서 설명해줍니다. 이게 이 강의의 패턴이에요. 복잡할수록 명령어보다 **대화로 확인하는 순서**가 중요해요.

### Windows 설치 흐름 한눈에 보기

| 단계 | 위치 | 목적 |
|---|---|---|
| WSL2 설치 | Windows PowerShell | Linux를 돌릴 자리 만들기 |
| 재시작 | Windows | WSL 기능 적용 |
| Ubuntu 초기 설정 | Ubuntu 터미널 | 사용자명과 비밀번호 만들기 |
| 기본 도구 설치 | Ubuntu 터미널 | `curl`, `git` 준비 |
| Claude Code 설치 | Ubuntu 터미널 | 강의 실습용 agent 실행 준비 |
| Node.js 설치 | Ubuntu 터미널 | 이후 웹·자동화 실습에서 쓸 엔진 준비 |
| 인증 | Windows 브라우저 + Ubuntu 터미널 | Claude 계정 연결 |

비밀번호를 입력할 때 화면에 아무 글자도 안 보이는 건 정상입니다. 보안 때문에 숨기는 거예요. 안 보여도 입력되고 있으니까 그대로 치고 Enter 누르면 돼요.

---

## 🚶 진행 흐름

### 1. 안티그래비티 IDE 설치

먼저 Windows용 안티그래비티 IDE를 설치하고 Google 계정으로 로그인합니다. 저는 여기서부터 agent를 켜두는 걸 추천해요. 뒤에 나오는 설치 흐름을 계속 물어보면서 갈 수 있거든요.

```text
Windows에서 Claude Code 설치 실습을 시작하려는데, WSL2부터 인증까지 단계별로 알려줘
```

여기서 agent가 안내하는 내용을 따라가되, Windows PowerShell에서 실행할 명령과 Ubuntu 터미널에서 실행할 명령을 꼭 구분해둡니다. 이 둘이 섞이면 설치가 꼬이기 쉬워요.

### 2. WSL2와 Ubuntu 설치

PowerShell을 관리자 권한으로 열어 WSL 설치를 진행합니다. 구체적인 명령은 agent가 현재 Windows 상태에 맞게 안내하도록 둡니다. 여러분이 외울 필요 없어요.

```text
WSL2와 Ubuntu를 설치하려는데, PowerShell에서 할 일과 재부팅 후 할 일을 나눠서 알려줘
```

설치 후에는 Windows를 재시작합니다. 이건 건너뛰면 안 돼요. 재시작하지 않으면 WSL 기능이 제대로 적용되지 않을 수 있습니다. 재시작 뒤 Ubuntu 창이 열리면 사용자명과 비밀번호를 만들어요.

Ubuntu가 준비되었는지 확인해요.

```bash
uname -r
pwd
```

### 3. Ubuntu 기본 도구 준비

이제 Ubuntu 안에서 기본 도구를 깝니다. Claude Code 설치와 이후 실습에 `curl`과 `git`이 필요해요.

```text
WSL Ubuntu에 curl과 git을 설치하려는데, 업데이트부터 설치 확인까지 안전한 순서로 알려줘
```

설치 후 확인해요.

```bash
curl --version
git --version
```

### 4. Claude Code와 Node.js 설치

이 단계에서도 핵심은 agent 패턴입니다. 인터넷에서 본 명령을 바로 실행하지 말고, 안티그래비티 agent에게 WSL Ubuntu 기준 설치 절차를 먼저 설명받아요.

```text
WSL Ubuntu 안에 Claude Code를 설치하려는데, 권장 설치 방식과 PATH 확인, 인증 방법까지 알려줘
```

설치가 끝나면 셸 설정을 다시 불러오고 버전을 확인해요.

```bash
source ~/.bashrc
claude --version
```

Node.js도 Ubuntu 안에 설치합니다. Windows에 이미 Node.js가 있어도 WSL 안에서는 별개예요. 이걸 헷갈리면 `npm` 경로가 섞여요.

```text
WSL Ubuntu에 최신 LTS Node.js를 설치하려는데, Windows 쪽 npm이 섞이지 않게 확인하는 방법까지 알려줘
```

확인 명령은 이렇게 갑니다.

```bash
node -v
npm -v
which npm
```

`which npm`이 `/mnt/c/...`로 시작하면 Windows 쪽 경로가 섞인 겁니다. 이 경우 agent에게 WSL PATH 정리 방법을 다시 물어보면 돼요.

### 5. 첫 실행과 인증

마지막으로 WSL 홈 아래에 테스트 폴더를 만들고 Claude Code를 실행합니다. `/mnt/c` 아래가 아니라 `~/projects` 아래라는 점, 꼭 보세요.

```bash
mkdir -p ~/projects/cc101-test
cd ~/projects/cc101-test
claude
```

WSL에서는 브라우저가 자동으로 안 열릴 수 있습니다. 에러가 아니라 정상이에요. 터미널에 표시된 인증 URL을 복사해서 Windows 브라우저 주소창에 붙여넣고 로그인하면 돼요.

---

## 📦 결과물

설치가 끝났으면 기록을 남깁니다. 저장 위치는 `50-my-work/Part02-시작하기/실습02-Windows환경설치/`예요.

```text
실습02-Windows환경설치/
└── README.md          # WSL 버전, Ubuntu 사용자, 설치 검증, 인증 여부 기록
```

최종 확인 항목은 다음과 같습니다. 여기서는 “Windows에서 된다”가 아니라 “WSL Ubuntu 안에서 된다”가 기준이에요.

| 항목 | 확인 명령 |
|---|---|
| WSL Ubuntu | `uname -r` |
| curl | `curl --version` |
| Git | `git --version` |
| Node.js | `node -v` |
| npm | `npm -v` |
| npm 경로 | `which npm` |
| Claude Code | `claude --version` |

한 번에 확인하려면 아래 순서로 실행해요.

```bash
uname -r
curl --version
git --version
node -v
npm -v
which npm
claude --version
```

---

## 🆘 자주 막히는 포인트

| 증상 | 원인 | 해결 |
|---|---|---|
| WSL 설치 후 Ubuntu가 안 열림 | 재시작이 안 됐거나 Windows 기능 적용 전 | Windows 재시작 후 다시 확인 |
| Ubuntu 비밀번호가 입력되지 않는 것처럼 보임 | Linux 터미널은 비밀번호 표시를 숨김 | 화면에 안 보여도 입력 후 Enter |
| `curl`이나 `git`이 없음 | Ubuntu 기본 도구가 아직 없음 | agent에게 Ubuntu 기준 설치 명령을 다시 요청 |
| `claude`가 안 잡힘 | PATH가 현재 셸에 아직 안 들어옴 | `source ~/.bashrc` 실행 또는 Ubuntu 터미널 재시작 |
| 인증 브라우저가 자동으로 안 열림 | WSL에서는 흔한 일 | URL을 복사해 Windows 브라우저에 직접 붙여넣기 |
| `which npm`이 `/mnt/c/...`로 나옴 | Windows npm이 WSL PATH에 섞임 | agent에게 “WSL PATH에서 Windows npm이 먼저 잡히지 않게 정리하려는데 어떻게 해?”라고 질문 |
| 프로젝트를 `/mnt/c` 아래에 만듦 | Windows 파일 시스템을 WSL에서 쓰는 중 | `~/projects/...` 아래로 옮겨 실습 |
| PowerShell과 Ubuntu 터미널이 헷갈림 | 실행 위치가 섞임 | agent에게 “이 명령은 PowerShell이야, Ubuntu야?”라고 매번 확인 |

---

## 🔗 다음 클립

다음은 **[Part 2 / Clip 3: 첫 실행](#part-2-03-first-run)** 입니다. 설치가 끝났다면 이제 Claude Code 화면을 직접 보고, 슬래시 명령과 모델 전환, 첫 폴더 정리 실습까지 가봐요.
