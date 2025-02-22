'use client';

import { PlayIcon, SquareTerminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Output } from '@/hooks/use-python';

interface TerminalProps {
  outputs: Output[];
  onRun?: () => void;
  isRunning?: boolean;
}

export function Terminal({ outputs, onRun, isRunning }: TerminalProps) {
  const renderContent = (output: Output) => {
    if (output.status === 'in_progress') {
      return (
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">$</span>
          <span className="text-zinc-200">Running...</span>
        </div>
      );
    }

    if (output.status === 'completed' && output.content === null) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">$</span>
          <span className="text-zinc-200">No output</span>
        </div>
      );
    }

    if (!output.content) return null;

    // Split content into lines and render each line
    return output.content.split('\n').map((line, i) => (
      <div key={i} className="flex items-start gap-2">
        <span className="text-zinc-500 select-none">$</span>
        <span 
          className={`${output.status === 'failed' ? 'text-red-400' : 'text-zinc-200'} whitespace-pre-wrap`}
        >
          {line || ' '}
        </span>
      </div>
    ));
  };

  return (
    <div className="flex h-full flex-col bg-zinc-900 text-zinc-50 border">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
        <div className="flex items-center gap-2">
          <SquareTerminal className="h-4 w-4" />
          <span className="text-sm font-medium">Terminal</span>
        </div>
        {onRun && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onRun}
            disabled={isRunning}
          >
            <PlayIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex-1 p-4 font-mono text-sm overflow-auto">
        {outputs.length === 0 ? (
          <div className="text-zinc-500">$ Ready...</div>
        ) : (
          outputs.map((output) => (
            <div key={output.id} className="mb-4">
              {renderContent(output)}
              {output.status === 'in_progress' && (
                <div className="mt-2">
                  <div className="animate-pulse bg-zinc-800 h-4 w-24 rounded" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 