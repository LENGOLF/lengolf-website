/**
 * Per-slot script census for course-detail translations.
 *
 * Answers the question a diff CANNOT answer: is each locale's text actually in
 * that locale's language, and is every required field present and non-blank?
 *
 * Catches, by construction:
 *   - whole-slot swap (a zh paragraph landing in the `th` field)
 *   - PARTIAL slot swap (a zh sentence spliced into an otherwise-correct block)
 *   - a dead builder's partial block (th/ko written, ja absent)
 *   - whitespace-only / empty fields (which beat the EN fallback via `??`)
 *   - missing prose fields, or prose omitted entirely
 *
 * Usage: npm run validate:course-slots [-- <region> [slug ...]]
 *        (no args = every region with at least one translated course)
 *        npm run validate:course-slots -- --self-test
 */
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { COURSE_DETAIL_I18N } from '../data/golf-courses-i18n'

const ROOT = process.cwd()
const LOCALES = ['th', 'ko', 'zh', 'ja'] as const
const PROSE_FIELDS = [
  'overview',
  'layout_and_experience',
  'tips',
  'location_and_access',
  'rental_cta_context',
] as const

type Loc = (typeof LOCALES)[number]

/**
 * Script membership, used by BOTH the dominance counters and the run detector.
 * They were two separate range sets in the first version, which made a single
 * `ㄱ` a hard error under one rule and invisible neutral punctuation under the
 * other. One definition each, no drift.
 *
 * `han` spans CJK Ext A and the compatibility block as well as the BMP core, so
 * a rare character cannot slip past as "neutral". `kana` DELIBERATELY excludes
 * U+30FB `・` and U+30FC `ー`: both are punctuation-class marks, and counting
 * them as kana let a Chinese paragraph with a `・` every 20 characters satisfy
 * ja's kana-presence rule and reset its Han runs.
 */
const SCRIPT = {
  thai: (c: string) => /[฀-๿]/u.test(c),
  hangul: (c: string) => /[가-힯ᄀ-ᇿ㄰-㆏]/u.test(c),
  kana: (c: string) => /[ぁ-ゟァ-ヺヽ-ヿ]/u.test(c),
  han: (c: string) =>
    /[㐀-䶿一-鿿豈-﫿]|[\u{20000}-\u{2ffff}]/u.test(c),
}
const bearing = (c: string) =>
  SCRIPT.thai(c) || SCRIPT.hangul(c) || SCRIPT.kana(c) || SCRIPT.han(c)

function count(s: string, is: (c: string) => boolean) {
  let n = 0
  for (const ch of s) if (is(ch)) n++
  return n
}

/**
 * Clause boundaries. Runs do not cross these.
 *
 * This is what makes the run detector safe on ordinary CJK copy: a comma-listed
 * kanji noun phrase (`練習場、宿泊施設、会議室、日本語対応受付…`) is not one
 * 35-character run, it is four short ones. Without this the longest LEGITIMATE
 * ja run in the shipped corpus is 10 and a plain three-item route list measures
 * 24, so any threshold low enough to catch a splice also fired on real copy.
 * With it the longest legitimate ja run drops to 7 (`野生動物保護区`) and
 * th/ko/zh to 0 — measured over the then-1,708-string corpus, not assumed.
 */
const CLAUSE_BREAK = /[、。，．！？：；…「」『』（）〔〕【】〈〉《》・ー—―～〜／·]/u

/**
 * Longest CONTIGUOUS run of characters foreign to this locale.
 *
 * Quoted foreign terms are SHORT; a swapped sentence is long. Latin, digits and
 * ASCII punctuation are skipped as NEUTRAL rather than breaking a run — they
 * appear legitimately inside every locale's copy (addresses, brand names,
 * yardages), so breaking on them would let `球场1位于2华欣3镇` smuggle a whole
 * clause past in four-character pieces. Native script and clause punctuation do
 * break runs.
 */
function longestRun(s: string, isForeign: (c: string) => boolean): { len: number; text: string } {
  let best = 0
  let cur = 0
  let bestTxt = ''
  let curTxt = ''
  for (const ch of s) {
    if (CLAUSE_BREAK.test(ch)) {
      cur = 0
      curTxt = ''
      continue
    }
    if (isForeign(ch)) {
      cur++
      curTxt += ch
      if (cur > best) {
        best = cur
        bestTxt = curTxt
      }
    } else if (bearing(ch)) {
      cur = 0
      curTxt = ''
    }
    // else: neutral (Latin/digit/ASCII punctuation) — neither extends nor breaks
  }
  return { len: best, text: bestTxt }
}

