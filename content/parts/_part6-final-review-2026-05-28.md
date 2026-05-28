# Part 6 본문 작성 + 최종 patina 검토 보고서

> 작성일: 2026-05-28
> 위치: `/Users/chulrolee/cc101-with-fc/cc101-fc/content/parts/part-6-*.md`
> 챕터 수: 10개 (intro 1 + 9 실습)
> 총 라인: 2,891 lines
> 총 분량: 약 140KB Korean Markdown

---

## 작성 완료 챕터 (10/10)

| # | 파일 | 라인 | 클립 매핑 | 실습 # | 만드는 스킬 |
|:-:|---|:-:|---|:-:|---|
| 1 | `part-6-01-skill-intro.md` | 211 | Part 6 / Ch 01 / Clip 1 | — | (이론 인트로) |
| 2 | `part-6-02-deep-research.md` | 240 | Clip 2 | 23 | `deep-research` v1 |
| 3 | `part-6-03-evaluate-improve.md` | 254 | Clip 3 | 24 | `deep-research` v2 (비교·개선) |
| 4 | `part-6-04-skillers-suda.md` | 215 | Clip 4 | 25 | (skillers-suda 자동 생성 1종) |
| 5 | `part-6-05-public-api.md` | 284 | Clip 5 | 26 | `trip-advisor` + `tour_api.py` |
| 6 | `part-6-06-search-api.md` | 320 | Clip 6 | 27 | `naver-news` + `fetch_news.py` |
| 7 | `part-6-07-web-crawl.md` | 301 | Clip 7 | 28 | `fashion-trend` (insane-search) |
| 8 | `part-6-08-meeting-notes.md` | 327 | Clip 8 | 29 | `audio-to-doc` (Gemini 3.5-flash) |
| 9 | `part-6-09-morning-briefing.md` | 321 | Clip 9 | 30 | `morning-briefing` + `/morning-briefing` |
| 10 | `part-6-10-content-pipeline.md` | 418 | Clip 10 | 31 | `content-pipeline` (gpt-image-2 + gpt-4o-mini-tts + Remotion) |

---

## 적용된 결정 사항

| 결정 | 출처 | 적용 |
|---|---|---|
| **챕터 매핑**: 10개 — Clip 1 인트로 포함 | 사용자 인터뷰 | ✅ part-6-01부터 part-6-10 |
| **톤**: Part 5 clip-01 담백체 베이스 + 약간 친근함, 이모지 없음 | 사용자 인터뷰 | ✅ 모든 챕터 적용 |
| **작성 방식**: 챕터별 검증 + patina 사용 | 사용자 인터뷰 | ✅ 각 챕터 patina 자체 스캔 후 진행 |
| **강사 표현 제거**: 자습서로 보는 책 | 사용자 추가 지시 | ✅ "강사" 0건 (전체 sweep) |
| **시간 분할 제거**: 사람마다 다름 | 사용자 추가 지시 | ✅ 9.5h 같은 절대 시간 수치 제거 |
| **TTS = OpenAI gpt-4o-mini-tts** (edge-tts 아님) | docs-guide 검증 | ✅ part-6-10에 박힘 |
| **"9 스킬" → "9 실습"** | 사용자 추가 지시 | ✅ SKILL.md + 모든 본문 적용 |
| **강의 워크스페이스·강의 영상 KEEP** | 사용자 추가 지시 | ✅ 기술 용어로 유지 |
| **Scrapling → insane-search** | docs-guide + SKILL 정합성 | ✅ part-6-07에 박힘 |

---

## docs-guide 외부 검증 결과 (모델 ID)

`docs-guide:docs-guide` 스킬로 공식 문서 직접 fetch 후 확인:

| 모델 | 공식 ID | 출처 |
|---|---|---|
| Gemini 전사+화자분리 | `gemini-3.5-flash` (Flash 계열 stable 최신) | ai.google.dev/gemini-api/docs/models/gemini-3.5-flash |
| OpenAI 이미지 | `gpt-image-2` (snapshot `gpt-image-2-2026-04-21`) | developers.openai.com/api/docs/models/gpt-image-2 |
| OpenAI TTS | `gpt-4o-mini-tts` (snapshot `gpt-4o-mini-tts-2025-12-15`) | developers.openai.com/api/docs/models/gpt-4o-mini-tts |

