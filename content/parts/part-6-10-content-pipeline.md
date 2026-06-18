---
course_clip_ref: "Part 6 / Ch 03 / Clip 10"
result_path: "50-my-work/Part06-스킬만들기/실습31-콘텐츠파이프라인스킬/"
next_clip_id: "part-7-01-workspace-design"
---

# Part 6 / Clip 10: 콘텐츠 파이프라인 — 6 STEP 풀 통합

> 강의 영상: Part 6 / Ch 03 / Clip 10 (~30분)
> 만드는 것: `content-pipeline` 스킬 (6 STEP 풀 통합) + `scripts/generate_image.py` + `scripts/tts.py` + 사전 리서치 자산 2종
> 시연 주제: 벚꽃 명소

---

## 이 클립에서 만드는 것

Part 6의 마지막 클립이에요. 지금까지 만든 7개 스킬과 Part 5 자산 6종을 하나로 묶어 **콘텐츠 파이프라인** 한 스킬로 통합합니다.

한 마디 주제만 던지면 6단계가 자동으로 굴러가요.

```text
주제 한 마디 (예: "벚꽃 명소")
   ↓
[1] 딥리서치 (deep-research 스킬 재호출, 폴백 WebSearch) → 01-리서치-보고서.md
[2] 카드뉴스 기획 (유형·장수·핵심 메시지) → 02-카드뉴스-기획서.md
[3] 이미지 생성 (generate_image.py, gpt-image-2, 1088x1360→1080x1350 crop) → images/card-01~12.png
[4] HTML 카드뉴스 (B&W 에디토리얼 매거진 1080x1350) → card-news.html
[5] TTS 스크립트 — 카드(씬) 1장 = 섹션 1개 (## 헤더로 씬 구분) → 05-tts-script.md
[6] 음성·영상 — gpt-4o-mini-tts로 씬별 mp3 + Remotion 9:16 영상 빌드 → output.mp4
```

Part 03 카드뉴스·리모션 챕터에서 30분씩 따로 따로 하던 작업이 한 호출에 5분이면 끝납니다 (영상 빌드 시간 별도).

이번 클립에서 꼭 챙겨갈 메시지는 두 가지예요.

- **있는 스킬은 재호출, 없는 기능은 자체 스크립트** — 리서치는 Clip 2에서 만든 `deep-research`를 그대로 호출하고, 이미지·TTS는 OpenAI API로 자체 스크립트 작성. "스킬을 호출한다 vs 직접 만든다"를 판단하는 눈을 기르는 거예요.
- **체크포인트 패턴** — 단계마다 AskUserQuestion으로 "OK 다음 갈까요?"를 물어봅니다. 자동만이 아닌 협업이에요. 중간에 어색한 결과가 나오면 다음 단계로 안 넘어가도록.

만들고 나면 Part 6 9 실습이 다 끝납니다. 마지막에 본인 평생 도구 정리 + 회고로 마무리해요.

---

## 핵심 개념

### OpenAI 키 하나로 이미지·TTS 동시 처리

이미지 생성과 TTS 모두 OpenAI API를 씁니다. 키 하나로 두 스크립트가 다 굴러가요.

```text
.env
─────
OPENAI_API_KEY=sk-...     ← 한 줄로 이미지·TTS 공용
```

| 스크립트 | 모델 | 용도 |
|---|---|---|
| `generate_image.py` | `gpt-image-2` (snapshot `gpt-image-2-2026-04-21`) | 카드뉴스 배경 이미지 12장 |
| `tts.py` | `gpt-4o-mini-tts` | 씬별 음성 mp3 |

### gpt-image-2 — 1088x1360 생성 → 1080x1350 crop

카드뉴스 표준은 인스타 캐러셀 4:5 비율(1080×1350). OpenAI 이미지 모델은 16px 배수 제약이 있어요. 1080은 16의 배수가 아니라 직접 요청이 안 됩니다.

