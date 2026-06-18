---
course_clip_ref: "Part 6 / Ch 03 / Clip 8"
result_path: "50-my-work/Part06-스킬만들기/실습29-회의록자동화스킬/"
next_clip_id: "part-6-09-morning-briefing"
---

# Part 6 / Clip 8: 오디오/영상 → 문서 (audio-to-doc)

> 강의 영상: Part 6 / Ch 03 / Clip 8 (~30분)
> 만드는 것: `audio-to-doc` 스킬 + `scripts/extract_audio.sh` + `scripts/transcribe_gemini.py` + `references/templates.md`
> 시연: 유튜브 4분 인터뷰 영상 → 5 유형 자동 판별 → 마크다운 문서

---

## 이 클립에서 만드는 것

지금까지는 텍스트 데이터를 다뤘어요. 이번엔 **오디오와 영상**입니다. 회의 녹음, 강의 녹화, 팟캐스트, 인터뷰 같은 음성 콘텐츠를 자동으로 전사하고 요약 문서로 정리해주는 스킬을 만듭니다.

만드는 스킬은 `audio-to-doc`. 회의록이 메인 용도예요. 시연용 회의 녹음이 없어서 유튜브 영상으로 우회 시연합니다 (유퀴즈 김대식 교수 인터뷰 4분 발췌). 하지만 본인 회의 녹음 파일을 그대로 넣으면 같은 흐름으로 굴러갑니다.

이 클립에서 진짜 재밌는 건 **5 유형 자동 판별**이에요. 같은 한 스킬이 입력 오디오를 분석해서 회의·강의·팟캐스트·인터뷰·발표 중 어디에 해당하는지 자동으로 판단하고, 그에 맞는 템플릿으로 문서를 만들어줍니다.

전과 후의 차이는 이렇습니다.

- 1시간짜리 회의가 끝나면 액션 아이템과 결정사항이 5분 안에 한 장으로 정리됩니다.
- 유튜브 강의 영상을 보면서 노트하던 작업이 자동화돼요. URL만 던지면 핵심 개념 정리본이 떨어집니다.
- 본인 회의·인터뷰·발표 녹음마다 매번 어떤 양식으로 정리할지 고민하지 않아도 됩니다. 스킬이 유형을 판별하고 알아서 맞춰줘요.

이번 클립에서 할 일은 다섯 단계입니다. Gemini API 키 발급 → 워크플로우 잡기 → 도구 선택(Gemini vs 로컬) → 스킬 + 스크립트 분리 작성 → 유튜브 시연 + 본인 회의 응용.

---

## 핵심 개념

### 도구 선택 — 왜 Gemini인가

전사 + 화자 분리를 동시에 처리하는 도구는 몇 가지가 있어요. 같은 유튜브 4분 음성으로 직접 비교한 결과를 보면 결정 근거가 보입니다.

| 기준 | Gemini 3.5 Flash | WhisperKit (로컬) | whisper-diarization |
|---|:-:|:-:|:-:|
| 설치 (PyTorch X) | ✅ curl만 | ✅ `brew` | ❌ torch+NeMo 무거움 |
| 화자 분리 품질 | ✅ 진행자·게스트·나레이션까지 구별 | ✅ 음성 기반 | ✅ 음성 기반 |
| 한국어 전사 | ✅ "러브(Lobe)·CES·캣트리스" 정확 | ○ | ○ |
| 개인정보 (로컬) | ❌ 오디오 구글 전송 | ✅ 외부 X | ✅ 외부 X |
| 긴 회의 | ✅ 한 번에 | △ 분할 | △ 분할 |
| 비용 | 무료 한도 | 무료 | 무료 |

핵심 갈림길은 단 하나예요. **"오디오를 외부(구글)로 보내도 되는가"**. 사내 대외비 회의 녹음이라면 로컬(WhisperKit)이 정답입니다. 이번 클립은 설치 0 + 품질 + 긴 영상 한 번에 처리를 우선해서 **Gemini 3.5 Flash**를 채택했어요. 본인 상황에 맞게 도구를 바꾸면 됩니다.

