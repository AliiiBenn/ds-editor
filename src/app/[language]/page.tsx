import { notFound } from 'next/navigation';
import { LanguageEditor } from '@/components/language-editor';
import { SquareTerminal, Bot, Braces, Code2, Blocks } from 'lucide-react';

// Supported languages and their configurations
export const SUPPORTED_LANGUAGES = {
  javascript: {
    defaultCode: '// Start coding in JavaScript...',
    label: 'JavaScript',
    icon: Braces,
  },
  typescript: {
    defaultCode: '// Start coding in TypeScript...',
    label: 'TypeScript',
    icon: Code2,
  },
  python: {
    defaultCode: '# Start coding in Python...',
    label: 'Python',
    icon: Blocks,
  },
  rust: {
    defaultCode: '// Start coding in Rust...',
    label: 'Rust',
    icon: Bot,
  },
  shell: {
    defaultCode: '# Start coding in Shell...',
    label: 'Shell',
    icon: SquareTerminal,
  },
} as const;

export type Language = keyof typeof SUPPORTED_LANGUAGES;

interface PageProps {
  params: Promise<{ language: string }>;
}

export default async function LanguagePage({ params }: PageProps) {
  // Await and validate params
  const { language: rawLanguage } = await params;
  
  // Type guard for language
  function isValidLanguage(lang: string): lang is Language {
    return lang in SUPPORTED_LANGUAGES;
  }

  if (!isValidLanguage(rawLanguage)) {
    notFound();
  }

  const language = rawLanguage;
  return <LanguageEditor language={language} defaultCode={SUPPORTED_LANGUAGES[language].defaultCode} />;
} 