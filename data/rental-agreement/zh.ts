import { BUSINESS_INFO } from '@/lib/constants'
import type { RentalAgreementContent } from './types'

// Simplified Chinese translation of the Golf Course Club Rental Agreement.
// The English text in ./en.ts governs (§12); this is a convenience translation.
//
// Translation decisions a later editor should keep:
// - Register: formal written contract Chinese addressing the reader as 您. The
//   glossary's 你 rule covers guide/explainer prose only; this is a legal text,
//   and the rental pages it sits beside (messages/zh.json CourseClubRental) use 您.
// - Defined terms, rendered the same way every time: the "Equipment" = 器材,
//   this "Agreement" = 本协议, LENGOLF/"we"/"us" = LENGOLF / 我们, the "Renter"
//   = 承租人. Where EN says LENGOLF the text says LENGOLF; where EN says we/us
//   it says 我们.
// - The rental concept is 租赁 throughout (legal register, and the head noun of
//   Footer.rentalAgreement 租赁协议). ONE exception: the bold §9 lead sentence
//   reuses CourseClubRental.heroCancellationNote verbatim (租借开始24小时前可免费
//   取消), so the cancellation promise reads identically on both pages.
// - "case by case" (4x) = 按个案; "fair replacement value" = 公平更换价值 (NOT
//   公允价值 or 重置价值, which are accounting terms of art and narrower than EN).
// - Currency is 泰铢; the EN "(THB)" gloss is dropped (validate-i18n warns on
//   Latin THB in zh prose). "5 to 10" is written 5至10, not with a dash.
// - Place names follow the CourseClubRental namespace: BTS奇隆站 (never 齐隆),
//   The Mercury Ville in Latin, LINE @lengolf and booking.len.golf verbatim.
// - No em dashes (neither U+2014 nor the doubled Chinese form), per house style.
export const zh: RentalAgreementContent = {
  sourceVersion: '2026-08-07',
  title: '高尔夫球场球杆租赁协议',
  metaTitle: '高尔夫球场球杆租赁协议',
  metaDescription:
    'LENGOLF高尔夫球场球杆租赁协议：适用于每一笔外场（球场）高尔夫球杆租赁的条款。',
  lastUpdated: '最后更新：2026年8月7日',
  notice: {
    text: '本页面为本协议的中文译本，仅为方便起见而提供；如中文译本与英文版本有任何冲突，以英文版本为准。',
    linkText: '阅读英文版本',
  },
  intro: [
    '本协议约定LENGOLF CO., LTD.（以下简称“LENGOLF”或“我们”）向您（以下称“您”或“承租人”）出租高尔夫球杆套装及相关器材（以下简称“器材”），供您在店外的高尔夫球场使用的相关事宜。本协议适用于您向我们进行的每一笔外场（球场）租赁，无论您是通过booking.len.golf、LINE、电话、电子邮件还是现场预订。室内及店内模拟器球杆租赁不属于本协议的适用范围。',
    '您一经向我们确认球场租赁预订，即表示您同意本协议。',
  ],
  sections: [
    {
      heading: '1. 租赁',
      items: [
        '我们向您出租您的预订确认中所列的球杆套装及任何加购项目，租赁期以预订确认中所载为准（自开始日期和时间起，至归还日期和时间止）。',
        '器材始终为LENGOLF的财产。',
        '您可以到LENGOLF（The Mercury Ville，BTS奇隆站）自取器材，或申请配送（见第7条）。',
      ],
    },
    {
      heading: '2. 费用与付款',
      items: [
        '租金、配送费及加购项目价格以预订时显示的金额为准，以泰铢计价，并已包含增值税（VAT）。付款于预订时通过结账页面提供的任一付款方式在线进行。配送订单须在线预付；自取订单也可选择在取杆时以现金付款。',
        '无需押金。',
        '在您完成付款期间，您的预订最长保留2小时。如未在该时限内完成付款，预订将自动取消，器材随即解除保留。',
      ],
    },
    {
      heading: '3. 交付时的器材状况',
      items: [
        `请在自取或收到器材时进行检查。如有任何缺失、损坏或与预期不符之处，请在使用前告知我们（LINE @lengolf、${BUSINESS_INFO.phone}或${BUSINESS_INFO.email}）。`,
        '如您未在使用前报告问题，器材将被视为您已完整收到且状况良好。',
      ],
    },
    {
      heading: '4. 您的责任',
      items: [
        '仅以正常方式将器材用于打高尔夫球，并在租赁期内将器材置于您的占有和控制之下。',
        '以合理的谨慎保管器材，防止其遗失、被盗及遭受可避免的损坏。',
        '不得将器材出售、转租、出借或交予任何其他人。',
        '最迟于约定的归还时间归还全套器材，包括球包以及每一支球杆和每一件加购项目。',
      ],
    },
    {
      heading: '5. 正常磨损',
      paragraphs: [
        '因日常打球使用而产生的正常磨损（例如轻微擦痕、握把磨损及表面痕迹）属于预期范围，由LENGOLF承担。您无需为此支付费用。',
      ],
    },
    {
      heading: '6. 遗失、被盗或损坏',
      items: [
        '器材在您保管期间发生遗失、被盗，或出现超出正常磨损（第5条）的损坏的，由您承担责任。',
        '器材受损的，您同意支付合理的维修费用。如有物品遗失、被盗或损坏至不具经济修复价值，您同意支付该物品的公平更换价值。我们将按个案评估维修费用及公平更换价值，并会在收取任何费用前向您说明。',
        '如有任何器材遗失、被盗或损坏，请尽快告知我们。',
      ],
    },
    {
      heading: '7. 配送与取件',
      items: [
        '我们按约定在曼谷及周边地区提供配送。配送及归还取件的时间和地点于预订时约定。大曼谷地区以外的地点按个案处理，请与我们联系。',
        '须有人于约定的时间在约定的地点，在配送时接收器材，并在归还取件时交还器材。',
        '如因无人在场或所提供的信息有误，导致我们无法完成配送或取件，可能会产生额外费用或延误。',
      ],
    },
    {
      heading: '8. 逾期归还',
      items: [
        '器材应于约定的归还日期和时间归还。如您逾期保留器材，在器材归还之前，每超出一天（或不足一天）均按标准日租费加收租金。',
        '如器材未归还且我们无法联系到您，我们可依据第6条将其视为遗失。',
      ],
    },
    {
      heading: '9. 取消与退款',
      items: [
        `**租借开始24小时前可免费取消。**如您在租赁期开始前至少24小时取消，我们将全额退还您已支付的款项，不收取任何取消费用。如需取消，请通过LINE @lengolf、致电${BUSINESS_INFO.phone}或发送电子邮件至${BUSINESS_INFO.email}与我们联系。`,
        '在租赁期开始前不足24小时提出的取消，将按个案评估。我们会在处理前告知您将退还哪些款项（如有）。',
        '如您未前来自取器材，或无法接收器材（未到场），该预订可能被视为已取消；退款按个案处理。',
        '退款将退回至预订时使用的原付款方式。银行卡退款通常会在我们处理后的5至10个工作日内由您的银行入账。',
        '如我们无法提供您所预订的器材，您可以选择其他可用的替代器材或全额退款。',
      ],
    },
    {
      heading: '10. 风险自担；责任限制',
      items: [
        '高尔夫运动涉及身体活动，并存在固有风险。您使用器材的风险由您自行承担，并有责任根据自身能力安全、适当地使用器材。',
        '器材按“现状”提供，供休闲高尔夫运动使用。在法律允许的范围内，对于因您使用器材而引起的任何伤害、损失或损坏，或任何间接或后果性损失，LENGOLF不承担责任。',
        '本协议的任何内容均不限制您依据泰国法律享有的、不可被排除的任何权利。',
      ],
    },
    {
      heading: '11. 个人数据',
      paragraphs: [
        '我们将依照我们的隐私政策（len.golf/privacy-policy）处理您为履行本次租赁而提供的个人信息。',
      ],
    },
    {
      heading: '12. 适用法律与语言',
      items: [
        '本协议受泰国法律管辖，任何争议均受泰国法院的司法管辖。',
        '本协议以英文撰写。任何译本仅为方便起见而提供；如有任何冲突，以英文版本为准。',
      ],
    },
    {
      heading: '13. 联系方式',
      items: [
        `LINE：@lengolf · 电话：${BUSINESS_INFO.phone} · 电子邮件：${BUSINESS_INFO.email}`,
        `${BUSINESS_INFO.legalName}（纳税人识别号：${BUSINESS_INFO.taxId}），${BUSINESS_INFO.registeredAddress}。`,
      ],
    },
    {
      heading: '14. 接受条款',
      paragraphs: [
        '您一经向LENGOLF确认球场租赁预订（无论是在线、通过LINE、电话、电子邮件还是现场确认），即表示您确认已阅读、理解并同意本协议。',
      ],
    },
  ],
  closing: [
    '我们可不时更新本协议；您预订时有效的版本适用于该次租赁。',
  ],
}
