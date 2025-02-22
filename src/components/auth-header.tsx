'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Command } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function AuthHeader() {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isSignupPage = pathname === '/signup';

  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <Link 
        href="/" 
        className="flex items-center gap-2 text-sm font-semibold hover:opacity-80"
      >
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-foreground text-background">
          <Command className="size-4" />
        </div>
        <span>Code Editor</span>
      </Link>
      <div className="flex items-center gap-4">
        {!isLoginPage && (
          <Button variant="ghost" className="text-sm font-medium" asChild>
            <Link href="/login">Login</Link>
          </Button>
        )}
        {!isSignupPage && (
          <Button className="text-sm font-medium" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        )}
        <Separator orientation="vertical" className="h-4" />
        <ThemeSwitcher />
      </div>
    </header>
  );
} 