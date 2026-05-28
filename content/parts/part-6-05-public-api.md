---
course_clip_ref: "Part 6 / Ch 02 / Clip 5"
result_path: "50-my-work/Part06-스킬만들기/실습26-공공API스킬/"
next_clip_id: "part-6-06-search-api"
---

# Part 6 / Clip 5: 공공 API 스킬 — TourAPI 여행 가이드

> 강의 영상: Part 6 / Ch 02 / Clip 5 (~20분)
> 만드는 것: `trip-advisor` 스킬 + `scripts/tour_api.py` (Python 결정론 스크립트)
> 시연 주제: 부산 2박3일 여행 가이드

---

## 이 클립에서 만드는 것

CH01에서는 스킬 만들기 자체를 익혔어요. CH02부터는 외부 API를 스킬과 연결하는 작업이에요. 첫 번째는 **공공데이터포털 TourAPI** — 한국관광공사가 제공하는 무료 공공 API입니다.

만드는 스킬은 `trip-advisor`. "부산 여행 코스 짜줘" 같은 자연어 한 마디로 호출하면, 관광지·축제·숙박 정보를 자동으로 모아 종합 여행 가이드 한 장을 만들어줍니다. 시연은 부산 2박3일로 진행합니다.

이번 클립은 두 가지 새로운 패턴을 동시에 익혀요.

- **외부 API 키 관리** — `.env` 파일에 API 키 한 줄 보관. `.gitignore` 등록 + Part 5 trash-guard hook이 안전장치예요.
- **스크립트 분리 패턴** — SKILL.md 본문(AI 해석 영역)과 결정론 단계(API 호출, JSON 파싱)를 분리합니다. 결정론 단계는 `scripts/tour_api.py`로 빼서, 같은 입력에 같은 결과가 매번 나오게 보장해요.

이번 클립에서 할 일은 다섯 단계입니다. TourAPI 활용신청 → 워크플로우 잡기 → 단계 정의(AI vs 결정론) → 스킬화 + 스크립트 분리 → 부산 여행으로 호출 테스트.

---

## 핵심 개념

### 스크립트 분리 패턴 — AI에게 맡길 단계 vs 코드로 빼야 할 단계

SKILL.md 본문은 클로드코드가 매번 해석합니다. 단어 선택, 출력 형식, 정렬 순서가 매번 미세하게 달라져요. 자유도가 필요한 단계엔 좋지만, **API 호출이나 JSON 파싱처럼 답이 정해진 단계**까지 AI에 맡기면 결과가 흔들립니다.

```text
[AI에게 맡길 단계 — SKILL.md 본문]
- 어떤 관광지를 고를지 판단
- 일정 순서 배치
- 한국어 가이드 톤으로 정리

[코드로 빼야 할 단계 — scripts/tour_api.py]
- TourAPI 엔드포인트 호출 (HTTP GET)
- 응답 JSON 파싱
- 필드명 매핑 + 빈 값 처리
```

같은 입력 → 같은 결과가 필요한 부분은 Python 스크립트로, 매번 다른 해석이 필요한 부분은 SKILL.md 본문으로. 이 구분은 CH02부터 CH03까지 5개 스킬에서 계속 반복돼요. Clip 5에서 손에 익혀두면 나머지 스킬들이 같은 패턴으로 따라옵니다.

### TourAPI 5 액션 — 한 스크립트가 다섯 가지 일을 함

`tour_api.py`는 다섯 가지 액션을 처리합니다.

| 액션 | 기능 | 예 |
|---|---|---|
| `keyword` | 키워드로 관광지 검색 | "부산 + 해운대" |
| `festival` | 축제 정보 | "2026년 5월 부산 축제" |
| `area` | 지역 코드로 관광지 묶음 조회 | "부산 광역시 전체" |
| `stay` | 숙박 정보 | "부산 숙박업소 목록" |
| `detail` | 특정 항목 상세 정보 | "해운대 해수욕장 상세" |

스크립트 하나에 다섯 함수를 다 넣어도 되고, 액션별 파일로 분리해도 됩니다. 클로드코드한테 부탁할 때 "5 액션을 하나의 `tour_api.py`에 담아줘"라고 명시하면 됩니다.

### API 키는 `.env`에 — 절대 SKILL.md에 박지 마세요

TourAPI 키처럼 비밀번호 격인 값은 SKILL.md나 스크립트에 직접 박으면 위험해요. 깃에 올라가는 순간 노출됩니다. 강의 워크스페이스에선 다음 위치에 한 줄로 보관합니다.

```text
~/fastcampus-cc/.env
─────────────────────────
TOURAPI_SERVICE_KEY=발급받은_키_여기에
```

`.gitignore`에 이미 `.env`가 등록돼 있어서 깃엔 안 올라가요. Part 5 Clip 4에서 만든 trash-guard hook이 추가 안전장치 역할을 합니다 — `.env`를 실수로 삭제·덮어쓰기 하려고 하면 자동 차단됩니다.

Python 스크립트는 `os.getenv("TOURAPI_SERVICE_KEY")`로 값을 읽어 씁니다.