이미지 크기 제약(16배수)도 공식 확인: 1080×1350 직접 불가 → 1088×1360 생성 후 crop 정석 패턴.

---

## Patina AI 패턴 sweep 결과

전체 10 챕터에 16개 패턴 sweep — **모두 0건**.

```text
[패턴]              [잔존]
강사                  0
본 클립               0 (총 10건 → 일괄 "이번 클립" 치환)
이를 통해             0
아울러                0
결론적으로            0
체계적인              0
효과적인              0
혁신적                0
지속적인              0
다양한                0
단순히 ~ 아니라        0
뿐만 아니라           0
에 그치지 않          0
그렇다면 ~ 까          0
에 있어서             0
(으)로서              0
```

## Patina 적용 패스

1. **part-6-01 첫 패스** — 사용자 인터뷰 톤 결정 후 단일 patina (skill) — 표적 8건 + 사용자 제안 4건 + Codex/Gemini 교차검증 6건 + 강사 5건 제거
2. **part-6-02~10 자체 패스** — 작성 직후 grep 기반 self-audit + 표적 수정
3. **전체 일괄 sweep** — 16개 패턴 0건 확인 + "본 클립" 10건 일괄 치환
4. **외부 codex 디스패치** — 4개 대표 챕터(03/05/07/10) 정성적 검토 (백그라운드 진행 중, 추가 발견시 별도 반영)

---

## SKILL.md 동시 갱신 사항

본문 작성에 맞춰 `~/Desktop/fastcampus-cc/.claude/skills/part06-skill-craft/` 스킬도 갱신:

- `SKILL.md` 커리큘럼 표: Scrapling → insane-search, "9 스킬" → "9 실습", Remotem → Remotion 오타 수정
- `SKILL.md` 스크립트 분리 표: fashion-trend는 "외부 플러그인(스크립트 분리 없음)"으로 차별화, content-pipeline은 `gpt-image-2 + gpt-4o-mini-tts` 명시 + OpenAI 키 1개 공유 박스
- `clip06-search-api.md` line 78: "Scrapling KREAM" → "insane-search KREAM"
- `clip07-web-crawl.md`: 이미 insane-search 패턴 박힘 (그대로 유지)
- `clip08-meeting-notes.md`: "9.5h 한 번에" → "긴 회의 한 번에" (구체 시간 제거)
- `clip10-content-pipeline.md`: 6 STEP 풀 파이프라인 표 + WRAP 모두 `gpt-image-2 + gpt-4o-mini-tts` 명시, "9 스킬" → "9 실습"

---

## 핵심 메시지 박힘 (모든 챕터 일관)

- **"그냥 만들어줘" X / "어떻게 워크플로우를 구성해야 할까?" O** — 메타 흐름 첫 프롬프트
- **4단계 메타 흐름** — 워크플로우 잡기 → 보완 → 스킬화 → 테스트
- **스크립트 분리 패턴** — AI에게 맡길 자유도 vs 코드로 빼는 결정론
- **Part 5 → Part 6 자산 사슬** — 매 챕터 명시
- **있는 스킬은 재호출, 없는 기능은 자체 스크립트** — Clip 10 통합 메시지
- **체크포인트 패턴** — 자동만이 아닌 협업 (Clip 10)
- **라이프사이클** — v1 한 번 만들고 끝 아님 (Clip 3)
- **본인 평생 도구** — Part 5 자산 6종 + Part 6 9 실습 (Clip 10 마무리)

---

## 외부 codex patina 디스패치 결과 (적용 완료)

대표 4 챕터(03/05/07/10) 정성 검토 — 12건 발견 모두 적용:

