export default function CTA() {
  return (
    <section className="py-20 sm:py-28 px-4">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Ready to focus on what matters?
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Join hundreds of founders who use gh-achievements-lab to stay on track
          without the overhead of traditional task management.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#pricing"
            className="w-full sm:w-auto rounded-lg bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Get Started for Free
          </a>
          <a
            href="https://github.com/NikitaDmitrieff/gh-achievements-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto rounded-lg border border-gray-300 dark:border-gray-700 px-8 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