### 5 유형 자동 판별

같은 오디오라도 회의록 양식과 인터뷰 양식은 다릅니다. 스킬이 다섯 가지 패턴을 자동으로 구분해요.

| 유형 | 판별 신호 | 출력 템플릿 |
|---|---|---|
| 회의 | 다수 화자 + 안건·결정·액션 키워드 | 안건 / 결정사항 / 액션 아이템 표 |
| 강의/컨퍼런스 | 단일 화자 + 개념 설명 흐름 | 핵심 개념 + 섹션별 요약 |
| 팟캐스트/대담 | 2~3 화자 + 자유 대화 | 주제별 구간 + 화자별 의견 |
| 인터뷰 | 질문자 + 답변자 (Q&A 패턴) | Q&A 구조 + 발언 하이라이트 |
| 발표/세미나 | 단일 화자 + 주장-근거 패턴 | 주장-근거-Q&A |

판별은 Gemini 프롬프트로 처리합니다. SKILL.md 본문에 "화자 수와 안건·결정 키워드 빈도로 판별" 같은 가이드를 명시하면, 5 유형 중 가장 맞는 걸 자동으로 골라요.

### 스크립트 분리 — 두 개의 결정론

CH02·CH03에서 익힌 패턴 그대로 결정론 단계를 빼는데, 이번엔 두 개로 나눠집니다.

| 파일 | 언어 | 역할 |
|---|---|---|
| `scripts/extract_audio.sh` | Bash | 유튜브 URL → yt-dlp로 음성 추출 + ffmpeg로 16kHz mono wav 변환 |
| `scripts/transcribe_gemini.py` | Python | Gemini Files API 업로드 → 전사 + 화자 분리 호출 → 텍스트 반환 |
| `references/templates.md` | (문서) | 5 유형별 출력 양식 — AI가 매번 해석할 자료 |

추출·전사·API 호출은 같은 입력에 같은 결과가 나와야 합니다. 그래서 스크립트. 5 유형 판별·요약은 매번 미세하게 다르게 나와도 OK라서 SKILL.md 본문에. 자유도와 안정성을 같이 잡는 분리예요.

### 사전 준비 — Gemini API 키 발급 (5분)

Gemini는 무료 한도가 있어 카드 등록 없이 바로 쓸 수 있습니다.

```text
1. https://aistudio.google.com/apikey 접속 (구글 계정 로그인)
2. "Create API key" 클릭 → 새 프로젝트면 "Create API key in new project"
3. 생성된 키 복사 (AIza...로 시작하는 문자열)
4. ⚠️ 비밀번호 같은 것 — 화면 캡처·공유 금지
5. ~/fastcampus-cc/.env 에 한 줄 추가
   GEMINI_API_KEY=AIza여기에_복사한_키
```

`.env`는 `.gitignore`에 있어 깃엔 안 올라가요. Clip 5, 6과 같은 위치, 같은 패턴입니다.

**무료 한도 주의** — 분당·일일 요청 수 제한이 있어요. 회의 1~2건 테스트는 충분합니다. 한도 초과 시 잠시 후 재시도하거나 결제 연결.

### 시연 우회 — 유튜브로 본인 회의 적용 가능

시연용 회의 녹음 파일을 매번 준비하기 어려우니까 유튜브 영상으로 우회 시연합니다. 본인 회의 녹음 파일이 있다면 같은 흐름에 파일 경로만 바꿔서 넣으면 돼요.

- 시연 입력: 유튜브 URL → yt-dlp 추출 → wav
- 본인 입력: 로컬 mp3·wav·m4a 파일 → ffmpeg 변환 → wav

