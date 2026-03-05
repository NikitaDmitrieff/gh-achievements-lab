export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4">
      <div className="mx-auto max-w-4xl text-center">
        <span className="inline-block rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-6">
          Built for founders who ship
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white text-balance">
          Capture tasks ambientally.{" "}
          <span className="text-indigo-600 dark:text-indigo-400">
            Focus on what matters.
          </span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-balance">
          gh-achievements-lab captures your work as it happens and surfaces a
          weekly focus review so you always know what to ship next.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#pricing"
            className="w-full sm:w-auto rounded-lg bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Start Free
          </a>
          <a
            href="#features"
            className="w-full sm:w-auto rounded-lg border border-gray-300 dark:border-gray-700 px-8 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            See How It Works
          </a>
        </div>
      </div>
    </section>
  );
}