### 사전 준비 — TourAPI 활용신청 10분 대기

TourAPI는 무료지만 키 발급에 약 10분 대기가 있어요. 이번 클립 시작할 때 신청부터 넣어두고 다른 일을 하는 게 효율적입니다.

```text
1. https://www.data.go.kr 접속 → 회원가입
2. "TourAPI" 검색 → "한국관광공사_국문관광정보" 활용신청
3. 활용 목적 한 줄 입력 (예: 학습용)
4. 신청 후 약 10분 대기 → 자동 승인 메일 도착
5. 마이페이지 → 인증키(Encoding) 복사
```

대기하는 동안 본 챕터의 핵심 개념 부분을 미리 읽거나, Clip 4에서 만든 다른 스킬을 다듬어도 됩니다.

---

## 진행 흐름

### 1. `/part06` 호출 → Clip 5 선택 + TourAPI 신청

강의 워크스페이스에서 시작합니다.

```text
/part06
```

자동 셋업이 진도 폴더와 스크립트 폴더를 준비합니다.

```text
✓ ~/fastcampus-cc/50-my-work/Part06-스킬만들기/실습26-공공API스킬/ 준비 완료
✓ ~/fastcampus-cc/.claude/skills/trip-advisor/scripts/ 준비 완료
✓ Python requests OK
```

여기서 TourAPI 활용신청부터 넣어두세요. 위 "사전 준비" 안내대로 진행한 뒤, 10분 대기 동안 STEP 1로 넘어가 워크플로우를 잡습니다.

### 2. STEP 1 — 워크플로우 잡기

클로드코드 세션에서 의문문으로 시작합니다.

```text
공공 API로 여행 정보 가져와서 여행 가이드 만들려는데,
어떻게 워크플로우를 구성해야 할까?
```

클로드코드가 단계별 워크플로우를 정리해줍니다. 보통 이런 모습이에요.

```text
1. 지역·기간·관심사 입력 받기
2. 관광지 검색 (TourAPI keyword 액션)
3. 같은 기간 축제 조회 (TourAPI festival 액션)
4. 숙박 후보 조회 (TourAPI stay 액션)
5. 일정 순서 배치 (1일차·2일차·3일차)
6. 한국어 가이드로 종합 정리 + 출처 명시
```

### 3. STEP 2 — 보완 + AI vs 결정론 분리

여기서 핵심은 어느 단계를 코드로 빼고, 어느 단계를 AI에게 맡길지 구분하는 거예요.

```text
정리된 단계 좋은데 두 가지 보완하자.

1) TourAPI 호출 단계 2~4는 매번 같은 입력에 같은 결과가 필요해.
   Python 스크립트로 빼두자. scripts/tour_api.py에 5 액션 모두 담자.

2) 일정 배치, 한국어 정리는 매번 미세하게 다르게 나와도 OK.
   SKILL.md 본문에 자연어로 둬도 충분.

이렇게 분리하는 게 맞나?
```

클로드코드가 분리 안을 정리해줍니다. 다음과 같은 모습이 됩니다.

```text
[scripts/tour_api.py] — 결정론
- keyword(query)      → 관광지 검색
- festival(area, ym)  → 축제 조회
- area(area_code)     → 지역 묶음
- stay(area_code)     → 숙박 조회
- detail(content_id)  → 상세 정보

[SKILL.md 본문] — 자유도
- 입력 받기 + 액션 호출 결정
- 결과 묶기 + 일정 배치
- 한국어 가이드 정리
- 결과물 저장 위치 명시
```

### 4. STEP 3 — 스킬화 + 스크립트 분리

이제 클로드코드한테 스킬과 스크립트를 함께 만들어달라고 요청합니다.

```text
지금 정의한 분리 안대로 trip-advisor 스킬을 만들어줘.

위치:
- ~/fastcampus-cc/.claude/skills/trip-advisor/SKILL.md
- ~/fastcampus-cc/.claude/skills/trip-advisor/scripts/tour_api.py

SKILL.md description: "여행 가이드·여행 코스·관광지 추천·축제·숙박" 키워드 포함

tour_api.py 요건:
- 5 액션 함수 (keyword/festival/area/stay/detail)
- API 키는 os.getenv("TOURAPI_SERVICE_KEY")로 .env에서 읽기
- http:// 프로토콜 사용 (TourAPI 공식 스펙)
- 응답 JSON 파싱 + 빈 값 처리
- 액션별 CLI 호출 가능하게 argparse 추가

결과물 저장 위치: ~/fastcampus-cc/50-my-work/Part06-스킬만들기/실습26-공공API스킬/{지역}-여행가이드-{날짜}.md
```

생성된 파일을 안티그래비티에서 한 번 열어보세요. 스킬 폴더 안에 두 파일이 들어가 있어야 합니다.

```text
~/fastcampus-cc/.claude/skills/trip-advisor/
├── SKILL.md
└── scripts/
    └── tour_api.py
```

`.env`에 TourAPI 키도 등록하세요. 메일로 받은 인증키를 한 줄로.