/**
 * Characters that are foreign to each locale's script.
 *
 * `ja` is listed here too — an EARLIER version returned before consulting this
 * map for ja, which made a Thai sentence spliced into a ja block invisible up to
 * the host slot's OWN kana count, because ja's only Thai rule is a dominance
 * test against total kana. Measured across the 427 shipped ja strings under
 * THIS FILE'S OWN `SCRIPT.kana` (which excludes `ー`) that ceiling is 171
 * characters in `location_and_access` — the field the CAVEAT below names —
 * and 479 at the corpus maximum. An earlier revision said 185/510, measured
 * counting `ー` as kana, i.e. contradicting the SCRIPT docblock above it.
 * Han is absent from the ja row because Han is legal Japanese; that case is the
 * separate kana-free-run rule below.
 */
const FOREIGN: Record<Loc, (c: string) => boolean> = {
  th: (c) => SCRIPT.han(c) || SCRIPT.hangul(c) || SCRIPT.kana(c),
  ko: (c) => SCRIPT.han(c) || SCRIPT.kana(c) || SCRIPT.thai(c),
  zh: (c) => SCRIPT.kana(c) || SCRIPT.hangul(c) || SCRIPT.thai(c),
  ja: (c) => SCRIPT.thai(c) || SCRIPT.hangul(c),
}

/**
 * Thresholds, measured against the whole shipped corpus rather than guessed.
 *
 * Longest LEGITIMATE run with clause-breaking on: `th 0 · ko 0 · zh 0 · ja 0`
 * for these foreign sets. 8 therefore has the entire corpus beneath it.
 *
 * What it CATCHES, measured the same way: splicing any one of the 427 shipped
 * zh strings into another locale produces a Han run of at least 8 (min 8,
 * median 18), so a whole-string swap is caught 100% of the time; at the
 * single-SENTENCE level 95% of zh sentences (1,550/1,639) clear 8, against 74%
 * at 12. Lowering this from the first version's 12 to 8 strictly improved both
 * sides — there was no legitimate run between 0 and 12 to protect.
 */
const FOREIGN_RUN_MAX: Record<Loc, number> = { th: 8, ko: 8, zh: 8, ja: 8 }

/**
 * ja needs its own rule because Han is legal Japanese: the signal is not foreign
 * script but a long stretch of Han with NO kana in it. Legitimate maximum in the
 * corpus is 7 (`野生動物保護区`), so 12 keeps five characters of headroom while
 * still reaching three quarters of single zh sentences. A whole-slot zh→ja swap
 * does not depend on this number at all — the kana-absence dominance rule below
 * catches it outright.
 */
const JA_KANA_FREE_HAN_MAX = 12

/** Whole-slot dominance, then partial-splice runs. */
function judge(loc: Loc, s: string): string | null {
  const thai = count(s, SCRIPT.thai)
  const hangul = count(s, SCRIPT.hangul)
  const kana = count(s, SCRIPT.kana)
  const han = count(s, SCRIPT.han)

  if (loc === 'th') {
    if (thai === 0) return `no Thai characters at all (han=${han} kana=${kana} hangul=${hangul})`
    // A quoted term of art in another script is fine; domination is not.
    if (han > thai) return `Han (${han}) outnumbers Thai (${thai}) — suspected zh text in a th slot`
    if (hangul > thai) return `Hangul (${hangul}) outnumbers Thai (${thai})`
  }
  if (loc === 'ko') {
    if (hangul === 0) return `no Hangul at all (han=${han} kana=${kana} thai=${thai})`
    if (han > hangul) return `Han (${han}) outnumbers Hangul (${hangul}) — suspected zh text in a ko slot`
    if (kana > 0 && kana > hangul) return `kana (${kana}) outnumbers Hangul (${hangul})`
  }
  if (loc === 'ja') {
    // Han is legal in Japanese, so dominance is BLIND to zh->ja. Kana is the
    // only discriminator — this mirrors checkScript's ja-only kana rule.
    if (kana === 0 && han >= 15) return `${han} kanji and ZERO kana — suspected zh text in a ja slot`
    if (kana === 0) return `no kana at all (han=${han})`
    if (thai > 8 && thai > kana) return `Thai (${thai}) outnumbers kana (${kana})`
  }
  if (loc === 'zh') {
    if (han === 0) return `no Han characters at all (kana=${kana} hangul=${hangul} thai=${thai})`
    // Zero tolerance, and it is an editorial rule rather than a heuristic:
    // Chinese renders Japanese and Korean proper nouns in Han (東京 not とうきょう,
    // 首爾/首尔 not 서울), so kana or Hangul in zh copy is either a splice or a
    // quoted term of art. See the CAVEAT below before reusing this elsewhere —
    // `messages/zh.json` DOES quote `스크린골프` legitimately.
    if (kana > 0) return `${kana} kana characters in a zh slot — suspected ja text`
    if (hangul > 0) return `${hangul} Hangul characters in a zh slot — suspected ko text`
    if (thai > 8 && thai > han) return `Thai (${thai}) outnumbers Han (${han})`
  }

  const run = longestRun(s, FOREIGN[loc])
  if (run.len >= FOREIGN_RUN_MAX[loc]) {
    return `${run.len}-character foreign-script run — suspected PARTIAL slot swap: "${run.text.slice(0, 40)}"`
  }
  if (loc === 'ja') {
    const hanRun = longestRun(s, SCRIPT.han)
    if (hanRun.len >= JA_KANA_FREE_HAN_MAX) {
      return `${hanRun.len}-character kana-free Han run — suspected PARTIAL zh splice: "${hanRun.text.slice(0, 40)}"`
    }
  }
  return null
}