```text
1080 / 16 = 67.5  ← 불가
1088 / 16 = 68    ← 가능
1350 / 16 = 84.375 ← 불가
1360 / 16 = 85    ← 가능
```

그래서 **1088×1360으로 생성 → 1080×1350으로 crop** 후처리가 정석 패턴이에요. `gpt-image-2`는 투명 배경 미지원이라 `background: "opaque"` 고정.

품질 티어도 있어요. 드래프트 배치엔 `low`, 일반 최종은 `medium`, 정밀 텍스트나 인포그래픽은 `high`. 처음엔 `low`로 톤 확인하고 마음에 들면 `medium`으로 재생성하는 게 과금 방어에 좋습니다.

### gpt-4o-mini-tts — 씬별 끊어서

TTS 모델은 `gpt-4o-mini-tts`예요. 한 카드(씬) = 한 섹션 구조로 TTS 스크립트를 작성합니다.

```text
05-tts-script.md
─────────────────
## 카드 1 (표지)
{표지 음성 텍스트}

## 카드 2 (도입)
{본문 1 음성 텍스트}

## 카드 3
...
```

`##` 헤더로 씬을 끊어 두면 `tts.py`가 섹션별로 분리해 mp3를 생성합니다. 카드별 재생 시간을 `card-timings.json`에 기록하면, Remotion이 카드마다 길이를 정확히 맞춰 9:16 영상을 빌드해요.

보이스는 13종 중 선택 (`alloy`, `coral`, `nova`, `marin`, `cedar` 등). 한국어 발음 자연도는 `marin`이나 `cedar`가 무난합니다.

### 체크포인트 패턴 — 단계마다 OK 물어보기

6단계가 자동으로 굴러가면 좋아 보이지만, 중간에 어색한 결과가 나와도 그대로 넘어가버리면 영상까지 다 만들고 나서 처음부터 다시 해야 해요. 그래서 단계마다 AskUserQuestion으로 확인합니다.

```text
[1] 리서치 완료 → "내용 어떠세요? 다음 단계 갈까요?"
[2] 기획 완료  → "카드 장수·메시지 OK? 이미지 생성 갈까요?"
[3] 이미지 완료 → "톤 OK? HTML 만들까요?"
[4] HTML 완료  → "디자인 OK? TTS 스크립트 작성?"
[5] TTS 스크립트 → "음성 텍스트 OK? 음성 생성?"
[6] 영상 빌드  → 끝
```

체크포인트 덕분에 본인이 흐름을 통제할 수 있어요. 마음에 안 드는 단계가 있으면 그 단계만 재실행하고 나머지는 그대로 이어집니다.

### 사전 리서치 자산 — references/

이번 클립은 별도 도메인 지식(카드뉴스 만들기·이미지 프롬프트 작성법)이 필요해서 `references/` 폴더에 두 문서를 둡니다.

```text
~/fastcampus-cc/.claude/skills/content-pipeline/references/
├── card-news-guide.md          ← 카드뉴스 제작 가이드 (구조·카피·정량값)
└── image-prompt-generator.md   ← gpt-image-2용 시스템 프롬프트
```

자동 셋업이 이 두 파일을 강의 워크스페이스의 사전 리서치 폴더에서 자동 복사해줍니다. SKILL.md 본문이 매번 처음부터 작성할 필요 없이, 이미 검증된 가이드를 참조해서 일관된 결과를 만들어요.

### 사전 준비 — OpenAI 키 + Node.js + Remotion

```text
1. OpenAI 키 발급
   - https://platform.openai.com 가입
   - API keys → "Create new secret key" → sk-...로 시작하는 키 복사
   - ~/fastcampus-cc/.env 에 한 줄 추가
     OPENAI_API_KEY=sk-...

2. Python openai SDK 설치
   pip install openai

3. Node.js + Remotion (Part 03에서 이미 설치했다면 OK)
   brew install node
   # Remotion은 Part 03 clip-10 프로젝트 재사용
```

