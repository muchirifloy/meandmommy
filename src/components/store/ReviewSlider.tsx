const reviews = [
  ["The storage bags make pumping at work easier because I can label, freeze, and organise milk without extra containers.", "Achieng, Nairobi"],
  ["The sterilising tablets are simple for night feeds and travel. Wash, rinse, soak, and the bottles are ready.", "Wanjiku, Kiambu"],
  ["I like that Me & Mommy focuses on the two things I actually reorder: milk bags and sterilising tablets.", "Njeri, Westlands"],
  ["The product pages explain how to use each item, which makes buying feel clear and practical.", "Mary, Mombasa"],
];

export function ReviewSlider() {
  const loop = [...reviews, ...reviews];

  return (
    <section className="overflow-hidden py-12">
      <div className="container-shell">
        <p className="text-sm font-black uppercase tracking-wide text-brand-dark">Testimonials</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">Parents trust the routine.</h2>
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
