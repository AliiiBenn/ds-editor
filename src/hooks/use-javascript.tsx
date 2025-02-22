import { useState, useEffect, useCallback, useRef } from 'react';

type OutputStatus = 'in_progress' | 'completed' | 'failed';
export type Output = { id: string; content: string | null; status: OutputStatus };

// Simple UUID generation
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function useJavascript() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<Output[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize iframe
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.sandbox.add('allow-scripts');
    iframe.src = '/js-runner.html';
    document.body.appendChild(iframe);
    iframeRef.current = iframe;

    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from our iframe
      if (event.source !== iframe.contentWindow) return;

      if (event.data.type === 'ready') {
        setIsInitialized(true);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    };
  }, []);

  const clearOutputs = useCallback(() => {
    setOutputs([]);
  }, []);

  const runJavascript = useCallback(async (code: string) => {
    const iframe = iframeRef.current;
    const contentWindow = iframe?.contentWindow;
    if (!contentWindow) {
      throw new Error('JavaScript runner is not initialized');
    }

    const runId = generateUUID();
    setIsLoading(true);
    setError(null);

    // Add initial output
    setOutputs((prev) => [
      ...prev,
      {
        id: runId,
        content: null,
        status: 'in_progress',
      },
    ]);

    return new Promise<{ success: boolean; runId: string; output?: string; error?: string }>((resolve) => {
      const cleanup = () => {
        window.removeEventListener('message', handleMessage);
      };

      const handleMessage = (event: MessageEvent) => {
        // Only accept messages from our iframe
        if (event.source !== contentWindow) return;

        if (event.data.type === 'output') {
          setOutputs((prev) => [
            ...prev.filter((output) => output.id !== runId),
            {
              id: runId,
              content: event.data.content,
              status: 'in_progress',
            },
          ]);
        } else if (event.data.type === 'completed') {
          setOutputs((prev) => [
            ...prev.filter((output) => output.id !== runId),
            {
              id: runId,
              content: event.data.content || null,
              status: 'completed',
            },
          ]);
          setIsLoading(false);
          cleanup();
          resolve({ success: true, runId, output: event.data.content });
        } else if (event.data.type === 'error') {
          setOutputs((prev) => [
            ...prev.filter((output) => output.id !== runId),
            {
              id: runId,
              content: event.data.error,
              status: 'failed',
            },
          ]);
          setError(event.data.error);
          setIsLoading(false);
          cleanup();
          resolve({ success: false, runId, error: event.data.error });
        }
      };

      window.addEventListener('message', handleMessage);

      // Send code to iframe
      contentWindow.postMessage({ type: 'execute', code }, '*');
    });
  }, []);

  return {
    runJavascript,
    isLoading,
    error,
    outputs,
    clearOutputs,
    isInitialized,
  };
} 