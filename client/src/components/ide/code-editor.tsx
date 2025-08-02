import { useRef, useEffect } from "react";
import * as monaco from "monaco-editor";

// Simple Monaco configuration for Vite
declare global {
  interface Window {
    MonacoEnvironment: any;
  }
}

if (typeof window !== 'undefined') {
  window.MonacoEnvironment = {
    getWorker: () => {
      // Return a simple worker that doesn't use importScripts
      return {
        postMessage: () => {},
        terminate: () => {}
      } as any;
    }
  };
}

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

export default function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Configure Monaco theme
    monaco.editor.defineTheme('customDark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A737D' },
        { token: 'keyword', foreground: '00FFAB' },
        { token: 'string', foreground: '00C2FF' },
        { token: 'number', foreground: 'F97583' },
        { token: 'function', foreground: 'B392F0' },
        { token: 'variable', foreground: 'E1E4E8' },
      ],
      colors: {
        'editor.background': '#0e0e2c',
        'editor.foreground': '#E1E4E8',
        'editorLineNumber.foreground': '#6A737D',
        'editor.selectionBackground': '#00FFAB33',
        'editor.lineHighlightBackground': '#1a1a3a',
        'editorCursor.foreground': '#00FFAB',
        'editor.findMatchBackground': '#00C2FF33',
        'editor.findMatchHighlightBackground': '#00C2FF22',
      }
    });

    // Create editor
    const editor = monaco.editor.create(editorRef.current, {
      value,
      language: language === 'javascript' ? 'typescript' : language,
      theme: 'customDark',
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Fira Code, monospace',
      minimap: { enabled: false },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      lineNumbers: 'on',
      glyphMargin: false,
      folding: true,
      lineDecorationsWidth: 10,
      lineNumbersMinChars: 3,
      renderLineHighlight: 'line',
      contextmenu: true,
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      cursorStyle: 'line',
      smoothScrolling: true,
      cursorBlinking: 'blink',
      renderWhitespace: 'selection',
      tabSize: 2,
      insertSpaces: true,
      // Enable IntelliSense
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: 'on',
      acceptSuggestionOnCommitCharacter: true,
      quickSuggestions: true,
      parameterHints: { enabled: true },
      hover: { enabled: true },
    });

    monacoRef.current = editor;

    // Listen for content changes
    const disposable = editor.onDidChangeModelContent(() => {
      const newValue = editor.getValue();
      onChange(newValue);
    });

    // Configure TypeScript/JavaScript IntelliSense
    if (language === 'javascript' || language === 'typescript') {
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.Latest,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.React,
        reactNamespace: 'React',
        allowJs: true,
        typeRoots: ['node_modules/@types']
      });

      // Add React types
      monaco.languages.typescript.javascriptDefaults.addExtraLib(`
        declare module 'react' {
          interface Component<P = {}, S = {}> {}
          function useState<T>(initialState: T): [T, (value: T) => void];
          function useEffect(effect: () => void, deps?: any[]): void;
          export = React;
          export as namespace React;
        }
      `, 'react.d.ts');
    }

    return () => {
      disposable.dispose();
      editor.dispose();
    };
  }, []);

  // Update language when it changes
  useEffect(() => {
    if (monacoRef.current) {
      const model = monacoRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language === 'javascript' ? 'typescript' : language);
      }
    }
  }, [language]);

  // Update value when it changes externally
  useEffect(() => {
    if (monacoRef.current && monacoRef.current.getValue() !== value) {
      monacoRef.current.setValue(value);
    }
  }, [value]);

  return (
    <div className="w-full h-full bg-[var(--space-900)]">
      <div ref={editorRef} className="w-full h-full" />
    </div>
  );
}
