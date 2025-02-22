import Link from 'next/link';
import { Command } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-8 text-center">
      <Link 
        href="/" 
        className="flex items-center gap-2 text-lg font-semibold hover:opacity-80"
      >
        <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-foreground text-background">
          <Command className="size-5" />
        </div>
        <span>Code Editor</span>
      </Link>
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">Language not found</h2>
        <p className="text-sm text-muted-foreground">
          The language you're looking for is not supported yet.
        </p>
      </div>
      <Button asChild>
        <Link href="/">
          Go to JavaScript Editor
        </Link>
      </Button>
    </div>
  );
} 