const testimonials = [
  {
    quote:
      "I stopped dreading Monday standups. The weekly review writes itself now.",
    name: "Sarah Chen",
    role: "Founder, Launchpad AI",
  },
  {
    quote:
      "We replaced three tools with this. Ambient capture is a game-changer for small teams.",
    name: "Marcus Rivera",
    role: "CTO, ShipFast",
  },
  {
    quote:
      "The achievement badges seem silly until your team starts competing to close more PRs. Productivity went through the roof.",
    name: "Priya Sharma",
    role: "Engineering Lead, Stackwise",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-28 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Loved by founders who ship
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            See what early adopters are saying.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl bg-gray-50 dark:bg-gray-900 p-8 border border-gray-200 dark:border-gray-800"
            >
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {t.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
