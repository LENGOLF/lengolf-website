import { BUSINESS_INFO } from '@/lib/constants'
import type { RentalAgreementContent } from './types'

// Japanese translation of ./en.ts (the governing text; §12 makes the English
// version prevail). Translation decisions a later editor should know:
//
// - REGISTER: contract style (〜ものとします / 〜します / 〜ません) throughout,
//   not the site's です/ます marketing tone. EN "Please ..." sentences stay
//   requests (〜してください): turning them into 〜ものとします would make the
//   Japanese stricter than the English.
// - DEFINED TERMS, used the same way every time: Agreement = 本規約,
//   Equipment = レンタル品, you / Renter = 借主 (introduced once as お客様),
//   we / us = 当社. Where EN says "LENGOLF" the Japanese says LENGOLF.
//   "Section N" = 第N条.
// - HEDGES: fair replacement value = 公正な代替価額 (deliberately NOT 再調達価額,
//   which means replacement-new and is narrower); "as is" = 現状有姿;
//   case by case = 個別に (4x); "what, if anything, will be refunded" =
//   返金の有無および返金額. Boundaries: at least 24 hours = 24時間以上前,
//   less than 24 hours = 24時間未満, up to 2 hours = 最大2時間.
// - DIGITS: validate-i18n requires each section's digits to match EN exactly.
//   So "(or part-day)" is 端数日 (not 1日未満) and "standard daily rate" is
//   日額料金 (not 1日料金). `lastUpdated` is exempt in one way: its numbers
//   may be the agreement date with the month spelled out or as a number, so
//   2026年8月7日 is valid.
// - REUSED SITE WORDING: the §9 bold sentence is CourseClubRental.
//   heroCancellationNote verbatim (+ 。); デポジット / 通常の摩耗 / 修理費用 follow
//   CourseClubRentalFaq a2 and a16; the title's head noun 規約 matches
//   Footer.rentalAgreement; 納税者番号 is Footer.taxId; アドオン follows the
//   catalog; The Mercury Ville (Latin) and BTSチットロム follow messages/ja.json.
// - Company name, Tax ID and registered address come from BUSINESS_INFO and
//   stay in English; there is no Japanese company name or address.
export const ja: RentalAgreementContent = {
  sourceVersion: '2026-08-07',
  title: 'ゴルフコース用クラブレンタル規約',
  metaTitle: 'ゴルフコース用クラブレンタル規約',
  metaDescription:
    'LENGOLFのゴルフコース用クラブレンタル規約。店外（コース）でのゴルフクラブのレンタルすべてに適用される条件を定めています。',
  lastUpdated: '最終更新日：2026年8月7日',
  notice: {
    text: 'この日本語版は便宜のために提供する翻訳です。内容に齟齬がある場合は、英語版が優先します。',
    linkText: '英語版を読む',
  },
  intro: [
    '本規約は、LENGOLF CO., LTD.（以下「LENGOLF」または「当社」といいます）が、お客様（以下「借主」といいます）に対し、ゴルフ場での店外使用を目的として行うゴルフクラブセットおよび関連用品（以下「レンタル品」といいます）のレンタルについて定めるものです。本規約は、booking.len.golf、LINE、電話、メール、対面のいずれで予約されたかを問わず、借主が当社との間で行うすべての店外（コース）レンタルに適用されます。インドアおよび店内でのシミュレーター用クラブレンタルは、本規約の対象ではありません。',
    '当社とのコースレンタルの予約を確定することにより、借主は本規約に同意するものとします。',
  ],
  sections: [
    {
      heading: '1. レンタル',
      items: [
        '当社は、予約確認に表示されたクラブセットおよびアドオン品目を、同予約確認に記載されたレンタル期間（開始日時から返却日時まで）、借主にレンタルします。',
        'レンタル品の所有権は、常にLENGOLFに帰属します。',
        '借主は、レンタル品をLENGOLF（The Mercury Ville @ BTSチットロム）で受け取るか、配送を依頼することができます（第7条参照）。',
      ],
    },
    {
      heading: '2. 料金および支払い',
      items: [
        'レンタル料金、配送料金およびアドオン品目の価格は、予約時に表示されたとおりとし、タイバーツ（THB）建てのVAT込みの金額です。支払いは、予約時に、チェックアウト時に提示される支払方法のいずれかを用いてオンラインで行います。配送の注文にはオンラインでの事前支払いが必要です。店頭ピックアップの注文については、代わりに受取時に現金で支払うこともできます。',
        'デポジットは不要です。',
        '借主の予約は、借主が支払いを完了する間、最大2時間確保されます。この時間内に支払いが完了しない場合、予約は自動的にキャンセルされ、レンタル品の確保は解除されます。',
      ],
    },
    {
      heading: '3. 引渡し時の状態',
      items: [
        `レンタル品を店頭で受け取る際、または配送で受領する際には、レンタル品を点検してください。欠品、損傷、または想定と異なる点がある場合は、使用前に当社へお知らせください（LINE @lengolf、${BUSINESS_INFO.phone}、または${BUSINESS_INFO.email}）。`,
        '使用前に問題の報告がない場合、レンタル品は欠品なく良好な状態で受け取られたものとして取り扱われます。',
      ],
    },
    {
      heading: '4. 借主の責任',
      items: [
        'レンタル品はゴルフのプレーのみに通常の方法で使用し、レンタル期間中は借主自身の占有および管理の下に置くものとします。',
        'レンタル品を合理的な注意をもって取り扱い、紛失、盗難および回避可能な損傷から保護するものとします。',
        'レンタル品を第三者に販売、転貸、貸与または譲渡してはなりません。',
        'バッグ、すべてのクラブおよびアドオン品目を含むセット一式を、合意した返却時刻までに返却するものとします。',
      ],
    },
    {
      heading: '5. 通常の摩耗',
      paragraphs: [
        '軽微な擦り傷、グリップの摩耗、表面の跡など、一般的なゴルフのプレーによる通常の摩耗は想定されたものであり、LENGOLFが負担します。これについて借主に料金を請求することはありません。',
      ],
    },
    {
      heading: '6. 紛失、盗難または損傷',
      items: [
        '借主は、レンタル品が借主の管理下にある間に生じた、通常の摩耗（第5条）を超えるレンタル品の紛失、盗難または損傷について責任を負うものとします。',
        'レンタル品が損傷した場合、借主は合理的な修理費用を支払うことに同意するものとします。いずれかの品目が紛失もしくは盗難に遭った場合、または経済的に修理が見合わない程度に損傷した場合、借主はその公正な代替価額を支払うことに同意するものとします。当社は、修理費用および公正な代替価額を個別に査定し、料金を適用する前にその内容を借主に説明します。',
        'レンタル品が紛失、盗難または損傷した場合は、できる限り速やかに当社へお知らせください。',
      ],
    },
    {
      heading: '7. 配送および引取り',
      items: [
        '当社は、取り決めにより、バンコクおよびその周辺地域への配送を行います。配送および返却時の引取りの日時と場所は、予約時に合意するものとします。バンコク首都圏外の場所については個別に対応しますので、当社までお問い合わせください。',
        '配送時にレンタル品を受け取り、返却時の引取りの際にレンタル品を引き渡すため、合意した場所および時間に対応できる者がいなければなりません。',
        '対応できる者がいない、または詳細情報に誤りがあったために当社が配送または引取りを完了できない場合、追加料金または遅延が発生することがあります。',
      ],
    },
    {
      heading: '8. 返却の遅延',
      items: [
        'レンタル品の返却期限は、合意した返却日時とします。借主がこれを超えてレンタル品を保持する場合、返却されるまでの超過した各日（端数日を含みます）について、標準の日額料金による追加のレンタル料金が発生します。',
        'レンタル品が返却されず、当社が借主と連絡を取ることができない場合、当社はレンタル品を第6条に基づく紛失として取り扱うことができます。',
      ],
    },
    {
      heading: '9. キャンセルおよび返金',
      items: [
        `**レンタル開始の24時間前まで無料キャンセル可能。** レンタル期間の開始の24時間以上前にキャンセルした場合、当社は借主が支払った全額を返金し、キャンセル料は発生しません。キャンセルするには、LINE @lengolf、電話（${BUSINESS_INFO.phone}）、またはメール（${BUSINESS_INFO.email}）で当社にご連絡ください。`,
        'レンタル期間の開始まで24時間未満の時点で行われたキャンセルについては、個別に判断します。当社は、処理を行う前に、返金の有無および返金額を借主にお知らせします。',
        '借主がレンタル品を受け取りに来ない場合、または受取りに対応できない場合（ノーショー）、当該予約はキャンセルされたものとして取り扱われることがあります。返金については個別に対応します。',
        '返金は、予約時に使用された元の支払方法に対して行われます。カードへの返金は、当社が処理を行ってから通常5〜10営業日以内に、借主の取引銀行によって反映されます。',
        '当社が借主の予約したレンタル品を提供できない場合、借主は、利用可能な代替品または全額返金のいずれかを選択することができます。',
      ],
    },
    {
      heading: '10. 自己責任での使用および責任の制限',
      items: [
        'ゴルフは身体活動を伴い、固有の危険を含みます。借主は自己の責任においてレンタル品を使用するものとし、自己の能力に応じて安全かつ適切にレンタル品を使用する責任を負います。',
        'レンタル品は、レクリエーションとしてのゴルフを目的として「現状有姿」で提供されます。法令で認められる範囲において、LENGOLFは、借主によるレンタル品の使用から生じるいかなる負傷、損失もしくは損害についても、また間接的または結果的な損失についても、責任を負いません。',
        '本規約のいかなる規定も、タイ法の下で排除することのできない借主の権利を制限するものではありません。',
      ],
    },
    {
      heading: '11. 個人情報',
      paragraphs: [
        '当社は、レンタルの履行のために借主が提供する個人情報を、当社のプライバシーポリシー（len.golf/privacy-policy）に従って取り扱います。',
      ],
    },
    {
      heading: '12. 準拠法および言語',
      items: [
        '本規約はタイ国の法律に準拠し、一切の紛争はタイ国の裁判所の管轄に服するものとします。',
        '本規約は英語で作成されています。翻訳は便宜のためにのみ提供されるものであり、齟齬がある場合は英語版が優先します。',
      ],
    },
    {
      heading: '13. 連絡先',
      items: [
        `LINE：@lengolf · 電話：${BUSINESS_INFO.phone} · メール：${BUSINESS_INFO.email}`,
        `${BUSINESS_INFO.legalName}（納税者番号 ${BUSINESS_INFO.taxId}）、${BUSINESS_INFO.registeredAddress}。`,
      ],
    },
    {
      heading: '14. 同意',
      paragraphs: [
        'オンライン、LINE、電話、メール、対面のいずれによるかを問わず、LENGOLFとのコースレンタルの予約を確定することにより、借主は、本規約を読み、理解し、これに同意したことを確認するものとします。',
      ],
    },
  ],
  closing: [
    '当社は、本規約を随時更新することがあります。借主が予約した時点で有効な版の本規約が、当該レンタルに適用されます。',
  ],
}