OpenAI는 무료 한도가 없습니다. 키 발급하려면 결제 수단 등록이 필요해요. 첫 사용 전에 $5 정도 결제해두면 시연 분량은 충분합니다 (이미지 12장 + TTS 5분 정도 = $1 미만).

---

## 진행 흐름

### 1. `/part06` 호출 → Clip 10 선택

```text
/part06
```

자동 셋업이 자산과 의존성을 한꺼번에 확인합니다.

```text
✓ 사전 리서치 자산 2종 → content-pipeline/references/ 복사
  (card-news-guide.md + image-prompt-generator.md)
✓ Node.js OK
✓ openai SDK OK
ℹ .env에 OPENAI_API_KEY 필요 — 사전 준비 따라하기
✓ deep-research 확인 (재호출 가능)
✓ ~/fastcampus-cc/50-my-work/Part06-스킬만들기/실습31-콘텐츠파이프라인스킬/ 준비 완료
```

OpenAI 키를 `.env`에 등록한 다음 STEP 1로.

### 2. STEP 1 — 워크플로우 잡기

```text
특정 주제로 리서치해서 영상까지 콘텐츠를 한 번에 만들려는데,
어떻게 워크플로우를 구성해야 할까?
```

정리되는 단계는 보통 이런 모습이에요.

```text
1. 주제 한 마디 입력
2. 딥리서치 (자료 수집·정리)
3. 카드뉴스 기획 (장수·핵심 메시지)
4. 이미지 생성 (카드별 배경)
5. HTML 카드뉴스 (4:5 디자인)
6. TTS 스크립트 (음성 텍스트)
7. 음성 변환 (씬별 mp3)
8. 영상 빌드 (9:16 Remotion)
```

### 3. STEP 2 — "있는 스킬 vs 자체 제작" 판단

여기서 이번 클립의 핵심 메시지가 나옵니다.

```text
정리된 단계 보완하자. 단계마다 '있는 스킬 재호출 vs 자체 스크립트' 판단:

[있는 스킬 재호출]
- 단계 2 리서치 → deep-research 스킬 재호출 (Clip 2에서 만든 v2)
  · 폴백: deep-research가 없으면 WebSearch로 대체

[자체 스크립트 — 결정론]
- 단계 4 이미지 → generate_image.py (gpt-image-2)
- 단계 7 음성 → tts.py (gpt-4o-mini-tts)
- 단계 8 영상 → Remotion 빌드 명령 (Part 03 프로젝트 재사용)

[SKILL.md 본문 — 자유도]
- 단계 1 주제 받기 + 체크포인트
- 단계 3 카드뉴스 기획 (references/card-news-guide.md 참조)
- 단계 5 HTML 카드뉴스 디자인
- 단계 6 TTS 스크립트 작성 (## 헤더로 씬 구분)
- 각 단계 사이 AskUserQuestion 체크포인트

[references — 도메인 지식]
- card-news-guide.md (사전 리서치 자산)
- image-prompt-generator.md (사전 리서치 자산)
```

"다른 스킬을 부른다"가 포인트가 아니라, **"있으면 재호출·없으면 자체 제작" 판단**이 포인트예요. 미래에 본인이 새 파이프라인을 만들 때 같은 판단을 반복하게 됩니다.

### 4. STEP 3 — 스킬 + 두 스크립트 + 체크포인트 작성