```text
~/fastcampus-cc/.env
─────────────────────
TOURAPI_SERVICE_KEY=받은_인증키_여기에
```

### 5. STEP 4 — 부산 여행으로 호출 테스트

새 스킬을 인식시키기 위해 클로드코드를 재시작합니다.

```bash
exit
claude
```

```text
부산 여행 코스 짜줘. 2박 3일 일정으로.
```

description이 매칭되면 `trip-advisor`가 발동돼요. 진행 화면에서 다음 단계가 보입니다.

```text
1. tour_api.py keyword 호출 (부산 + 관광지)
2. tour_api.py festival 호출 (부산 + 2026년 5월)
3. tour_api.py stay 호출 (부산 숙박)
4. 일정 1·2·3일차 배치
5. 한국어 가이드 정리 → 부산-여행가이드-{날짜}.md 저장
```

결과 파일을 안티그래비티에서 열어보세요. 관광지 목록, 같은 기간 축제, 숙박 후보, 일정 표가 한 장에 정리돼 있어야 합니다.

### 6. STEP 5 — 본인 업계 공공 API 응용

TourAPI 외에도 공공데이터포털에는 같은 패턴으로 쓸 수 있는 API가 많아요.

| 업계 | 활용 가능한 공공 API |
|---|---|
| 부동산 | 실거래가 공개 시스템 |
| 환경 | 미세먼지·대기질 측정 |
| 금융 | 환율·주가 (한국은행 ECOS) |
| 교통 | 버스·지하철 도착 정보 |
| 의료 | 병원·약국 위치 |

본인 업계에 맞는 API 하나를 골라보세요. 같은 스크립트 분리 패턴으로 본인 일에 맞는 스킬을 만들 수 있습니다.

---

## 결과물

이번 클립이 끝나면 아래가 남습니다.

| 결과물 | 위치 | 설명 |
|---|---|---|
| `SKILL.md` | `~/fastcampus-cc/.claude/skills/trip-advisor/SKILL.md` | 스킬 본문 (자유도 영역) |
| `tour_api.py` | `~/fastcampus-cc/.claude/skills/trip-advisor/scripts/tour_api.py` | 5 액션 결정론 스크립트 |
| `.env` 한 줄 | `~/fastcampus-cc/.env` | TOURAPI_SERVICE_KEY |
| `부산-여행가이드-{날짜}.md` | `실습26-공공API스킬/` | 첫 호출 결과 |

`완료` 또는 `/wrap`을 입력하면 `progress.json`의 `practice_completed`에 `"실습 26"`이, `skills_created`에 `"trip-advisor"`가 추가됩니다.

---

## 자주 막히는 포인트

| 증상 | 원인 | 해결 |
|---|---|---|
| TourAPI 활용신청 후 자동 승인 안 됨 | 10분 이상 지연 | 정상. 길게는 30분까지. 메일 받기 전까지 다른 작업 진행 |
| 인증키 복사할 때 줄바꿈 들어감 | 마이페이지 박스 줄바꿈 | `.env`에 붙여 넣을 때 한 줄로. 줄바꿈 제거 |
| `tour_api.py` 실행 시 키 못 읽음 | `.env` 위치 또는 파일명 오타 | 강의 워크스페이스 루트 `~/fastcampus-cc/.env`인지 확인. 변수명 `TOURAPI_SERVICE_KEY` 정확히 |
| TourAPI 호출이 403 | http와 https 혼동 | TourAPI는 `http://` 프로토콜. `https://` 쓰면 막힘 |
| TourAPI 응답이 XML로 옴 | format 파라미터 누락 | 요청 시 `&_type=json` 추가 |
| 5 액션 중 일부만 동작 | 파라미터 누락 | `tour_api.py` 안 각 함수 docstring 확인. festival은 ym(연월) 필수 |
| 결과물 위치가 엉뚱한 데로 | SKILL.md에 경로 누락 | SKILL.md에 "결과물은 ~/fastcampus-cc/50-my-work/Part06-스킬만들기/실습26-공공API스킬/{지역}-여행가이드-{날짜}.md 에 저장" 명시 |
| Python requests 모듈 없음 | pip install 안 함 | `pip install requests` 또는 `pip3 install requests` |
| 스킬이 호출 안 됨 | 재시작 누락 | `exit` 후 `claude` |
| description 매칭 안 됨 | 키워드 좁음 | "여행·관광·코스·가이드·추천" 등 4~5개로 확장 |

---

## 다음 클립

→ [Part 6 / Clip 6: 검색 API — 네이버 뉴스 → 뉴스레터 HTML](#part-6-06-search-api)

다음 클립에서는 같은 분리 패턴(`scripts/`)을 한 번 더 굴립니다. 이번엔 네이버 검색 API를 써서 관심 키워드 뉴스를 모은 뒤, HTML 뉴스레터 한 장으로 자동 정리해요. AskUserQuestion으로 호출 시점에 사용자에게 옵션을 물어보는 인터랙티브 패턴도 추가됩니다.
