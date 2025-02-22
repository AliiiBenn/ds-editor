import { useState, useEffect, useCallback } from 'react';

type OutputStatus = 'in_progress' | 'completed' | 'failed' | 'loading_packages';
export type Output = { id: string; content: string | null; status: OutputStatus };

// Simple UUID generation
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface PyodideInterface {
  loadPackagesFromImports: (code: string, options: { messageCallback: (message: string) => void }) => Promise<void>;
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (options: { batched: (output: string) => void }) => void;
}

declare global {
  interface Window {
    loadPyodide: (options: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

const PYODIDE_LOAD_RETRIES = 3;
const RETRY_DELAY = 1000;

export function usePython() {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<Output[]>([]);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const initializePyodide = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Wait for the script to be loaded
        if (typeof window.loadPyodide === 'undefined') {
          if (retryCount < PYODIDE_LOAD_RETRIES) {
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, RETRY_DELAY);
            return;
          }
          throw new Error('Pyodide script not loaded');
        }

        const pyodideInstance = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/',
        });
        setPyodide(pyodideInstance);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize Pyodide');
        console.error('Pyodide initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializePyodide();
  }, [retryCount]);

  const clearOutputs = useCallback(() => {
    setOutputs([]);
  }, []);

  const runPython = useCallback(async (code: string) => {
    if (!pyodide) {
      throw new Error('Pyodide is not initialized');
    }

    if (isLoading) {
      throw new Error('Pyodide is still loading');
    }

    const runId = generateUUID();
    const outputChunks: string[] = [];
    let hasOutput = false;

    setOutputs((prev) => [
      ...prev,
      {
        id: runId,
        content: null,
        status: 'in_progress',
      },
    ]);

    try {
      // Setup stdout to handle each line separately
      pyodide.setStdout({
        batched: (text: string) => {
          // Split the text into lines and add them to our chunks
          const lines = text.split(/\r?\n/);
          outputChunks.push(...lines);
          hasOutput = true;
        },
      });

      await pyodide.loadPackagesFromImports(code, {
        messageCallback: (message: string) => {
          setOutputs((prev) => [
            ...prev.filter((output) => output.id !== runId),
            {
              id: runId,
              content: message,
              status: 'loading_packages',
            },
          ]);
        },
      });

      await pyodide.runPythonAsync(code);

      // Filter out empty lines at the end
      while (outputChunks.length > 0 && outputChunks[outputChunks.length - 1] === '') {
        outputChunks.pop();
      }

      const finalOutput = outputChunks.join('\n');

      setOutputs((prev) => [
        ...prev.filter((output) => output.id !== runId),
        {
          id: runId,
          content: hasOutput ? finalOutput : null,
          status: 'completed',
        },
      ]);

      return { success: true, runId, output: finalOutput };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while running the code';
      
      setOutputs((prev) => [
        ...prev.filter((output) => output.id !== runId),
        {
          id: runId,
          content: errorMessage,
          status: 'failed',
        },
      ]);

      return { success: false, error: errorMessage, runId };
    }
  }, [pyodide, isLoading]);

  return {
    runPython,
    isLoading,
    error,
    outputs,
    clearOutputs,
    isInitialized: !!pyodide,
  };
}
