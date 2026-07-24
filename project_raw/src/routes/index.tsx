import { createFileRoute } from "@tanstack/react-router";
import burger from "@/assets/food-burger.jpg";
import shawarma from "@/assets/food-shawarma.jpg";
import pizza from "@/assets/food-pizza.jpg";
import coffee from "@/assets/food-coffee.jpg";
import kunafa from "@/assets/food-kunafa.jpg";
import salad from "@/assets/food-salad.jpg";
import chicken from "@/assets/food-chicken.jpg";
import dessert from "@/assets/food-dessert.jpg";
import juice from "@/assets/food-juice.jpg";
import sushi from "@/assets/food-sushi.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "معرض المنيوهات — Digital Menu Showreel" },
      {
        name: "description",
        content:
          "معرض تصاميم منيوهات إلكترونية عربية للمطاعم والكافيهات بأشكال جرافيكية متنوعة",
      },
      { property: "og:title", content: "معرض المنيوهات الإلكترونية" },
      {
        property: "og:description",
        content: "تصاميم منيوهات جرافيكية للمطاعم والكافيهات",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Showcase,
});

/* ---------------- Phone frame wrapper ---------------- */

function Phone({
  children,
  bg = "#000",
}: {
  children: React.ReactNode;
  bg?: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      <div
        className="relative overflow-hidden rounded-[38px] p-[3px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10"
        style={{ background: "linear-gradient(145deg,#2a2a2a,#0a0a0a)" }}
      >
        <div
          className="relative aspect-[9/19.5] overflow-hidden rounded-[35px] text-black"
          style={{ background: bg, fontFamily: "Cairo, sans-serif" }}
          dir="rtl"
        >
          {/* notch */}
          <div className="absolute left-1/2 top-2 z-30 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
          <div className="relative h-full w-full overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- 1. Talabat-style: Burger Palace (orange) ---------------- */

const Design1 = () => (
  <Phone bg="#fff">
    <div className="flex h-full flex-col text-[#1a1a1a]">
      {/* status */}
      <div className="pt-8 px-4 pb-2 flex justify-between text-[10px] font-bold text-black/70">
        <span>9:41</span>
        <span>●●●</span>
      </div>
      {/* hero */}
      <div className="relative h-40 mx-3 rounded-2xl overflow-hidden">
        <img src={burger} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-3 right-3 text-white">
          <div className="text-[9px] font-bold bg-[#ff5a1f] inline-block px-2 py-0.5 rounded-full">خصم ٢٥٪</div>
          <div className="mt-1 text-lg font-black leading-tight">برجر بالاس</div>
          <div className="text-[10px] opacity-80">⭐ ٤.٨ · ٢٥ دقيقة · توصيل مجاني</div>
        </div>
      </div>
      {/* categories */}
      <div className="px-3 mt-3 flex gap-2 overflow-hidden">
        {["الأكثر مبيعاً","برجر","دجاج","حلويات","مشروبات"].map((c,i)=>(
          <div key={c} className={`text-[10px] whitespace-nowrap px-3 py-1.5 rounded-full font-bold ${i===0?"bg-[#ff5a1f] text-white":"bg-black/5"}`}>{c}</div>
        ))}
      </div>
      {/* items */}
      <div className="mt-3 px-3 space-y-2 flex-1 overflow-hidden">
        {[
          {n:"دبل تشيز برجر", d:"لحم بقري ٢٠٠جم، جبن شيدر", p:"١٢٥", img:burger},
          {n:"كرسبي تشيكن", d:"دجاج مقرمش مع بطاطس", p:"٩٥", img:chicken},
          {n:"سلطة الشيف", d:"دجاج مشوي، أفوكادو، طماطم", p:"٨٥", img:salad},
        ].map(i=>(
          <div key={i.n} className="flex gap-2 bg-white p-2 rounded-xl border border-black/5">
            <div className="flex-1">
              <div className="text-[12px] font-bold">{i.n}</div>
              <div className="text-[10px] text-black/60 leading-tight mt-0.5">{i.d}</div>
              <div className="mt-1 text-[12px] font-black text-[#ff5a1f]">{i.p} ج.م</div>
            </div>
            <div className="relative h-16 w-16 rounded-lg overflow-hidden">
              <img src={i.img} alt="" loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute -bottom-1 -left-1 h-7 w-7 rounded-full bg-[#ff5a1f] text-white grid place-items-center text-lg font-black">+</div>
            </div>
          </div>
        ))}
      </div>
      {/* bottom cart */}
      <div className="mx-3 mb-3 rounded-xl bg-[#ff5a1f] text-white p-3 flex justify-between items-center">
        <div className="text-[10px]"><span className="bg-white/25 rounded px-1.5 py-0.5 font-bold">٣</span> عناصر</div>
        <div className="text-[12px] font-black">عرض السلة ← ٣٠٥ ج.م</div>
      </div>
    </div>
  </Phone>
);

/* ---------------- 2. Dark premium: Sushi restaurant ---------------- */

const Design2 = () => (
  <Phone bg="#0a0a0a">
    <div className="flex h-full flex-col text-[#f0e4c8]">
      <div className="pt-8 px-4 pb-2 flex justify-between text-[10px] opacity-60">
        <span>9:41</span><span>●●●</span>
      </div>
      <div className="px-4">
        <div className="text-[9px] tracking-[0.3em] opacity-60">TOKYO · طوكيو</div>
        <div className="text-2xl font-black" style={{fontFamily:"Tajawal"}}>ساكورا</div>
        <div className="text-[10px] opacity-70 mt-1">مطبخ ياباني أصيل · ⭐ ٤.٩</div>
      </div>
      {/* hero image */}
      <div className="relative mx-4 mt-3 h-44 rounded-2xl overflow-hidden">
        <img src={sushi} alt="" loading="lazy" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent" />
        <div className="absolute bottom-2 right-3 text-[10px] font-bold">توصيل خلال ٤٠ دقيقة</div>
      </div>
      {/* tabs */}
      <div className="mt-4 px-4 flex gap-4 text-[11px] border-b border-white/10 pb-2">
        {["السوشي","الرامن","المقبلات","الحلويات"].map((t,i)=>(
          <div key={t} className={i===0?"font-black border-b-2 border-[#f0e4c8] pb-1 -mb-3":"opacity-50"}>{t}</div>
        ))}
      </div>
      {/* items */}
      <div className="flex-1 px-4 pt-3 space-y-3 overflow-hidden">
        {[
          {n:"سالمون نيغيري", p:"١٨٠", d:"٦ قطع · سلمون نرويجي"},
          {n:"رول كاليفورنيا", p:"١٥٥", d:"٨ قطع · أفوكادو وكابوريا"},
          {n:"دراجون رول", p:"٢٢٥", d:"١٠ قطع · مميز"},
        ].map(i=>(
          <div key={i.n} className="flex justify-between items-start border-b border-white/5 pb-2">
            <div>
              <div className="text-[13px] font-bold">{i.n}</div>
              <div className="text-[10px] opacity-60 mt-0.5">{i.d}</div>
            </div>
            <div className="text-[13px] font-black text-[#e8b84a]">{i.p} ر.س</div>
          </div>
        ))}
      </div>
      <div className="mx-4 mb-4 rounded-full bg-[#e8b84a] text-black py-3 text-center text-[12px] font-black">
        اطلب الآن — ٣٦٠ ر.س
      </div>
    </div>
  </Phone>
);

/* ---------------- 3. Coffee shop — minimal pastel ---------------- */

const Design3 = () => (
  <Phone bg="#f5efe6">
    <div className="flex h-full flex-col text-[#3a2818]">
      <div className="pt-8 px-4 pb-2 flex justify-between text-[10px] font-bold opacity-60">
        <span>9:41</span><span>●●●</span>
      </div>
      <div className="px-4 flex justify-between items-center">
        <div>
          <div className="text-[10px] opacity-60">صباح الخير ☕</div>
          <div className="text-lg font-black">أهلاً أحمد</div>
        </div>
        <div className="h-10 w-10 rounded-full bg-[#3a2818] text-[#f5efe6] grid place-items-center font-black">أ</div>
      </div>
      {/* featured card */}
      <div className="mx-4 mt-3 relative rounded-3xl overflow-hidden bg-[#3a2818] text-[#f5efe6] p-4">
        <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-[#c9a97a] opacity-30" />
        <div className="text-[9px] tracking-widest opacity-70">القهوة المختصة</div>
        <div className="text-xl font-black mt-1 leading-tight">لاتيه<br/>الكراميل</div>
        <div className="relative mt-2 flex justify-between items-end">
          <div className="text-lg font-black">٤٥ ر.س</div>
          <img src={coffee} alt="" loading="lazy" className="h-24 w-24 rounded-full object-cover ring-4 ring-[#c9a97a]/40" />
        </div>
      </div>
      <div className="px-4 mt-4 flex justify-between text-[11px] font-bold">
        <div>القائمة</div>
        <div className="opacity-50">عرض الكل ←</div>
      </div>
      <div className="mt-2 px-4 grid grid-cols-2 gap-2 flex-1 overflow-hidden">
        {[
          {n:"إسبريسو", p:"٢٥", img:coffee},
          {n:"كنافة", p:"٥٥", img:kunafa},
          {n:"عصير فراولة", p:"٣٠", img:juice},
          {n:"لافا كيك", p:"٦٥", img:dessert},
        ].map(i=>(
          <div key={i.n} className="bg-white rounded-2xl p-2">
            <img src={i.img} alt="" loading="lazy" className="h-16 w-full object-cover rounded-xl" />
            <div className="mt-1 text-[11px] font-bold">{i.n}</div>
            <div className="flex justify-between items-center mt-0.5">
              <span className="text-[10px] font-black">{i.p} ر.س</span>
              <span className="h-5 w-5 rounded-full bg-[#3a2818] text-white text-xs grid place-items-center">+</span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 flex justify-around border-t border-black/10 text-[10px]">
        {["الرئيسية","قائمة","سلة","حساب"].map((n,i)=>(
          <div key={n} className={i===0?"font-black":"opacity-40"}>{n}</div>
        ))}
      </div>
    </div>
  </Phone>
);

/* ---------------- 4. Pizza — bold red brutalist ---------------- */

const Design4 = () => (
  <Phone bg="#ffeb3b">
    <div className="flex h-full flex-col text-black">
      <div className="pt-8 px-4 pb-2 flex justify-between text-[10px] font-black">
        <span>9:41</span><span>●●●</span>
      </div>
      <div className="px-4">
        <div className="text-[10px] font-black tracking-widest">NAPOLI · نابولي</div>
        <div className="text-4xl font-black leading-none">بيتزا<br/>هوت!</div>
        <div className="mt-2 inline-block bg-black text-[#ffeb3b] text-[10px] font-black px-2 py-1">توصيل ٢٠ دقيقة</div>
      </div>
      <div className="relative mx-4 mt-3 aspect-square rounded-full overflow-hidden border-4 border-black">
        <img src={pizza} alt="" loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="mt-3 px-4 space-y-2 flex-1 overflow-hidden">
        {[
          {n:"مارجريتا كلاسيك",p:"١٢٠"},
          {n:"بيبروني نار",p:"١٥٠"},
          {n:"باربكيو دجاج",p:"١٦٥"},
        ].map(i=>(
          <div key={i.n} className="flex justify-between items-center bg-black text-[#ffeb3b] px-3 py-2 font-black">
            <span className="text-[12px]">{i.n}</span>
            <span className="text-[13px]">{i.p} ج.م</span>
          </div>
        ))}
      </div>
      <div className="mx-4 mb-4 bg-black text-[#ffeb3b] text-center py-3 font-black text-[13px] border-4 border-black">
        اطلب الآن ← ٤٣٥ ج.م
      </div>
    </div>
  </Phone>
);

/* ---------------- 5. Shawarma — street food green ---------------- */

const Design5 = () => (
  <Phone bg="#0f3d2e">
    <div className="flex h-full flex-col text-[#e8dcc2]">
      <div className="pt-8 px-4 pb-2 flex justify-between text-[10px] opacity-60">
        <span>9:41</span><span>●●●</span>
      </div>
      <div className="px-4 flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-[#e8dcc2] text-[#0f3d2e] grid place-items-center font-black">ش</div>
        <div>
          <div className="font-black text-lg">شاورما البيت</div>
          <div className="text-[10px] opacity-70">⭐ ٤.٧ · مطبخ شامي</div>
        </div>
      </div>
      {/* filter chips */}
      <div className="px-4 mt-3 flex gap-2">
        {["الكل","ساندويتش","وجبات","إضافات"].map((c,i)=>(
          <span key={c} className={`text-[10px] font-bold px-3 py-1 rounded-full ${i===0?"bg-[#e8dcc2] text-[#0f3d2e]":"border border-[#e8dcc2]/30"}`}>{c}</span>
        ))}
      </div>
      {/* big featured */}
      <div className="mx-4 mt-3 rounded-2xl overflow-hidden relative">
        <img src={shawarma} alt="" loading="lazy" className="h-36 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f3d2e] via-transparent" />
        <div className="absolute bottom-2 right-3">
          <div className="text-[9px] bg-[#e8dcc2] text-[#0f3d2e] inline-block px-2 py-0.5 rounded font-black">جديد</div>
          <div className="text-lg font-black mt-1">شاورما دجاج مميزة</div>
          <div className="text-[11px] font-black">٦٥ ج.م</div>
        </div>
      </div>
      <div className="px-4 mt-3 space-y-2 flex-1 overflow-hidden">
        {[
          {n:"وجبة شاورما لحم",d:"مع بطاطس ومشروب",p:"١٢٠"},
          {n:"صحن مشاوي مشكل",d:"كباب، كفتة، شيش طاووق",p:"٢٢٠"},
          {n:"فتة حمص",d:"مع صنوبر وسمنة",p:"٤٥"},
        ].map(i=>(
          <div key={i.n} className="flex justify-between items-start border-b border-[#e8dcc2]/10 pb-2">
            <div>
              <div className="text-[12px] font-bold">{i.n}</div>
              <div className="text-[10px] opacity-60">{i.d}</div>
            </div>
            <div className="text-[12px] font-black">{i.p} ج.م</div>
          </div>
        ))}
      </div>
      <div className="mx-4 mb-4 rounded-full bg-[#e8dcc2] text-[#0f3d2e] py-3 text-center text-[12px] font-black">
        متابعة الطلب ←
      </div>
    </div>
  </Phone>
);

/* ---------------- 6. Sweets / kunafa — pink elegant ---------------- */

const Design6 = () => (
  <Phone bg="#fbe4e9">
    <div className="flex h-full flex-col text-[#4a1c2a]">
      <div className="pt-8 px-4 pb-2 flex justify-between text-[10px] opacity-60">
        <span>9:41</span><span>●●●</span>
      </div>
      <div className="px-4 text-center">
        <div className="text-[9px] tracking-[0.4em] opacity-60">SWEETS · حلويات</div>
        <div className="text-3xl font-black italic" style={{fontFamily:"Tajawal"}}>سُكّر</div>
        <div className="h-px w-16 bg-[#4a1c2a] mx-auto mt-2 opacity-30" />
      </div>
      <div className="relative mx-4 mt-3 h-40 rounded-2xl overflow-hidden">
        <img src={kunafa} alt="" loading="lazy" className="h-full w-full object-cover" />
        <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-[9px] font-black">اليوم فقط ✨</div>
      </div>
      <div className="px-4 mt-3 text-center">
        <div className="text-[10px] opacity-60">الأشهى اليوم</div>
        <div className="text-lg font-black">كنافة نابلسية بالفستق</div>
        <div className="text-[13px] font-black mt-1">٧٥ ر.س</div>
      </div>
      <div className="px-4 mt-3 grid grid-cols-3 gap-2 flex-1 overflow-hidden">
        {[
          {n:"كنافة",img:kunafa},
          {n:"لافا كيك",img:dessert},
          {n:"عصائر",img:juice},
          {n:"قهوة",img:coffee},
          {n:"سلطات",img:salad},
          {n:"بيتزا حلوة",img:pizza},
        ].map(i=>(
          <div key={i.n} className="text-center">
            <div className="h-16 w-full rounded-2xl overflow-hidden">
              <img src={i.img} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="text-[10px] font-bold mt-1">{i.n}</div>
          </div>
        ))}
      </div>
      <div className="mx-4 mb-4 rounded-2xl bg-[#4a1c2a] text-[#fbe4e9] py-3 text-center text-[12px] font-black">
        أضف إلى السلة — ٧٥ ر.س
      </div>
    </div>
  </Phone>
);

/* ---------------- 7. Multi-restaurant homepage (Talabat style) ---------------- */

const Design7 = () => (
  <Phone bg="#f5f5f5">
    <div className="flex h-full flex-col text-[#1a1a1a]">
      <div className="bg-[#ff5a1f] text-white pt-8 px-4 pb-4 rounded-b-3xl">
        <div className="flex justify-between text-[10px] opacity-90"><span>9:41</span><span>●●●</span></div>
        <div className="mt-3">
          <div className="text-[10px] opacity-80">التوصيل إلى</div>
          <div className="font-black text-sm">📍 المهندسين، القاهرة ▾</div>
        </div>
        <div className="mt-3 bg-white rounded-full px-3 py-2 flex items-center gap-2 text-[11px] text-black">
          <span className="opacity-40">🔍</span>
          <span className="opacity-50">ابحث عن مطعم أو طبق</span>
        </div>
      </div>
      {/* categories */}
      <div className="px-4 mt-3 grid grid-cols-4 gap-2 text-center">
        {[
          {n:"برجر",i:"🍔"},
          {n:"بيتزا",i:"🍕"},
          {n:"شاورما",i:"🌯"},
          {n:"حلويات",i:"🍰"},
        ].map(c=>(
          <div key={c.n} className="bg-white rounded-2xl p-2">
            <div className="text-xl">{c.i}</div>
            <div className="text-[10px] font-bold mt-0.5">{c.n}</div>
          </div>
        ))}
      </div>
      <div className="px-4 mt-3 flex justify-between text-[11px] font-bold">
        <div>المطاعم القريبة</div>
        <div className="text-[#ff5a1f]">عرض الكل</div>
      </div>
      <div className="mt-2 px-4 space-y-2 flex-1 overflow-hidden">
        {[
          {n:"برجر بالاس",t:"برجر · أمريكي",img:burger,r:"٤.٨",t2:"٢٥ د"},
          {n:"شاورما البيت",t:"شامي · مشاوي",img:shawarma,r:"٤.٧",t2:"٣٠ د"},
          {n:"ساكورا سوشي",t:"ياباني",img:sushi,r:"٤.٩",t2:"٤٠ د"},
        ].map(r=>(
          <div key={r.n} className="bg-white rounded-2xl overflow-hidden flex">
            <img src={r.img} alt="" loading="lazy" className="h-20 w-20 object-cover" />
            <div className="flex-1 p-2">
              <div className="flex justify-between">
                <div className="text-[12px] font-black">{r.n}</div>
                <div className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 rounded">⭐ {r.r}</div>
              </div>
              <div className="text-[10px] opacity-60 mt-0.5">{r.t}</div>
              <div className="text-[10px] mt-1 flex gap-2">
                <span>🛵 {r.t2}</span>
                <span className="text-[#ff5a1f] font-bold">توصيل مجاني</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-2 bg-white border-t border-black/5 flex justify-around text-[10px]">
        {["الرئيسية","بحث","طلباتي","الحساب"].map((n,i)=>(
          <div key={n} className={i===0?"font-black text-[#ff5a1f]":"opacity-40"}>{n}</div>
        ))}
      </div>
    </div>
  </Phone>
);

/* ---------------- 8. Item detail page ---------------- */

const Design8 = () => (
  <Phone bg="#fff">
    <div className="flex h-full flex-col">
      <div className="relative h-56">
        <img src={burger} alt="" loading="lazy" className="h-full w-full object-cover" />
        <div className="absolute top-8 right-3 h-9 w-9 rounded-full bg-white/90 grid place-items-center">←</div>
        <div className="absolute top-8 left-3 h-9 w-9 rounded-full bg-white/90 grid place-items-center">♡</div>
      </div>
      <div className="flex-1 -mt-6 bg-white rounded-t-3xl px-4 pt-4 overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[10px] opacity-60">برجر بالاس</div>
            <div className="text-xl font-black">دبل تشيز برجر</div>
          </div>
          <div className="text-lg font-black text-[#ff5a1f]">١٢٥ ج.م</div>
        </div>
        <div className="mt-2 flex gap-3 text-[10px] opacity-60">
          <span>⭐ ٤.٩</span><span>🔥 ٦٥٠ سعرة</span><span>⏱ ١٥ دقيقة</span>
        </div>
        <div className="mt-3 text-[11px] leading-relaxed opacity-70">
          قطعتين لحم بقري ٢٠٠ جم مشوي على الفحم، مع جبن شيدر ذائب، خس، طماطم، وصلصة البرجر الخاصة داخل خبز البريوش.
        </div>
        <div className="mt-3 text-[12px] font-black">الإضافات</div>
        <div className="mt-2 space-y-2 text-[11px]">
          {[
            {n:"جبن إضافي",p:"+١٠"},
            {n:"بيكون مقرمش",p:"+١٥"},
            {n:"بطاطس مقلية",p:"+٢٠"},
          ].map((a,i)=>(
            <div key={a.n} className="flex justify-between items-center py-1 border-b border-black/5">
              <div className="flex items-center gap-2">
                <div className={`h-4 w-4 rounded border-2 ${i===0?"bg-[#ff5a1f] border-[#ff5a1f]":"border-black/30"}`}></div>
                <span>{a.n}</span>
              </div>
              <span className="font-bold">{a.p} ج.م</span>
            </div>
          ))}
        </div>
      </div>
      <div className="p-3 flex gap-2 border-t border-black/5">
        <div className="flex items-center bg-black/5 rounded-full">
          <button className="h-9 w-9 font-black">−</button>
          <span className="px-2 font-black text-sm">١</span>
          <button className="h-9 w-9 font-black">+</button>
        </div>
        <button className="flex-1 rounded-full bg-[#ff5a1f] text-white font-black text-[12px]">أضف للسلة · ١٣٥ ج.م</button>
      </div>
    </div>
  </Phone>
);

/* ---------------- Showcase Page ---------------- */

const designs = [
  { c: Design1, n: "برجر بالاس", s: "أوردر عادي — برتقالي" },
  { c: Design7, n: "الصفحة الرئيسية", s: "قائمة مطاعم" },
  { c: Design8, n: "تفاصيل الطبق", s: "شاشة الإضافات" },
  { c: Design2, n: "ساكورا سوشي", s: "بريميوم داكن" },
  { c: Design3, n: "قهوة الصباح", s: "مينيمال باستيل" },
  { c: Design4, n: "بيتزا هوت", s: "بروتاليست جريء" },
  { c: Design5, n: "شاورما البيت", s: "شرقي أخضر" },
  { c: Design6, n: "سُكّر للحلويات", s: "أنيق وردي" },
];

function Showcase() {
  return (
    <div
      dir="rtl"
      className="min-h-screen text-white"
      style={{
        fontFamily: "Cairo, sans-serif",
        background:
          "radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a15 50%, #000 100%)",
      }}
    >
      {/* Hero */}
      <header className="px-6 pt-16 pb-10 md:px-12 text-center">
        <div className="text-[11px] tracking-[0.4em] opacity-60">SHOWREEL · معرض التصاميم</div>
        <h1 className="mt-3 text-4xl md:text-6xl font-black leading-tight">
          منيوهات إلكترونية
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg,#ff5a1f,#e8b84a,#ff5a1f)" }}
          >
            جرافيكية · احترافية
          </span>
        </h1>
        <p className="mt-4 max-w-lg mx-auto text-sm opacity-70">
          مجموعة تصاميم متنوعة لتطبيقات ومنيوهات المطاعم، الكافيهات، والحلويات
          — بصور حقيقية وأشكال مختلفة لعرض على العملاء.
        </p>
        <div className="mt-6 flex justify-center gap-6 text-[10px] tracking-widest opacity-70">
          <div><div className="text-2xl font-black text-white opacity-100">٨</div>تصاميم</div>
          <div><div className="text-2xl font-black text-white opacity-100">١٠</div>صور</div>
          <div><div className="text-2xl font-black text-white opacity-100">٥</div>أنماط</div>
        </div>
      </header>

      {/* Grid of phones */}
      <main className="px-6 md:px-12 pb-16">
        <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {designs.map(({ c: C, n, s }, i) => (
            <figure key={i} className="group">
              <div className="transition-transform duration-500 group-hover:-translate-y-2">
                <C />
              </div>
              <figcaption className="mt-5 text-center">
                <div className="text-[10px] tracking-widest opacity-50">
                  ٠{i + 1} · {s}
                </div>
                <div className="mt-1 font-black text-sm">{n}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-[10px] tracking-[0.3em] opacity-40">
        MENU SHOWREEL · معرض المنيوهات · 2026
      </footer>
    </div>
  );
}
