---
course_clip_ref: "Part 6 / Ch 03 / Clip 9"
result_path: "50-my-work/Part06-스킬만들기/실습30-모닝브리핑스킬/"
next_clip_id: "part-6-10-content-pipeline"
---

# Part 6 / Clip 9: 모닝 브리핑 — Part 5 GWS + 슬래시 커맨드

> 강의 영상: Part 6 / Ch 03 / Clip 9 (~30분)
> 만드는 것: `morning-briefing` 스킬 (HTML 대시보드) + `/morning-briefing` 슬래시 커맨드
> 시연: 오늘의 안 읽은 메일 5건 + 오늘 일정 + 클로드코드 키워드 뉴스 → HTML 대시보드 한 장

---

## 이 클립에서 만드는 것

매일 아침 30분씩 하던 작업이 한 클릭에 들어가는 시간이에요. **두 가지 새로운 패턴**을 동시에 익힙니다.

- **Part 5 자산 재활용 위에 nopal 얹기** — Part 5 Clip 3에서 인증한 GWS CLI를 그대로 두고, `nopal` 플러그인으로 자연어 오케스트레이션을 추가합니다. 새 인증 없이 메일·일정 호출이 자연어로 돼요.
- **스킬이 스킬을 부르는 첫 사례** — `morning-briefing` 스킬이 자기 안에서 Clip 6의 `naver-news` 스킬을 재호출합니다. 스킬을 모아놓으면 새 스킬은 작은 조각만 더하고 기존 자산을 끌어 쓰면 돼요.

만드는 스킬은 `morning-briefing`. 3개 데이터 소스를 한 화면 HTML 대시보드로 묶어줍니다.

| 소스 | 도구 | 결과 |
|---|---|---|
| 📧 메일 | `nopal` (Gmail) — Part 5 GWS 자산 | 안 읽은 5건 |
| 📅 일정 | `nopal` (Calendar) | 오늘 일정 |
| 📰 뉴스 | Clip 6 `naver-news` 재호출 | 관심 키워드 5건 |

호출은 두 가지 방식이에요. 자연어 ("오늘 모닝 브리핑")와 슬래시 커맨드 (`/morning-briefing`). 자동 발동과 명시 호출 둘 다 가능합니다.

이번 클립에서 할 일은 다섯 단계입니다. nopal 설치 → 워크플로우 잡기 → 분리 정의 → 스킬 + 슬래시 커맨드 작성 → 호출 테스트 + 자동 발동 미리보기.

---

## 핵심 개념

### Part 5 GWS 자산 위에 nopal — 새 인증 없이 자연어 호출

Part 5 Clip 3에서 GWS CLI 연동을 마쳤다면 이미 본인 Google 계정으로 Gmail·Calendar 접근 권한이 갖춰져 있어요. 그 위에 `nopal` 플러그인 한 줄을 얹으면, 자연어로 메일·일정을 호출할 수 있게 됩니다.

```text
[Part 5 자산]                [Clip 9에서 얹는 것]

GWS CLI 인증            →   nopal 플러그인 (자연어 오케스트레이션)
(Gmail, Calendar 권한)      "메일 5건 요약" / "오늘 일정"
                            같은 자연어가 GWS CLI 호출로 자동 변환
```

새 인증을 다시 받지 않아요. Part 5의 자산이 그대로 살아 있는 위에 한 단계 더 쌓는 구조입니다. Part 5 자산 사슬의 가치가 이번 클립에서 가장 잘 드러나요.

### 스킬이 스킬을 부르는 첫 사례

뉴스 칸은 새로 만들지 않습니다. Clip 6에서 만든 `naver-news` 스킬을 그대로 재호출해요.

```text
morning-briefing 본문
   ↓
1. nopal로 메일 5건 호출
2. nopal로 오늘 일정 호출
3. naver-news 스킬 재호출 (키워드: "클로드코드" 같은 본인 관심 키워드)
4. 받은 결과 3개를 HTML 대시보드 한 장으로 합치기
```

스킬은 폴더 단위로 모이는 자산이에요. 모아놓으면 새 스킬은 처음부터 다시 만들지 않고, 기존 스킬을 부르는 짧은 본문 + HTML 디자인만 추가하면 됩니다. 이번 클립이 그 첫 시연이에요.

