---
course_clip_ref: "Part 5 / Ch 01 / Clip 5"
result_path: "50-my-work/Part05-뜯어보기/실습22-GitHub/"
next_clip_id: null
---

# Part 5 / Clip 5: GitHub — git-teacher로 백업하기

> 강의 영상: Part 5 / Ch 01 / Clip 5 (~20분)
> 만드는 것: 학습 워크스페이스 전체를 GitHub Private 저장소로 영구 백업

---

## 🎯 이 클립에서 만드는 것

Part 5 동안 본인 학습 워크스페이스에 자산이 한참 쌓였어요. 한 번 돌아볼게요.

```text
my-cc-study/
├── CLAUDE.md                       # Clip 1 — 본인 컨텍스트
├── .claude/
│   ├── commands/study-progress.md  # Clip 2 — 진도 정리 커맨드
│   ├── agents/practice-coach.md    # Clip 2 — 학습 코치 서브에이전트
│   └── settings.json               # Clip 4 — Hook 3개
├── .mcp.json                       # Clip 3 — Playwright MCP
└── sandbox/                        # Clip 3 — 스크린샷·일정·메일
```

이거 다 컴퓨터에만 있어요. 포맷되면 날아갑니다. 회사 컴퓨터와 집 컴퓨터를 같이 쓰려면 매번 USB로 옮길 수도 없고요. 그래서 마지막 클립은 **GitHub에 통째로 백업**합니다.

방법은 단순해요. **git-teacher** 플러그인을 한 번 더 추가해서, 한국어로 git을 다룹니다. 명령어 외울 필요 없어요. "깃 시작해줘", "저장해줘", "올려줘" 세 문장이면 끝납니다.

| Before | After |
|---|---|
| 학습 워크스페이스가 내 컴퓨터에만 있음 | GitHub Private 저장소에 영구 백업 |
| `git add`, `commit`, `push` 명령어 외워야 할 거 같음 | 한국어 한 문장으로 자동 진행 |
| 다른 컴퓨터에서 같은 환경 재현이 막연함 | `git clone` 한 번이면 같은 환경 그대로 |

이번 클립이 끝나면 본인 클로드코드 환경 전체가 GitHub URL 하나로 정리됩니다. 강의 끝나도 계속 쓸 자산이에요.

---

## 💡 핵심 개념

### Google Drive와 Git의 차이

git을 처음 보면 Google Drive랑 비슷한 줄 알아요. 둘 다 클라우드에 파일 보관하는 거니까. 그런데 동작 방식이 결정적으로 달라요.

| 구분 | Google Drive | Git |
|---|---|---|
| 동기 방식 | 자동 — 저장하면 클라우드에 바로 | 수동 — 저장(commit) + 업로드(push) 두 단계 |
| 로그인 | 한 번 로그인하면 끝 | repo마다 commit + push 필요 |
| 협업 모델 | "수정 제안" 모드 | Pull Request |

**핵심 차이 하나만 기억하면 80% 끝**이에요. Google Drive는 자동, Git은 수동. 그래서 git에는 "지금 저장할게" 하는 commit 단계와 "이제 올릴게" 하는 push 단계가 따로 있습니다.

이게 처음엔 번거롭게 느껴지지만 이유가 있어요. Git은 **변경 이력을 모두 기록**합니다. 어제 어디까지 했는지, 그저께랑 뭐가 달라졌는지 다 추적돼요. 그래서 commit 시점을 본인이 정해야 하는 거고요.

### git-teacher는 git을 한국어로 다룹니다

git 본체는 명령어가 어려워요. `git add`, `git commit`, `git push`, `git branch`, `git merge`. 외울 게 너무 많죠. **git-teacher**는 이걸 한국어로 바꿔주는 플러그인이에요. "저장해줘", "되돌려줘" 같은 한국어로 부탁하면 알아서 해석해서 적절한 git 명령을 실행합니다.

git을 직접 다루는 게 아니라 git-teacher가 가르치는 식으로 진행돼요. 명령마다 5단계 자동 가이드를 띄워주고, 헷갈리는 곳에서 멈춰줘요.

### 강의 워크스페이스는 백업하지 않습니다

여기서 한 번 짚고 갈게요. **오늘 백업할 건 학습 워크스페이스(`my-cc-study/`)뿐**이에요. 강의 워크스페이스(`~/fastcampus-cc/`)는 강의 진행용이라 GitHub에 올리지 않습니다. 강사가 관리하는 자산이고, 본인이 추가한 게 없어요.

본인 자산은 다 학습 워크스페이스 안에 있으니, 그 폴더 통째로 한 저장소로 올리면 끝납니다.

---

## 🚶 진행 흐름

### 1. git-teacher 플러그인 설치

강의 워크스페이스에서 클로드코드를 켜고 마켓플레이스에 git-teacher가 있는지 확인합니다. Part 4 Clip 1에서 추가한 GPTaku 마켓플레이스에 같이 들어 있어요.

```text
/plugin install git-teacher
```

설치 완료 후 클로드코드 재시작.

```bash
exit
claude
```

재시작 후 git-teacher가 활성화됩니다.

