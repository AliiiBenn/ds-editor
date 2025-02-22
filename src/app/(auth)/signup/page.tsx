'use client';

import { AuthHeader } from '@/components/auth-header';
import { SignupForm } from "./signup-form"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AuthHeader />
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <SignupForm />
        </div>
      </main>
    </div>
  )
}
