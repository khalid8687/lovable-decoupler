import { BadgeCheck, CheckCircle2, ClipboardCheck, FileCheck2, Flag, PackageCheck } from 'lucide-react';
import { Dark, Light, Logo, Media } from './parts';
import { PHASES, PROJECT, WEEKS } from './project';
import iso from '@/assets/system_iso.jpg';

const phase = (id: string) => PHASES.find(p => p.id === id);
const range = (id: string, start: number, end: number) => {
  const p = phase(id);
  return p ? `${Math.max(p.start, start)}–${Math.min(p.end, end)} ديسمبر` : '';
};

export function WeeklyMap() {
  return <Light kicker={`خطة التنفيذ الأسبوعية • ديسمبر ${PROJECT.year}`} title="أربعة أسابيع… حتى التسليم النهائي">
    <div className="journey-map grid h-full grid-cols-4 gap-10">{WEEKS.map(w => <div key={w.number} className="flex flex-col border-t-4 border-teal pt-7">
      <div className="s-kicker text-teal">{w.name}</div><div className="s-date my-7 num text-gold">{w.start}–{w.end}</div><h3 className="s-sub mb-6 text-navy">{w.title}</h3>
      <div className="mt-auto border-t border-border pt-6"><Flag size={34} className="mb-4 text-teal"/><p className="s-body text-navy">{w.output}</p></div>
    </div>)}</div>
  </Light>;
}

export function FirstDay() {
  return <Dark><div className="creation-layout grid h-full grid-cols-[1.1fr_1fr] items-center gap-16 p-[110px]">
    <div><div className="s-kicker mb-6 text-gold">الأسبوع الأول • {WEEKS[0].start} ديسمبر {PROJECT.year}</div><h2 className="s-title-lg">اليوم الأول:<br/>تجهيز العمل</h2><div className="mt-10 flex flex-col gap-8">{[
      'تثبيت نطاق التنفيذ المتفق عليه وتحديد مسؤول المراجعة من كل قسم.',
      'تجهيز بيئة إنشاء واختبار منفصلة وحفظ نسخة من بيانات النظام الحالي.',
      'جمع نماذج الفواتير والتقارير وبيانات الأصناف والحسابات المطلوبة.',
    ].map(t => <p key={t} className="s-body-lg flex items-start gap-5"><CheckCircle2 size={34} className="shrink-0 text-gold"/>{t}</p>)}</div></div>
    <Media src={iso} className="h-[720px]" label="تصوّر لبيئة تشغيل المنظومة"/>
  </div></Dark>;
}