### 슬래시 커맨드 결합 — 호출 두 가지 방식

같은 스킬을 두 가지로 부를 수 있습니다.

```text
[자연어 호출] description 자동 매칭
    "오늘 모닝 브리핑"
    "아침 브리핑 받자"
    "메일 일정 뉴스 한 번에"

[명시 호출] 슬래시 커맨드
    /morning-briefing
```

자연어는 description 키워드와 매칭되면 자동 발동돼요. 슬래시는 명시적이라 빠르게 부르기 좋습니다. 두 가지를 같이 두면 본인이 그때그때 편한 방식을 선택할 수 있어요.

슬래시 커맨드는 별도 파일로 만듭니다.

```text
~/fastcampus-cc/.claude/commands/morning-briefing.md
```

본문은 짧아요. "`morning-briefing` 스킬을 호출한다"는 한 줄만 들어가면 됩니다.

### 뉴스 소스 확장 (선택)

기본 흐름은 Clip 6 `naver-news` 재호출이에요. 본인 관심사가 투자가 아니라 "그날 알아야 할 일반 뉴스"라면, `daily-news` 같은 종합 헤드라인 스킬을 따로 만들어 뉴스 칸을 갈아 끼울 수 있습니다.

`naver-news`를 고치는 게 아니라(반도체 같은 특화 키워드 깊이를 유지) **새 스킬을 하나 더 만들어** `morning-briefing`이 골라 부르는 구조예요. 네이버 오픈 API엔 헤드라인 엔드포인트가 없으니까, 분야별 다중 검색 + 군집·보도량 랭킹으로 근사하면 됩니다.

### SessionStart hook 연결 — 자동 발동 미리보기

Part 5 Clip 4에서 만든 SessionStart hook을 변형하면, 매일 아침 클로드코드를 켤 때 자동으로 모닝 브리핑이 뜨게 만들 수 있어요.

```text
~/fastcampus-cc/.claude/settings.json
    SessionStart hook
        command: "morning-briefing 스킬 호출"
```

이렇게 두면 매일 아침 클로드코드 켜는 순간 한 화면 대시보드가 자동으로 떨어집니다. Part 5 자산이 매일 활용되는 형태예요. 이번 클립은 hook 연결을 미리보기만 보여주고, 실제 자동화는 본인이 원하는 시점에 추가하면 됩니다.

### 사전 준비 — nopal 플러그인 설치

플러그인 설치는 2줄.

```text
/plugin marketplace add fivetaku/gptaku_plugins
/plugin install nopal@gptaku-plugins
```

설치 후 클로드코드 재시작. 인증은 Part 5 GWS 자산이 그대로 살아 있어서 새로 받지 않습니다.

---

## 진행 흐름

### 1. `/part06` 호출 → Clip 9 선택

```text
/part06
```

자동 셋업이 자산을 확인합니다.

```text
✓ naver-news 확인 (재호출 가능)
✓ Part 5 실습20 GWS CLI 자산 확인 (nopal 재활용)
✓ nopal 확인 (GWS 자연어 오케스트레이션)
✓ ~/fastcampus-cc/50-my-work/Part06-스킬만들기/실습30-모닝브리핑스킬/ 준비 완료
✓ ~/fastcampus-cc/.claude/skills/morning-briefing/ 준비 완료
✓ ~/fastcampus-cc/.claude/commands/ 준비 완료
```

`naver-news`나 GWS CLI가 빠져 있으면 안내가 뜹니다. Clip 6 또는 Part 5 Clip 3를 먼저 마치고 다시 진행하세요.

### 2. STEP 1 — 워크플로우 잡기

```text
메일·일정·뉴스를 모아서 매일 아침 모닝 브리핑 만들려는데,
어떻게 워크플로우를 구성해야 할까?
```

정리되는 단계는 보통 이런 모습입니다.

```text
1. 3개 소스 동시 호출
   - 메일: nopal로 Gmail 안 읽은 5건
   - 일정: nopal로 오늘 일정
   - 뉴스: naver-news 스킬 재호출 (관심 키워드)
2. 결과 3개 받아오기
3. HTML 대시보드 한 장으로 합치기 (메일 / 일정 / 뉴스 3 섹션)
4. 브라우저로 자동 열기
5. 저장 (실습30/brief-{날짜}.html)
```