```text
지금 정의한 분리 안대로 content-pipeline 스킬을 만들어줘.

위치:
- ~/fastcampus-cc/.claude/skills/content-pipeline/SKILL.md
- ~/fastcampus-cc/.claude/skills/content-pipeline/scripts/generate_image.py
- ~/fastcampus-cc/.claude/skills/content-pipeline/scripts/tts.py
- references/는 이미 자동 셋업으로 복사됨

SKILL.md description: "콘텐츠 파이프라인·카드뉴스·영상 자동 생성·리서치부터 영상까지" 키워드

SKILL.md 본문:
1. 주제 받기
2. deep-research 스킬 재호출 (있으면) 또는 WebSearch (폴백) → 01-리서치-보고서.md
   [체크포인트 1] AskUserQuestion: "내용 OK? 다음 갈까요?"
3. 카드뉴스 기획 (references/card-news-guide.md 참조)
   - 유형·장수·핵심 메시지 결정 → 02-카드뉴스-기획서.md
   [체크포인트 2] AskUserQuestion: "기획 OK? 이미지 생성?"
4. generate_image.py 호출 (카드별 12장) → images/card-01~12.png
   [체크포인트 3] AskUserQuestion: "이미지 톤 OK? HTML?"
5. HTML 카드뉴스 작성 (B&W 에디토리얼 매거진, 1080x1350)
   - card-news.html
   [체크포인트 4] AskUserQuestion: "디자인 OK? TTS?"
6. TTS 스크립트 작성 (## 헤더로 씬 구분) → 05-tts-script.md
   [체크포인트 5] AskUserQuestion: "스크립트 OK? 음성?"
7. tts.py 호출 (씬별 mp3 + card-timings.json) → audio/cards/*.mp3
8. Remotion 9:16 빌드 (Part 03 프로젝트 재사용) → output.mp4

generate_image.py 요건:
- API 키: os.getenv("OPENAI_API_KEY")
- 모델: gpt-image-2 (snapshot gpt-image-2-2026-04-21)
- 크기: 1088x1360 생성 → 1080x1350 crop 후처리
- background: opaque
- 품질 기본값: medium (드래프트는 low)
- 입력: image-prompt-generator.md의 시스템 프롬프트 + 카드별 비주얼 아이디어

tts.py 요건:
- API 키: 같은 OPENAI_API_KEY 공유
- 모델: gpt-4o-mini-tts
- 보이스: marin 또는 cedar (한국어 무난)
- 입력: 05-tts-script.md 파싱 (## 헤더로 씬 분리)
- 출력: 씬별 mp3 + card-timings.json (각 카드 재생 시간)

결과물 위치: ~/fastcampus-cc/50-my-work/Part06-스킬만들기/실습31-콘텐츠파이프라인스킬/{주제}-{날짜}/
```

생성된 파일들을 안티그래비티에서 확인합니다.

### 5. STEP 4 — 벚꽃 명소 시연 (단계별)

클로드코드 재시작 후 자연어로 호출.

```bash
exit
claude
```

```text
벚꽃 명소 주제로 콘텐츠 파이프라인 만들어줘
```

진행이 6단계로 갈라져요. 각 체크포인트에서 OK 답변하면서 진행합니다.

**단계 1·2 — 리서치 + 기획 (~6분)**

```text
[1] deep-research 스킬 재호출 → "전국 벚꽃 명소"
    → 01-리서치-보고서.md (출처 5~10개)
[CP1] "내용 어떠세요? 다음 갈까요?"  → "응 좋아"

[2] 카드뉴스 기획 (references/card-news-guide.md 참조)
    - 유형: 정보형 (지식·노하우)
    - 장수: 표지 1 + 본문 8 + 마무리 1 = 10장
    - 핵심: 지역별 명소 + 개화 시기 + 추천 코스
    → 02-카드뉴스-기획서.md
[CP2] "기획 OK? 이미지 12장 생성?" → "응"
```

**단계 3·4 — 이미지 + HTML (~5분)**

```text
[3] generate_image.py 호출 (12장 배치)
    - 드래프트 low로 톤 확인 → "벚꽃 + 톤 OK" 답하면 medium 재생성
    → images/card-01~12.png (1080x1350)
[CP3] "이미지 톤 OK? HTML?" → "응"

[4] HTML 카드뉴스 작성
    - B&W 에디토리얼 매거진 톤
    - 4:5 캐러셀 안전영역 + 폰트 위계 + 60-30-10 색상
    → card-news.html
[CP4] "디자인 OK? TTS 스크립트?" → "응"
```

**단계 5·6 — TTS + 영상 (~3분, 빌드 별도)**

