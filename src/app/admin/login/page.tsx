import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/dashboard/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}
