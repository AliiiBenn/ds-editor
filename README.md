# DS Editor

A powerful code editor library with multi-language execution support.

## Packages

This monorepo contains two main packages:

### @ds-editor/core

Core package for executing code in multiple programming languages.

```bash
npm install @ds-editor/core
```

### @ds-editor/react

React component package providing an enhanced Monaco-based code editor.

```bash
npm install @ds-editor/react
```

## Development

This project uses pnpm for package management:

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development mode
pnpm dev

# Run tests
pnpm test

# Lint code
pnpm lint
```

## Usage

### Core Package

```typescript
import { CodeExecutor } from '@ds-editor/core';

const executor = new CodeExecutor();
// Register language executors...
const result = await executor.execute('python', 'print("Hello, World!")');
```

### React Component

```typescript
import { CodeEditor } from '@ds-editor/react';

function App() {
  return (
    <CodeEditor
      language="javascript"
      value="console.log('Hello, World!');"
      onChange={(value) => console.log(value)}
    />
  );
}
```

## License

MIT
#   d s - e d i t o r  
 