`extract_audio.sh`가 두 경로(URL / 로컬 파일)를 모두 받게 만들면 본인 회의에 바로 가져갈 수 있습니다.

---

## 진행 흐름

### 1. `/part06` 호출 → Clip 8 선택 + Gemini 키 발급

```text
/part06
```

자동 셋업이 의존성을 확인합니다.

```text
✓ ffmpeg OK
✓ yt-dlp OK (유튜브 시연용)
ℹ .env에 GEMINI_API_KEY 필요 — 사전 준비 따라하기
✓ ~/fastcampus-cc/.claude/skills/audio-to-doc/{scripts,references}/ 준비 완료
```

`ffmpeg`와 `yt-dlp`가 없으면 brew로 설치하세요.

```bash
brew install ffmpeg yt-dlp
```

Gemini API 키도 위 "사전 준비" 안내대로 발급해서 `.env`에 등록합니다.

### 2. STEP 1 — 워크플로우 잡기

```text
오디오로 된 녹음 파일을 텍스트로 전환해서
요약 정리를 하려는데, 어떻게 워크플로우를 구성해야 할까?
```

정리되는 단계는 보통 이런 모습입니다.

```text
1. 입력 형식 판별 (유튜브 URL / 로컬 파일)
2. 음성 추출 + wav 변환 (16kHz mono)
3. 전사 + 화자 분리
4. 입력 유형 자동 판별 (회의·강의·팟캐스트·인터뷰·발표)
5. 유형별 템플릿 적용
6. 요약 + 액션 아이템 / 핵심 개념 / Q&A 정리
7. 마크다운 문서 저장
```

### 3. STEP 2 — 도구 선택 + 단계 정의

여기서 화자 분리 도구를 정하는 과정 자체가 메타 흐름의 모범이에요. 공식 문서 조사 → 후보 비교 → 실제 테스트.

```text
화자 분리 도구 후보 비교해줘.
- 공식 문서 확인: OpenAI Whisper는 화자 분리 지원하나?
- Gemini Files API의 화자 분리 능력
- WhisperKit (Mac 로컬)
- whisper-diarization (PyTorch+NeMo)

판단 기준:
- 설치 무게
- 한국어 정확도
- 화자 구별 품질 (진행자·게스트 구분)
- 긴 회의 처리 능력
- 개인정보 (로컬 vs 외부)
```

조사·비교 결과 위 "도구 선택" 표가 나와요. 이번 클립은 Gemini로 가지만, 본인 상황(사내 대외비 회의)에 따라 WhisperKit으로 분기할 수 있다는 선택지를 SKILL.md에 명시해두면 좋습니다.

분리 안:

```text
[extract_audio.sh — 결정론]
- 입력: 유튜브 URL 또는 로컬 파일 경로
- yt-dlp로 URL → mp3 추출 (URL 입력 시만)
- ffmpeg로 16kHz mono wav 변환
- (선택) 긴 영상 트림

[transcribe_gemini.py — 결정론]
- Gemini Files API 업로드
- gemini-3.5-flash 모델로 전사 + 화자 분리 호출
- 텍스트 반환 (화자 태그 포함)

[SKILL.md 본문 — 자유도]
- 입력 받기 + 추출 스크립트 호출
- 5 유형 판별 (화자 수 + 키워드 빈도)
- 유형별 템플릿 적용 (references/templates.md 참조)
- 요약 + 마크다운 저장

[references/templates.md — 문서]
- 회의 / 강의 / 팟캐스트 / 인터뷰 / 발표 5 유형 양식
```

### 4. STEP 3 — 스킬화 + 두 스크립트 + 템플릿 작성

