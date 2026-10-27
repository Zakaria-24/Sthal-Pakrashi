"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { api } from "@/lib/client-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * A single login page with two routes through it:
 *
 *   password  — staff sign in with the password the super admin gave them.
 *   otpEmail  — "Sign in with OTP" opens its own email step…
 *   otpCode   — …which sends a code, then asks for it.
 *
 * The super admin has no password and always takes the second path.
 */
type Step = "password" | "otpEmail" | "otpCode";

function LoginCard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [code, setCode] = useState("");

  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function done() {
    router.replace(searchParams.get("next") ?? "/dashboard");
    router.refresh();
  }

  function goTo(next: Step) {
    setStep(next);
    setError(null);
    if (next === "password") {
      setCode("");
      setNotice(null);
    }
  }

  async function signInWithPassword(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await api.login(email, password);
      done();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Login failed");
      setPending(false);
    }
  }

  async function sendCode(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const result = await api.sendOtp(otpEmail);
      setNotice(
        result.delivery === "email"
          ? `Code sent to ${otpEmail}. It expires in ${result.expiresInMinutes} minutes.`
          : `SMTP isn't configured, so the code was printed in the dev server terminal. It expires in ${result.expiresInMinutes} minutes.`,
      );
      setStep("otpCode");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't send code");
    } finally {
      setPending(false);
    }
  }

  async function verifyCode(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await api.verifyOtp(otpEmail, code);
      done();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Verification failed");
      setPending(false);
    }
  }

  const errorNode = error && (
    <p className="text-destructive text-sm" role="alert">
      {error}
    </p>
  );

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          {step === "password" ? "Sign in" : "Sign in with OTP"}
        </CardTitle>
        <CardDescription>
          {step === "otpEmail"
            ? "We'll email you a one-time code."
            : step === "otpCode"
              ? "Enter the code we sent you."
              : "Content dashboard"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {step === "password" && (
          <form onSubmit={signInWithPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {errorNode}

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Signing in…" : "Sign in"}
            </Button>

            <div className="flex items-center gap-3">
              <span className="bg-border h-px flex-1" />
              <span className="text-muted-foreground text-xs">or</span>
              <span className="bg-border h-px flex-1" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => goTo("otpEmail")}
            >
              Sign in with OTP
            </Button>

            <p className="text-muted-foreground text-center text-xs">
              Forgot your password? Ask the super admin to set a new one.
            </p>
          </form>
        )}

        {step === "otpEmail" && (
          <form onSubmit={sendCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp-email">Email</Label>
              <Input
                id="otp-email"
                type="email"
                autoComplete="username"
                required
                autoFocus
                value={otpEmail}
                onChange={(e) => setOtpEmail(e.target.value)}
              />
            </div>

            {errorNode}

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Sending code…" : "Sign in"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => goTo("password")}
            >
              Back to password sign-in
            </Button>
          </form>
        )}

        {step === "otpCode" && (
          <form onSubmit={verifyCode} className="space-y-4">
            {notice && <p className="text-muted-foreground text-sm">{notice}</p>}

            <div className="space-y-2">
              <Label htmlFor="otp-code">6-digit code</Label>
              <Input
                id="otp-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                required
                autoFocus
                className="text-center text-lg tracking-[0.5em]"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            {errorNode}

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Verifying…" : "Sign in"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => goTo("otpEmail")}
            >
              Use a different email
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Suspense>
        <LoginCard />
      </Suspense>
    </main>
  );
}
