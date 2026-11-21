"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/shared/password-input";
import { authClient } from "@/lib/auth-client";
import { signUpSchema, type SignUpValues } from "@/lib/validations/auth";
import { GoogleButton } from "./google-button";
import { RolePicker } from "./role-picker";

export function SignUpForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", image: "", role: "customer" },
  });
  const role = watch("role");

  async function onSubmit(values: SignUpValues) {
    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
      image: values.image || undefined,
    });
    if (error) {
      toast.error(error.message ?? "Could not create your account. Please try again.");
      return;
    }
    toast.success("Account created! Welcome to PizzaHub.");
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" autoComplete="name" placeholder="Your full name" {...register("name")} />
          {errors.name && <p role="alert" className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p role="alert" className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput id="password" autoComplete="new-password" placeholder="Min 6 characters, upper and lower case" {...register("password")} />
          {errors.password && <p role="alert" className="text-sm text-destructive">{errors.password.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">Profile image URL (optional)</Label>
          <Input id="image" type="url" placeholder="https://..." {...register("image")} />
          {errors.image && <p role="alert" className="text-sm text-destructive">{errors.image.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>I am a</Label>
          <RolePicker value={role} onChange={(next) => setValue("role", next, { shouldValidate: true })} disabled={isSubmitting} />
          {errors.role && <p role="alert" className="text-sm text-destructive">{errors.role.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          Create account
        </Button>
      </form>
      <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>
      <GoogleButton callbackUrl="/dashboard" label="Sign up with Google" />
      <p className="text-center text-xs text-muted-foreground">With Google, you&apos;ll pick your account type right after signing in.</p>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}