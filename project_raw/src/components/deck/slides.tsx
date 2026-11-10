import type { ReactNode } from 'react';
import { Phone } from 'lucide-react';
import { Dark, Logo } from './parts';
import { PROJECT } from './project';
import cover from '@/assets/cover_store.jpg';
import {
  WeeklyMap, FirstDay, Acceptance, Handover,
  WeekOneWork, WeekOneDetail, WeekOneReview,
  WeekTwoWork, WeekTwoDetail, WeekTwoReview,
  WeekThreeWork, WeekThreeDetail, WeekThreeReview,
  WeekFourWork, WeekFourDetail, WeekFourReview,
} from './journey';

function Cover() {
  return <Dark><img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45"/><div className="absolute inset-0 bg-gradient-to-l from-navy-deep via-navy-deep/85 to-transparent"/>
    <div className="relative flex h-full flex-col justify-between p-[110px]"><div className="flex items-center justify-between"><Logo className="h-28"/><span className="s-cap text-gold">شركة الغربية لقطع غيار السيارات</span></div>
      <div className="max-w-[1300px]"><div className="s-kicker mb-7 text-gold">خطة تنفيذ البرنامج • ديسمبر {PROJECT.year}</div><h1 className="s-title-lg">منظومة الغربية<br/>خطة العمل الأسبوعية</h1><p className="s-sub mt-9">ما سيتم تنفيذه في كل أسبوع، وما ستراجعه الشركة، وصولًا إلى التسليم النهائي.</p></div>
      <div className="s-body text-gold">بدء الإنشاء 1 ديسمبر • التسليم {PROJECT.deliveryDay} ديسمبر {PROJECT.year}</div>
    </div>
  </Dark>;
}
function Closing() {
  return <Dark><img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20"/>
    <div className="relative flex h-full flex-col justify-between p-[110px]"><div className="flex items-center justify-between"><div className="s-kicker text-gold">نهاية خطة التنفيذ</div><Logo className="h-24"/></div>
      <div><h2 className="s-title-lg">جاهزون للتشغيل<br/>يوم <span className="text-gold num">{PROJECT.deliveryDay}</span> ديسمبر</h2><p className="s-body-lg mt-10 max-w-[1150px]">بعد مراجعة النسخة النهائية والبيانات وتدريب الأقسام، نوقّع محضر التسليم ونبدأ متابعة التشغيل.</p><p className="s-body mt-8 text-gold">التسليم قبل {PROJECT.deadlineDay} ديسمبر {PROJECT.year} • دعم {PROJECT.supportMonths} شهور بعد التسليم</p></div>
      <div className="flex justify-end"><div className="flex flex-col items-center"><div className="signature text-[88px] leading-[1.25] text-gold">عادل رجب</div><a href={`tel:${PROJECT.phone}`} className="s-body mt-5 flex items-center gap-4"><Phone size={32} className="text-gold"/><span className="num">{PROJECT.phone}</span></a></div></div>
    </div>
  </Dark>;
}

export const SLIDES: { id: string; chapter: string; title: string; C: () => ReactNode }[] = [
  { id: 'cover', chapter: 'خطة التنفيذ', title: 'خطة العمل الأسبوعية', C: Cover },
  { id: 'weeks', chapter: 'خطة التنفيذ', title: 'ملخص الأسابيع الأربعة', C: WeeklyMap },
  { id: 'first-day', chapter: 'الأسبوع الأول', title: 'اليوم الأول: تجهيز العمل', C: FirstDay },
  { id: 'week-one-work', chapter: 'الأسبوع الأول', title: 'الأسبوع الأول: الأعمال والجدول', C: WeekOneWork },
  { id: 'week-one-detail', chapter: 'الأسبوع الأول', title: 'الأسبوع الأول: تفاصيل التنفيذ', C: WeekOneDetail },
  { id: 'week-one-review', chapter: 'الأسبوع الأول', title: 'الأسبوع الأول: المخرجات والمراجعة', C: WeekOneReview },
  { id: 'week-two-work', chapter: 'الأسبوع الثاني', title: 'الأسبوع الثاني: الأعمال والجدول', C: WeekTwoWork },
  { id: 'week-two-detail', chapter: 'الأسبوع الثاني', title: 'الأسبوع الثاني: تفاصيل التنفيذ', C: WeekTwoDetail },
  { id: 'week-two-review', chapter: 'الأسبوع الثاني', title: 'الأسبوع الثاني: المخرجات والمراجعة', C: WeekTwoReview },
  { id: 'week-three-work', chapter: 'الأسبوع الثالث', title: 'الأسبوع الثالث: الأعمال والجدول', C: WeekThreeWork },
  { id: 'week-three-detail', chapter: 'الأسبوع الثالث', title: 'الأسبوع الثالث: تفاصيل التنفيذ', C: WeekThreeDetail },
  { id: 'week-three-review', chapter: 'الأسبوع الثالث', title: 'الأسبوع الثالث: المخرجات والمراجعة', C: WeekThreeReview },
  { id: 'week-four-work', chapter: 'الأسبوع الرابع', title: 'الأسبوع الرابع: الأعمال والجدول', C: WeekFourWork },
  { id: 'week-four-detail', chapter: 'الأسبوع الرابع', title: 'الأسبوع الرابع: تفاصيل التنفيذ', C: WeekFourDetail },
  { id: 'week-four-review', chapter: 'الأسبوع الرابع', title: 'الأسبوع الرابع: المخرجات والمراجعة', C: WeekFourReview },
  { id: 'acceptance', chapter: 'التسليم النهائي', title: 'اختبارات ما قبل التسليم', C: Acceptance },
  { id: 'handover', chapter: 'التسليم النهائي', title: 'محتويات التسليم النهائي', C: Handover },
  { id: 'closing', chapter: 'التسليم النهائي', title: 'التسليم ومتابعة التشغيل', C: Closing },
];