### 3. STEP 2 — 분리 정의 (3 소스 + 호출 두 방식)

```text
정리된 단계 보완하자.

[기존 자산 재호출]
- nopal — Gmail / Calendar 자연어 호출
- naver-news 스킬 — 뉴스 칸 재호출

[SKILL.md 본문 — 새로 작성할 부분만]
- 3 소스 동시 호출 + 결과 받기
- HTML 대시보드 디자인 (3 섹션 카드 + 모바일 반응형)
- 브라우저 자동 열기 (open 명령)

[슬래시 커맨드 — commands/morning-briefing.md]
- "morning-briefing 스킬 호출" 한 줄

자동 발동 미리보기:
- Part 5 Clip 4 SessionStart hook 변형 가이드만 안내 (실제 적용은 선택)
```

### 4. STEP 3 — 스킬 + 슬래시 커맨드 작성

```text
지금 정의한 분리 안대로 morning-briefing 스킬과 슬래시 커맨드를 만들어줘.

위치:
- ~/fastcampus-cc/.claude/skills/morning-briefing/SKILL.md
- ~/fastcampus-cc/.claude/commands/morning-briefing.md

SKILL.md description: "모닝 브리핑·아침 브리핑·오늘 시작·메일 일정 뉴스 한 번에" 키워드

SKILL.md 본문:
1. nopal 호출 (Gmail): "안 읽은 메일 5건 제목 + 보낸이 + 한 줄 요약"
2. nopal 호출 (Calendar): "오늘 일정 시간순"
3. naver-news 스킬 재호출 (키워드는 사용자 설정 또는 기본값 "클로드코드")
4. 3 결과를 HTML 대시보드로 묶기
   - 헤더: 오늘 날짜 + 인사 한 줄
   - 섹션 A: 메일 5건 (제목·보낸이·요약)
   - 섹션 B: 일정 (시간·제목·장소)
   - 섹션 C: 뉴스 5건 (제목·요약·링크)
   - 모바일 반응형
5. ~/fastcampus-cc/50-my-work/Part06-스킬만들기/실습30-모닝브리핑스킬/brief-{YYYYMMDD}.html 저장
6. 브라우저 자동 열기 (macOS: `open`, Linux: `xdg-open`, Windows: `start`)

commands/morning-briefing.md:
- description: "한 클릭 아침 브리핑"
- 본문: "morning-briefing 스킬을 호출하라"
```

### 5. STEP 4 — 호출 테스트

클로드코드 재시작 후 두 가지 방식 모두 테스트해보세요.

```bash
exit
claude
```

자연어 호출:

```text
오늘 모닝 브리핑
```

description 매칭되면서 스킬이 발동돼요. 진행 화면에서 3 소스가 차례로 호출되는 모습이 보입니다.

```text
1. nopal Gmail 호출 → 메일 5건 받음
2. nopal Calendar 호출 → 오늘 일정 받음
3. naver-news 스킬 재호출 → 키워드 뉴스 5건 받음
4. HTML 대시보드 합치는 중...
5. brief-{YYYYMMDD}.html 저장 + 브라우저 자동 열림
```

브라우저에 한 화면 대시보드가 떠야 합니다. 메일 카드 5개, 오늘 일정 표, 뉴스 카드 5개가 다 들어가 있어야 해요.

슬래시 커맨드 호출:

```text
/morning-briefing
```

같은 결과가 같은 자리에 떨어집니다. 자연어와 슬래시 둘 다 사용 가능한 게 확인되면 OK.

### 6. STEP 5 — SessionStart hook 연결 미리보기 + 본인 일 응용

