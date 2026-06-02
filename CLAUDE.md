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
2. 검증 (프리뷰 하네스 등)
3. **Claude가 변경 묶음마다 `git commit` 직접 실행** (의미있는 한국어 메시지)
4. 사용자가 GitHub Desktop에서 **Push만** 직접

> ✅ **Claude는 `git commit`까지 한다** — 의미있는 변경 묶음마다 한국어 메시지로 자동 커밋.
> ⛔ **`git push`는 하지 않는다** — 푸시는 사용자가 GitHub Desktop으로 직접.
> (규칙 변경: 2026-06. 이전엔 커밋도 안 했으나 이제 커밋은 Claude가, 푸시만 사용자. 커밋 committer가 `unknown <ckevin@kaist.ac.kr>`로 박혀도 OK — 사용자 승인.)
>
> 이 폴더(`C:\Users\조규형\Documents\GitHub\vamsur`)는 git repo. 커밋은 git CLI로, 푸시는 GitHub Desktop으로.

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
- `BAL.rouletteProb` — 룰렛 확률 (sleep 0.10 / hina 0.12 / each 0.156)
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

## 🆕 이번 세션 추가/변경 (위 시스템 외 — 최신)

### 자동 패치 세션 (전적/픽업/밸런스 정비)
- **무기별 데미지 집계**: `dmgByWpn`(wt별) + `WFAM` 패밀리 라벨 → 결과화면 막대그래프. `totalDmg`/`dmgPeak`도. 모든 `hurt(v,crit,src)`에 src 전달(오버킬 제외).
- **하이스코어**: `META.best{time,kills,dmg,wins,plays}` localStorage 영속. `bankRun(win)`서 갱신, `runRecords`로 결과화면 🏆배지, 타이틀에 최고기록.
- **🪙 골드 코인 픽업(VS식)**: `Coin` 클래스, 처치 시 드랍→자석 흡수→`runGold`. 미수거분 `bankRun`서 자동정산(손실0).
- **난이도 옵션 = 제거됨** (복잡도↓, 사용자 요청). DIFFS/curDiff/META.diff 전부 삭제.
- **폭탄 너프**: 데미지 27%로 1위였음 → 레벨스케일 ×0.1→×0.04, 반경 320→260, 엘리트 랜덤드롭 제외(`PICKUP_TYPES`서 bomb 빠짐, 보스만 드롭).
- **진화무기 밸류↑**: 풀스펙 1.85·풀코스 1.7(+무한관통)·심야 1.6·각성 3.7·언리쉬 1.75·개방 axe 5.0. (폭탄 대신 진화가 주력이 되도록)
- **jw 주문폭주 쿨다운**: `rushCdT`(BAL.char.jw.rushCd=7) — 종료 후 7s간 콤보 안 쌓임(후반 상시발동 차단).
- **싸비 보스 돌진 풀차지**: chargeDur 0.35→0.9·spd 440→560 (거리 504 = 텔레레인 끝까지). 트럭 등 나머지는 유지.
- **미니맵 플레이어중심**: 버그였음(플레이어가 항상 world 0,0에 그려짐) → `rel()`로 플레이어 기준 상대좌표, ±750 줌인, 흰링+방향화살표.
- **비주얼**: 풀코스=🍣사시미 draw, 칼 텀블링 회전, 뭉치 짖기 `barkX/barkY` 위치고정+풀사거리링, 손전등 빔 `globalCompositeOperation='lighter'`(가산혼합, 적 가독성↑).
- **(소민 룰렛: 검증결과 이미 손전등 전용 — `streamerBuff(sm)=1`, 데미지 누수 없음)**

- **보스 시그니처 패턴** (구현 완료): 트럭/싸비 = 돌진(윈드업 정지 텔레그래프 = 반투명 위험레인+화살표 → 고속 락온 대시, ×1.6 강타), 불편러 = 시야차단 안개(`boss.fogT`), 망령 = 분신 소환(엘리트 러셔 3). `Boss.signature()` + `sigEvery/sigT/chargeWind/chargeT/chargeDir/fogT`.
- **💗 부활 메타 업그레이드**: `META.up.revive`(판당 최대 2회), 사망 시 HP50%+주변 넉백. `runRevives`로 카운트, `takeDmg` 분기.
- **아이템 슬롯 4→6** (`P_SLOTS=6`, 무기는 4). 렌더링 자동 대응.
- **상점 누적 총량 표시**: 각 `META_UPGRADES`에 `fmt(l)` → 상점에서 "현재 +24% → +32%" 금색 표시.
- **레벨업 무기 카드**: 데미지 배율(×N→×M)·투사체 수 증가 표시 (triggerLvUp wpnPool).
- **버그픽스**: 룰렛 확정 클릭 시 `for(k in keys)keys[k]=false` (이동 고정 방지).

## ⚖️ 현재 밸런스 값 (이번 세션 튜닝 결과 — 중요)