type Item = { label: string; text: string };
type Detail = { schedule: Item[]; implementation: Item[]; output: string[]; review: string; prerequisite: string };
const DETAILS: Detail[] = [
  {
    schedule: [
      { label: range('discovery', 1, 7), text: 'تثبيت دورة البيع والشراء والتحصيل والمخزون، وتصميم الشاشات ومراجعتها.' },
      { label: range('accounting', 1, 7), text: 'بدء دليل الحسابات والأرصدة الافتتاحية وإعداد تسجيل القيود.' },
      { label: 'مراجعة نهاية الأسبوع', text: 'عرض التصميم والنسخة الأولى للحسابات وتسجيل الملاحظات قبل الاستكمال.' },
    ],
    implementation: [
      { label: 'الشاشات ودورة العمل', text: 'تحديد حقول الفاتورة والعميل والصنف والمخزن، وخطوات الحفظ والإلغاء والمراجعة.' },
      { label: 'أساس الحسابات', text: 'تعريف الحسابات وربط العملاء والموردين بها وتجهيز إدخال الأرصدة الافتتاحية.' },
      { label: 'المستخدمون والبيانات', text: 'تحديد أدوار الإدارة والمحاسب والبيع والمخزن، وتجهيز خرائط نقل البيانات.' },
    ],
    output: ['نماذج شاشات ودورة عمل تمت مراجعتها.', 'دليل حسابات ونسخة أولية لتسجيل القيود.', 'قائمة بيانات مطلوبة وملاحظات موثّقة.'],
    review: 'مراجعة شاشة بيع واستلام مع الأقسام، وإدخال قيد تجريبي ومراجعة حساباته؛ هذه نسخة تأسيس وليست تشغيلًا نهائيًا.',
    prerequisite: 'نماذج المستندات ودليل الحسابات ومسؤول اعتماد من الشركة.',
  },
  {
    schedule: [
      { label: range('accounting', 8, 14), text: 'استكمال القيود والأستاذ والميزان والضريبة والتحصيل وأعمار الديون.' },
      { label: range('operations', 8, 14), text: 'بدء الأصناف والباركود والمخازن وشاشات الشراء والاستلام والبيع.' },
      { label: 'مراجعة نهاية الأسبوع', text: 'مراجعة الدورة المحاسبية، ثم عرض أول عملية شراء وبيع على نسخة الاختبار.' },
    ],
    implementation: [
      { label: 'الربط المحاسبي', text: 'تحويل المستند إلى قيد ثم أستاذ وميزان؛ مراجعة الضريبة والتحصيل ورصيد العميل.' },
      { label: 'بيانات التشغيل', text: 'إنشاء الأصناف ووحداتها وباركودها والعملاء والموردين وربط الحركة بالمخزن.' },
      { label: 'الفواتير والاستلام', text: 'تنفيذ إدخال البنود والكميات والأسعار، وحفظ المستند وربطه بحركة الصنف.' },
    ],
    output: ['نواة محاسبية مكتملة للمراجعة.', 'شاشات أصناف وعملاء وموردين ومخازن.', 'نسخة أولية للشراء والاستلام والبيع.'],
    review: 'المحاسب يتتبع مستندًا حتى القيد والميزان؛ ويُراجع موظف التشغيل تسجيل استلام وفاتورة بيع وأثرهما الأولي.',
    prerequisite: 'اعتماد تصميم الأسبوع الأول وتوفير بيانات اختبار وأرصدة قابلة للمراجعة.',
  },
  {
    schedule: [
      { label: range('operations', 15, 21), text: 'استكمال البيع والمرتجع والتحويل بين المخازن والتكلفة والربحية وحد الطلب.' },
      { label: range('sync', 15, 21), text: 'بدء الحفظ بدون إنترنت والمزامنة ولوحة المدير وتطبيق الموبايل والأمان.' },
      { label: 'مراجعة نهاية الأسبوع', text: 'عرض دورة تشغيل مترابطة وتجربة أولية لانقطاع الاتصال والعودة.' },
    ],
    implementation: [
      { label: 'حركة المخزون', text: 'ربط الشراء والبيع والمرتجع والتحويل بكميات وتكلفة وأرصدة كل مخزن.' },
      { label: 'الأوفلاين والمزامنة', text: 'حفظ العمليات محليًا وترتيب إرسالها عند عودة الاتصال ومراجعة التعارضات.' },
      { label: 'الإدارة والأمان', text: 'ربط مؤشرات المبيعات والديون والمخزون بالموبايل، وتطبيق الصلاحيات وسجل التعديلات.' },
    ],
    output: ['دورة بيع وشراء ومرتجع وتحويل مترابطة.', 'تقارير مخزون وربحية وتنبيهات حد الطلب.', 'نسخة أولية للمزامنة ولوحة المدير.'],
    review: 'تنفيذ استلام ثم بيع ومرتجع وتحويل ومراجعة الأرصدة؛ ثم فصل الاتصال وحفظ عملية وتجربة مزامنتها بعد العودة.',
    prerequisite: 'مراجعة الحسابات وتحديد أجهزة التشغيل وأدوار الموظفين وحدود الوصول.',
  },
  {
    schedule: [
      { label: range('sync', 22, 28), text: 'استكمال المزامنة والموبايل والصلاحيات واختبار النسخ الاحتياطي والاستعادة.' },
      { label: range('launch', 22, 28), text: 'ترحيل تجريبي ثم نهائي، ومطابقة الأرصدة والتدريب والتشغيل وإغلاق الملاحظات.' },
      { label: `${PROJECT.deliveryDay} ديسمبر`, text: 'مراجعة قائمة القبول وتسليم النسخة النهائية ودليل التشغيل ومحضر التسليم.' },
    ],
    implementation: [
      { label: 'المراجعة الفنية والبيانات', text: 'اختبار الدمج ومنع التكرار، وفحص استيراد الجداول والتكرار والشذوذ، ثم مطابقة الأصناف والحسابات والأرصدة.' },
      { label: 'التدريب حسب الدور', text: 'البيع: فاتورة ومرتجع؛ المخزن: استلام وتحويل؛ المحاسب: قيد وتحصيل؛ الإدارة: تقارير وموبايل ومساعد أسئلة.' },
      { label: 'التشغيل والتسليم', text: 'تشغيل السيناريوهات على النسخة النهائية، وتصحيح الملاحظات المؤثرة، وتسليم دليل الاستخدام والنسخ الاحتياطي.' },
    ],
    output: ['بيانات نهائية وأرصدة تمت مطابقتها.', 'نسخة تشغيل وتطبيق موبايل ولوحة إدارة.', 'تدريب ودليل تشغيل ومحضر قبول وتسليم.'],
    review: 'مراجعة السيناريوهات التشغيلية والمحاسبية والصلاحيات والمزامنة واستعادة نسخة احتياطية؛ واعتماد النتيجة قبل التسليم.',
    prerequisite: 'حضور مسؤولي الأقسام للتدريب والمراجعة، واعتماد البيانات وموعد النقل النهائي.',
  },
];