매일 아침 자동 발동을 원하면, Part 5 Clip 4에서 만든 hook을 변형하세요.

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "echo '오늘 모닝 브리핑 받으시려면 /morning-briefing 입력하세요'"
          }
        ]
      }
    ]
  }
}
```

너무 무거운 자동화는 시작 시 느려질 수 있어서, hook은 "안내"만 띄우고 본인이 명시 호출하는 게 무난해요. 매일 자동 실행을 원하면 `/schedule`로 따로 등록하세요.

직무별 응용:

| 직무 | 추가하면 좋을 소스 |
|---|---|
| 마케팅 | 본인 브랜드 키워드 모니터링 + 광고 성과 (gws CLI Sheets) |
| PO | 스프린트 진도 (Linear/Jira MCP) + 팀 일정 |
| 영업 | 고객사 메일 우선순위 + 오늘 미팅 + 고객사 뉴스 |
| 학습 | 안 읽은 RSS + 오늘 학습 일정 + 관심 분야 새 논문 |

본인 일에 맞춰 SKILL.md 본문의 소스 호출 부분만 손보면 같은 흐름이 다른 도메인으로 갑니다.

---

## 결과물

이번 클립이 끝나면 아래가 남습니다.

| 결과물 | 위치 | 설명 |
|---|---|---|
| `SKILL.md` | `~/fastcampus-cc/.claude/skills/morning-briefing/SKILL.md` | 3 소스 통합 본문 |
| `morning-briefing.md` | `~/fastcampus-cc/.claude/commands/` | 슬래시 커맨드 (`/morning-briefing`) |
| `brief-{YYYYMMDD}.html` | `실습30-모닝브리핑스킬/` | 첫 호출 결과 대시보드 |

`완료` 또는 `/wrap`을 입력하면 `progress.json`의 `practice_completed`에 `"실습 30"`이, `skills_created`에 `"morning-briefing"`이, `commands_created`에 `"morning-briefing"`이 추가됩니다.

---

## 자주 막히는 포인트

| 증상 | 원인 | 해결 |
|---|---|---|
| `nopal 플러그인 확인되지 않음` | 미설치 | `/plugin marketplace add fivetaku/gptaku_plugins` 후 `/plugin install nopal@gptaku-plugins` |
| nopal 호출 시 인증 오류 | Part 5 GWS CLI 미연동 | Part 5 Clip 3로 돌아가 GWS CLI 인증 완료 후 재시도 |
| `naver-news` 재호출 안 됨 | Clip 6 미진행 또는 스킬 위치 오류 | `~/fastcampus-cc/.claude/skills/naver-news/SKILL.md` 존재 확인. 없으면 Clip 6부터 |
| 메일 5건이 빈 채로 옴 | Gmail 안 읽은 메일이 실제 0건 | 정상. 테스트면 임시 메일 한두 통 보내고 재호출 |
| 일정이 비어 있음 | Calendar에 오늘 일정 없음 | 정상. 캘린더에 테스트 일정 하나 만들고 재호출 |
| 뉴스 칸이 안 채워짐 | naver-news 키워드 미지정 | SKILL.md에서 기본 키워드 명시 또는 호출 시 AskUserQuestion |
| HTML 대시보드가 데스크탑에서만 예쁨 | 모바일 미디어 쿼리 누락 | "모바일 반응형 강제" 재요청 |
| 슬래시 커맨드 `/morning-briefing` 안 됨 | `commands/` 폴더 위치 오류 | `~/fastcampus-cc/.claude/commands/morning-briefing.md` 위치 확인. 클로드코드 재시작 필요 |
| 브라우저 자동 열림이 안 됨 | OS별 명령 차이 | macOS는 `open`, Linux는 `xdg-open`, Windows는 `start`. SKILL.md에 OS 분기 명시 |
| SessionStart hook에 무거운 명령 박음 | 시작이 느려짐 | hook엔 echo 안내만, 실제 호출은 사용자 명시 |
| 매일 자동 발행 원함 | hook은 일회성 아님 | `/schedule 매일 오전 8시 "오늘 모닝 브리핑"` 추가 등록 |

---

## 다음 클립

→ [Part 6 / Clip 10: 콘텐츠 파이프라인 — 6 STEP 풀 통합](#part-6-10-content-pipeline)

다음 클립이 Part 6의 마지막이에요. 지금까지 만든 스킬과 자산을 한 자루에 묶어 **콘텐츠 파이프라인** 한 스킬로 통합합니다. 한 마디 주제 입력 → 리서치 → 카드뉴스 기획 → 이미지 → HTML → TTS → Remotion 9:16 영상까지 6단계가 한 번에 굴러가요. Part 03에서 30분 걸리던 콘텐츠 작업이 5분으로 줄어드는 시연입니다.
