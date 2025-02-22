'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import Editor, { OnMount } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
  height?: string | number;
  width?: string | number;
  options?: editor.IStandaloneEditorConstructionOptions;
  className?: string;
}

export function CodeEditor({
  value = '',
  onChange,
  language = 'javascript',
  height = '500px',
  width = '100%',
  options = {},
  className,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    
    // Enable quick suggestions
    editor.updateOptions({
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true,
      },
      suggestOnTriggerCharacters: true,
      ...options,
    });
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []);

  // Use resolvedTheme to handle system theme properly
  const editorTheme = resolvedTheme === 'dark' ? 'vs-dark' : 'light';

  return (
    <div className={className} style={{ height }}>
      <Editor
        height="100%"
        width={width}
        language={language}
        value={value}
        theme={editorTheme}
        onChange={(value) => onChange?.(value ?? '')}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          wordWrap: 'on',
          lineNumbers: 'on',
          folding: true,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          ...options,
        }}
        loading={<div className="h-full w-full bg-background" />}
      />
    </div>
  );
}
