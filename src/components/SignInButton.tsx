"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function SignInButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="animate-pulse h-10 w-24 bg-gray-200 rounded" />;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">
          {session.user?.name ?? session.user?.email}
        </span>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("github")}
      className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
    >
      Sign in with GitHub
    </button>
  );
}