```text
지금 정의한 분리 안대로 audio-to-doc 스킬을 만들어줘.

위치:
- ~/fastcampus-cc/.claude/skills/audio-to-doc/SKILL.md
- ~/fastcampus-cc/.claude/skills/audio-to-doc/scripts/extract_audio.sh
- ~/fastcampus-cc/.claude/skills/audio-to-doc/scripts/transcribe_gemini.py
- ~/fastcampus-cc/.claude/skills/audio-to-doc/references/templates.md

SKILL.md description: "회의록·전사·화자 분리·음성 요약·오디오 문서화·인터뷰 정리" 키워드

extract_audio.sh:
- 입력 인자: URL 또는 파일 경로
- URL 입력: yt-dlp -x --audio-format mp3
- ffmpeg로 16kHz mono wav 변환
- (선택) --trim 옵션으로 긴 영상 잘라내기

transcribe_gemini.py:
- API 키는 os.getenv("GEMINI_API_KEY")
- 모델: gemini-3.5-flash
- Files API 업로드 → 전사 + 화자 분리 프롬프트
- 한국어 우선
- 텍스트 반환 (화자 태그 [화자1]·[화자2] 포함)

SKILL.md 본문:
- AskUserQuestion: URL인지 로컬 파일인지 + 5 유형 자동 판별 / 수동 지정
- extract_audio.sh 호출 → wav 파일
- transcribe_gemini.py 호출 → 전사 텍스트
- 5 유형 판별 (화자 수 + 안건/결정/Q&A 키워드 빈도)
- references/templates.md 에서 해당 유형 양식 가져와 적용
- 결과물 저장: ~/fastcampus-cc/50-my-work/Part06-스킬만들기/실습29-회의록자동화스킬/{입력명}-{유형}-{날짜}.md

templates.md:
- 회의: 안건 / 결정사항 / 액션 아이템 표
- 강의: 핵심 개념 + 섹션별 요약
- 팟캐스트: 주제별 구간 + 화자별 의견
- 인터뷰: Q&A 구조 + 발언 하이라이트
- 발표: 주장-근거-Q&A
```

생성된 파일들을 안티그래비티에서 확인하세요.

### 5. STEP 4 — 유튜브 시연 (인터뷰 유형 판별)

클로드코드 재시작 후 자연어로 호출합니다.

```bash
exit
claude
```

```text
이 유튜브 영상 텍스트로 정리해줘
https://youtu.be/{유퀴즈-김대식-인터뷰-4분-발췌-URL}
```

진행 화면에서 다음이 보여요.

```text
1. extract_audio.sh 호출 → mp3 추출 → wav 변환
2. transcribe_gemini.py 호출 → Gemini Files API 업로드
3. 전사 텍스트 + 화자 태그 수신
   [진행자] ... [김대식 교수] ... [VCR 나레이션] ...
4. 5 유형 판별 → 인터뷰 (질문자 + 답변자 Q&A 패턴)
5. templates.md의 인터뷰 양식 적용
6. Q&A 구조 + 발언 하이라이트로 저장
```

결과 파일을 열어보세요. 인터뷰 양식대로 Q&A 구조가 잡혀 있고, 진행자·게스트·VCR 나레이션이 분리돼 있어야 합니다.

### 6. STEP 5 — 본인 회의 응용

본인 회의 녹음 파일이 있다면 그대로 넣어보세요.

```text
이 회의 녹음 정리해줘
~/Documents/2026-05-28-팀미팅.mp3
```

스킬이 회의 유형으로 자동 판별하면서 안건·결정사항·액션 아이템 표가 들어간 마크다운이 떨어집니다. 5 유형 자동 판별 덕분에 본인이 매번 "회의록 양식으로 정리해줘"라고 명시하지 않아도 돼요.

페르소나별 응용:

| 직무 | 자주 다룰 입력 |
|---|---|
| 마케팅 | 회의 + 인터뷰(고객 인터뷰) |
| PO | 회의(스프린트) + 발표(데모) |
| 영업 | 미팅(고객) + 인터뷰(니즈 청취) |
| 학습 | 강의 + 팟캐스트 |

---

## 결과물

이번 클립이 끝나면 아래가 남습니다.

