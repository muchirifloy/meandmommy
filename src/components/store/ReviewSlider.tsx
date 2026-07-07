const reviews = [
  ["Me & Mommy makes it easier to pick safe, practical baby essentials without overthinking every purchase.", "Achieng, Nairobi"],
  ["The diaper and feeding ranges feel thoughtfully selected for daily routines, travel, and long nights.", "Wanjiku, Kiambu"],
  ["I love that checkout is simple and I can ask questions quickly on WhatsApp before buying.", "Njeri, Westlands"],
  ["The product cards are clear, the prices are easy to compare, and the store feels built for parents.", "Mary, Mombasa"],
];

export function ReviewSlider() {
  const loop = [...reviews, ...reviews];

  return (
    <section className="overflow-hidden py-12">
      <div className="container-shell">
        <p className="text-sm font-black uppercase tracking-wide text-brand-dark">Testimonials</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">Parents trust the comfort.</h2>
      </div>
      <div className="mt-8 flex w-max animate-[review-marquee_32s_linear_infinite] gap-5 px-4">
        {loop.map(([text, author], index) => (
          <figure key={`${author}-${index}`} className="w-[360px] shrink-0 rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
            <blockquote className="leading-7 text-slate-700">&ldquo;{text}&rdquo;</blockquote>
            <figcaption className="mt-4 text-sm font-black text-brand-dark">— {author}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
