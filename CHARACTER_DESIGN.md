# CHARACTER_DESIGN.md — 뱀서 픽셀 스프라이트 디자인 바이블

> 친구 6명(기훈 제외) 픽셀 스프라이트 제작용. PixelLab 프롬프트 + 공유 스타일 스펙.
> 목표: 7명이 "같은 손에서 나온" 통일된 룩. 핵심은 **개별 퀄이 아니라 공유 규칙**.

---

## 🎨 공유 스타일 스펙 (7명 전부 동일하게 적용 — 통일감의 90%)

| 항목 | 값 | 이유 |
|---|---|---|
| 캔버스 | **96×96px** (PixelLab 무료 200px 이내) | 영웅형 디테일 살리는 최소 크기 |
| 비율 | **키 큰 6등신** (종원 실측: 머리 작게·다리 길게) | 치비 방지·통일 (4등신이라 적으면 머리 큰 치비됨!) |
| 시점 | **정면 3/4 뷰**, idle 서있는 포즈 | 서바이버 표준, 걷기모션 코드로 |
| 아웃라인 | **selout (색 외곽선)** — 굵은 검정 X | 레퍼런스와 동일, 부드럽고 고급 |
| 팔레트 | **차분한 레트로** (SNES JRPG 톤, 채도 한 단계 낮게) | 친구 답변 |
| 배경 | **투명** | 게임 합성용 |

### PixelLab에 넣는 공유 스타일 문장 (모든 캐릭 앞에 동일하게 붙이기)
```
pixel art character sprite, full body, front 3/4 view, idle standing pose,
tall realistic 6-head proportions, small head, long legs, adult body,
soft colored selout outlines (no hard black outline),
muted retro SNES-JRPG color palette, soft shading, transparent background, high detail
```
> 공유 Negative: `chibi, big head, super deformed, 2-head, 3-head, short legs, stubby, hard black outline, blurry`
> 이 문장은 **글자 하나 안 바꾸고** 6명 전부에 동일하게. 직업 소품만 아래에서 갈아끼움.
> ⚠️ 절대 "4-head/4등신" 쓰지 말 것 → 머리 큰 치비됨. 종원이 ≈6등신.

---

## 👥 캐릭터별 프롬프트 (6명)

### jh — 박준형 (준형전자 / 자작PC 수리맨)
> 친구들 컴퓨터 맨날 조립해주는 그 친구
```
+ a young Korean man, casual hoodie and jeans, holding a computer RAM stick
like a weapon, a screwdriver tucked in his pocket, a graphics card in the other hand,
friendly DIY PC-repair technician vibe
```

### jw — 최종원 (5성 호텔 셰프)
> 실제: 키 182 훤칠/슬림, 웨이브 단발, 안경X, 다부진 턱선 → "통통한 셰프" 디폴트를 마른 키로 눌러야 함
```
+ a tall, slim, lean athletic young Korean man (NOT chubby, slender build,
broad shoulders, long legs), short wavy black hair, clean-shaven with a sharp
defined jawline, fair skin, wearing a fitted slim white double-breasted chef
coat and tall white toque hat, holding a large gleaming chef's knife,
confident handsome five-star hotel chef
```

### sm — 윤소민 (경비 알바 + 버튜버 덕후)
> 실제: 통통한 편(마르지 않음), 20대 중반. 손전등=경비 손전등(빛X, 빔은 코드가 그림) + 한손엔 핸드폰
```
+ a tall stocky chubby young Korean man in his mid-20s, round face with a bit of
a belly but long legs, wearing a dark navy security guard uniform with a peaked
cap and a badge, holding a small black security flashlight (turned off, no light)
in one hand and a smartphone in the other hand, night-shift building guard
```
> Negative: chibi, big head, super deformed, 2-head, 3-head, short legs, stubby, skinny, thin, slim, light beam, glowing flashlight, lens flare, glow, hard black outline, blurry, glasses
> ⚠️ 공유 스펙(6등신)이 키 잡아줌. "chubby"는 배만 나오고 키는 유지되게 tall/long legs 같이. 키는 종원이랑 맞춰 고르기.
> ⚠️ 양손 2소품(손전등+폰)은 AI 난도 높음 → 여러 장 뽑아 best 고르기. 안 되면 폰 생략.

### gj — 최기종 (군대 디스크 / 군복)
> 지팡이 = 디스크 터진 허리
```
+ a weary Korean soldier in military camouflage uniform and field cap, leaning on
a wooden cane, one hand pressed on his lower back, herniated-disc posture
```

### co — 최초 (동네 아저씨 + 돌핀팬츠 + 강아지)
> 다들 아는 그 강아지 키우는 친구
```
+ a middle-aged neighborhood man, wearing a white tank top and shiny retro
"dolphin" gym shorts and slippers, relaxed ajussi vibe, a small fluffy white
dog (pomeranian) standing beside his feet
```

### zw — 지원이 (멸치 공익 + 주식고수)
> 비쩍 마른 해골美 + 주식 (소민이랑 정반대 — 마른 체형 강하게)
```
+ a very skinny gaunt pale young Korean man in his mid-20s with thin bony limbs
and a tired exhausted face, wearing a public-service worker safety vest over a
plain shirt, holding a smartphone showing a red and blue stock candlestick
chart, scrawny look
```
> Negative: chubby, fat, plump, muscular, buff, chibi, big head, short legs, stubby, hard black outline, blurry, glasses

---

## 🛠️ PixelLab 사용 팁 (무료로 6명 뽑기)

1. **해상도 고정**: 모든 캐릭 96×96(또는 128). 절대 섞지 말 것.
2. **팔레트 고정**: PixelLab 팔레트 락 기능 있으면 첫 캐릭에서 정한 팔레트를 6명 내내 재사용 → 통일감 ↑.
3. **한 세션에 몰아서**: 6명을 같은 날 같은 설정으로. "하나 잘 뽑고 다음에 또" = 따로 놀 위험.
4. **각 캐릭 10~20장 뽑아 best 고르기** (정석). 무료는 하루 5장(느린 생성)이라 며칠 나눠도 됨.
5. **무료로 1~2명 먼저 테스트** → 룩 확정되면 한 달 Tier1(~$9-12)로 6명+걷기애니 몰아 뽑고 해지.
6. 결과가 조금씩 안 맞으면 → 정규화 파이프라인(리사이즈+팔레트 통일)으로 후보정.

---

## ⏳ 보류: gh — 황기훈
씹덕겜 마스터 컨셉(원신·스타레일·명조 마스코트 스킬 룰렛). 비주얼보다 **메카닉 설계**가 먼저라 별도 진행.
베이스 외형(게이머 오타쿠 룩?) 확정 후 추가.
