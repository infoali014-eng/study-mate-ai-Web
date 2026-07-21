"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signupSchema, SignupInput } from "@/lib/validation/authSchemas";
import { supabase } from "@/lib/supabase/client";
import { useOwlStore } from "@/store/owlStore";
import { OWL_MESSAGES } from "@/components/owl/owlMessages";
import { PasswordInput } from "@/components/auth/PasswordInput";

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const say = useOwlStore((s) => s.say);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: SignupInput) => {
    setLoading(true);
    say(OWL_MESSAGES.submitting.text, OWL_MESSAGES.submitting.mood);

    try {
      const requestTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out. Please check your network connection.")), 10000)
      );

      const { error } = (await Promise.race([
        supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              display_name: data.name,
            },
          },
        }),
        requestTimeout
      ])) as { error: { message: string } | null };

      if (error) {
        toast.error(error.message);
        say(OWL_MESSAGES.error.text, OWL_MESSAGES.error.mood);
        setLoading(false);
      } else {
        toast.success("Account created successfully!");
        say(OWL_MESSAGES.success.text, OWL_MESSAGES.success.mood);
        setTimeout(() => {
          router.push("/onboarding");
        }, 1500);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "An unexpected error occurred";
      toast.error(errMsg);
      say(OWL_MESSAGES.error.text, OWL_MESSAGES.error.mood);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to start Google sign in";
      toast.error(errMsg);
    }
  };

  const passwordRegister = register("password");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Create an Account</h2>
        <p className="text-sm text-muted-foreground">Start learning smarter with StudyMate AI</p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <label htmlFor="name" className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            className={`flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              errors.name ? "border-destructive focus-visible:ring-destructive" : "border-input focus-visible:ring-ring"
            }`}
            {...register("name")}
            onFocus={() => say(OWL_MESSAGES.focusName.text, OWL_MESSAGES.focusName.mood)}
          />
          {errors.name && (
            <span className="text-xs text-destructive mt-0.5 block">{errors.name.message}</span>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className={`flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              errors.email ? "border-destructive focus-visible:ring-destructive" : "border-input focus-visible:ring-ring"
            }`}
            {...register("email")}
            onFocus={() => say(OWL_MESSAGES.focusEmail.text, OWL_MESSAGES.focusEmail.mood)}
          />
          {errors.email && (
            <span className="text-xs text-destructive mt-0.5 block">{errors.email.message}</span>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Password
          </label>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            error={!!errors.password}
            {...register("password")}
            onFocus={() => say(OWL_MESSAGES.focusPassword.text, OWL_MESSAGES.focusPassword.mood)}
            onBlur={async (e) => {
              await passwordRegister.onBlur(e);
              const isValid = await trigger("password");
              if (!isValid) {
                say(OWL_MESSAGES.passwordShort.text, OWL_MESSAGES.passwordShort.mood);
              }
            }}
          />
          {errors.password && (
            <span className="text-xs text-destructive mt-0.5 block">{errors.password.message}</span>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex h-10 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Create Account"
        )}
      </button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">or continue with</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex h-10 items-center justify-center rounded-md border border-input hover:bg-muted text-sm font-semibold text-foreground transition-colors cursor-pointer"
      >
        Continue with Google
      </button>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-foreground hover:underline font-semibold">
          Log in
        </Link>
      </p>
    </form>
  );
}
