import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/dashboard/login-form";

const PAGE_TITLE = "تسجيل الدخول — Norah Studio";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  robots: {
    index: false,
    follow: false,
  },
};

const AdminLoginPage = () => {
  return (
    <main
      dir="rtl"
      className="dashboard-root flex min-h-screen items-center justify-center bg-[hsl(133_18%_10%)] px-6"
    >
      <section className="w-full max-w-sm rounded-xl2 border border-white/10 bg-white/[0.03] p-8">
        <header className="mb-8 flex flex-col items-center gap-1">
          <Image
            src="/logo/norah-monogram.png"
            alt="Norah Studio"
            width={100}
            height={64}
            className="mb-6 h-10 w-auto"
          />
          <h1 className="text-center text-lg font-medium text-white">لوحة تحكم الاستوديو</h1>
          <p className="text-center text-sm text-white/50">سجّلي الدخول لإدارة موقعك</p>
        </header>

        <div className="[&_input]:border-white/15 [&_input]:bg-white/5 [&_input]:text-white [&_label]:text-white/50">
          <LoginForm />
        </div>
      </section>
    </main>
  );
};

export default AdminLoginPage;
