import React, { useState, useRef } from 'react';
import { Play, Send, RefreshCw, Copy, Check, RotateCcw, Cpu, Sparkles, Terminal, Code2 } from 'lucide-react';

const LANGUAGES = [
  { id: 'Java', label: 'Java', badge: 'OpenJDK 25', icon: '☕' },
  { id: 'Python', label: 'Python', badge: 'v3.14', icon: '🐍' },
  { id: 'C++', label: 'C++', badge: 'GCC 6.3', icon: '⚡' },
  { id: 'JavaScript', label: 'JavaScript', badge: 'Node v24', icon: '🟨' }
];

export default function CodeEditor({
  code,
  onChange,
  language = 'Java',
  onLanguageChange,
  onRun,
  onSubmit,
  onReset,
  isExecuting = false,
  readOnly = false,
  runLabel = 'Run Code',
  submitLabel = 'Submit'
}) {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(13);
  const textareaRef = useRef(null);

  const handleTextChange = (e) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e) => {
    const target = e.target;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const val = target.value;

    if (e.key === 'Tab') {
      e.preventDefault();
      const nextVal = val.substring(0, start) + '    ' + val.substring(end);
      onChange(nextVal);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
      return;
    }

    const pairs = { '{': '}', '[': ']', '(': ')', '"': '"', "'": "'" };

    if (pairs[e.key]) {
      e.preventDefault();
      const closing = pairs[e.key];
      const nextVal = val.substring(0, start) + e.key + closing + val.substring(end);
      onChange(nextVal);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 1;
      }, 0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = (code || '').split('\n').length || 1;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 16) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-arena-border bg-arena-card shadow-2xl">
      
      {/* Top Header Bar with Language Tabs & Execution Buttons */}
      <div className="px-4 py-2.5 bg-arena-bgElevated border-b border-arena-border flex flex-wrap items-center justify-between gap-2">
        
        {/* Language Tabs / Selector */}
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          {LANGUAGES.map((lang) => {
            const isSelected = language.toLowerCase() === lang.id.toLowerCase() ||
              (lang.id === 'C++' && language.toLowerCase() === 'cpp') ||
              (lang.id === 'JavaScript' && language.toLowerCase() === 'js');
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => onLanguageChange && onLanguageChange(lang.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center space-x-1.5 border cursor-pointer ${
                  isSelected
                    ? 'bg-arena-primary text-white border-arena-primary shadow-glow-primary'
                    : 'bg-arena-card text-arena-muted hover:text-arena-text border-arena-border hover:border-arena-primary/40'
                }`}
              >
                <span>{lang.icon}</span>
                <span>{lang.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                  isSelected ? 'bg-black/30 text-white/90' : 'bg-arena-card text-arena-muted'
                }`}>
                  {lang.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Controls & Utilities */}
        <div className="flex items-center space-x-2">
          {onReset && (
            <button
              onClick={onReset}
              title="Reset starter template"
              className="p-1.5 rounded-lg bg-arena-bg hover:bg-arena-cardGlow text-arena-muted hover:text-arena-text border border-arena-border text-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleCopy}
            title="Copy code"
            className="p-1.5 rounded-lg bg-arena-bg hover:bg-arena-cardGlow text-arena-muted hover:text-arena-text border border-arena-border text-xs transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-arena-success" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <div className="h-4 w-[1px] bg-arena-border mx-1" />

          {onRun && (
            <button
              onClick={onRun}
              disabled={isExecuting}
              className="px-3.5 py-1.5 rounded-xl bg-arena-card hover:bg-arena-cardGlow border border-arena-border text-arena-text text-xs font-bold flex items-center space-x-1.5 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isExecuting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 text-arena-success fill-current" />
              )}
              <span>{runLabel}</span>
            </button>
          )}

          {onSubmit && (
            <button
              onClick={onSubmit}
              disabled={isExecuting}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-arena-primary to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-extrabold flex items-center space-x-1.5 shadow-glow-primary hover:scale-105 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitLabel}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex-1 flex overflow-hidden bg-arena-bgDeep">
        
        {/* Line Numbers Gutter */}
        <div className="w-12 py-3 bg-arena-bgElevated border-r border-arena-border/50 text-right pr-3 font-mono text-xs text-arena-muted/40 select-none leading-6">
          {lineNumbers.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>

        {/* Interactive Text Area with Tab support */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          style={{ fontSize: `${fontSize}px`, tabSize: 4 }}
          className="flex-1 w-full h-full p-3 bg-transparent text-arena-text font-mono leading-6 resize-none focus:outline-none caret-arena-primary selection:bg-arena-primary/30"
          placeholder="// Write your solution here..."
        />
      </div>

      {/* Footer Status Bar */}
      <div className="px-4 py-1.5 bg-arena-bgElevated border-t border-arena-border/60 flex items-center justify-between text-[11px] font-mono text-arena-muted">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <Cpu className="w-3 h-3 text-arena-primary" />
            <span>CodeArena Compiler v3.0</span>
          </span>
          <span className="opacity-40">•</span>
          <span>Tab Size: 4</span>
          <span className="opacity-40">•</span>
          <span>UTF-8</span>
        </div>

        <div className="flex items-center space-x-3">
          <span>Ln {lineCount}, Col 1</span>
          <span className="opacity-40">•</span>
          <span>{language}</span>
        </div>
      </div>

    </div>
  );
}
