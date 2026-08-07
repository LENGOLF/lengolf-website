/**
 * Per-locale translations for golf-course REGION HUB pages
 * (app/[locale]/golf-courses/[region]/page.tsx).
 *
 * This is a PLAIN data module — deliberately NOT `import 'server-only'` — so the
 * smoke test can import it to cross-check the translated-routes registry (see
 * scripts/smoke-test.ts, region-hub consistency check). For the same reason
 * `Region` is imported as a TYPE ONLY: a runtime import of lib/golf-courses
 * would trip that file's `import 'server-only'` guard and break the smoke test.
 *
 * `label` is intentionally translated (not passed through from REGION_META): the
 * localized place name is the SEO crux for these hubs — target queries are
 * 曼谷高尔夫球场 / バンコク ゴルフ場 / 방콕 골프장 / สนามกอล์ฟกรุงเทพฯ.
 *
 * Only regions with a published translation appear here. Adding a (region,
 * locale) below REQUIRES adding the matching '/golf-courses/<region>' entry to
 * that locale's staticRoutes in lib/translated-routes.ts — the smoke-test
 * region-hub consistency check fails CI in both directions if they drift.
 */
import type { Region } from '@/lib/golf-courses'

export interface RegionHubTranslation {
  /** Localized place name — translated (SEO crux), NOT the EN REGION_META label. */
  label: string
  /** Localized province / sub-region line (translated from REGION_META.province). */
  province: string
  /** Localized hero intro paragraph (translated from REGION_META.description). */
  description: string
}

type HubLocale = 'ja' | 'ko' | 'zh' | 'th'

export const REGION_HUB_I18N: Partial<
  Record<Region, Partial<Record<HubLocale, RegionHubTranslation>>>
