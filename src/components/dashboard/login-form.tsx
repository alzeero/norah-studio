"use client";

import { useActionState } from "react";
import { signIn, type SignInState } from "@/lib/actions/auth";
import { Input, Label, FieldError } from "@/components/ui/form-fields";
import { Button } from "@/components/ui/button";

const initialState: SignInState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} dir="rtl" className="space-y-5">
      <div>
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input id="email" name="email" type="email" autoComplete="email" dir="ltr" required />
      </div>
      <div>
        <Label htmlFor="password">كلمة المرور</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" dir="ltr" required />
      </div>
      <FieldError>{state.error}</FieldError>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "جارٍ تسجيل الدخول…" : "تسجيل الدخول"}
      </Button>
    </form>
  );
}
