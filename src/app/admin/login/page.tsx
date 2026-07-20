import Image from "next/image";
import type { Metadata } from "next";
import { LoginForm } from "@/components/dashboard/login-form";

export const metadata: Metadata = {
  title: "Sign in — Norah Studio",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[hsl(133_18%_10%)] px-6">
      <div className="w-full max-w-sm rounded-xl2 border border-white/10 bg-white/[0.03] p-8">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo/norah-monogram.png"
            alt="Norah Studio"
            width={100}
            height={64}
            className="h-10 w-auto"
          />
        </div>
        <h1 className="mb-1 text-center text-lg font-medium text-white">Studio Dashboard</h1>
        <p className="mb-8 text-center text-sm text-white/50">Sign in to manage your site</p>
        <div className="[&_label]:text-white/50 [&_input]:border-white/15 [&_input]:bg-white/5 [&_input]:text-white">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