### 2. "깃 시작해줘" — 학습 워크스페이스 git 셋업

이제 학습 워크스페이스 쪽으로 갑니다. 안티그래비티 새 창에서 `my-cc-study/` 폴더를 열고, 그 안에서 클로드코드를 켜요.

```bash
claude
```

그리고 한 문장 입력합니다.

```text
깃 시작해줘
```

git-teacher가 5단계 자동 셋업을 진행해요.

```text
[git-teacher] 깃 백업 시작합니다.

Step 1: Git 설치 확인
  ✓ git 2.45.0 설치됨

Step 2: GitHub CLI 확인
  → 미설치 시 안내: brew install gh (Mac) / winget install --id GitHub.cli (Win)
  ✓ gh 2.87.0 설치됨

Step 3: GitHub 계정 인증
  → gh auth login 실행 안내
  → 브라우저 OAuth 인증

Step 4: 현재 폴더를 git 프로젝트로 초기화
  → git init 실행
  ✓ 완료

Step 5: .gitignore 자동 생성 (민감 파일 제외)
  - .DS_Store, *.log, node_modules/ 등
  ✓ 완료

다음에 "저장해줘" 입력하면 첫 commit 진행할게요.
```

명령어를 직접 칠 일이 없습니다. GitHub 계정이 없으신 분은 영상 중간에 `https://github.com/signup`에서 가입하시면 돼요. 1~2분이면 끝납니다.

> **진행 중 챙길 세 가지**
> - **gh auth login 시 인증 방식 선택**: HTTPS와 SSH 중 익숙하지 않으면 **HTTPS 추천**. 브라우저로 자동 인증돼 가장 간단해요.
> - **`.gitignore` 자동 생성 내용 확인**: API 키, `.env`, 비밀 토큰류가 제외되는지 한 번 보세요. git-teacher가 기본 패턴을 넣지만 본인 프로젝트 특이 파일은 직접 추가 필요.
> - **첫 push 시 main 브랜치 자동 생성**: 메시지에 `git push -u origin main`이 보이면 정상. master로 돌아가지 않게 git-teacher가 main 기준으로 진행합니다.

### 3. "저장해줘" — 첫 commit

지금까지 만든 자산을 한꺼번에 저장합니다. git 용어로는 commit이에요.

```text
저장해줘
```

git-teacher가 변경 사항을 분석하고 자연어 commit 메시지를 자동으로 제안합니다.

```text
[git-teacher] 변경 사항 분석 중...

발견한 자산:
  - CLAUDE.md (학습 워크스페이스 매뉴얼)
  - .claude/commands/study-progress.md (진도 정리 커맨드)
  - .claude/agents/practice-coach.md (학습 코치 서브에이전트)
  - .mcp.json (Playwright MCP 설정)
  - .claude/settings.json (Hook 3개)
  - sandbox/ (스크린샷·일정·메일 결과물)

자동 commit 메시지 제안:
  "init: Part 05 학습 자산 — CLAUDE.md, 커맨드, 서브에이전트, MCP, Hook"

이대로 저장할까요? (Y/n)
```

`Y`로 진행. 메시지가 영어로 시작하지만 본문에 한국어가 섞여요. git 관례를 따른 거예요.

```text
✓ 첫 commit 완료
  현재 커밋: a3f2b1c
  파일 수: {N}

다음에 "올려줘" 입력하면 GitHub에 업로드할게요.
```

저장 끝. 다만 **아직 본인 컴퓨터에만** 있어요. 백업 완성하려면 GitHub에 올려야 합니다.

### 4. "올려줘" — GitHub push

다음 한 마디로 GitHub 저장소 생성과 업로드를 동시에 진행해요.

```text
올려줘
```

git-teacher가 저장소를 자동으로 만들고 업로드합니다.

```text
[git-teacher] GitHub 업로드 진행합니다.

Step 1: GitHub repo 생성
  - 이름: my-cc-study
  - 공개 설정: Private (권장 — settings.json에 개인 정보 가능성)
  → gh repo create my-cc-study --private
  ✓ Repo 생성 완료
  🔗 https://github.com/{유저명}/my-cc-study

Step 2: 원격 연결 + push
  → git remote add origin git@github.com:{유저명}/my-cc-study.git
  → git push -u origin main
  ✓ 업로드 완료
```

브라우저로 GitHub URL을 열어보세요. 파일들이 다 올라와 있어요. 이제 어디서나 접근 가능합니다. 회사 컴퓨터에서 `git clone https://github.com/{유저명}/my-cc-study`만 하면 같은 환경이 그대로 재현돼요.

**Private 설정**이라 본인만 봅니다. 팀원과 공유하려면 GitHub Settings → Collaborators에서 추가하시면 됩니다.

### 5. 수정 → 재저장 루프 한 번 체험

마지막 단계. 앞으로 본인이 뭔가 수정할 때마다 이 흐름을 반복합니다.

안티그래비티에서 `CLAUDE.md`를 한 줄만 수정해보세요. 예를 들어 "오늘 학습 완료: Part 05" 같은 메모 추가. 저장 후 클로드코드에 한 줄 부탁.

