// Override console methods to capture output
let output = '';
const console = {
  log: (...args) => {
    output += args.map(arg => 
      typeof arg === 'string' ? arg : JSON.stringify(arg)
    ).join(' ') + '\n';
    self.postMessage({ type: 'output', content: output });
  },
  error: (...args) => {
    output += args.map(arg => 
      typeof arg === 'string' ? arg : JSON.stringify(arg)
    ).join(' ') + '\n';
    self.postMessage({ type: 'output', content: output });
  },
  warn: (...args) => {
    output += args.map(arg => 
      typeof arg === 'string' ? arg : JSON.stringify(arg)
    ).join(' ') + '\n';
    self.postMessage({ type: 'output', content: output });
  },
  info: (...args) => {
    output += args.map(arg => 
      typeof arg === 'string' ? arg : JSON.stringify(arg)
    ).join(' ') + '\n';
    self.postMessage({ type: 'output', content: output });
  }
};

// Listen for code to execute
self.onmessage = async (e) => {
  if (e.data.type === 'execute') {
    output = '';
    try {
      // Execute the code in the worker context
      await self.importScripts('data:application/javascript;base64,' + btoa(e.data.code));
      self.postMessage({ type: 'completed', content: output });
    } catch (error) {
      self.postMessage({ type: 'error', error: error.message });
    }
  }
}; 