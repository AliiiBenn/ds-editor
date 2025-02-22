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
import { useJavascript } from '@/hooks/use-javascript';

interface LanguageEditorProps {
  language: Language;
  defaultCode: string;
}

export function LanguageEditor({ language, defaultCode }: LanguageEditorProps) {
  const [code, setCode] = useState(defaultCode);
  const { runPython, outputs: pythonOutputs, isLoading: isPythonLoading, isInitialized: isPythonInitialized } = usePython();
  const { runJavascript, outputs: jsOutputs, isLoading: isJsLoading, isInitialized: isJsInitialized } = useJavascript();

  const handleRunCode = useCallback(async () => {
    try {
      if (language === 'python') {
        await runPython(code);
      } else if (language === 'javascript') {
        await runJavascript(code);
      }
    } catch (err) {
      console.error(`Failed to run ${language} code:`, err);
    }
  }, [language, code, runPython, runJavascript]);

  const canRun = language === 'python' ? (isPythonInitialized && !isPythonLoading) :
                 language === 'javascript' ? (isJsInitialized && !isJsLoading) :
                 false;

  const isLoading = language === 'python' ? isPythonLoading :
                   language === 'javascript' ? isJsLoading :
                   false;

  const outputs = language === 'python' ? pythonOutputs :
                 language === 'javascript' ? jsOutputs :
                 [];

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
                outputs={outputs}
                onRun={canRun ? handleRunCode : undefined}
                isRunning={isLoading}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 