function WeekWork({ index }: { index: number }) {
  const w = WEEKS[index]; const d = DETAILS[index];
  if (!w || !d) return null;
  return <Light kicker={`${w.name} • ${w.start}–${w.end} ديسمبر ${PROJECT.year}`} title={w.title}>
    <div className="flex h-full flex-col">{d.schedule.map((t,i) => <div key={t.label} className="grid grid-cols-[0.7fr_2fr] gap-10 border-b border-border py-8"><div className="s-sub text-teal">{t.label}</div><p className="s-body-lg text-navy">{t.text}</p></div>)}
    <p className="s-cap mt-auto border-t-4 border-gold pt-6 text-muted-foreground">توزيع تفصيلي للتنفيذ والمراجعة ضمن خطة ديسمبر، وليس تقريرًا عن أعمال اكتملت بالفعل.</p></div>
  </Light>;
}
function WeekDetail({ index }: { index: number }) {
  const w = WEEKS[index]; const d = DETAILS[index];
  if (!w || !d) return null;
  return <Light kicker={`${w.name} • تفاصيل ما سيتم تنفيذه`} title="ما الذي سنبنيه داخل البرنامج؟">
    <div className="grid h-full grid-cols-3 gap-12">{d.implementation.map((t,i) => <div key={t.label} className="flex flex-col border-t-4 border-teal pt-9"><span className="s-date num mb-9 text-gold">0{i+1}</span><h3 className="s-sub mb-7 text-navy">{t.label}</h3><p className="s-body-lg text-muted-foreground">{t.text}</p></div>)}</div>
  </Light>;
}
function WeekReview({ index }: { index: number }) {
  const w = WEEKS[index]; const d = DETAILS[index];
  if (!w || !d) return null;
  return <Light kicker={`${w.name} • التسليم المرحلي والمراجعة`} title="ماذا سترى الشركة في نهاية الأسبوع؟">
    <div className="phase-layout grid h-full grid-cols-[1fr_1.15fr] gap-14"><div><div className="s-kicker mb-8 text-teal">المخرجات المعروضة</div>{d.output.map(t => <p key={t} className="s-body-lg mb-9 flex items-start gap-5 text-navy"><FileCheck2 size={36} className="shrink-0 text-teal"/>{t}</p>)}<div className="border-t border-border pt-7"><h3 className="s-kicker mb-4 text-teal">المطلوب من الشركة</h3><p className="s-body text-muted-foreground">{d.prerequisite}</p></div></div>
    <div className="flex flex-col border-r-2 border-teal pr-10"><div className="s-kicker mb-8 flex items-center gap-4 text-teal"><ClipboardCheck size={36}/>جلسة المراجعة</div><p className="s-body-lg text-navy">{d.review}</p><div className="mt-auto bg-navy p-8 text-primary-foreground"><h3 className="s-kicker mb-4 text-gold">نتيجة المراجعة</h3><p className="s-body">تسجيل الملاحظات، وتحديد ما يحتاج تعديلًا، واعتماد ما تم اختباره قبل الانتقال للخطوة التالية.</p></div></div></div>
  </Light>;
}
export const WeekOneWork = () => <WeekWork index={0}/>;
export const WeekOneDetail = () => <WeekDetail index={0}/>;
export const WeekOneReview = () => <WeekReview index={0}/>;
export const WeekTwoWork = () => <WeekWork index={1}/>;
export const WeekTwoDetail = () => <WeekDetail index={1}/>;
export const WeekTwoReview = () => <WeekReview index={1}/>;
export const WeekThreeWork = () => <WeekWork index={2}/>;
export const WeekThreeDetail = () => <WeekDetail index={2}/>;
export const WeekThreeReview = () => <WeekReview index={2}/>;
export const WeekFourWork = () => <WeekWork index={3}/>;
export const WeekFourDetail = () => <WeekDetail index={3}/>;
export const WeekFourReview = () => <WeekReview index={3}/>;

