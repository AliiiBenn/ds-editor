export interface ExecutionResult {
  output: string;
  error?: string;
  exitCode: number;
}

export interface LanguageExecutor {
  execute(code: string, options?: ExecutionOptions): Promise<ExecutionResult>;
  supports(language: string): boolean;
}

export interface ExecutionOptions {
  timeout?: number;
  args?: string[];
  env?: Record<string, string>;
}

export class CodeExecutor {
  private executors: Map<string, LanguageExecutor> = new Map();

  registerExecutor(language: string, executor: LanguageExecutor) {
    this.executors.set(language, executor);
  }

  async execute(language: string, code: string, options?: ExecutionOptions): Promise<ExecutionResult> {
    const executor = this.executors.get(language);
    if (!executor) {
      throw new Error(`No executor found for language: ${language}`);
    }
    return executor.execute(code, options);
  }

  supportsLanguage(language: string): boolean {
    return this.executors.has(language);
  }
}

export * from './types'; 