'use client';

import { useState, useCallback } from 'react';
import { CodeEditor } from '@/components/code-editor';
import { Terminal } from '@/components/terminal';
import { AppSidebar } from '@/components/app-sidebar';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { LanguageSelector } from '@/components/language-selector';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import Link from 'next/link';
import type { Language } from '@/app/[language]/page';
import { usePython } from '@/hooks/use-python';

interface LanguageEditorProps {
  language: Language;
  defaultCode: string;
}

export function LanguageEditor({ language, defaultCode }: LanguageEditorProps) {
  const [code, setCode] = useState(defaultCode);
  const { runPython, outputs, isLoading, error, isInitialized } = usePython();

  const handleRunCode = useCallback(async () => {
    if (language === 'python') {
      try {
        await runPython(code);
      } catch (err) {
        console.error('Failed to run Python code:', err);
      }
    }
  }, [language, code, runPython]);

  const canRunPython = language === 'python' && isInitialized && !isLoading;

  return (
    <SidebarProvider className="min-h-screen" defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className="h-screen flex flex-col bg-background">
        <header className="h-16 flex shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-4 px-4 flex-1">
            <LanguageSelector />
          </div>
          <div className="flex items-center gap-4 px-4">
            <Button variant="outline" className="text-sm font-medium" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="text-sm font-medium" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <ThemeSwitcher />
          </div>
        </header>
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full border">
            <ResizablePanel defaultSize={70} minSize={30}>
              <CodeEditor
                value={code}
                onChange={(value) => setCode(value)}
                height="100%"
                className="rounded-l-lg"
                language={language}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30} minSize={20}>
              <Terminal 
                outputs={language === 'python' ? outputs : []}
                onRun={canRunPython ? handleRunCode : undefined}
                isRunning={isLoading}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 