export function Acceptance() {
  const rows = [['بيع ومرتجع', 'مطابقة الفاتورة والمخزون ورصيد العميل'], ['شراء وتحويل مخزني', 'مطابقة الكمية والتكلفة وأرصدة المخازن'], ['قيد وضريبة وتحصيل', 'مطابقة الأستاذ والميزان وأرصدة الحسابات'], ['انقطاع وعودة الاتصال', 'حفظ العملية ومزامنتها دون تكرار'], ['صلاحيات واستعادة نسخة', 'مراجعة الوصول المسموح ونجاح الاستعادة']];
  return <Light kicker="الأسبوع الرابع • قائمة مراجعة التسليم" title="ما الذي نختبره قبل اعتماد النسخة؟"><div className="acceptance-table">{rows.map(([t,d]) => <div key={t} className="grid grid-cols-[0.8fr_1.5fr_auto] items-center gap-8 border-b border-border py-6"><h3 className="s-body-lg text-navy">{t}</h3><p className="s-body text-muted-foreground">{d}</p><BadgeCheck size={36} className="text-teal"/></div>)}</div><p className="s-cap mt-8 text-teal">تُوثّق النتيجة الفعلية ومسؤول المراجعة، وتُغلق الملاحظات المؤثرة قبل توقيع محضر التسليم.</p></Light>;
}
export function Handover() {
  return <Light kicker={`${PROJECT.deliveryDay} ديسمبر ${PROJECT.year} • التسليم النهائي`} title="محتويات التسليم النهائي للشركة">
    <div className="grid h-full grid-cols-3 gap-12">{[
      ['البرنامج والبيانات', 'نسخة التشغيل النهائية، وتطبيق الموبايل ولوحة المدير، وبيانات وأرصدة تمت مراجعتها.'],
      ['التشغيل والتدريب', 'تدريب الأقسام على مهامها، ودليل للاستخدام اليومي والنسخ الاحتياطي والاستعادة.'],
      ['التوثيق والاعتماد', 'نتائج الاختبارات ومحضر التسليم، وبيانات الوصول تُسلّم لمسؤول الشركة بشكل آمن.'],
    ].map(([t,d]) => <div key={t} className="border-t-4 border-teal pt-9"><PackageCheck size={56} className="mb-9 text-gold"/><h3 className="s-sub mb-7 text-navy">{t}</h3><p className="s-body-lg text-muted-foreground">{d}</p></div>)}</div>
  </Light>;
}
