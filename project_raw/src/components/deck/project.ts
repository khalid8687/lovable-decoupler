export const PROJECT = {
  price: 105000,
  year: 2026,
  month: 12,
  deliveryDay: 28,
  deadlineDay: 31,
  supportMonths: 3,
  phone: '+201002646533',
} as const;

export const PHASES = [
  { id: 'discovery', title: 'التحليل والتصميم', start: 1, end: 3, output: 'نطاق معتمد وشاشات واضحة', gate: 'اعتماد خرائط العمل والتصميم' },
  { id: 'accounting', title: 'النواة المحاسبية', start: 4, end: 11, output: 'دورة مالية مترابطة', gate: 'مراجعة القيد والميزان مع المحاسب' },
  { id: 'operations', title: 'المبيعات والمخازن', start: 12, end: 17, output: 'دورة تشغيل كاملة', gate: 'اعتماد البيع والشراء وحركة المخزون' },
  { id: 'sync', title: 'المزامنة وتطبيق المدير', start: 18, end: 23, output: 'تشغيل متصل وغير متصل', gate: 'اختبار الانقطاع والعودة والصلاحيات' },
  { id: 'launch', title: 'الترحيل والتدريب والتسليم', start: 24, end: 28, output: 'بيانات مراجعة وفريق جاهز', gate: 'محضر قبول وتسليم نهائي' },
] as const;

export const PAYMENTS = [
  { percent: 30, amount: 31500, label: 'عند التوقيع' },
  { percent: 30, amount: 31500, label: 'تسليم النواة المحاسبية' },
  { percent: 30, amount: 31500, label: 'بدء التشغيل' },
  { percent: 10, amount: 10500, label: 'بعد 30 يوم استقرار' },
] as const;

export const WEEKS = [
  { number: 1, name: 'الأسبوع الأول', start: 1, end: 7, title: 'التأسيس والتصميم وبداية الحسابات', output: 'شاشات معتمدة ونسخة أولية للحسابات', phaseIds: ['discovery', 'accounting'] },
  { number: 2, name: 'الأسبوع الثاني', start: 8, end: 14, title: 'استكمال الحسابات وبداية التشغيل', output: 'دورة مالية وشاشات بيع واستلام', phaseIds: ['accounting', 'operations'] },
  { number: 3, name: 'الأسبوع الثالث', start: 15, end: 21, title: 'ربط المخزون والمزامنة والإدارة', output: 'دورة تشغيل مترابطة ومزامنة أولية', phaseIds: ['operations', 'sync'] },
  { number: 4, name: 'الأسبوع الرابع', start: 22, end: 28, title: 'الاختبار والترحيل والتدريب والتسليم', output: 'نسخة نهائية وبيانات مراجعة وفريق جاهز', phaseIds: ['sync', 'launch'] },
] as const;