```text
[5] TTS 스크립트 작성 (카드 1장 = 섹션 1개)
    → 05-tts-script.md
[CP5] "스크립트 OK? 음성 생성?" → "응"

[6] tts.py 호출 (씬별 mp3 생성)
    → audio/cards/card-01.mp3 ~ card-10.mp3
    → card-timings.json (각 카드 재생 시간)
[7] Remotion 9:16 영상 빌드 (Part 03 프로젝트 재사용)
    → output.mp4
```

브라우저에서 `card-news.html` 열어 카드뉴스 확인. 영상 플레이어로 `output.mp4` 재생해서 9:16 결과 확인.

### 6. STEP 5 — Part 6 통합 정리 + 회고

Part 6 9 실습이 끝났어요. 이번 클립 마무리에서 통합 정리를 합니다.

```text
[Part 6 9 실습 + Part 5 자산 6종 = 본인 평생 도구]

CH01 — 스킬 입문
1. deep-research v1 — 손으로 메타 흐름 4단계 익히기
2. deep-research v2 — 비교·개선 사이클 (라이프사이클)
3. skillers-suda 도구 — 자동 생성 (일상 사용)

CH02 — API 활용
4. trip-advisor — 공공 API + 스크립트 분리 첫 도입
5. naver-news — 검색 API + AskUserQuestion 인터랙티브 + HTML 출력

CH03 — 업무 자동화
6. fashion-trend — 외부 플러그인 (스크립트 분리 X 예외)
7. audio-to-doc — 오디오 + 5 유형 자동 판별
8. morning-briefing — 스킬이 스킬 호출 + 슬래시 커맨드
9. content-pipeline — 6 STEP 풀 통합 + 체크포인트

Part 5 자산 사슬 매트릭스:
- 실습 18 CLAUDE.md  → 9 실습 전체 컨텍스트
- 실습 19 커맨드     → Clip 8·9 패턴 재활용
- 실습 20 GWS CLI    → Clip 9 모닝 브리핑 메일·일정 재료
- 실습 21 hooks      → 9 실습 안전장치 (.env 보호)
- 실습 22 GitHub     → 9 실습 묶음 백업
```

마지막 회고는 자유 입력으로.

```text
가장 응용하고 싶은 실습 1개 + 본인 일 어디에 가져갈지 한 줄
```

---

## 결과물

이번 클립이 끝나면 아래가 남습니다.

| 결과물 | 위치 | 설명 |
|---|---|---|
| `SKILL.md` | `~/fastcampus-cc/.claude/skills/content-pipeline/SKILL.md` | 6 STEP 본문 + 체크포인트 |
| `generate_image.py` | `~/fastcampus-cc/.claude/skills/content-pipeline/scripts/` | gpt-image-2 + crop |
| `tts.py` | `~/fastcampus-cc/.claude/skills/content-pipeline/scripts/` | gpt-4o-mini-tts |
| `card-news-guide.md` | `references/` | 사전 리서치 자산 |
| `image-prompt-generator.md` | `references/` | 사전 리서치 자산 |
| `.env` 한 줄 | `~/fastcampus-cc/.env` | `OPENAI_API_KEY` |
| `벚꽃명소-{날짜}/` | `실습31-콘텐츠파이프라인스킬/` | 6 파일 (리서치·기획·이미지·HTML·TTS·영상) |
| `audio/cards/*.mp3` | `실습31-콘텐츠파이프라인스킬/벚꽃명소-{날짜}/` | 카드별 음성 |
| `output.mp4` | `실습31-콘텐츠파이프라인스킬/벚꽃명소-{날짜}/` | Remotion 9:16 영상 |

`완료` 또는 `/wrap`을 입력하면 다음이 처리됩니다.

- `progress.json`의 `practice_completed`에 `"실습 31"` 추가
- `skills_created`에 7종 명명 스킬 모두 확인 + skillers-suda 자동 생성 1종
- `completed_parts`에 `"Part 06"` 추가
- 레벨 승급: `"AI Intermediate"` → `"AI Advanced"`

---

## 자주 막히는 포인트

