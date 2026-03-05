import Link from "next/link";
import SignInButton from "@/components/SignInButton";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-[family-name:var(--font-geist-sans)]">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">gh-achievements-lab</h1>
        <p className="text-gray-600">
          Ambient task capture and weekly focus review for founders.
        </p>
        <SignInButton />
        <div>
          <Link
            href="/profile"
            className="text-sm text-blue-600 hover:underline"
          >
            View Profile
          </Link>
        </div>
      </div>
    </main>
  );
}