/**
 * CAVEAT — known false-positive shape, and what to do about it.
 *
 * These thresholds are calibrated on the COURSE corpus, where no locale quotes
 * another's script. Two places in this repo legitimately do, and both would fail
 * here: `directions.grabTip` in `data/faq-hub.ts` prints the venue address in
 * THAI inside ja/ko/zh copy so a reader can show it to a taxi driver, and
 * `messages/zh.json` quotes `스크린골프` as a term of art. `location_and_access`
 * is exactly the field where a future batch would reach for the first pattern.
 *
 * If that happens the gate WILL go red, and the answer is to widen this file
 * deliberately — an allowlist keyed on `<slug>:<locale>:<field>` — not to raise
 * a threshold, which would disarm the check for every other slot. Note the
 * asymmetry while it stands: a Thai address fails in ko and zh at 8 characters
 * and now also fails in ja, where it previously passed unnoticed.
 *
 * Do NOT point these numbers at `messages/*.json` without re-measuring.
 */

// ---------------------------------------------------------------------------

/**
 * Self-test: proves each detector actually fires. A gate whose checks are all
 * silently disabled prints a byte-identical success line to a healthy one —
 * `if (true) return null` at the top of `judge()` passed the whole corpus with
 * "0 problem(s)", because the counters count strings VISITED, not checks
 * APPLIED. `validate:i18n` carries its own `--self-test` for the same reason.
 *
 * `match` is why this suite is not just fire/silent, and it was added after a
 * guard-efficacy pass disarmed each rule one at a time and the suite stayed
 * green on 19 of 24 mutations. Cause: every positive case was ALSO caught by the
 * foreign-run check, so the two layers masked each other and the dominance rules
 * — which are load-bearing, not redundant — had no coverage at all. A
 * comma-heavy zh sentence spliced into a th block is caught by `han > thai`
 * dominance and NOT by the run check, because `，` is a clause break. Asserting
 * the REASON means disarming one rule either silences its case or changes its
 * message, and both go red.
 */