| 결과물 | 위치 | 설명 |
|---|---|---|
| `SKILL.md` | `~/fastcampus-cc/.claude/skills/audio-to-doc/SKILL.md` | 5 유형 자동 판별 본문 |
| `extract_audio.sh` | `~/fastcampus-cc/.claude/skills/audio-to-doc/scripts/` | yt-dlp + ffmpeg 변환 |
| `transcribe_gemini.py` | `~/fastcampus-cc/.claude/skills/audio-to-doc/scripts/` | Gemini 전사 + 화자 분리 |
| `templates.md` | `~/fastcampus-cc/.claude/skills/audio-to-doc/references/` | 5 유형 출력 양식 |
| `.env` 한 줄 | `~/fastcampus-cc/.env` | `GEMINI_API_KEY` |
| 시연 산출 1~2건 | `실습29-회의록자동화스킬/` | 유튜브 인터뷰 시연 결과 |
| 본인 회의 1건 | `실습29-회의록자동화스킬/` | (선택) 본인 회의 적용 결과 |

`완료` 또는 `/wrap`을 입력하면 `progress.json`의 `practice_completed`에 `"실습 29"`가, `skills_created`에 `"audio-to-doc"`가 추가됩니다.

---

## 자주 막히는 포인트

| 증상 | 원인 | 해결 |
|---|---|---|
| `yt-dlp` 명령 없음 | 미설치 | `brew install yt-dlp` |
| `ffmpeg` 명령 없음 | 미설치 | `brew install ffmpeg` |
| Gemini API 호출이 401 | 키 오타 또는 `.env` 위치 오류 | 강의 워크스페이스 루트 `~/fastcampus-cc/.env`인지 확인. 변수명 `GEMINI_API_KEY` 정확히 |
| Gemini 무료 한도 초과 | 분당·일일 요청 한도 도달 | 잠시 후 재시도 또는 결제 연결 |
| 한국어 전사가 영문으로 나옴 | 프롬프트에 언어 명시 누락 | `transcribe_gemini.py` 프롬프트에 "한국어로 전사" 강제 |
| 화자 구분이 안 됨 | 짧은 리액션을 별도 화자로 과분리 | gemini-3.5-flash 사용 확인 (2.5는 과분리 경향) |
| 5 유형 판별이 항상 회의로 빠짐 | 판별 기준이 약함 | SKILL.md에 화자 수 + 키워드 빈도 임계값 명시 |
| 1시간 회의가 한 번에 안 됨 | 토큰 한도 초과 | 30분 단위로 자르고 합치는 단계 SKILL.md에 추가 |
| 사내 대외비 회의에 쓰기 망설여짐 | Gemini는 외부 전송 | WhisperKit 로컬 분기 추가 — SKILL.md에 "민감 회의면 WhisperKit 사용" 명시 |
| 본인 회의 파일이 m4a/mp3인데 안 됨 | `extract_audio.sh`가 URL만 처리 | 스크립트가 로컬 파일 경로도 받게 인자 확장 |
| 액션 아이템이 누락 | 회의 양식 누락 | `templates.md`의 회의 양식에 "액션 아이템: [담당자] [내용] [기한]" 명시 |

---

## 다음 클립

→ [Part 6 / Clip 9: 모닝 브리핑 — Part 5 GWS + 슬래시 커맨드](#part-6-09-morning-briefing)

다음 클립에서는 한 스킬이 다른 스킬을 부르는 첫 사례가 나옵니다. 매일 아침 메일·일정·뉴스를 한 화면 HTML 대시보드로 받는 모닝 브리핑이에요. Part 5에서 만든 GWS CLI 자산이 메일·일정 재료가 되고, Clip 6에서 만든 `naver-news` 스킬이 뉴스 칸을 채웁니다. 슬래시 커맨드와 결합해서 호출도 두 가지 방식 — 자연어와 `/morning-briefing` 슬래시.
