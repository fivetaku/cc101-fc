# 권한 모드 비교

> 권한 모드는 Claude Code가 어디까지 물어보고, 어디부터 알아서 움직일지 정하는 장치예요. 제가 입문자에게 먼저 보라고 하는 표는 이것입니다.

| 모드 | 자동차 비유 | 행동 | 추천 대상 |
|---|---|---|---|
| **Default** | 수동 기어 | 파일 수정·명령 실행마다 물어봄 | 처음 켠 사람, 안전 우선 |
| **Accept-edits** | 자동 기어 | 안전한 파일 편집은 자동, 위험한 행동은 확인 | **입문자 기본 추천** |
| **Plan** | 네비게이션 | 실행 전 계획부터 보여줌 | 복잡한 작업, 큰 변경 전 |
| **Auto** | 풀 자동 | 위험한 행동만 확인하고 대부분 진행 | Max 사용자, 반복 실습 |
| **Bypass** | 레이싱 모드 | 거의 묻지 않고 실행 | 익숙한 사용자, 격리된 작업 |

처음엔 **Accept-edits**가 제일 무난해요. 느리지 않으면서도 위험한 순간에는 멈춰서 물어봅니다.

## 전환 방법

바꾸는 방법은 짧아요. Status Line에서 현재 모드가 바뀌는지만 확인하세요.

| 조작 | 동작 | 메모 |
|---|---|---|
| `Shift+Tab` | `Default → Accept-edits → Plan → Default` 순환 | Status Line에서 현재 모드 확인 |
| `/powerup` | 권한 모드 학습 토픽 실행 | 처음에는 직접 체험 추천 |
| 실행 플래그 | Bypass로 시작 | 사이클에 없으므로 별도 실행 |

```bash
claude --dangerously-skip-permissions
```

## Alias 짧게 보기

alias는 긴 실행 명령을 짧게 부르는 별명입니다. 자주 켤수록 꽤 편해져요.

| 별명 | 실제 명령 | 용도 |
|---|---|---|
| `cc` | `claude` | 기본 실행 |
| `ccd` | `claude --dangerously-skip-permissions` | Bypass 바로 시작 |
| `ccr` | `claude --resume --dangerously-skip-permissions` | 이전 세션 이어서 Bypass |

처음에는 `cc`와 **Accept-edits** 조합이면 충분합니다. 큰 작업 전에는 **Plan**, 반복 작업에 익숙해졌을 때만 **Auto**나 **Bypass**를 고려합니다.

여전히 불안하면 Default나 Accept-edits로 돌아와서 한 번 더 시작해보세요. 안전하게 천천히 가도 됩니다.

## 🔗 관련 클립

[Part 2 / Clip 3](#part-2-03-first-run), [Part 2 / Clip 4](#part-2-04-modes-alias)