> = {
  bangkok: {
    ja: {
      label: 'バンコク',
      province: 'バンコクと周辺県',
      description:
        'バンコクとその周辺県には、タイでも有数の名門ゴルフコースが揃っています。パトゥムタニのチャンピオンシップ級のレイアウトから、市内中心部から90分以内で行けるリゾートコースまで、幅広く楽しめます。',
    },
    ko: {
      label: '방콕',
      province: '방콕 및 주변 지역',
      description:
        '방콕과 주변 지역에는 태국 최고 수준의 골프 코스가 자리하고 있습니다. 빠툼타니의 챔피언십급 코스부터 시내 중심에서 90분 이내에 닿는 리조트 코스까지 다양하게 즐길 수 있습니다.',
    },
    zh: {
      label: '曼谷',
      province: '曼谷及周边府',
      description:
        '曼谷及其周边府拥有泰国一些最优质的高尔夫球场——从巴吞他尼的锦标赛级球场，到距离市中心90分钟车程以内的度假村球场，选择丰富。',
    },
    th: {
      label: 'กรุงเทพฯ',
      province: 'กรุงเทพฯ และจังหวัดโดยรอบ',
      description:
        'กรุงเทพฯ และจังหวัดโดยรอบเป็นที่ตั้งของสนามกอล์ฟที่ดีที่สุดแห่งหนึ่งของไทย ตั้งแต่สนามระดับแชมเปียนชิพในปทุมธานี ไปจนถึงสนามรีสอร์ตที่เข้าถึงง่ายภายในระยะเวลาไม่เกิน 90 นาทีจากใจกลางเมือง',
    },
  },
  phuket: {
    ja: {
      label: 'プーケット',
      province: 'プーケット',
      description:
        'プーケットのゴルフは、かつての錫鉱山跡地を生かしたドラマチックな地形、名だたるトーナメント開催コース、そして島の名高い海岸線沿いに広がるリゾートコースが特徴です。名門レッドマウンテンから、ジョニーウォーカー・クラシックの舞台となったブルーキャニオンのフェアウェイまで揃っています。',
    },
    ko: {
      label: '푸켓',
      province: '푸켓',
      description:
        '푸켓의 골프는 과거 주석 광산 부지를 활용한 극적인 지형, 상징적인 토너먼트 개최 코스, 그리고 섬의 이름난 해안선을 따라 자리한 리조트 코스로 유명합니다. 명성 높은 레드 마운틴부터 조니워커 클래식이 열린 블루 캐니언의 페어웨이까지 만나볼 수 있습니다.',
    },
    zh: {
      label: '普吉',
      province: '普吉',
      description:
        '普吉的高尔夫以昔日锡矿改造而成的壮观地貌、举世闻名的赛事球场，以及沿着岛上著名海岸线铺展的度假村球场著称——从备受赞誉的红山球场，到举办过尊尼获加精英赛的蓝色峡谷球道，应有尽有。',
    },
    th: {
      label: 'ภูเก็ต',
      province: 'ภูเก็ต',
      description:
        'วงการกอล์ฟภูเก็ตโดดเด่นด้วยภูมิทัศน์อดีตเหมืองแร่ดีบุกอันน่าตื่นตา สนามอันโด่งดังที่เคยเป็นเจ้าภาพจัดการแข่งขัน และสนามรีสอร์ตที่ทอดยาวตามแนวชายฝั่งอันโด่งดังของเกาะ — ตั้งแต่ Red Mountain ที่ได้รับการยกย่อง ไปจนถึงแฟร์เวย์ของ Blue Canyon ที่เคยจัดการแข่งขัน Johnnie Walker Classic',
    },
  },
  pattaya: {
    ja: {
      label: 'パタヤ',
      province: 'チョンブリー県・東部沿岸地域',
      description:
        'パタヤとタイ東部沿岸エリアには、国内でも指折りの素晴らしいゴルフコースが揃っています。アジアンツアーの大会を開催してきたチャンピオンシップコースをはじめ、海を望むシーサイドコースや、緑豊かな丘陵地に佇む会員制のプライベートクラブまで楽しめます。',
    },
    ko: {
      label: '파타야',
      province: '촌부리 및 동부 해안 지역',
      description:
        '파타야와 태국 동부 해안 지역에는 태국에서도 손꼽히는 멋진 골프 코스가 자리하고 있습니다. 아시안 투어 대회를 개최해 온 챔피언십 코스부터 바다가 보이는 해안 코스, 열대 구릉지에 자리한 회원제 프라이빗 클럽까지 다양하게 즐길 수 있습니다.',
    },
    zh: {
      label: '芭提雅',
      province: '春武里府及东部沿海',
      description:
        '芭提雅与泰国东部沿海地区坐拥全国一些最壮观的高尔夫球场——既有举办过亚巡赛的锦标赛球场，也有可眺望海景的海岸球场，还有隐于热带丘陵间的会员制私人俱乐部。',
    },
    th: {
      label: 'พัทยา',
      province: 'ชลบุรีและชายฝั่งทะเลตะวันออก',
      description:
        'พัทยาและชายฝั่งทะเลตะวันออกของไทยมีสนามกอล์ฟที่งดงามที่สุดแห่งหนึ่งของประเทศ ทั้งสนามระดับแชมเปียนชิพที่เคยเป็นเจ้าภาพจัดการแข่งขัน Asian Tour สนามริมทะเลที่มองเห็นวิวทะเล และคันทรีคลับสำหรับสมาชิกท่ามกลางเนินเขาเขตร้อน',
    },
  },
  'hua-hin': {
    ja: {
      label: 'ホアヒン',
      province: 'プラチュアップキリカン県・ペッチャブリー県',
      description:
        'ホアヒンとチャアムには、タイでも名高いゴルフコースが集まっています。ゴルフダイジェストのトップ100に選ばれたブラックマウンテンから、世界ランキングにも名を連ねるパイナップルバレーまで、いずれも山並みとタイ湾を望むロケーションに広がっています。',
    },
    ko: {
      label: '후아힌',
      province: '쁘라추압키리칸 및 펫차부리',
      description:
        '후아힌과 차암에는 태국에서도 이름난 골프 코스가 모여 있습니다. 골프 다이제스트 100대 코스에 선정된 블랙 마운틴부터 세계 랭킹에 오른 파인애플 밸리까지, 모두 산맥과 태국만을 배경으로 펼쳐집니다.',
    },
    zh: {
      label: '华欣',
      province: '巴蜀府及佛丕府',
      description:
        '华欣与差安坐拥泰国一些最负盛名的高尔夫球场——从入选《高尔夫文摘》百佳榜的黑山球场，到跻身世界排名的菠萝谷球场，皆坐落于群山与泰国湾的环抱之中。',
    },
    th: {
      label: 'หัวหิน',
      province: 'ประจวบคีรีขันธ์และเพชรบุรี',
      description:
        'หัวหินและชะอำเป็นที่ตั้งของสนามกอล์ฟที่มีชื่อเสียงที่สุดแห่งหนึ่งของไทย ตั้งแต่ Black Mountain สนามที่ติดอันดับ Golf Digest Top 100 ไปจนถึง Pineapple Valley สนามที่ติดอันดับโลก โดยทุกสนามตั้งอยู่ท่ามกลางแนวเทือกเขาและอ่าวไทย',
    },
  },
  'chiang-mai': {
    ja: {
      label: 'チェンマイ',
      province: 'チェンマイ県',
      description:
        'チェンマイには、タイ北部でも最もバラエティに富んだゴルフコースが揃っています。ガッサングループの個性豊かな3つのチャンピオンシップコースをはじめ、ピーター・トムソン設計のロイヤルチェンマイ、市街地にある27ホールのランナ、そしてドイ・インタノン国立公園に近くコストパフォーマンスに優れたチェンマイ・インタノンまで多彩です。いずれもバンコクから飛行機で短時間でアクセスできます。',
    },
    ko: {
      label: '치앙마이',
      province: '치앙마이',
      description:
        '치앙마이에는 태국 북부에서 가장 다채로운 골프 코스가 자리하고 있습니다. 가산 그룹의 개성 있는 3개 챔피언십 코스를 비롯해 피터 톰슨이 설계한 로열 치앙마이, 도심에 위치한 27홀 란나 코스, 그리고 도이 인타논 국립공원 인근의 가성비 좋은 치앙마이 인타논 리조트까지 만나볼 수 있습니다. 모든 코스가 방콕에서 비행기로 금방 닿는 거리에 있습니다.',
    },
    zh: {
      label: '清迈',
      province: '清迈府',
      description:
        '清迈拥有泰国北部最为丰富多样的高尔夫球场——从卡桑集团旗下三座风格迥异的锦标赛球场，到彼得·汤姆森设计的皇家清迈球场、位于市区的27洞兰纳球场，以及邻近因他侬国家公园、高性价比的清迈因他侬度假村。所有球场距曼谷仅有短途航程。',
    },
    th: {
      label: 'เชียงใหม่',
      province: 'เชียงใหม่',
      description:
        'เชียงใหม่มอบประสบการณ์กอล์ฟที่หลากหลายที่สุดของภาคเหนือ ตั้งแต่สนามแชมเปียนชิพทั้งสามแห่งอันมีเอกลักษณ์เฉพาะตัวของกลุ่ม Gassan ไปจนถึง Royal Chiang Mai ที่ออกแบบโดย Peter Thomson สนาม Lanna 27 หลุมใจกลางเมือง และ Chiangmai Inthanon รีสอร์ตคุ้มราคาใกล้อุทยานแห่งชาติดอยอินทนนท์ ทุกสนามอยู่ห่างจากกรุงเทพฯ เพียงเที่ยวบินระยะสั้น',
    },
  },
  // ── Structural-parity batch (2026-08) ────────────────────────────────
  // The remaining 9 regions, so every region in lib/golf-courses.ts REGIONS
  // has a hub in all four locales and no region funnel dead-ends at an
  // English hub. Facts are translated from REGION_META and nothing else —
  // where EN hedges ("around", "roughly"), the hedge is preserved.
  //
  // Proper-noun policy differs by locale ON PURPOSE. Do not "harmonize"
  // across locales — see docs/i18n-review-checklist.md.
  //   ja — transliterates course names (キリマヤ), matching its shipped hubs.
  //   th — keeps course/club/designer names Latin beside Thai geography,
  //        matching the shipped th hubs and th course prose.
  //   zh — course names Latin (Thai proper nouns with no circulating Chinese
  //        form; coining one would be invention), but PERSON names Sinicised
  //        with a Latin gloss (杰克·尼克劳斯（Jack Nicklaus）), matching
  //        彼得·汤姆森 in the shipped chiang-mai hub below.
  //   ko — course names Latin in THESE 9 only. This deliberately diverges
  //        from the 5 pre-2026-08 ko hubs (블랙 마운틴, 파인애플 밸리, 란나):
  //        those are globally famous courses with real KO search demand,
  //        whereas Rooks Korat / Wiang Ko Sai / Pakasai / Katathong / Mae Moh
  //        have none, so a coined Hangul form would match nothing a Korean
  //        golfer types. It also matches the roster table rendered directly
  //        below the hero, which is Latin because no ko course-detail
  //        translations exist. Do NOT retro-fit Latin onto the shipped five.
  //        Rule for future ko hubs: place names and Anglo personal names →
  //        Hangul; Thai-romanized course and person names → Latin; gloss an
  //        unfamiliar Hangul place name on first mention (빡통차이(Pak Thong
  //        Chai)).
  //
  // koh-samui carries EN's "around 1,000 THB" and therefore trips the
  // non-blocking price-as-of WARN in validate:i18n. REGION_META has no
  // as-of date; inventing one to silence a warning would be a fact addition,
  // so the WARN is accepted deliberately.
  'khao-yai': {
    ja: {
      label: 'カオヤイ',
      province: 'ナコンラーチャシーマー県・ナコンナーヨック県',
      description:
        'カオヤイと中央高原地帯には、バンコクから2〜3時間で行けるゴルフコースが揃っています。キリマヤとカオヤイ・ゴルフクラブのジャック・ニクラス・シグネチャー設計をはじめ、セベ・バレステロスがタイで唯一手がけたマウンテンクリーク、森に囲まれた手ごろな料金でラウンドできるボナンザとソウルサイアム、そしてパクトンチャイの老舗コース、ルークス・コラートまで多彩です。',
    },
    ko: {
      label: '카오야이',
      province: '나콘랏차시마 및 나콘나욕',
      description:
        '카오야이와 중부 고원 지대에는 방콕에서 2~3시간이면 닿는 코스가 모여 있습니다. Kirimaya와 Khao Yai Golf Club의 잭 니클라우스 시그니처 설계부터, 세베 바예스테로스가 태국에 남긴 유일한 코스 Mountain Creek, 부담 없는 요금으로 숲속 라운딩을 즐길 수 있는 Bonanza와 Seoul Siam, 그리고 빡통차이(Pak Thong Chai)의 오랜 역사를 지닌 Rooks Korat까지 다양하게 만나볼 수 있습니다.',
    },
    zh: {
      label: '考艾',
      province: '呵叻府及那空那育府',
      description:
        '考艾与中部高地的球场距曼谷2–3小时路程——从Kirimaya与Khao Yai Golf Club的杰克·尼克劳斯（Jack Nicklaus）签名设计，到塞维·巴列斯特罗斯（Seve Ballesteros）在泰国唯一的作品Mountain Creek，再到Bonanza与Seoul Siam价格亲民的林间球场，以及Pak Thong Chai的老牌球场Rooks Korat。',
    },
    th: {
      label: 'เขาใหญ่',
      province: 'นครราชสีมาและนครนายก',
      description:
        'เขาใหญ่และที่ราบสูงตอนกลางมีสนามกอล์ฟที่อยู่ห่างจากกรุงเทพฯ เพียง 2-3 ชั่วโมง ตั้งแต่สนาม Jack Nicklaus Signature ที่ Kirimaya และ Khao Yai Golf Club ไปจนถึง Mountain Creek สนามเดียวของ Seve Ballesteros ในประเทศไทย รอบกอล์ฟกลางป่าราคาย่อมเยาที่ Bonanza และ Seoul Siam และสนามเก่าแก่อย่าง Rooks Korat ในปักธงชัย',
    },
  },
  kanchanaburi: {
    ja: {
      label: 'カンチャナブリー',
      province: 'カンチャナブリー県・ラーチャブリー県',
      description:
        'カンチャナブリーとクウェー川流域には、タイでも屈指の趣あるゴルフコースが点在しています。渡し船でしか行けない秘境のジャングルコースをはじめ、水没したサファイア鉱山跡に造られた36ホールのリゾート、ボープロイのモータースポーツをテーマにしたレイアウト、そしてバンコクから90分圏内にあるジム・エングとAttanan Yomchinda設計の起伏に富んだ丘陵コースまで揃っています。',
    },
    ko: {
      label: '깐짜나부리',
      province: '깐짜나부리 및 랏차부리',
      description:
        '깐짜나부리와 콰이강 일대에는 태국에서도 손꼽히는 분위기 있는 골프 코스가 자리하고 있습니다. 페리를 타야만 닿을 수 있는 외딴 정글 코스부터, 물에 잠긴 사파이어 광산 위에 조성된 36홀 리조트, 보플로이(Bo Phloi)의 모터스포츠를 테마로 한 코스, 그리고 방콕에서 90분 이내 거리에 짐 엥(Jim Engh)과 Attanan Yomchinda가 설계한 험준한 구릉 코스까지 만나볼 수 있습니다.',
    },
    zh: {
      label: '北碧',
      province: '北碧府及叻丕府',
      description:
        '北碧与桂河沿线拥有泰国一些最具氛围感的高尔夫球场——从只能搭渡轮抵达的偏远丛林球场，到建在被水淹没的蓝宝石矿场上的36洞度假村球场，再到Bo Phloi的赛车主题球场，以及由Jim Engh与Attanan Yomchinda设计、距曼谷90分钟以内的崎岖山坡球场。',
    },
    th: {
      label: 'กาญจนบุรี',
      province: 'กาญจนบุรีและราชบุรี',
      description:
        'กาญจนบุรีและแนวลุ่มแม่น้ำแควเป็นที่ตั้งของสนามกอล์ฟที่มีบรรยากาศน่าจดจำที่สุดแห่งหนึ่งของไทย ตั้งแต่สนามกลางป่าอันห่างไกลที่เข้าถึงได้ด้วยเรือข้ามฟากเท่านั้น ไปจนถึงรีสอร์ต 36 หลุมที่สร้างขึ้นบนเหมืองไพลินที่ถูกน้ำท่วม สนามธีมมอเตอร์สปอร์ตในบ่อพลอย และสนามบนไหล่เขาอันขรุขระที่ออกแบบโดย Jim Engh และ Attanan Yomchinda ห่างจากกรุงเทพฯ ไม่เกิน 90 นาที',
    },
  },
  isan: {
    ja: {
      label: 'イサーン',
      province: 'コンケン県・ウドンターニー県・ノンカーイ県',
      description:
        'タイ北東部に広がる広大な高原地帯イサーンでは、コストパフォーマンスと景観の両面で振り切ったゴルフが楽しめます。コンケンにあるアジアンツアー基準のシンハーパークをはじめ、ウボンラット貯水池を見下ろすEGATのダムコースでの歩きのみのラウンド、ラオス国境に近いノンカーイのメコン川沿いのクラブ、そしてタイでは数少ないキャディーもカートも必須ではないコースまで揃っています。',
    },
    ko: {
      label: '이싼',
      province: '콘깬, 우돈타니 및 농카이',
      description:
        '태국 북동부의 광활한 고원 지대인 이싼은 가격과 풍광 모두 극단을 오가는 골프를 선사합니다. 콘깬의 아시안 투어 수준 코스 Singha Park, 우본라타나(Ubolratana) 저수지를 내려다보는 EGAT 댐 코스에서 걸어서만 도는 라운딩, 라오스 국경에 가까운 농카이의 메콩강변 클럽, 그리고 캐디도 카트도 의무가 아닌 태국에서 몇 안 되는 코스까지 만나볼 수 있습니다.',
    },
    zh: {
      // Geographic form first, transliteration glossed: 伊善高尔夫球场 has
      // effectively no ZH search demand and the transliteration is unsettled
      // (伊善/依善/伊森 all circulate), while the sibling labels in this batch
      // already use the geographic form (泰国北部, 泰国南部).
      label: '泰国东北部（伊善）',
      province: '孔敬府、乌隆他尼府及廊开府',
      description:
        '伊善——泰国广袤的东北部高原——把高尔夫的性价比与景致都推到了极致：孔敬的Singha Park达到亚巡赛级别，Ubolratana水库上方的EGAT水坝球场只能步行打球，廊开有一座紧邻老挝边境的湄公河畔俱乐部，还有全泰国屈指可数的、既不强制配球童也不强制用球车的球场之一。',
    },
    th: {
      label: 'อีสาน',
      province: 'ขอนแก่น อุดรธานี และหนองคาย',
      description:
        'อีสาน — ที่ราบสูงอันกว้างใหญ่ทางภาคตะวันออกเฉียงเหนือของไทย — มอบประสบการณ์กอล์ฟที่คุ้มค่าและงดงามอย่างถึงที่สุด ทั้ง Singha Park ในขอนแก่นที่ได้มาตรฐานระดับ Asian Tour รอบกอล์ฟแบบเดินอย่างเดียวที่สนามของ กฟผ. บนเขื่อนซึ่งอยู่สูงเหนืออ่างเก็บน้ำอุบลรัตน์ คลับริมแม่น้ำโขงในหนองคายใกล้ชายแดนลาว และหนึ่งในไม่กี่สนามของไทยที่ไม่บังคับทั้งแคดดี้และรถกอล์ฟ',
    },
  },
  'southern-thailand': {
    ja: {
      label: 'タイ南部',
      province: 'ソンクラー県・トラン県',
      description:
        'タイ南部のゴルフは、ペリー・ダイがジャングルの渓谷に設計したチャンピオンシップコース、サザンヒルズから始まります。南部でもさらに南のエリアで最も高く評価されるコースで、マレーシアから国境を越えて訪れるゴルファーの姿も目立ちます。このほか、ハートヤイ市街にはロバート・マクファーランド設計の手ごろなコース、トラン県には知る人ぞ知るスリトラン・ゴルフクラブがあり、後者は国内で最も安く18ホールを回れるコースのひとつです。',
    },
    ko: {
      label: '태국 남부',
      province: '송클라 및 뜨랑',
      description:
        '태국 남부의 골프는 페리 다이가 정글 계곡에 설계한 챔피언십 코스 Southern Hills에서 시작합니다. 남부 하단 지역에서 가장 높은 평가를 받는 코스로, 말레이시아에서 국경을 넘어오는 골퍼가 많습니다. 여기에 핫야이 시내의 저렴한 로버트 맥팔랜드 설계 코스, 그리고 태국에서 가장 저렴한 18홀 라운딩 중 하나로 꼽히는 뜨랑 주의 외진 Sri Trang Golf Club까지 이어집니다.',
    },
    zh: {
      label: '泰国南部',
      province: '宋卡府及董里府',
      description:
        '泰国南部的高尔夫横跨多种面貌：从佩里·戴（Perry Dye）在Southern Hills打造的丛林谷地锦标赛球场——下南部最受推崇的球场，来自马来西亚的跨境球友众多——到合艾市区那座由Robert McFarland设计的平价球场，再到董里府极为小众的Sri Trang Golf Club，那里是全国最便宜的18洞球场之一。',
    },
    th: {
      label: 'ภาคใต้',
      province: 'สงขลาและตรัง',
      description:
        'กอล์ฟในภาคใต้มีตั้งแต่ Southern Hills สนามระดับแชมเปียนชิพในหุบเขากลางป่าที่ออกแบบโดย Perry Dye ซึ่งเป็นสนามที่ได้รับการยกย่องมากที่สุดในภาคใต้ตอนล่างและมีนักกอล์ฟข้ามแดนจากมาเลเซียมาเล่นจำนวนมาก ไปจนถึงสนามราคาประหยัดที่ออกแบบโดย Robert McFarland ในตัวเมืองหาดใหญ่ และ Sri Trang Golf Club ในจังหวัดตรังที่อยู่นอกเส้นทางท่องเที่ยวอย่างแท้จริง ซึ่งเป็นหนึ่งในรอบ 18 หลุมที่ราคาถูกที่สุดในประเทศ',
    },
  },
  'koh-samui': {
    ja: {
      label: 'サムイ島',
      province: 'スラーターニー県',
      description:
        'サムイ島のゴルフは、性格の異なる2つの体験に分かれます。ひとつは島で唯一のチャンピオンシップコース、サンティブリ・サムイ・カントリークラブ。山がちなパー72で、カートを運転するキャディーの同伴が必須、タイ湾の眺めとバンコクエアウェイズ・オープン開催の実績を備えています。もうひとつはカオソック近くのラチャプラパダム・ゴルフコースで、EGATが運営する政府系コースのなかでもタイ有数の景観を誇り、外国人ゴルファーもチャオラン貯水池のほとりで18ホールを約1,000THBでプレーできます。',
    },
    ko: {
      label: '코사무이',
      province: '수랏타니',
      description:
        '코사무이의 골프는 성격이 전혀 다른 두 가지 경험으로 나뉩니다. 하나는 섬의 유일한 챔피언십 코스인 Santiburi Samui Country Club입니다. 산악 지형의 파72 코스로 캐디 동반이 필수이며 캐디가 카트를 운전하고, 태국만 전망과 Bangkok Airways Open 개최 이력을 갖췄습니다. 다른 하나는 카오속 인근의 Rajjaprabha Dam Golf Course로, 태국에서 가장 경치가 빼어난 EGAT 국영 코스 중 하나이며 외국인 방문객이 치여우란(Cheow Lan) 저수지 옆에서 18홀 풀라운딩을 약 1,000바트에 즐길 수 있습니다.',
    },
    zh: {
      label: '苏梅岛',
      province: '素叻他尼府',
      description:
        '苏梅岛的高尔夫涵盖两种截然不同的体验：岛上唯一的锦标赛球场Santiburi Samui Country Club——一座标准杆72的山地球场，强制配球童并由球童驾驶球车，可眺望泰国湾，还有Bangkok Airways Open的赛事底蕴——以及Khao Sok附近的Rajjaprabha Dam Golf Course，泰国景色最美的EGAT公营球场之一，外国球友在Cheow Lan水库畔打满18洞约需1,000泰铢。',
    },
    th: {
      label: 'เกาะสมุย',
      province: 'สุราษฎร์ธานี',
      description:
        'กอล์ฟบนเกาะสมุยแบ่งออกเป็นสองประสบการณ์ที่ต่างกันอย่างสิ้นเชิง หนึ่งคือ Santiburi Samui Country Club สนามแชมเปียนชิพแห่งเดียวของเกาะ สนามพาร์ 72 บนภูเขาที่กำหนดให้ต้องใช้แคดดี้ ซึ่งเป็นผู้ขับรถกอล์ฟให้ด้วย มีวิวอ่าวไทย และเคยเป็นเจ้าภาพจัดการแข่งขัน Bangkok Airways Open อีกหนึ่งคือ Rajjaprabha Dam Golf Course ใกล้เขาสก หนึ่งในสนามของหน่วยงานรัฐภายใต้ กฟผ. ที่มีทัศนียภาพงดงามที่สุดของไทย ซึ่งผู้เล่นชาวต่างชาติออกรอบครบ 18 หลุมได้ในราคาประมาณ 1,000 บาท ริมอ่างเก็บน้ำเชี่ยวหลาน',
    },
  },
  'chiang-rai': {
    ja: {
      label: 'チェンライ',
      province: 'チェンライ県',
      description:
        'チェンライのゴルフの中心は、サンティブリ・カントリークラブです。ロバート・トレント・ジョーンズ・ジュニアのシグネチャー設計で、タイ北部で最高のコースと広く評価されており、涼しい気候と美しい山並みをもたらす高原の丘陵地に広がっています。県内にはこのほか、個性の異なる3つの9ホールループを持つ27ホールのハッピーシティリゾート、渓谷に佇むウォーターフォードバレークラブ、そして隣接するプレー県のコストパフォーマンスに優れたウィアンコーサイもあります。チェンライはバンコクから飛行機でわずか1時間15分。2〜3ラウンドのゴルフ旅行を、連休で無理なく組み立てられます。',
    },
    ko: {
      label: '치앙라이',
      province: '치앙라이',
      description:
        '치앙라이의 골프는 Santiburi Country Club을 중심으로 펼쳐집니다. 로버트 트렌트 존스 주니어의 시그니처 설계로 태국 북부 최고의 코스로 널리 꼽히며, 이 지역 특유의 서늘한 기후와 수려한 산세를 만들어 내는 고산 구릉지에 자리하고 있습니다. 이 밖에도 개성이 뚜렷한 9홀 코스 3개로 이뤄진 27홀 Happy City Resort, 계곡에 자리한 Waterford Valley Club, 그리고 인근 프래 주의 가성비가 뛰어난 Wiang Ko Sai가 있습니다. 치앙라이는 방콕에서 비행기로 1시간 15분이면 닿아, 2~3라운드 골프 여행을 긴 주말 일정으로 무리 없이 소화할 수 있습니다.',
    },
    zh: {
      label: '清莱',
      province: '清莱府',
      description:
        '清莱的高尔夫以Santiburi Country Club为核心——这座小罗伯特·特伦特·琼斯（Robert Trent Jones Jr.）签名设计球场被广泛认为是泰国北部最好的球场——坐落在高地丘陵之间，正是这片地形带来了当地凉爽的气候与秀丽的山景。府内还有27洞的Happy City Resort，由3个各具特色的9洞环线组成；位于谷地的Waterford Valley Club；以及邻近帕府、性价比极高的Wiang Ko Sai。从曼谷飞往清莱只需1小时15分钟，用一个长周末打2–3场球轻松可行。',
    },
    th: {
      label: 'เชียงราย',
      province: 'เชียงราย',
      description:
        'กอล์ฟในเชียงรายมี Santiburi Country Club เป็นหัวใจหลัก สนาม Robert Trent Jones Jr. Signature ที่ได้รับการยอมรับอย่างกว้างขวางว่าเป็นสนามที่ดีที่สุดในภาคเหนือ ตั้งอยู่ท่ามกลางเนินเขาสูงอันเป็นที่มาของอากาศเย็นสบายและฉากหลังทิวเขาที่งดงามของภูมิภาคนี้ นอกจากนี้ในจังหวัดยังมี Happy City Resort สนาม 27 หลุมที่แบ่งเป็น 3 คอร์ส คอร์สละ 9 หลุม อันมีเอกลักษณ์ต่างกัน Waterford Valley Club ที่ตั้งอยู่ในหุบเขา และ Wiang Ko Sai ในจังหวัดแพร่ที่อยู่ใกล้เคียงซึ่งคุ้มค่าเป็นพิเศษ เชียงรายอยู่ห่างจากกรุงเทพฯ เพียงเที่ยวบินระยะสั้น 1 ชั่วโมง 15 นาที ทำให้ทริปกอล์ฟ 2-3 รอบในช่วงวันหยุดยาวสุดสัปดาห์เป็นเรื่องที่ทำได้ไม่ยาก',
    },
  },
  'north-misc': {
    ja: {
      label: 'タイ北部',
      province: 'ランパーン県と北部の遠隔地域',
      description:
        'タイ北部の最も奥まったゴルフは、年間にごくわずかのゴルファーしか訪れない県にまで広がっています。その代表格が、ランパーン県のメーモ・ゴルフコースです。石炭火力発電所に併設されたタイ唯一のゴルフコースで、広大なEGATメーモ発電所の敷地内に造られ、政府料金で一般に開放されています。タイ最大の発電施設をめぐる産業観光とラウンドを組み合わせたい方には、ほかにない目的地といえます。',
    },
    ko: {
      label: '태국 북부',
      province: '람빵 및 북부 오지 지역',
      description:
        '태국 북부의 가장 외진 골프는 매년 찾아오는 골퍼가 손에 꼽을 만큼 적은 지역까지 뻗어 있습니다. 대표 주자는 람빵의 Mae Moh Golf Course로, 석탄 화력 발전소에 자리한 태국 유일의 골프 코스입니다. 광대한 EGAT Mae Moh Power Station 단지 안에 조성되어 있으며 일반에도 국영 요금으로 개방됩니다. 태국 최대 발전 시설의 산업 관광과 라운딩을 함께 즐기고 싶은 골퍼에게 색다른 목적지입니다.',
    },
    zh: {
      label: '泰国北部',
      province: '南邦府及北部偏远各府',
      description:
        '泰国北部最偏远的高尔夫，深入到每年只有寥寥数位球友造访的府。其中的代表是南邦府的Mae Moh Golf Course——泰国唯一一座位于燃煤电厂的高尔夫球场，建在庞大的EGAT Mae Moh Power Station职工社区之内，并以公营价格对公众开放。对于想把一场球与泰国最大发电设施的工业旅游结合起来的球友来说，这是一个与众不同的目的地。',
    },
    th: {
      label: 'ภาคเหนือ',
      province: 'ลำปางและจังหวัดห่างไกลในภาคเหนือ',
      description:
        'กอล์ฟในพื้นที่ห่างไกลที่สุดของภาคเหนือทอดลึกเข้าไปในจังหวัดที่มีนักกอล์ฟแวะมาเยือนเพียงหยิบมือในแต่ละปี สนามที่โดดเด่นที่สุดคือ Mae Moh Golf Course ในลำปาง สนามกอล์ฟแห่งเดียวของไทยที่ตั้งอยู่ในโรงไฟฟ้าถ่านหิน สร้างขึ้นภายในเขตชุมชนโรงไฟฟ้าแม่เมาะอันกว้างใหญ่ของ กฟผ. และเปิดให้บุคคลทั่วไปเข้าเล่นในอัตราของหน่วยงานรัฐ นับเป็นจุดหมายที่ไม่เหมือนใครสำหรับนักกอล์ฟที่อยากผสานการออกรอบเข้ากับการท่องเที่ยวเชิงอุตสาหกรรมของโรงไฟฟ้าที่ใหญ่ที่สุดของไทย',
    },
  },
  'khao-lak': {
    ja: {
      label: 'カオラック',
      province: 'パンガー県',
      description:
        'カオラックとパンガー県は、プーケット空港から北へおよそ80kmのアンダマン海沿岸に位置します。プーケットから日帰りできる距離ながら雰囲気は大きく異なり、静かなビーチ、シミラン諸島でのダイビング、そしてゆったりとしたリゾートの空気が魅力です。中心となるコースはカタトーン・ゴルフリゾート＆スパ。2015年開場のパー72で、かつての錫鉱山跡の渓谷をダイナミックに切り開いたレイアウトは、この地域で最高のゴルフと広く評価されています。HKTに降り立ったゴルファーなら、コースまで60〜70分ほどでアクセスできます。',
    },
    ko: {
      label: '카오락',
      province: '팡응아',
      description:
        '카오락과 팡응아 주는 푸켓 공항에서 북쪽으로 약 80km 떨어진 안다만 해안에 자리합니다. 푸켓에서 당일치기로 다녀올 만큼 가깝지만 성격은 사뭇 달라서, 한적한 해변과 시밀란 제도 다이빙, 한결 느긋한 리조트 분위기를 즐길 수 있습니다. 대표 코스는 Katathong Golf Resort & Spa로, 2015년 조성된 파72 코스이며 극적인 옛 주석 광산 계곡을 가로질러 만들어져 이 지역 최고의 골프로 널리 평가받습니다. HKT로 들어오는 골퍼라면 약 60~70분이면 코스에 닿을 수 있습니다.',
    },
    zh: {
      // Glossed on purpose: bare 考拉 is also the common Chinese word for
      // "koala", and this label feeds GolfCourseRegion.metaTitle/heroHeading
      // (考拉高尔夫球场 would read as "Koala Golf Course" and compete with
      // koala results). The gloss disambiguates and catches the Latin query.
      label: '考拉（Khao Lak）',
      province: '攀牙府',
      description:
        '考拉（Khao Lak）与攀牙府位于安达曼海岸，在普吉机场以北约80公里处——近到可以从普吉当天往返，气质却截然不同：海滩更安静，可前往斯米兰群岛潜水，度假氛围也更加悠闲。当地的旗舰球场是Katathong Golf Resort & Spa，这座2015年落成、标准杆72的球场穿行于一处壮观的旧锡矿谷地，被普遍视为本地区最好的高尔夫球场。飞抵HKT的球友约60–70分钟即可抵达球场。',
    },
    th: {
      label: 'เขาหลัก',
      province: 'พังงา',
      description:
        'เขาหลักและจังหวัดพังงาตั้งอยู่บนชายฝั่งอันดามัน ห่างจากสนามบินภูเก็ตขึ้นไปทางเหนือราว 80 กิโลเมตร ใกล้พอที่จะไปกลับในวันเดียวจากภูเก็ต แต่มีเสน่ห์ที่ต่างออกไป ทั้งชายหาดที่เงียบสงบกว่า การดำน้ำที่หมู่เกาะสิมิลัน และบรรยากาศรีสอร์ตที่ผ่อนคลายกว่า สนามหลักของพื้นที่คือ Katathong Golf Resort & Spa สนามพาร์ 72 ที่เปิดในปี 2015 ซึ่งตัดผ่านหุบเขาอดีตเหมืองแร่ดีบุกอันน่าตื่นตา และได้รับการยกย่องอย่างกว้างขวางว่าเป็นสนามที่ดีที่สุดในภูมิภาคนี้ นักกอล์ฟที่บินลงสนามบิน HKT เดินทางถึงสนามได้ในเวลาประมาณ 60-70 นาที',
    },
  },
  krabi: {
    ja: {
      label: 'クラビ',
      province: 'クラビ県',
      description:
        'クラビのゴルフは、パカサイ・カントリークラブが中心です。県内で唯一の18ホールチャンピオンシップコースで、熱帯のゴム農園が広がる谷あいに位置し、フェアウェイの向こうには象徴的な石灰岩のカルスト地形がそびえます。アオナンとクラビ沿岸を訪れるゴルファーにとっては自然な選択肢で、島々のビーチ、シーカヤック、ロッククライミングと組み合わせれば、タイでも屈指の絶景が続くアンダマン海沿岸を存分に味わえます。',
    },
    ko: {
      label: '끄라비',
      province: '끄라비',
      description:
        '끄라비의 골프는 Pakasai Country Club을 중심으로 펼쳐집니다. 주 내 유일한 18홀 챔피언십 코스로, 열대 고무나무 농원 계곡에 자리하며 페어웨이 위로 상징적인 석회암 카르스트 지형이 솟아 있습니다. 아오낭과 끄라비 해안 일대를 찾는 골퍼에게 자연스러운 선택으로, 태국에서도 손꼽히는 안다만 해안 구간에서 섬 해변과 바다 카약, 암벽 등반을 라운딩과 함께 즐길 수 있습니다.',
    },
    zh: {
      label: '甲米',
      province: '甲米府',
      description:
        '甲米的高尔夫以Pakasai Country Club为中心——这是府内唯一的18洞锦标赛球场，坐落在热带橡胶园谷地之中，标志性的石灰岩喀斯特山峰在球道上方拔地而起。对于前往奥南以及甲米整片海岸线的球友来说，这里是顺理成章的选择：打一场球，再配上海岛沙滩、海上皮划艇，以及在泰国最壮丽的安达曼海岸线之一攀岩。',
    },
    th: {
      label: 'กระบี่',
      province: 'กระบี่',
      description:
        'กอล์ฟในกระบี่มีศูนย์กลางอยู่ที่ Pakasai Country Club สนามแชมเปียนชิพ 18 หลุมแห่งเดียวของจังหวัด ตั้งอยู่ในหุบเขาสวนยางพาราเขตร้อน โดยมีเขาหินปูนรูปทรงโดดเด่นอันเป็นเอกลักษณ์ตั้งตระหง่านอยู่เหนือแฟร์เวย์ สนามแห่งนี้จึงเป็นทางเลือกที่ลงตัวสำหรับนักกอล์ฟที่มาเยือนอ่าวนางและแนวชายฝั่งกระบี่โดยรอบ ผสานการออกรอบเข้ากับชายหาดบนเกาะ การพายเรือคายัคในทะเล และการปีนผา บนหนึ่งในแนวชายฝั่งอันดามันที่งดงามตระการตาที่สุดของไทย',
    },
  },
}

