import { createFileRoute } from "@tanstack/react-router";
import { Deck } from "@/components/deck/Deck";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    slide: Math.max(1, Math.floor(Number(search['slide']) || 1)),
    print: search['print'] === true || search['print'] === 'true',
  }),
  head: () => ({
    meta: [
      { title: "خطة تنفيذ منظومة الغربية أسبوعًا بأسبوع | Cairo Code" },
      { name: "description", content: "تفاصيل تنفيذ برنامج الغربية خلال الأسابيع الأربعة من ديسمبر 2026: الأعمال، والمخرجات، والمراجعة، والتدريب، والتسليم النهائي." },
      { property: "og:title", content: "خطة تنفيذ منظومة الغربية أسبوعًا بأسبوع | Cairo Code" },
      { property: "og:description", content: "ما سيتم تنفيذه في كل أسبوع وما ستراجعه الشركة، من تجهيز العمل إلى التسليم النهائي في ديسمبر 2026." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Deck,
});
