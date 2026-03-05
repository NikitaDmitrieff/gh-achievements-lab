const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For solo founders getting started.",
    features: [
      "1 GitHub repo",
      "Weekly focus review",
      "Basic achievement badges",
      "7-day history",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For founders who ship seriously.",
    features: [
      "Unlimited repos",
      "Daily + weekly reviews",
      "All achievement badges",
      "Unlimited history",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$8",
    period: "/user/month",
    description: "For teams that ship together.",
    features: [
      "Everything in Pro",
      "Team dashboards",
      "Cross-repo insights",
      "Custom badges",
      "SSO & admin controls",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-28 px-4 bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl p-8 border ${
                tier.highlighted
                  ? "bg-white dark:bg-gray-900 border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-600 dark:ring-indigo-500"
                  : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              }`}
            >
              {tier.highlighted && (
                <span className="inline-block rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 mb-4">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {tier.name}
              </h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {tier.price}
                </span>
                <span className="text-gray-500 dark:text-gray-500 ml-1">
                  {tier.period}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {tier.description}
              </p>
              <ul className="mt-6 space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <svg
                      className="h-4 w-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-8 w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  tier.highlighted
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