/**
 * Localized hub strings for a (region, locale), or null when no published
 * translation exists (caller falls back to the EN REGION_META values).
 */
export function getRegionHubTranslation(
  region: string,
  locale: string
): RegionHubTranslation | null {
  const byRegion = REGION_HUB_I18N[region as Region]
  if (!byRegion) return null
  return byRegion[locale as HubLocale] ?? null
}

/**
 * Every (locale, region) pair that has a published translation. Used by the
 * page's generateStaticParams (so only translated combos build) AND by the
 * smoke-test region-hub consistency check.
 */
export function getTranslatedRegionHubParams(): { locale: string; region: string }[] {
  const params: { locale: string; region: string }[] = []
  for (const region of Object.keys(REGION_HUB_I18N) as Region[]) {
    const byLocale = REGION_HUB_I18N[region]
    if (!byLocale) continue
    for (const locale of Object.keys(byLocale) as HubLocale[]) {
      params.push({ locale, region })
    }
  }
  return params
}

/**
 * Registry of COURSE DETAIL pages ([region]/[slug]) with published locale
 * variants. Same plain-module constraint as REGION_HUB_I18N above: the smoke
 * test imports this to cross-check lib/translated-routes.ts (course-detail
 * registry consistency check, section J3), so no `import 'server-only'` and
 * no runtime import of lib/golf-courses.
 *
 * Unlike the hubs, the localized STRINGS do not live here — they live on the
 * course file itself (`course.locales.th` in data/golf-courses/<region>/
 * <slug>.ts). This registry only declares WHICH courses build which locales,
 * feeding the [slug] page's generateStaticParams. Adding a (course, locale)
 * here REQUIRES adding the matching '/golf-courses/<region>/<slug>' entry to
 * that locale's staticRoutes in lib/translated-routes.ts — the smoke-test
 * course-detail consistency check fails CI in both directions if they drift.
 */
