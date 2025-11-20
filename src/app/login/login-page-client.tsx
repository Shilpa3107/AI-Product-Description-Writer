"use client";

import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("@/components/auth/login-form").then(mod => mod.LoginForm), { ssr: false });

export function LoginPageClient() {
    return <LoginForm />;
}
