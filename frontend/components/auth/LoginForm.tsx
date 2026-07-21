"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { loginSchema, LoginInput } from "@/lib/validation/authSchemas";
import { supabase } from "@/lib/supabase/client";
import { useOwlStore } from "@/store/owlStore";
import { OWL_MESSAGES } from "@/components/owl/owlMessages";
import { PasswordInput } from "@/components/auth/PasswordInput";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const say = useOwlStore((s) => s.say);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    say(OWL_MESSAGES.submitting.text, OWL_MESSAGES.submitting.mood);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
        say(OWL_MESSAGES.error.text, OWL_MESSAGES.error.mood);
        setLoading(false);
      } else {
        toast.success("Successfully logged in!");
        say(OWL_MESSAGES.success.text, OWL_MESSAGES.success.mood);
        setTimeout(() => {
          router.push("/dashboard");
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Welcome Back</h2>
        <p className="text-sm text-muted-foreground">Log in to your StudyMate AI account</p>
      </div>

      <div className="space-y-3">
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
          "Log In"
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
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-foreground hover:underline font-semibold">
          Sign up
        </Link>
      </p>
    </form>
  );
}
