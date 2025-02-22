'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/app/[language]/page';

export function LanguageSelector() {
  const pathname = usePathname();
  const currentLanguage = pathname.split('/')[1];
  const currentLangConfig = currentLanguage in SUPPORTED_LANGUAGES 
    ? SUPPORTED_LANGUAGES[currentLanguage as keyof typeof SUPPORTED_LANGUAGES]
    : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between gap-2 min-w-[160px]">
          {currentLangConfig ? (
            <>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <currentLangConfig.icon className="h-4 w-4" />
                </div>
                <span className="truncate">{currentLangConfig.label}</span>
              </div>
            </>
          ) : (
            <span className="truncate">Select Language</span>
          )}
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[160px]">
        {Object.entries(SUPPORTED_LANGUAGES).map(([key, { label, icon: Icon }]) => (
          <DropdownMenuItem key={key} asChild>
            <Link href={`/${key}`} className="flex w-full cursor-pointer items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 