- **골드 = 🪙코인 바닥 픽업(VS식)**: 처치 시 `Coin`(class) 드랍 → 자석(`magr×1.15`)으로 흡수해야 `runGold` 적립. 값 보존: 일반 0.08·탱크 0.25·엘리트 0.45·보스 8개×1·새끼 0. (이전 즉시적립 → 픽업식으로 변경, 미수거분은 미적립). HUD·뱅킹 `Math.floor`. 한 판 ~1000골드, 만렙 ~6-8판.
- **기본 체젠**: `BAL.regen.base=1.2`(HP/초, 비전투) — 진통제 없어도 회복. 회복잠금 `combatLockDur=1.0`.
- **적 HP 곡선**: `hs= t<=600 ? 1+t*0.013 : min(8.8+(t-600)*0.002, 9.6)` — **10분 후 플래토(상한 9.6)**로 후반 폭주 억제. 11분 9.58→8.96.
- **🔑 11분 '벽'의 진짜 원인**: 측정 결과 **스폰율(~30/s) vs 무기 타격처리량(~12/s)** 문제. HP는 거의 무관(다발무기 처치량은 투사체수×발사속도로 캡). → **레버는 ①관통 ②스폰밀도**, HP는 보조.
- **스폰 밀도**: 후반 증량은 '벽'이라 롤백 → `cnt=min(3+wave*2, 15)` 고정. 10분부터 `spawnT` 하한 증가(`0.5+min(0.4,(t-600)/60*0.06)`)로 밀도↓ (스폰율 11분 ~26/s → 15분 ~19/s).
- **풀코스(진화) 무한관통**: `fan(...extraP=999...)` — 모든 적 관통. 강빌드 처치율 ~6×(2.8→16/s). 11분 벽 직접 완화.
- **해골 총알**: `pdmg = dmg*0.95` (0.6→0.95). 후반 탱키 캐릭에도 위협(가만히 5발 = 사망). dodge 가능(projSpd 150).
- **진행방향 도망통로**: 스폰 각도가 `player.facing` ±35°(0.61rad) 콘 안이면 50% 리롤 → 앞쪽 밀도 절반(측정 19.4%→10%).
- **룰렛 확률**: `BAL.rouletteProb` sleep **0.10** / hina **0.12** / each **0.156** (×5). (이전 0.15/0.06/0.158).
- **📞 야근 윤소민 이벤트**: 졸린 윤소민(sleep) **2연속**(소민 전용) 시 sleep 미적용 → 전화 컷신(`drawWorkCutscene`, `player.workCut` 1=사장/2=소민, 클릭 진행) → `WORK_FORM`(손전등 2개 30초 풀가동, `applyStreamerLight` case 'workmode'). 추적: `player.lastWasSleep`. 컷신/야근 중 update 정지(`workCut>0` 가드).
- **해골**: `BAL.enemy.skel` projSpd 150(플레이어 100~128 회피가능)·fire 4.5~8·스폰비중 200s+10%/300s+9%.
- **기종 dm 1.3** (1.4에서), **gj def 0.85**.
- **jh(준형전자) 약캐 버프**: 램 `BAL.wpn.ram.count` 1→**2**개 + `hitCd` 0.35→0.30. 측정 바닥DPS 6→24(co와 동급). ⚠️ 자동측정은 노이지(레벨업 정지·방향 RNG) — **실플레이 체감 검증 필요**. 타 캐릭(jw 후반강·gj AOE강)은 데이터 신뢰도 낮아 미조정.

## 🔑 핵심 난이도 인사이트 (다음 튜닝 시 필수 이해)

- **물량 벽 = 스폰속도 vs 처치속도**가 진짜 레버. 데미지 아님!
- **부채꼴/다발 무기는 투사체 수 × 발사속도로 처치량이 캡** → 공격력 더 박아도 처치 거의 안 늘어남(측정: dm 1.66↔2.4가 DPS 거의 동일). "공격력 max인데도 안 죽음"의 정체.
- **진화 = 3× 파워 게이트**(knife 5.6k→fullcourse 16k DPS). 진화 전이 가장 빡센 구간.
- 현재 처치/스폰 비율(5분): 비진화 **0.3**(압도됨) / 진화+보통빌드 **0.99**(본전) / 진화+강빌드 **1.61**(압도). → 의도된 곡선.

## ⚠️ 현재 미커밋 (다음 세션 전 사용자가 커밋해야 함)
- `index.html`: 위 "현재 밸런스 값" 전부 + 아이템6칸 + 상점총량/무기카드/룰렛 버그픽스
- `CLAUDE.md`: 이 문서
- (origin은 `2ac8db0`까지 동기화됨)

## 다음 작업 후보 (백로그)
1. **캐릭터 격차 정밀 튜닝** — jh 약한 시작무기(ram), sm/gh 후반형. 데이터+실플레이 필요
2. **메타 확장** — 캐릭터 잠금해제, 하이스코어, 골드 픽업(VS식 바닥코인)
3. **무기 6칸 옵션** (현재 아이템만 6) / 난이도 옵션 / 모바일·실 SFX
4. **VTuber 룰렛 실제 이미지** (현재 이모지)