| 증상 | 원인 | 해결 |
|---|---|---|
| OpenAI 키 발급 시 결제 등록 요구 | OpenAI 무료 한도 없음 | $5 정도 결제. 시연 분량 충분 |
| OpenAI 호출이 401 | 키 오타 또는 잔액 없음 | `.env`의 `OPENAI_API_KEY` 정확 확인 + 결제 잔액 확인 |
| `gpt-image-2` 호출이 invalid size | 1080x1350 직접 요청함 | 1088x1360으로 생성 → Pillow로 1080x1350 crop 후처리 |
| 이미지 톤이 매 카드 다름 | STYLE_LOCK 미적용 | `image-prompt-generator.md`의 STYLE_LOCK 1회 정의 + 카드마다 verbatim 재명시 |
| 이미지에 텍스트가 박혀 들어옴 | HTML 텍스트 레이어 분리 미명시 | 프롬프트에 "no readable text, no letters, no numbers, no logos" 강제 |
| `gpt-4o-mini-tts` 발음이 부자연 | 보이스 선택 오류 | 한국어는 `marin` 또는 `cedar`. 다른 보이스는 영문 발음 위주 |
| 카드 재생 시간이 영상과 안 맞음 | `card-timings.json` 미생성 | `tts.py`에서 각 mp3 길이 측정 + JSON 저장 단계 추가 |
| `deep-research` 스킬이 호출 안 됨 | Clip 2 미진행 또는 위치 오류 | `~/fastcampus-cc/.claude/skills/deep-research/SKILL.md` 확인. 없으면 WebSearch 폴백 사용 |
| Remotion 빌드가 실패 | Part 03 프로젝트 위치 오류 | Part 03 clip-10에서 만든 Remotion 프로젝트 경로 SKILL.md에 명시 |
| 체크포인트 응답 없이 계속 진행 | AskUserQuestion 누락 | SKILL.md 단계 사이마다 AskUserQuestion 명시 |
| 영상 빌드 시간이 5분 넘게 | 정상 (10장 + 음성 + 트랜지션) | 빌드는 백그라운드로. 본인은 다른 일 |
| 시연 외 본인 주제로 안 만들어짐 | 도메인 가이드가 카드뉴스에 특화 | `card-news-guide.md`를 본인 도메인 가이드로 교체 가능 |
| 1080x1350 crop이 어색하게 잘림 | 16배수 마진을 사방 균등 분배 안 함 | crop 코드에 `(1088-1080)/2 = 4px`, `(1360-1350)/2 = 5px` 마진 |

---

## Part 6 마무리

Part 6 9 실습이 모두 끝났습니다. 처음 만든 `deep-research` v1부터 마지막 `content-pipeline`까지, 손에 익은 메타 흐름이 9번 반복됐어요. 다음에 본인 일에 새 스킬을 만들 때, 첫 프롬프트를 "어떻게 워크플로우를 구성해야 할까?"로 시작하는 습관이 남아 있으면 Part 6의 목적은 달성된 거예요.

**Part 5 자산 6종 + Part 6 9 실습 = 본인 평생 도구**, 이 한 줄이 Part 6에서 가져갈 전부예요. 강의가 끝나도 `~/fastcampus-cc/`는 본인 클로드코드 작업장으로 계속 쓰세요. 새 아이디어가 떠오를 때마다 `/skillers-suda`로 빠르게 첫 동작 형태를 만들고, 부족하면 Clip 3 사이클로 다듬으면 됩니다.

**다음에 어디로** — Part 7은 만든 스킬들을 실전 프로젝트에 적용하는 단계입니다. Part 6에서 만든 스킬을 본인 일에 한 달 정도 굴려보고 Part 7로 넘어가는 게 자연스러워요. 한 달 동안 가장 자주 부르게 된 스킬 1~2개가 본인 평생 도구의 핵심이 될 거예요.

→ [Part 7 / Clip 1: 하네스 엔지니어링 — 내 워크스페이스 설계하기](#part-7-01-workspace-design)

수고하셨습니다.