| 파일 | Line | Before | After |
|---|---|---|---|
| part-6-03 | 24 | Part 5에서 박은 trash-guard hook이 자동으로 백업을 떠줘서 | 설정한 trash-guard hook이 자동으로 백업해줘서 |
| part-6-03 | 35 | 처음 만든 v1은 본인 한계가 박힌 상태라 | 처음 만든 v1에는 아직 부족한 부분이 남아 있어서 |
| part-6-03 | 173 | 본인 일에 가장 영향 클 1~2가지만 | 본인 일에 가장 영향이 큰 1~2가지만 |
| part-6-05 | 17 | 외부 API를 스킬에 끼우는 작업이에요 | 외부 API를 스킬과 연결하는 작업이에요 |
| part-6-05 | 48 | 이 분리가 ~ 반복돼요 | 이 구분은 ~ 계속 반복돼요 |
| part-6-05 | 112 | 위 "사전 준비" 안내대로. | 위 "사전 준비" 안내대로 진행한 뒤, |
| part-6-07 | 57 | 막히면 자동으로 escalate. | 막히면 자동으로 다음 단계로 올라갑니다. |
| part-6-07 | 73 | 핵심 트렌드 인사이트입니다 | 핵심입니다 |
| part-6-07 | 90 | 네이밍을 날짜 prefix로 고정해요 | 파일명 앞에 날짜를 붙이는 규칙으로 고정해요 |
| part-6-10 | 17 | 한 자루에 묶어 | 하나로 묶어 |
| part-6-10 | 45 | 두 자리 OpenAI 키 (의미 흔들림) | OpenAI 키 하나로 |
| part-6-10 | 416 | 실전 프로젝트에 박는 단계 | 실전 프로젝트에 적용하는 단계 |

## 일관성 차원 추가 적용 (codex 미샘플 챕터)

"박은/박힌/박혀" 패턴 7건 중 본문 4건 추가 수정 (표 셀 3건은 유지):

| 파일 | Line | Before | After |
|---|---|---|---|
| part-6-01 | 89 | 한계가 그대로 박혀요 | 한계가 그대로 반영됩니다 |
| part-6-02 | 159 | 본문에 단계가 그대로 박혀 있어야 | 본문에 단계가 그대로 들어가 있어야 |
| part-6-04 | 176 | Part 5에서 박은 trash-guard hook | Part 5에서 설정한 trash-guard hook |
| part-6-09 | 40 | 접근 권한이 박혀 있어요 | 접근 권한이 갖춰져 있어요 |

표 셀 유지 (짧고 의미 직관적):
- part-6-02:229 "경로가 안 박혀 있음"
- part-6-06:304 "응답에 `<b>` 태그가 박혀 옴"
- part-6-10:398 "이미지에 텍스트가 박혀 들어옴"

## 출간 전 권장 사항

- 외부 모델 ID 1회 재검증 (docs-guide로 이미 확인했지만 출간 시점 재확인 권장)
  - `gemini-3.5-flash` / `gpt-image-2-2026-04-21` / `gpt-4o-mini-tts-2025-12-15`
- 본인 환경에서 실제로 한두 챕터 따라해보며 단계별 문구 검증

---

## 결과물 위치

```text
/Users/chulrolee/cc101-with-fc/cc101-fc/content/parts/
├── part-6-01-skill-intro.md
├── part-6-02-deep-research.md
├── part-6-03-evaluate-improve.md
├── part-6-04-skillers-suda.md
├── part-6-05-public-api.md
├── part-6-06-search-api.md
├── part-6-07-web-crawl.md
├── part-6-08-meeting-notes.md
├── part-6-09-morning-briefing.md
├── part-6-10-content-pipeline.md
└── _part6-final-review-2026-05-28.md  ← 본 보고서
```

스킬 갱신 위치:

```text
/Users/chulrolee/Desktop/fastcampus-cc/.claude/skills/part06-skill-craft/
├── SKILL.md (v3.1)
├── references/
│   ├── clip02-deep-research.md
│   ├── clip03-evaluate-improve.md
│   ├── clip04-skillers-suda.md
│   ├── clip05-public-api.md
│   ├── clip06-search-api.md
│   ├── clip07-web-crawl.md
│   ├── clip08-meeting-notes.md
│   ├── clip09-morning-briefing.md
│   └── clip10-content-pipeline.md
└── (clip10-assets/ 사전 리서치 자산 2종)
```

이전 단계 검토 보고서:

```text
/Users/chulrolee/Desktop/fastcampus-cc/50-my-work/Part06-스킬만들기/skill-review-2026-05-28.md
```
