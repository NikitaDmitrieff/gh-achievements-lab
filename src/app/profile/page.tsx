import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <div className="space-y-4">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt="Avatar"
              width={80}
              height={80}
              className="rounded-full"
            />
          )}
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="text-lg">{session.user?.name ?? "—"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-lg">{session.user?.email ?? "—"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">User ID</label>
            <p className="text-lg font-mono text-sm">{session.user?.id}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