const SELF_TESTS: Array<{ name: string; loc: Loc; s: string; expect: boolean; match?: RegExp }> = [
  // --- must FIRE ---
  { name: 'whole zh paragraph in a th slot', loc: 'th', expect: true,
    s: '这座球场位于华欣以南约二十公里，十八洞标准杆七十二，球道宽阔，果岭速度中等偏快。' },
  // `match` pins the SPECIFIC rule. Detection here is redundant by design — the
  // general `kana === 0` rule catches every zero-kana string — so the 15-kanji
  // rule only sharpens the diagnosis from "no kana at all" to "suspected zh text
  // in a ja slot". Without the match, disarming it is invisible; with it, the
  // message change goes red. Redundant for detection is not redundant for the
  // person reading the failure.
  { name: 'whole zh paragraph in a ja slot (kana-free)', loc: 'ja', expect: true,
    match: /kanji and ZERO kana — suspected zh text/,
    s: '这座球场位于华欣以南约二十公里，十八洞标准杆七十二，球道宽阔，果岭速度中等偏快。' },
  { name: 'whole ja paragraph in a zh slot', loc: 'zh', expect: true,
    s: 'このコースはホアヒンの南に位置し、18ホールパー72のレイアウトです。' },
  { name: 'whole ko paragraph in a zh slot', loc: 'zh', expect: true,
    s: '이 코스는 후아힌 남쪽에 있으며 18홀 파 72 구성입니다.' },
  { name: 'PARTIAL: zh clause spliced into a ja block', loc: 'ja', expect: true,
    s: 'このコースはホアヒン中心部から車で約20分の場所にあります。球道宽阔果岭速度中等偏快十分适合。フェアウェイは広めです。' },
  { name: 'PARTIAL: zh clause spliced into a th block', loc: 'th', expect: true,
    s: 'สนามแห่งนี้อยู่ห่างจากตัวเมืองหัวหินประมาณ 20 นาที 球道宽阔果岭速度中等偏快 และมีแคดดี้บังคับ' },
  // The ja host is LONG on purpose. A short one lets `thai > 8 && thai > kana`
  // dominance fire instead, so the case passes while `FOREIGN.ja` — the entry it
  // exists to cover — is disarmed. That is exactly how it read before a
  // guard-efficacy pass measured it: kana must outnumber the splice, or this is
  // a dominance test wearing a run test's name. `match` pins which one fires.
  { name: 'PARTIAL: Thai sentence spliced into a LONG ja block (isolates FOREIGN.ja)', loc: 'ja', expect: true,
    match: /foreign-script run/,
    s: 'このコースはホアヒンの中心部から車でおよそ20分の場所にあり、フェアウェイは全体に広めで、グリーンの速度は中程度に保たれています。'
     + 'キャディーは必須で、カートは希望者のみとなります。练習場も併設されているため、ラウンド前の調整にも困りません。'
     + 'สนามแห่งนี้มีแคดดี้บังคับ。'
     + '朝の時間帯は風が穏やかで、初心者の方でも比較的スコアをまとめやすいでしょう。予約は前日までに済ませておくと安心です。' },
  { name: 'zh text bridged by ・ in a ja slot (must not fake kana)', loc: 'ja', expect: true,
    s: '这座球场位于华欣以南・十八洞标准杆七十二・球道宽阔果岭速度・中等偏快十分适合' },
  { name: 'Latin/digit interleaving must not break a run', loc: 'th', expect: true,
    s: 'สนามกอล์ฟแห่งนี้ 球场1位于2华欣3镇4以5南6约7二8十9公里 เปิดทุกวัน' },

  // --- dominance rules, each isolated from the run check ---
  // Clause punctuation every few characters keeps every run under 8, so ONLY the
  // dominance rule named in `match` can fire. Disarm that rule and the case goes
  // silent; disarm a different one and the message changes.
  { name: 'DOMINANCE th: Han outnumbers Thai (all runs < 8)', loc: 'th', expect: true,
    match: /Han \(\d+\) outnumbers Thai/,
    s: 'สนาม 球场位于，果岭速度，球道宽阔，十分适合，交通方便，价格合理，风景优美' },
  { name: 'DOMINANCE ko: Han outnumbers Hangul (all runs < 8)', loc: 'ko', expect: true,
    match: /Han \(\d+\) outnumbers Hangul/,
    s: '코스 球场位于，果岭速度，球道宽阔，十分适合，交通方便，价格合理，风景优美' },
  { name: 'DOMINANCE ko: no Hangul at all', loc: 'ko', expect: true,
    match: /no Hangul at all/,
    s: 'สนามแห่งนี้อยู่ห่างจากตัวเมืองหัวหินประมาณ 20 นาที และมีแคดดี้บังคับ' },
  { name: 'DOMINANCE zh: no Han at all', loc: 'zh', expect: true,
    match: /no Han characters at all/,
    s: 'สนามแห่งนี้อยู่ห่างจากตัวเมืองหัวหินประมาณ 20 นาที และมีแคดดี้บังคับ' },
  { name: 'DOMINANCE zh: a single kana (run of 1, well under the floor)', loc: 'zh', expect: true,
    match: /kana characters in a zh slot/,
    s: '这座球场位于华欣以南、十八洞标准杆七十二、球道宽阔、果岭速度中等の球场' },
  { name: 'DOMINANCE zh: a short Hangul quote (run of 3)', loc: 'zh', expect: true,
    match: /Hangul characters in a zh slot/,
    s: '这座球场位于华欣以南、十八洞标准杆七十二、球道宽阔、果岭速度中等、스크린' },
  { name: 'DOMINANCE ja: no kana at all, under the 15-kanji bar', loc: 'ja', expect: true,
    match: /no kana at all/,
    s: '国道号線経由' },
  { name: 'DOMINANCE th: no Thai at all', loc: 'th', expect: true,
    match: /no Thai characters at all/,
    s: 'Kaeng Krachan Country Club 27 holes par 72' },

  // --- the four dominance rules a guard-efficacy pass found UNCOVERED ---
  // Each is clause-broken so every run stays under 8; only the named rule fires.
  { name: 'DOMINANCE th: Hangul outnumbers Thai', loc: 'th', expect: true,
    match: /Hangul \(\d+\) outnumbers Thai/,
    s: 'ส 코스는、후아힌、남쪽에、있으며、파 72、구성이고、그린이、빠릅니다' },
  { name: 'DOMINANCE ko: kana outnumbers Hangul', loc: 'ko', expect: true,
    match: /kana \(\d+\) outnumbers Hangul/,
    s: '코스 このこーすは、ほあひんの、みなみにあり、ぱーななじゅうに、ふぇあうぇいは、ひろめです' },
  { name: 'DOMINANCE ja: Thai outnumbers kana', loc: 'ja', expect: true,
    match: /Thai \(\d+\) outnumbers kana/,
    s: 'の สนามกอล์ฟแห่งนี้ตั้งอยู่ทางทิศใต้ของหัวหินและมีแคดดี้บังคับทุกรอบการเล่น' },
  { name: 'DOMINANCE zh: Thai outnumbers Han', loc: 'zh', expect: true,
    match: /Thai \(\d+\) outnumbers Han/,
    s: '球 สนามกอล์ฟแห่งนี้ตั้งอยู่ทางทิศใต้ของหัวหินและมีแคดดี้บังคับทุกรอบการเล่น' },

  // --- FOREIGN map entries: one case per (locale, script) so a one-character
  // edit to that map cannot go green. Eight of eleven had no coverage at all,
  // including all three `ko` entries. Hosts are long enough that dominance
  // cannot fire, so ONLY the run check can catch these.
  { name: 'FOREIGN.th.hangul — Korean splice in long Thai', loc: 'th', expect: true,
    match: /foreign-script run/,
    s: 'สนามแห่งนี้อยู่ห่างจากตัวเมืองหัวหินประมาณ 20 นาที และมีแคดดี้บังคับทุกรอบ '
     + 'พร้อมรถกอล์ฟให้เช่า สนามมีระยะ 7,100 หลาจากแท่นทีหลัง เปิดบริการทุกวันตั้งแต่เช้า '
     + '이코스는후아힌남쪽에있으며 และมีสิ่งอำนวยความสะดวกครบครัน' },
  { name: 'FOREIGN.th.kana — kana splice in long Thai', loc: 'th', expect: true,
    match: /foreign-script run/,
    s: 'สนามแห่งนี้อยู่ห่างจากตัวเมืองหัวหินประมาณ 20 นาที และมีแคดดี้บังคับทุกรอบ '
     + 'พร้อมรถกอล์ฟให้เช่า สนามมีระยะ 7,100 หลาจากแท่นทีหลัง เปิดบริการทุกวันตั้งแต่เช้า '
     + 'フェアウェイはひろめです และมีสิ่งอำนวยความสะดวกครบครัน' },
  { name: 'FOREIGN.ko.han — zh splice in long Korean', loc: 'ko', expect: true,
    match: /foreign-script run/,
    s: '이 코스는 후아힌 시내에서 차로 약 20분 거리에 있으며, 캐디는 필수이고 카트는 선택입니다. '
     + '전장은 뒤쪽 티에서 7,100야드에 이르고 페어웨이는 비교적 넓은 편이에요. '
     + '球道宽阔果岭速度中等偏快十分适合 매일 아침부터 운영합니다.' },
  { name: 'FOREIGN.ko.kana — kana splice in long Korean', loc: 'ko', expect: true,
    match: /foreign-script run/,
    s: '이 코스는 후아힌 시내에서 차로 약 20분 거리에 있으며, 캐디는 필수이고 카트는 선택입니다. '
     + '전장은 뒤쪽 티에서 7,100야드에 이르고 페어웨이는 비교적 넓은 편이에요. '
     + 'フェアウェイはひろめです 매일 아침부터 운영합니다.' },
  { name: 'FOREIGN.ko.thai — Thai splice in long Korean', loc: 'ko', expect: true,
    match: /foreign-script run/,
    s: '이 코스는 후아힌 시내에서 차로 약 20분 거리에 있으며, 캐디는 필수이고 카트는 선택입니다. '
     + '전장은 뒤쪽 티에서 7,100야드에 이르고 페어웨이는 비교적 넓은 편이에요. '
     + 'สนามแห่งนี้มีแคดดี้บังคับ 매일 아침부터 운영합니다.' },
  { name: 'FOREIGN.zh.thai — Thai splice in long Chinese', loc: 'zh', expect: true,
    match: /foreign-script run/,
    s: '这座球场位于华欣以南约二十公里，十八洞标准杆七十二，球道宽阔，果岭速度中等偏快，'
     + '后九洞可以远眺泰国湾，球会每天清晨开放，球童为必须，球车可以选择。'
     + 'สนามแห่งนี้มีแคดดี้บังคับ 十分适合安排一日行程。' },
  { name: 'FOREIGN.ja.hangul — Korean splice in long Japanese', loc: 'ja', expect: true,
    match: /foreign-script run/,
    s: 'このコースはホアヒンの中心部から車でおよそ20分の場所にあり、フェアウェイは全体に広めで、'
     + 'グリーンの速度は中程度に保たれています。キャディーは必須で、カートは希望者のみです。'
     + '이코스는후아힌남쪽에있으며 朝の時間帯は風が穏やかです。' },

  // CLAUSE_BREAK must not swallow whitespace: a space-separated splice is still
  // a splice, and adding `\s` to that class silently destroys every run check.
  { name: 'CLAUSE_BREAK: space-separated zh splice still caught', loc: 'th', expect: true,
    match: /foreign-script run/,
    s: 'สนามแห่งนี้อยู่ห่างจากตัวเมืองหัวหินประมาณ 20 นาที และมีแคดดี้บังคับทุกรอบ '
     + '球道 宽阔 果岭 速度 中等 偏快 十分 适合 安排 一日 行程 十分 方便 而且 价格 合理 และมีสิ่งอำนวยความสะดวกครบครัน' },

  // --- must STAY SILENT (real shipped copy, or its shape) ---
  { name: 'legit ja kanji compound run (corpus max, 7)', loc: 'ja', expect: false,
    s: 'このコースは野生動物保護区に隣接しており、朝は鳥の声が聞こえます。フェアウェイは広めです。' },
  { name: 'legit ja comma-listed kanji nouns', loc: 'ja', expect: false,
    s: '施設は練習場、宿泊施設、会議室、日本語対応受付、送迎車両手配、貸切営業対応、団体競技運営を備えます。' },
  { name: 'legit ja route list', loc: 'ja', expect: false,
    s: 'アクセスは国道7号線経由、東部臨海工業地帯経由、空港高速道路経由の3通りです。' },
  { name: 'legit th prose with Latin brand names and yardages', loc: 'th', expect: false,
    s: 'สนามออกแบบโดย Jack Nicklaus ระยะ 7,100 หลา จากแท่นหลัง เปิดบริการทุกวัน ตั้งแต่ 06.00 น.' },
  { name: 'legit ko prose with a Latin course name', loc: 'ko', expect: false,
    s: 'Black Mountain Golf Club 코스는 후아힌 시내에서 차로 약 15분 거리에 있습니다.' },
  { name: 'legit zh prose', loc: 'zh', expect: false,
    s: '这座球场位于华欣以南约二十公里，十八洞标准杆七十二，球道宽阔，果岭速度中等偏快。' },
]

