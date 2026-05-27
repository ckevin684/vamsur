# 의리채팅 뱀서 (Vamsur) — 작업 컨텍스트

> 이 파일은 새 채팅 세션에서 작업을 이어가기 위한 핸드오프 문서입니다.
> 새 채팅 시작할 때 이 파일을 읽으라고 Claude한테 알려주세요.

---

## 📌 프로젝트 개요

**이름**: 의리채팅 뱀서 (Vamsur)
**장르**: 뱀파이어 서바이버즈 스타일 픽셀 서바이벌 액션
**플랫폼**: 브라우저 (HTML5 Canvas, 데스크탑 전용)
**컨셉**: 친구들끼리 농담으로 만든 인사이드 조크 게임. 6명의 친구가 캐릭터로 등장 (준형전자/최종원/윤소민/최기종/최초/황기훈).
**목표**: 15분간 살아남아 최종 보스 "협곡의 망령" 처치.

---

## 📁 파일 위치 / 작업 환경

### 작업 폴더 (이게 메인)
```
C:\Users\조규형\Documents\GitHub\vamsur\
├─ index.html                    ← 게임 본체 (~3800줄, 171KB)
├─ sprite_generator.html          ← 스프라이트 추출 도구 (참고용)
├─ bgm/
│  ├─ 캐릭선택창/Vinyl Choir.mp3      ← 타이틀/선택 화면 BGM
│  └─ 배경음악/                   ← 인게임 BGM 4개 (Suno AI로 생성, 게임 시작 시 랜덤 1개 무한반복)
│     ├─ Crack-Bound Heartbeat.mp3
│     ├─ Crack-Bound Heartbeat (1).mp3
│     ├─ Grave Circuit.mp3
│     └─ Grave Circuit (1).mp3
├─ README.md
├─ CONTEXT.md                    ← 이 파일
└─ .git/                         ← GitHub 추적
```

