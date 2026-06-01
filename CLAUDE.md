# CLAUDE.md — 의리채팅 뱀서 (Vamsur)

> Claude Code가 매 세션 시작 시 자동으로 읽는 프로젝트 메모리.
> 더 깊은 맥락은 `CONTEXT.md`(전체 구조/메카닉), `HANDOFF.md`(최근 작업/백로그), `BALANCE_REPORT.md`(밸런스 분석) 참고.

---

## 프로젝트 한 줄 요약

친구 6명 인사이드 조크 픽셀 서바이벌 (뱀파이어 서바이버즈 스타일). 15분 생존 → 최종 보스 "협곡의 망령" 처치. HTML5 Canvas, 데스크탑 브라우저, **외부 의존성 0**.

- **단일 파일**: `index.html` (~4827줄, ~220KB) — 모든 코드가 여기 한 곳에
- **GitHub**: https://github.com/ckevin684/vamsur
- **워크플로우**: 파일 수정 → 브라우저 테스트 → **GitHub Desktop**으로 commit + push (커밋 메시지 한국어 OK)

---

## 작업 흐름 (중요)

1. `index.html` 수정
2. 브라우저에서 `file://`로 열어 테스트 (BGM은 file://에서 안 나올 수 있음 → **Firefox** 또는 GitHub Pages 배포 권장)
3. 만족하면 사용자가 **GitHub Desktop**으로 직접 commit + push (Claude가 git push 안 함 — 사용자가 GUI로)

> 이 폴더(`C:\Users\조규형\Documents\GitHub\vamsur`)는 git repo지만 워크플로우상 git CLI 대신 GitHub Desktop을 쓴다. 커밋/푸시는 사용자가 한다.

---

## 핵심 패턴: BAL 객체 (게임 config)

모든 튜닝 수치는 `index.html` 상단 **`const BAL={...}`** (601~713줄, `// ═══ BALANCE 중앙화 ═══` 섹션)에 모여 있다.
코드 곳곳에서 **`BAL.X.Y`** 형태로 참조 → 한 군데만 바꾸면 전체 반영.

**새 메카닉/튜닝 추가 시 황금 규칙**: BAL에 키를 먼저 정의하고, 코드에서 `BAL.X.Y`로 참조한다. 매직 넘버를 코드에 직접 박지 않는다.

BAL 구조:
- `BAL.char.{jh,jw,sm,gj,co,gh}` — 캐릭터별 시그니처 메카닉 수치
- `BAL.wpn.{ram,fullspec,knife,...}` — 무기 데미지 배수/속도/크기
- `BAL.beam.{shibuki,riko,huya,lize,tabi,sleep,hina,...}` — 윤소민 변신별 빔 효과
- `BAL.regen` — 회복 틱/전투 잠금
- `BAL.rouletteProb` — 룰렛 확률 (sleep 0.15 / hina 0.06 / each 0.158)
- `BAL.passive.{pill,bark,warrant,...}` — 패시브 아이템 레벨당 효과

---

## 캐릭터 6명 + 시그니처 메카닉

| ID | 이름 | 시작 무기 | 패시브 | 시그니처 메카닉 |
|---|---|---|---|---|
| `jh` | 준형전자 | 🖥️ 램 | 방어 +10% | 🔧 **AS 보증** — HP 25% 이하 자동 수리 (90s CD) |
| `jw` | 최종원 | 🔪 셰프나이프 | 시간↑공격↑ | 🍳 **주문 폭주** — 4s내 12킬 → 5s 공속 ×2 |
| `sm` | 윤소민 | 🔦 손전등(빔) | 이동 +15% | 🎰 **룰렛/변신 7종** — 30s마다 스텔라이브 변신 |
| `gj` | 최기종 | 🦯 지팡이 | 공격+40% 속도-30% | 💥 **이동 누적 → 분노 → 🦽휠체어 → 💉신경주사** |
| `co` | 최초 | 🐕 뭉치 | 크리 +20% | 🐕 **뭉치 컴패니언** — 추적/할퀴기/짖기 |
| `gh` | 황기훈 | 🪓 차지액스 | 보스 +25% | 🪓 **페이얼 게이지 → 도끼모드 → SAED 번개** |

> ⚠️ **CONTEXT.md의 최기종 설명은 일부 오래됨**: CONTEXT.md엔 "피격 통증 게이지(disc burst)"로 적혀 있지만, 현재 코드는 **이동 기반 게이지**(`BAL.char.gj.painPerMove`)로 바뀜 → 60초 이동 누적 시 분노 발동. HANDOFF.md + BAL이 최신 기준.

진화 페어 (EVOS):
- 🖥️램+🖥️AS보증서 → ⚡풀스펙 / 🔪셰프나이프+🍖비밀레시피 → 🔥풀코스
- 🔦손전등+📋순찰일지 → 🌙심야경계령 / 🦯지팡이+💊허리진통제 → 💜각성한 기종
- 🐕뭉치+🐕목줄 → 🐕뭉치 언리쉬드 / 🪓차지액스+☕백다방아아 → ⚡개방의 검

---

## 코딩 컨벤션

- **단일 HTML 파일**, 외부 의존성 0. JavaScript **골프 스타일** (압축 작성, `let a=1,b=2;function f(x){return x*2}`)
- **한국어 주석** 사용
- 변수 약어: `G`=2d ctx, `c`=canvas DOM, `LW/LH`=논리 화면크기(780×560), `p`=player, `e`=enemy, `pr/proj`=projectile, `w`=weapon slot, `dt`=delta time, `wlv`=weapon level
- 캐릭터별 특수 메카닉은 **Player 상태**로 관리 (`cbGauge`, `streamerForm`, `repairCd`, `rushT`, `discPain` 등)
- `fireWpn`에서 캐릭터 ID 체크해 분기 (`if(p.cd.id==='sm'&&p.streamerForm)`)
- **함정**: 새 `wt`(무기 타입) 추가 시 `Proj.draw`에 case 추가 안 하면 default(RAM 스틱)로 빠짐
- **해상도**: 모든 그리기는 `LW/LH` 논리좌표 사용 (`c.width/height` 직접 쓰지 말 것). `getMouse()`가 마우스를 논리좌표로 자동 변환

### 파일 내 코드 순서 (대략)
HTML/CSS → 화질/해상도 → AUDIO+BGM → HELPERS → SPRITES → **BAL(601~)** → DEFINITIONS(CHARS/WDEFS/EVOS...) → GAME STATE → Player → fireWpn → aoeHit/slashHit/spawnLightning → Proj → Enemy → Boss → Gem/Companion/draw헬퍼들 → triggerLvUp → WORLD → HUD → 화면함수들 → spawnEnemies → startGame/reset → 이벤트핸들러 → update/render/loop

---

## 자주 쓰는 명령

```powershell
# 줄 수 / 파일 크기 확인
(Get-Content "index.html" | Measure-Object -Line).Lines

# 브라우저로 테스트 (기본 브라우저)
start index.html
# BGM 테스트는 Firefox 권장
start firefox index.html
```

검색은 Grep 도구 사용 (예: BAL 정의 `const BAL`, 캐릭터 분기 `p.cd.id===`, 무기 발사 `fireWpn`, 그리기 `Proj.draw`).

---

## 적/보스

- 기본 적: zombie(0s) → bat(60s) → rusher(120s) → skeleton(200s) → tank(300s). 8% 엘리트(체력 2.2배)
- **추가 적 (VS 참고, 일반 호드)**: splitter(분열형, 200s+ · 죽으면 splitling 2마리로 쪼개짐), bomber(자폭형, 300s+ · 죽으면 반경 72 광역 폭발, 근접 처치 위험). 스프라이트는 둥근 형태로 휴머노이드와 구분. 생성자/die/draw 디스패치/spawnEnemies 테이블에 통합.
- 해골(skeleton): **정지 포탑형** — 사정거리(`BAL.enemy.skel.range`) 도달 시 그 자리 고정, 투사체 사격(가시성 높은 파란 마름모)
- 보스 4종 (시간 트리거): 3분 🐕싸비 / 6분 🖥️납품트럭 / 10분 😤불편러 / 15분 😡협곡의 망령
- 모든 보스: HP 50% 이하 시 페이즈2(+히트스톱·흔들림), 텔레그래프 후 공격. 처치 시 회복+폭탄+자석 드랍 + 히트스톱

---

## 메타 진행 / 신규 시스템 (이번 세션 추가)

- **메타 진행 (영구 업그레이드)**: 적/보스 처치로 🪙골드 적립(`runGold`) → 판 종료 시 `bankRun()`이 `META.gold`에 적립, **localStorage `vamsur_meta`** 저장. 타이틀 → `state='shop'` 강화 상점에서 구매.
  - `META={gold, up:{hp,dmg,spd,xp,crit,armor}, roulette}`, `META_UPGRADES` 정의(레벨당 효과+비용곡선), `ROULETTE_COST=300`
  - `applyMetaUpgrades(player)` — startGame에서 호출, 업그레이드를 플레이어 스탯에 적용 (jw는 `metaDmg`로 후반 스케일에 곱)
  - **룰렛 해금**: `META.roulette` → `rouletteOn(p)`가 소민 외 캐릭도 룰렛 허용. 비-소민은 `streamerBuff(p)`로 폼별 전무기 데미지 배율(소민은 빔 변신 정체성 유지)
  - 상점 UI: `renderShop()`/`getShopClick()`/`shopBuy()`, 타이틀 버튼 `action:'shop'`, ESC로 나가기
- **비주얼 juice**: `hitStop`(전역) — 보스 페이즈2/처치/큰 피격 시 짧은 정지. 데미지 숫자 펀치-인 스케일 팝 + 크리 금색 글로우
- **가시성**: 플레이어 발밑 식별 링(캐릭 색), 보스 상시 아우라(금/페이즈2 빨강)
- **디버그**: `godMode`(백틱 ` 키 토글 또는 콘솔 `godMode=true`) — 무적, HUD 배지

---

## 개발용 플레이테스트 하네스 (중요 — Claude가 직접 게임 구동/측정)

- `serve.ps1` (PowerShell 정적 서버, 관리자 권한·파이썬·노드 불필요) + `~/.claude/launch.json`(port 8777) → **Claude Preview MCP**로 게임을 직접 띄워 스크린샷/콘솔/eval 가능. (둘 다 dev 전용 — 배포엔 불필요, gitignore 후보)
- **DPS/TTK 측정**: `update(dt)`를 eval 루프에서 직접 스텝 → 실시간 대기 없이 전투 시뮬레이션. 불사 더미(보스/적링) 상대로 데미지 측정. 밸런스 before/after 정량 비교에 사용.
- 워크플로우: 코드 수정 → `location.reload()` (serve.ps1 no-store) → eval로 상태 세팅 + `render()` → 스크린샷. 백그라운드 탭은 rAF 스로틀되니 eval 안에서 `render()` 명시 호출 필요.

---

## 알려진 이슈 / 주의

- 🟢 Cowork의 "파일 truncation"·"bash 마운트 stale" 이슈는 **Claude Code엔 없음** (직접 파일 접근)
- 게임이 갑자기 멈추면 파일 끝(`</script></body></html>`)부터 확인
- BGM 자동재생은 브라우저 정책상 차단 → 사용자가 클릭해야 시작 (타이틀에서 처리)

---

## 다음 작업 후보 (백로그)

1. **보스 패턴 다양화** — 각 보스에 시그니처 메카닉 1개씩 (트럭=돌진, 불편러=시야차단, 망령=분신)
2. **메타 진행 확장** — 캐릭터 잠금해제, 하이스코어, 더 많은 업그레이드, 부활 아이템
3. **VTuber 룰렛 실제 이미지** — 현재 이모지(🦊🗡️🐲🦇🎤👑💤)
4. **램/풀스펙 단일 타겟** — 바운싱이라 보스에 약함(VS King Bible과 동일 특성). 필요 시 호밍/크기 조정 고려
- 기타: 모바일 터치, 실제 SFX 파일, 난이도 옵션, 골드 밸런스(현재 일반1/탱크3/엘리트5/보스45)

## 밸런스 측정 스냅샷 (v1.4.1+, dm=1·crit=0·Lv8, 방향성)
- 단일타겟 DPS: 풀코스>언리쉬드>각성기종>caff>심야 / 램·풀스펙 극저(바운싱)
- 군중 DPS: 언리쉬드·caff·풀코스·각성 상위 / 램·손전등 하위
- 진화/베이스 비율 전부 2.1~7.8× (진화 보상감 충분)