function selfTest(): never {
  let failed = 0
  // Counted INSIDE the loop: these measure cases EXECUTED. Derived from
  // SELF_TESTS.filter(...) they measured cases DECLARED, and a `break` here ran
  // zero cases while every floor passed and the gate exited 0 (measured
  // 2026-08-24).
  let ran = 0
  let firesRan = 0
  let reasonedRan = 0
  const reasonsRan = new Set<string>()
  for (const t of SELF_TESTS) {
    const verdict = judge(t.loc, t.s)
    const got = verdict !== null
    // A case with `match` must fire for the RIGHT reason. Fire-only assertions
    // let a second rule cover for a disarmed first one — see the docblock.
    const reasonOk = !t.match || (verdict !== null && t.match.test(verdict))
    const ok = got === t.expect && reasonOk
    // Counters sit AFTER the comparison, deliberately. Incrementing first was
    // vacuous in a way the `break` this guard was written against does not
    // expose: a `continue` placed one line lower left
    // `ran === SELF_TESTS.length` intact, so 2 of 35 assertions ran and the
    // summary was byte-identical to a healthy run. `continue` is what an
    // ordinary refactor adds (a skip for a new shape, a locale filter). Count
    // what was CHECKED, not what the loop was handed.
    ran++
    if (t.expect) firesRan++
    if (t.match) {
      reasonedRan++
      reasonsRan.add(t.match.source)
    }
    if (!ok) failed++
    console.log(
      `  ${ok ? '✓' : '✗'} [${t.loc}] ${t.name} — expected ${t.expect ? 'FIRE' : 'silent'}` +
        `${t.match ? ` matching ${t.match.source}` : ''}, got ${got ? 'FIRE' : 'silent'}`
    )
    if (!ok && got) console.log(`      ${verdict}`)
  }
  console.log(`\n${ran} self-tests ran (${firesRan} must fire, ${ran - firesRan} must stay silent) · ${failed} failed`)
  // Declared vs EXECUTED, first: a harness reporting what it declared cannot
  // see itself running nothing.
  if (ran !== SELF_TESTS.length) {
    console.log(`FAIL: HARNESS BROKEN — ${SELF_TESTS.length} cases declared, ${ran} executed`)
    process.exit(1)
  }
  // Count DISTINCT reasons, not cases. The first version's `reasoned >= 8`
  // counted cases carrying a `match`, so deleting two dominance cases and then
  // disarming the two rules they pinned left the suite green — the same
  // hollowness it was written to close, one level up.
  const distinctReasons = reasonsRan.size
  // distinctReasons is pinned AT the current count (14), not below it. At 10
  // there were four units of slack, and "delete a rule together with the
  // self-test case that pins it" is what an ordinary cleanup refactor does —
  // four rules could go with both this script and its self-test staying green
  // and byte-identical to a healthy run. Verified by mutation. Raise this line
  // in the same commit that adds a reason; never lower it.
  // firesRan and reasonedRan sat at 8 against true values of 29 and 22 — 21
  // and 14 units of slack, i.e. two thirds of the firing cases could be
  // deleted with this green. Pinned AT the true values now, like
  // distinctReasons beside them. Raise all three when adding cases.
  if (firesRan < 29 || reasonedRan < 22 || distinctReasons < 14) {
    console.log(
      `FAIL: self-test suite has lost coverage (${firesRan} firing, ${reasonedRan} reason-asserting, ` +
        `${distinctReasons} distinct reasons; expected >= 29 / >= 22 / >= 14)`
    )
    process.exit(1)
  }
  if (failed > 0) process.exit(1)
  console.log('OK — every detector fires on the shape it exists for, and stays silent on real copy')
  process.exit(0)
}