### 폐기된 폴더 (참조 X)
- `C:\Users\조규형\Desktop\의리채팅뱀서\` — 이전 작업 폴더. **이제 사용 안 함.** 안의 `push_to_github.bat`, `update_github.bat`, `index_v1_backup.html`도 불필요.

### GitHub
- Repo: https://github.com/ckevin684/vamsur
- 워크플로우: **GitHub Desktop** 사용
  - 파일 수정 → GitHub Desktop이 자동 감지 → Commit + Push
  - 한국어 지원 안 함, 영어 UI 그대로 사용

---

## 🎮 게임 시스템 (현재 완성된 것들)

### 캐릭터 6명 (CHARS 배열)
| ID | 이름 | 별명 | 시작 무기 | 패시브 효과 |
|---|---|---|---|---|
| jh | 준형전자 | 조립의 신 | 🖥️ 램 | 방어력 +10% |
| jw | 최종원 | 셰프 | 🔪 셰프 나이프 | 시간↑ 공격력↑ (시간 경과 시 데미지 증가) |
| sm | 윤소민 | 심야경비+버튜버 | 🔦 손전등 | 이동속도 +15% **+ 스텔라이브 변신 시스템** |
| gj | 최기종 | 허리디스크레전드 | 🦯 지팡이 | 공격+40% 속도-30% |
| co | 최초 | 뭉치 주인 | 🐕 뭉치 (컴패니언) | 크리티컬 +30% |
| gh | 황기훈 | 몬헌마스터 | 🪓 차지 액스 | 보스 데미지 +25% |

### 무기 시스템 (Vampire Survivors 스타일)
- 무기 슬롯 4개 / 아이템 슬롯 4개 (분리)
- 무기 Lv1-8, 아이템 Lv1-5
- 무기 MAX(8) + 페어 아이템 MAX(5) → 진화 가능
- 진화는 레벨업 카드에서 ✨진화 옵션으로 등장

**진화 페어 (EVOS):**
- 🖥️ 램 + 🖥️ AS보증서 → ⚡ 풀스펙
- 🔪 셰프 나이프 + 🍖 비밀레시피 → 🔥 풀코스
- 🔦 손전등 + 📋 순찰일지 → 🌙 심야경계령
- 🦯 지팡이 + 💊 허리진통제 → 💜 각성한 기종
- 🐕 뭉치 + 🐕 뭉치 목줄 → 🐕 뭉치 언리쉬드
- 🪓 차지 액스 + ☕ 백다방 아아 → ⚡ 개방의 검

### 적 5종
- **zombie** (기본) - 좀비, 0초~
- **bat** (60초~) - 박쥐, 빠르고 지그재그
- **rusher** (120초~) - 작고 빠른 분홍 좀비
- **skeleton** (200초~) - 해골, 가끔 뼛조각 던짐
- **tank** (300초~) - 거대 보라 좀비, 느리지만 단단
- 모두 8% 확률로 엘리트 (체력 2.2배 + 글로우)

### 보스 4종 (시간 트리거)
- 3분: 🐕 뭉치 (최초의 강아지 보스)
- 6분: 🖥️ 납품트럭 (준형전자 트럭)
- 10분: 😤 불편러 (말풍선으로 "이거 불편함..")
- 15분: 😡 협곡의 망령 (페이즈2 시 "ㅈ발 트롤..", LoL 트롤 컨셉)
- 모든 보스: 페이즈2 (HP 50% 이하 시), 텔레그래프 후 공격
- 처치 시: 회복 픽업 + 30% 폭탄 + 25% 자석 픽업 드랍

---

## 🔋 특수 메카닉 — 캐릭터별 핵심 시스템

### 1. 황기훈 — 🪓 차지 액스 (검/도끼 모드 + SAED)

플레이어 머리 위에 **5개 페이얼 점** 표시.

**검 모드 (기본):**
- 100° 부채꼴 초승달 슬래시 (반경 ~52px, 캐릭터 가까운 거리)
- 데미지 ~1.3배 (약함)
- 적 때릴 때마다 페이얼 게이지 충전 (Lv1: 2% / Lv8: 5.5% per hit)

**도끼 모드 (게이지 100% 도달 시 자동):**
- 140° 초승달 강타 (반경 ~72px)
- 데미지 ~4배 (강함)
- 5초간 시간 기반으로 게이지 자동 감소 (도끼 모드 유지)
- 0% 도달 시 자동 검 모드 복귀

**진화 (⚡ 개방의 검) — SAED:**
- 충전 속도 2배 / 도끼 모드 6초
- **도끼 휘두름마다 앞으로 번개 3발 빠빠빵 (0.15초 간격 쾅 쾅 쾅)**
- 노란 지그재그 번개 + 흰 코어 + 임팩트 폭발 + 천둥 SFX
- 보스 한 방 정리 가능

**관련 코드:**
- Player 상태: `cbGauge`, `cbMode`, `cbAxeT`, `cbAxeMax`
- 헬퍼: `slashHit()`, `spawnLightning()`
- UI: `drawPhialGauge()`

### 2. 최초 — 🐕 뭉치 컴패니언 (흰 코카 스파니엘)

발사형 아니라 **항상 따라다니는 컴패니언**.

- **1마리 고정** (진화 시 2마리)
- 흰 코카 스파니엘 외형 (긴 늘어진 귀 + 검은 단추 코)
- 적 자동 추적해서 깨물기 (380px 탐색 범위)
- **할퀴기 (Lv 2+)**: 확률로 추가타 콤보. 5개 굵은 발톱 자국 + "할퀴!" 텍스트
- **짖기 (Lv 3+)**: 주기적 광역 공격. 노란 충격파 링 + "멍!" 텍스트. 레벨 높을수록 자주
- **5~6초마다 강제 복귀**: 너무 멀리 안 나가게. 복귀 중 머리 위 🏃 표시
- Companion 클래스, `drawCocker()` 그리기

### 3. 윤소민 — 🔦 손전등 빔 + 🎰 스텔라이브 변신 룰렛

**손전등은 던지지 않고 들고 비추는 빔** — 쿨다운마다 "딸깍" 켜져서 콘 모양 빛이 가장 가까운 적을 향해 비춰지며, 콘 안의 적들에게 **틱 데미지** + **40% 슬로우** (`e.slow` 시스템 활용). 빔은 플레이어를 따라다니고, 적 방향으로 부드럽게(9rad/s) 조준 회전.

**30초마다 룰렛 → 변신 → 30초 유지 → 다시 룰렛**

**룰렛 진행 중 (2.6초)**: **게임 완전 정지** (적/공격/이동 다 멈춤)
**룰렛 종료 후**: 2.2초간 큰 결과 카드 표시 (이모지, 이름, 효과 한 줄)

**확률 분포 / 변신별 빔 차별화:**
- 🦊 텐코 시부키 (15%) — 주황 빔, 중간 폭(0.42rad), 틱마다 15% 확률 폭딜 추가타
- 🗡️ 유즈하 리코 (15%) — 에메랄드 좁고 빠른 빔(halfAng 0.24, tick 0.10s)
- 🐲 사키하네 후야 (15%) — 보라 매우 길고 좁은 레이저(len 400, halfAng 0.15), 강한 단발 틱
- 🦇 아카네 리제 (15%) — 빨간 빔, 슬로우 2.0초 길게, 처치 시 60% 확률 HP+3 흡혈
- 🎤 아라하시 타비 (15%) — 주황 빔 + 호밍 음표 동시 발사
- 💤 졸린 윤소민 (25% 꽝) — 회색 짧고 약한 빔, 30% 확률로 "불 안 켜짐"

**진화 (🌙 심야경계령)** — 빔 + 90px 360° 짧은 펄스. 변신 시 모든 빔이 더 길고(40px+) 빠른 틱(0.85x) + 슬로우 0.4초 길게.

**관련 코드:**
- STREAMER_FORMS, FORM_EFFECTS 상수
- Player 상태: `streamerForm`, `streamerT`, `rouletteT`, `rouletteResult`, `resultCardT`
- 헬퍼: `pickStreamerForm()`, `spawnBeam()`, `applyStreamerLight()`, `drawStreamerAccessory()`, `drawRouletteAnim()`, `drawResultCard()`
- `spawnBeam(p,ang,opts)` — 콘 빔 객체 (projs에 추가). opts: `{col,len,halfAng,life,dmg,tickInt,slowDur,wt,onHit,bigClick}`
- 빔은 `isAoe:true` 객체로 매 프레임 플레이어 따라가며, `tickInt`초마다 콘 안 적에게 데미지+슬로우 갱신
- 호밍 음표 (tabi만): wt `light_tb` (Proj.draw에서 ♪ 모양으로 렌더)
- 색상은 `this.col` 사용 (각 변신마다 다른 컬러)

### 4. 준형전자 — 🔧 AS 보증 (자가 수리)

**HP 위급 시 자동 발동 — 컴퓨터 조립공의 셀프 정비**

- HP 25% 이하로 떨어지면 자동 발동 (쿨다운 끝났을 때만)
- HP 0 이하 도달 직전엔 "긴급 부팅" 발동 (HP 55% 회복)
- 효과: 1.5초 무적 + HP 35% 회복 (긴급 시 55%)
- 쿨다운: 60초
- Player 상태: `repairCd`, `repairFx`
- 헬퍼: `triggerASRepair(emergency)`
- 시각: 파란 회로 글로우 링 + 머리 위 🔧
- HUD: 대시 옆 쿨다운 바

### 5. 최종원 — 🍳 주문 폭주 (콤보 트리거 폭발딜)

**5초 안에 8킬 연속 콤보 시 5초간 폭주 모드 — 주방 미친 셰프**

- 콤보 윈도우: 마지막 킬로부터 5초 안에 추가 킬해야 누적
- 8킬 도달 시 발동: 5초간 모든 무기 발사 속도 ×2 (cd 절반)
- 발동 중엔 새 콤보 카운트 안 함 (한 번에 1폭주)
- 기존 `dm = 1 + gameTime/120 * 0.7` (후반 데미지 스케일링)은 그대로 유지
- Player 상태: `rushT`, `rushKills`, `rushWnd`
- 헬퍼: `notifyKill()` (bumpCombo에서 호출)
- 시각: 머리 위 🍳 + 주황 글로우 + 잔여 시간 미니바
- HUD: 대시 옆 콤보 카운트 (대기 중 `🍳 X/8`) 또는 잔여 시간 (`🍳 X.Xs`)

### 6. 최기종 — 💥 디스크 폭발 (피격 통증 게이지)

**피격 누적이 한계 도달하면 자동 폭발 — 허리 디스크 발작**

- 피격 시 통증 게이지 충전: `(받은 dmg / mhp) × 2.5`
- 게이지 100% 도달 시 자동 발동: 반경 180px 광역 폭발, 데미지 베이스 × 4 + 슬로우
- 발동 시 0.8초 무적 + 게이지 0% 리셋
- 1초당 4% 자연 감소 (안 맞으면 천천히 빠짐)
- Player 상태: `discPain`, `discFx`
- 헬퍼: `triggerDiscBurst()`
- 시각: 머리 위 보라 게이지 바 (85% 이상 시 핑크색 + 펄스), 발동 시 보라 슬램 링
- HUD: 대시 옆 통증 게이지 (`💥 X%`)
- 컨셉: 탱키한 대신 느린 캐릭터가 맞으면서 점점 누적되는 시너지

---

## 🎨 시각/UX 시스템

### 해상도 시스템 (중요!)
- `LW=780, LH=560` — 게임 코드가 사용하는 **논리 좌표**
- `canvasScale` (1.5x 기본) — 캔버스 내부 해상도 배율
- `devicePixelRatio` 자동 곱해짐 (Retina 대응)
- `applyCanvasScale()` 함수가 모든 설정 적용
- `G.setTransform(scale, ...)`으로 모든 그리기 자동 스케일
- **모든 `c.width`/`c.height` → `LW`/`LH`로 교체됨** (124곳)
- 마우스 좌표는 `getMouse()`에서 자동으로 논리 좌표 변환

### 화면 구조
- **타이틀** (`state='title'`): 게임 시작 / 설정 버튼
- **설정 오버레이** (`settingsOpen=true`): BGM/SFX/화면 크기 슬라이더 + 자동 맞춤 토글
- **캐릭터 선택** (`state='select'`): 6명 카드
- **인게임** (`state='playing'`): 메인 게임
- **레벨업** (`state='levelup'`): 3장 카드 선택
- **결과** (`state='dead'` / `'win'`): 통계 화면

### HUD 구성
- **좌상단**: 캐릭터 패널 (미니 초상화 + 이름 + 레벨 + HP/XP 바 + 처치/콤보 + 대시 쿨다운)
- **상단 중앙**: 시계 (mm:ss)
- **우상단**: 무기 슬롯 4개 + 아이템 슬롯 4개 (분리 패널, 각 슬롯에 이름 + 레벨바 + L1~MAX 표시)
- **우중앙**: 윤소민 변신 인디케이터 (현재 변신 + 다음 룰렛 카운트다운)
- **우하단**: 미니맵 110×110 (적 빨강, 픽업 초록, 보스 깜빡 빨강, 보스 화면 밖이면 화살표)
- **좌하단**: 콤보 카운터 (3+ 콤보 시)
- **하단 중앙**: 보스 등장 시 보스 체력바
- **우하단 위**: 알림 (notify 함수, 슬라이드인)

### 일시정지 화면 (P/ESC)
- "⏸ PAUSED" 큰 글씨
- 두 컬럼: 무기 (왼쪽) | 아이템 (오른쪽), 각 4슬롯 표시
- 하단: ✨ 진화 조합법 6개 (색상 코딩: 진화 완료=초록 ✓, 가능=금색 ★, 진행 중=파랑 ▸, 미보유=회색 ○)
- 윈도우 포커스 잃으면 자동 일시정지

---

## 🔊 오디오 시스템

### BGM (HTML5 Audio)
- 타이틀/캐릭터 선택: `bgm/캐릭선택창/Vinyl Choir.mp3`
- 인게임: `bgm/배경음악/` 폴더 4곡 중 게임 시작 시 랜덤 1개 무한반복
- 헬퍼: `playBgm('title'/'battle')`, `stopBgm()`, `setBgmVol()`
- 첫 오토플레이 차단 대응: 사용자가 클릭해야 시작 (타이틀에서 처리)
- 절차적 BGM (기존) 비활성화됨 (`startBgm_OLD_DISABLED`)

### SFX (WebAudio)
- 절차적 (`tone()`, `noise()`)
- `sfxVol`로 일괄 볼륨 조절
- 주요 효과음: `SFX.shoot/hit/pHit/lvUp/gem/boss/evolve/over/win/bHit/elite/slash/thunder/phialReady`
- 실제 SFX 파일로 교체할 수도 있음 (아직 안 함)

---

## 🛠️ 기타 시스템 정리

| 시스템 | 키/트리거 | 설명 |
|---|---|---|
| 대시 | `Space` | 0.18초 4.5배속, 무적 0.28초, 쿨다운 3초 |
| 일시정지 | `P` / `ESC` | 완전 정지 + 빌드 + 진화 조합법 표시 |
| 콤보 | 자동 | 2.5초 내 연속 처치, 3+ 콤보부터 표시 |
| 픽업 | 엘리트 15% / 보스 보장 | 회복(35% HP) / 자석(전 젬 흡수) / 폭탄(반경 320 광역) |
| 데미지 숫자 | 자동 | 크리는 노란 "CRIT!" 표시, 큰 글씨 |
| 화면 흔들림 | `shake(t, m)` | 피격/보스킬/페이즈2 등 |
| 핏자국 데칼 | 적 사망 시 | 적 색깔별 다름, 15초 잔존 |
| 번개 날씨 | 8~15초 주기 | 푸른 플래시 + 천둥 노이즈 |
| 자동 일시정지 | 윈도우 blur | 탭/창 바꾸면 자동 멈춤 |

---

## 📋 최근 작업 / 결정 사항

### 마지막 세션 (이 채팅) 진행한 큰 변경:
1. **차지 액스 (황기훈)** 페이얼 게이지 + 검/도끼 모드 + SAED 번개 완성
2. **뭉치** 컴패니언 시스템 + 할퀴기/짖기 스킬 + 5~6초 강제 복귀
3. **윤소민** 스텔라이브 5명 + 꽝 룰렛 변신 시스템
4. **GitHub** 셋업 (현재 폴더에 git, GitHub Desktop 연동)

### 코딩 결정:
- 캐릭터별 특수 메카닉은 Player 상태로 관리 (`cbGauge`, `streamerForm` 등)
- fireWpn에서 캐릭터 ID 체크해서 특수 처리 분기 (`if(p.cd.id==='sm'&&p.streamerForm)`)
- 새 wt 추가 시 Proj.draw에 case 추가 안 하면 default(RAM 스틱)로 빠지는 버그 주의

---

## 🎯 다음에 할 수 있는 것들 (백로그)

### 아직 안 한 것:
- 다른 캐릭터들 (준형전자/최종원/최기종) 특수 메카닉 추가
- 실제 SFX 효과음 파일로 교체 (현재 모두 절차적)
- VTuber 룰렛에 실제 사진 사용 (namu wiki 이미지 사용 가능?)
- 모바일 터치 지원
- 하이스코어/메타 진행 (localStorage)
- 캐릭터 언락 시스템
- 새 보스 추가
- 새 적 종류
- 게임 난이도 옵션 (이지/노말/하드)

### 알려진 문제 / 개선:
- BGM 자동재생 차단 (브라우저 정책) → 사용자가 클릭해야 시작
- 크롬은 file:// 로컬에서 BGM 안 나올 수 있음 → Firefox 추천 또는 GitHub Pages 배포
- 게임 길이 (15분) 친구한테 보여주기엔 좀 김

---

## 💻 코딩 스타일 / 컨벤션

- **단일 HTML 파일** (외부 의존성 0)
- **JavaScript 골프 스타일** — `let a=1,b=2;function f(x){return x*2}` 형태로 압축 작성
- **한국어 주석** 사용
- **변수 약어**:
  - `G` = canvas 2d context
  - `c` = canvas DOM element
  - `LW`, `LH` = 논리 화면 크기
  - `p` = player
  - `e` = enemy
  - `pr` = projectile
  - `w` = weapon slot
  - `dt` = delta time
  - `wlv` = weapon level
- **파일 구조 순서**:
  1. HTML/CSS 헤더
  2. 화질/해상도 시스템
  3. AUDIO (tone/noise/SFX) + BGM 헬퍼
  4. HELPERS (dist/rnd/clamp/shade)
  5. SPRITES (sChar/sZombie/sBat/sSkel/sRusher/sTank/보스들)
  6. DEFINITIONS (CHARS/WDEFS/WLV/WPROJ/EVOS/PASSIVES/WUP/STREAMER_FORMS)
  7. GAME STATE (전역 변수들)
  8. Player 클래스
  9. WEAPON FIRE (fireWpn + applyStreamerLight + 헬퍼)
  10. aoeHit, slashHit, spawnLightning
  11. Proj 클래스
  12. Enemy 클래스
  13. Boss 클래스 + BDEFS
  14. Gem 클래스 + spawnParts + Companion + drawCocker + drawPhialGauge + drawStreamerAccessory + drawResultCard + drawRouletteAnim
  15. triggerLvUp
  16. WORLD (initWorld + drawWorld)
  17. HUD (drawBar + drawHUD)
  18. 타이틀/설정/캐릭선택/레벨업/결과 화면 함수들
  19. spawnEnemies
  20. startGame / reset
  21. 이벤트 핸들러 (mousemove/mousedown/mouseup/click/keydown)
  22. update / render / loop

---

## 🚀 새 채팅 시작할 때 할 일

1. Claude한테 이 파일 읽으라고 알려주기: "C:\Users\조규형\Documents\GitHub\vamsur\CONTEXT.md 읽어서 이전 작업 맥락 파악해줘"
2. 또는 GitHub repo URL 알려주기: https://github.com/ckevin684/vamsur
3. 작업 시작
4. 변경 후 GitHub Desktop으로 Commit + Push

---

## 📞 작업 흐름 요약

```
[수정 작업]
1. Claude한테 요청
2. Claude가 C:\Users\조규형\Documents\GitHub\vamsur\index.html 등 수정
3. 게임 테스트: index.html 브라우저로 열어보기

[GitHub 업로드]
1. GitHub Desktop 열기
2. Changes 탭에 변경 파일 자동 표시
3. Summary 입력 (한글 OK)
4. "Commit to main" 클릭
5. "Push origin" 클릭
6. 끝
```

---

*마지막 업데이트: 6명 캐릭터 전원 고유 액티브 메카닉 완성 (준형/최종원/최기종 추가) + 룰렛 감속/클릭 시스템*
*총 작업 시간: 약 60+ 세션, index.html ~4000줄*