```text
방금 CLAUDE.md 수정한 거 저장하고 GitHub에 올려줘
```

git-teacher가 변경을 감지하고 commit + push를 한 번에 진행해요.

```text
[git-teacher]
  변경 발견: CLAUDE.md (1줄 추가)
  → git add CLAUDE.md
  → git commit -m "update: 학습 진도 메모 추가"
  → git push
  ✓ 업로드 완료
```

GitHub에서 새로고침하면 변경이 반영됩니다. 커밋 히스토리도 같이 쌓여요. 매번 이 흐름 — **수정 → "저장하고 올려줘"** — 반복하시면 됩니다.

---

## 📦 결과물

| 결과물 | 위치 | 설명 |
|---|---|---|
| GitHub Private repo | `github.com/{유저명}/my-cc-study` | 학습 워크스페이스 영구 백업 |
| `.git/` 폴더 | `my-cc-study/.git/` | 로컬 git 메타데이터 |
| `.gitignore` | `my-cc-study/.gitignore` | 민감 파일 제외 규칙 |
| 커밋 히스토리 | GitHub repo | 최소 2개 (init + update) |
| `README.md` | `실습22-GitHub/` | 진도 메타 (스킬 자동 작성) |

`완료` 입력하면 progress.json의 `github_repo`에 URL이 기록되고 `completed_parts`에 "Part 05"가 추가됩니다.

---

## 🆘 자주 막히는 포인트

| 증상 | 원인 | 해결 |
|---|---|---|
| `gh` 명령이 없음 | GitHub CLI 미설치 | git-teacher가 자동 안내. Mac: `brew install gh` / Win: `winget install --id GitHub.cli` |
| `gh auth login` 인증 실패 | 2FA 또는 토큰 만료 | `gh auth logout` 후 `gh auth login` 재실행 |
| `git push`에서 permission 거부 | 원격 URL 오류 | `gh repo view`로 정확한 URL 확인 후 `git remote set-url origin [URL]` |
| `.gitignore`가 중요 파일까지 제외 | 자동 생성 시 과도 제외 | "`.gitignore` 열어서 수정해줘" 재요청 |
| 대용량 파일 push 거부 | GitHub 100MB 제한 | `sandbox/` 스크린샷이 크면 `.gitignore`에 추가 |
| Private인데 Public으로 실수 생성 | 옵션 잘못 선택 | GitHub Settings → Change visibility → Private |
| 커밋 메시지가 영어로 | 자동 메시지 패턴 | "한국어로 다시 만들어줘" 후 amend |
| API 키 같은 거 실수로 올림 | 보안 사고 | 즉시 키 revoke + git-teacher에 "API 키 노출됐어, 즉시 대응 방법" |
| GitHub 계정 없음 | 미가입 | `https://github.com/signup` 1~2분 가입 후 다시 시도 |
| 강의 워크스페이스를 GitHub에 올리려고 함 | "내 거" 혼동 | 본인 백업은 학습 워크스페이스만 |
| git 처음이라 무서움 | 학습 부담 | git-teacher가 다 안내해줌. 명령어 외울 필요 없음 |
| Pull Request가 뭔지 헷갈림 | 협업 개념 | 팀 협업 시 학습. 백업만 할 때는 commit + push면 충분 |
| GitHub repo 삭제하고 싶음 | 실수 또는 정리 | GitHub Settings 하단 → Delete this repository |

---

## 🔗 다음 Part

### Part 5 마무리

Part 5 다섯 클립이 끝났어요. 한 폴더 안에 본인 클로드코드 환경의 DNA가 다 모였습니다.

| Clip | 한 일 | 결과물 |
|---|---|---|
| 1 | CLAUDE.md | 본인 컨텍스트 매뉴얼 |
| 2 | 커맨드 + 서브에이전트 | `/study-progress` + `practice-coach` |
| 3 | MCP + CLI | Playwright + gws CLI 연결 |
| 4 | Hook | 편의·습관·안전 자동화 |
| 5 | GitHub | 모든 자산을 영구 백업 |

여기까지가 **"이해 단계"** 였어요. 클로드코드가 어떤 재료로 구성되는지 직접 뜯어보고 만져본 시간. 다음 Part 6부터는 **"제작 단계"** 로 갑니다. 오늘 만든 자산들을 묶어서 본인만의 스킬로 발전시켜요. `/study-progress` + `practice-coach` + Hook + MCP를 묶은 본인 자동화 시스템이 거기서 나옵니다.

학습 워크스페이스(`my-cc-study/`)는 강의 끝나도 그대로 두세요. 강의 후에 본인 공부방으로 계속 키워나갈 곳이에요. 다른 컴퓨터에서 작업하고 싶을 땐 `git clone` 한 번이면 됩니다.

### 다음 Part

→ **Part 6: 클로드코드 스킬 만들기** — 오늘까지 만든 자산을 본인 스킬로 묶습니다.

Part 4 Clip 3에서 받은 1~2순위와 Clip 4 바선생에서 받은 보완 영역이 Part 6 시작할 때 자동으로 불려옵니다. 이해는 끝났어요. 제작 시작합니다.