// ---------------------------------------------------------------------------

const args = process.argv.slice(2)
if (args.includes('--self-test')) selfTest()

const regionArg = args[0]
const slugArgs = args.slice(1)
const scoped = Boolean(regionArg)

/**
 * The corpus is the REGISTRY, not the filesystem. A course with no locale
 * blocks is untranslated, not broken — censusing it would fail 88 times. A
 * course that IS in COURSE_DETAIL_I18N has promised exactly the locales ITS
 * OWN entry lists, and `dynamicParams = false` turns a missing one into a hard
 * 404 advertised by its own hreflang. So the registry is exactly the set where
 * a missing or wrong-script slot is a defect.
 *
 * Read each entry's `locales` array rather than assuming all four. The registry
 * type is `readonly CourseDetailLocale[]` and `getTranslatedCourseDetailParams()`
 * honours it, so a course registered for a subset builds correctly and passes
 * smoke J3. Hardcoding four here would fail it twice — once per "missing" block
 * and again on the anti-vacuity floor — which would make this gate stricter
 * than the contract it exists to enforce. Every entry happens to list all four
 * today; that is a fact about the data, not a rule.
 */
const registered: Array<{ region: string; slug: string; locales: readonly string[] }> =
  COURSE_DETAIL_I18N.map((c) => ({ region: c.region, slug: c.slug, locales: c.locales }))

