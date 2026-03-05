import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 font-[family-name:var(--font-geist-sans)] dark:bg-gray-900">
      <main className="mx-auto max-w-lg px-4 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Achievements Lab
        </h1>
        <p className="mb-8 text-gray-500 dark:text-gray-400">
          Ambient task capture and weekly focus review for founders.
        </p>
        <Link
          href="/weekly-review"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Open Weekly Review
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </main>
    </div>
  );
}