type CourseDetailLocale = 'th' | 'ja'

export const COURSE_DETAIL_I18N: {
  region: string
  slug: string
  locales: readonly CourseDetailLocale[]
}[] = [
  { region: 'bangkok', slug: 'sai-golf-club', locales: ['th', 'ja'] },
  { region: 'bangkok', slug: 'the-legacy-golf-club', locales: ['th', 'ja'] },
  { region: 'chiang-mai', slug: 'lanna-golf-course', locales: ['th', 'ja'] },
  // Batch 2 (2026-08) — top course pages by GSC impressions (90d) within
  // regions whose hubs are translated for both locales. Suvarnabhumi (1,319
  // imp) deliberately excluded pending the Phoenix Gold slug merge.
  { region: 'bangkok', slug: 'pinehurst-golf-country-club', locales: ['th', 'ja'] },
  { region: 'bangkok', slug: 'siam-country-club-bangkok', locales: ['th', 'ja'] },
  { region: 'bangkok', slug: 'ayutthaya-golf-club', locales: ['th', 'ja'] },
  { region: 'bangkok', slug: 'muang-ake-golf-course', locales: ['th', 'ja'] },
  { region: 'phuket', slug: 'blue-canyon-lakes-course', locales: ['th', 'ja'] },
  { region: 'phuket', slug: 'phuket-country-club', locales: ['th', 'ja'] },
  { region: 'pattaya', slug: 'wangjuntr-golf-park', locales: ['th', 'ja'] },
  // Batch 3 (2026-08) — GSC-demand picks within translated-hub regions:
  // Alpine (compare-page 656 imp + TH "alpine golf club ราคา" queries),
  // Nikanti (~1,400 imp across guide + name queries), Royal Gems ("the rg
  // city golf club" 110 imp + TH ราคา queries), Burapha (JPN-geo demand),
  // Laem Chabang ("laem chabang international country club prices" 70 imp).
  // Suvarnabhumi still excluded — see the Batch 2 note above.
  { region: 'bangkok', slug: 'alpine-golf-club', locales: ['th', 'ja'] },
  { region: 'bangkok', slug: 'nikanti-golf-club', locales: ['th', 'ja'] },
  { region: 'bangkok', slug: 'royal-gems-golf-sports-club', locales: ['th', 'ja'] },
  { region: 'pattaya', slug: 'burapha-golf-club', locales: ['th', 'ja'] },
  { region: 'pattaya', slug: 'laem-chabang-international', locales: ['th', 'ja'] },
]

/**
 * Every (locale, region, slug) triple with a published course-detail
 * translation. Used by the [slug] page's generateStaticParams (so only
 * translated combos build) AND by the smoke-test course-detail consistency
 * check.
 */
export function getTranslatedCourseDetailParams(): {
  locale: string
  region: string
  slug: string
}[] {
  const params: { locale: string; region: string; slug: string }[] = []
  for (const entry of COURSE_DETAIL_I18N) {
    for (const locale of entry.locales) {
      params.push({ locale, region: entry.region, slug: entry.slug })
    }
  }
  return params
}

/**
 * '/golf-courses/<region>/<slug>' paths with a published translation for
 * `locale`. Consumed by the smoke test's course-detail registry consistency
 * check (section J3), which set-diffs it against
 * getRegisteredCourseDetailPaths from lib/translated-routes.ts.
 */
export function getTranslatedCourseDetailPaths(locale: string): string[] {
  return COURSE_DETAIL_I18N.filter((e) =>
    (e.locales as readonly string[]).includes(locale)
  ).map((e) => `/golf-courses/${e.region}/${e.slug}`)
}