const corpus = registered.filter(
  (c) =>
    (!regionArg || c.region === regionArg) && (slugArgs.length === 0 || slugArgs.includes(c.slug))
)

/**
 * Absolute floors for an UNSCOPED run, so a shrinking registry cannot go green.
 * Every other number here is registry-derived and therefore self-satisfying:
 * `locales: []` on every entry yields "0/0 slots present · 0 problems · OK".
 *
 * These are a ratchet, not a description. Raise them when the corpus grows;
 * lowering one has to be a deliberate edit with a reason, which is the whole
 * point. Today: 71 courses, 284 slots, 1,988 strings.
 */
const MIN_COURSES = 71
const MIN_STRINGS = 1988

let problems = 0
let checked = 0
let slotsSeen = 0
let serpOnly = 0

async function main() {
  for (const { region, slug, locales: promised } of corpus) {
    const file = path.join(ROOT, 'data/golf-courses', region, `${slug}.ts`)
    let mod: { course?: Record<string, unknown> }
    try {
      // pathToFileURL, not the raw path: the ESM loader rejects a Windows
      // absolute path ("Received protocol 'c:'"), so a bare `import(file)`
      // makes this gate report all 61 courses as unloadable on the repo's
      // documented dev platform while staying green on ubuntu CI. Same fix,
      // same reason, as scripts/course-files.ts and scripts/validate-courses.ts.
      mod = await import(pathToFileURL(file).href)
    } catch (err) {
      // Bind the error: an unbound `catch {}` here misdiagnosed a loader
      // failure as a missing/broken data file and sent reviewers to data/.
      console.log(`  ✗ ${slug}: registered in COURSE_DETAIL_I18N but ${region}/${slug}.ts does not load`)
      console.log(`      ${err instanceof Error ? err.message.split('\n')[0] : String(err)}`)
      problems++
      continue
    }
    const course = mod.course as { locales?: Record<string, Record<string, string> & { prose?: Record<string, string> }> }
    const locales = course?.locales ?? {}
    const missing: string[] = []

    for (const loc of promised as readonly Loc[]) {
      const block = locales[loc]
      if (!block) {
        missing.push(loc)
        continue
      }
      slotsSeen++
      const fields: Array<[string, unknown]> = [
        ['title', block.title],
        ['meta_description', block.meta_description],
      ]
      if (!block.prose) {
        // Legal, and documented on GolfCourseLocale.prose: a locale may ship
        // title + meta_description only ("SERP presence first, body later"),
        // and CoursePage falls back to the EN prose per field. Failing this
        // would block a legitimate SERP-first batch. What is NOT legal is a
        // prose object that is PRESENT but incomplete — that is the dead-builder
        // signature this gate exists for, and it is checked below.
        serpOnly++
      } else {
        for (const f of PROSE_FIELDS) fields.push([`prose.${f}`, block.prose[f]])
      }

      for (const [name, raw] of fields) {
        checked++
        if (typeof raw !== 'string') {
          console.log(`  ✗ ${slug} [${loc}] ${name}: not a string (${raw === undefined ? 'MISSING' : typeof raw})`)
          problems++
          continue
        }
        if (raw.trim() === '') {
          console.log(`  ✗ ${slug} [${loc}] ${name}: EMPTY/whitespace-only — beats the EN fallback via ??`)
          problems++
          continue
        }
        const verdict = judge(loc, raw)
        if (verdict) {
          console.log(`  ✗ ${slug} [${loc}] ${name}: ${verdict}`)
          console.log(`      ${raw.slice(0, 90)}…`)
          problems++
        }
      }
    }
    if (missing.length) {
      console.log(`  ✗ ${slug}: locale block(s) MISSING/null: ${missing.join(', ')}`)
      problems += missing.length
    }
  }

  // Anti-vacuity with real numbers, not `> 0` (CLAUDE.md: a gate that cannot
  // fail is worse than no gate).
  const expectedSlots = corpus.reduce((a, c) => a + c.locales.length, 0)
  const proseBlocks = slotsSeen - serpOnly
  // Exact, not a floor: 2 strings per slot (title + meta) plus 5 more for every
  // slot that ships prose. A miscount here means the loop skipped something.
  const expectedStrings = slotsSeen * 2 + proseBlocks * 5
  console.log(
    `\n${corpus.length} course(s) · ${slotsSeen}/${expectedSlots} locale slots present · ` +
      `${proseBlocks} with prose, ${serpOnly} title+meta only · ` +
      `${checked} strings script-checked · ${problems} problem(s)`
  )
  if (corpus.length === 0) {
    console.log('FAIL: empty corpus — nothing was examined')
    process.exit(1)
  }
  // `slotsSeen` was printed but never asserted, and `expectedStrings` is derived
  // FROM it — so skipping a whole locale in the loop reduced both sides together
  // and the run stayed green with 61 slots and 427 strings silently absent.
  if (slotsSeen !== expectedSlots) {
    console.log(
      `FAIL: the registry promises ${expectedSlots} locale slots but only ${slotsSeen} were examined — ` +
        `${expectedSlots - slotsSeen} slot(s) went uncounted`
    )
    process.exit(1)
  }
  if (checked !== expectedStrings) {
    console.log(`FAIL: expected exactly ${expectedStrings} strings, examined ${checked}`)
    process.exit(1)
  }
  if (!scoped && corpus.length < MIN_COURSES) {
    console.log(
      `FAIL: expected at least ${MIN_COURSES} registered courses, found ${corpus.length} — ` +
        `the registry shrank, or this ratchet needs a deliberate edit`
    )
    process.exit(1)
  }
  if (!scoped && checked < MIN_STRINGS) {
    console.log(
      `FAIL: expected at least ${MIN_STRINGS} strings, examined ${checked} — ` +
        `the corpus shrank, or this ratchet needs a deliberate edit`
    )
    process.exit(1)
  }
  if (problems > 0) process.exit(1)
  console.log('OK — every slot is present, non-blank, and in its own script')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
