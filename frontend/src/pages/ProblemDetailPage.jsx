import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen, Lock, Lightbulb, Clock, Cpu, ChevronLeft,
  CheckCircle2, XCircle, AlertTriangle, Terminal, History,
  Building2, Layers, Check, Copy, RotateCcw, Play, Send, RefreshCw, FileCode
} from 'lucide-react';
import CodeEditor from '../components/CodeEditor';
import { problemService } from '../services/problemService';
import { submissionService } from '../services/submissionService';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProblemDetailPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'hints' | 'editorial' | 'submissions'
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [activeConsoleTab, setActiveConsoleTab] = useState('testcases'); // 'testcases' | 'result'
  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  
  // Execution pipeline state
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionState, setExecutionState] = useState({
    status: 'IDLE', // 'IDLE' | 'QUEUED' | 'RUNNING' | 'COMPLETED'
    stepMessage: '',
    result: null
  });

  const [submissionsHistory, setSubmissionsHistory] = useState([]);

  const getStarterCode = (prob, lang) => {
    if (!prob?.starterCode) return '// Write solution here...';
    const norm = (lang || 'Java').toLowerCase();
    if (norm === 'java') return prob.starterCode.java || '// Write Java solution';
    if (norm === 'python' || norm === 'py') return prob.starterCode.python || '# Write Python solution';
    if (norm === 'c++' || norm === 'cpp') return prob.starterCode.cpp || '// Write C++ solution';
    if (norm === 'javascript' || norm === 'js') return prob.starterCode.javascript || '// Write JavaScript solution';
    return prob.starterCode[norm] || prob.starterCode.java || prob.starterCode.javascript || '// Write solution';
  };

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const fetchProblem = async () => {
    try {
      const data = await problemService.getProblemById(id);
      setProblem(data);

      setCode(getStarterCode(data, language));

      // Load initial submissions
      const history = await submissionService.getProblemSubmissions(data.problemId || id);
      setSubmissionsHistory(history);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (problem) {
      setCode(getStarterCode(problem, newLang));
    }
  };

  const handleResetCode = () => {
    if (problem) {
      setCode(getStarterCode(problem, language));
    }
  };

  // Run Code against Public Testcases / Custom Input
  const handleRunCode = async () => {
    setIsExecuting(true);
    setActiveConsoleTab('result');
    setExecutionState({
      status: 'QUEUED',
      stepMessage: 'Queued in sandbox execution worker...',
      result: null
    });

    setTimeout(async () => {
      setExecutionState(prev => ({
        ...prev,
        status: 'RUNNING',
        stepMessage: 'Compiling and testing public test cases...'
      }));

      try {
        const data = await submissionService.runCode({
          code,
          language,
          problemId: problem?.problemId || id,
          customInput: isCustomMode ? customInput : null
        });

        setExecutionState({
          status: 'COMPLETED',
          stepMessage: 'Execution complete',
          result: data
        });
      } catch (err) {
        setExecutionState({
          status: 'COMPLETED',
          stepMessage: 'Execution failed',
          result: {
            verdict: 'RUNTIME_ERROR',
            runtimeError: err.message,
            runtimeMs: 0,
            memoryMb: 0,
            testcasesPassed: 0,
            totalTestcases: 1
          }
        });
      } finally {
        setIsExecuting(false);
      }
    }, 600);
  };

  // Submit Code for Full Evaluation against Hidden Test Suite
  const handleSubmitCode = async () => {
    setIsExecuting(true);
    setActiveConsoleTab('result');
    setExecutionState({
      status: 'QUEUED',
      stepMessage: 'Submission queued in isolated test runner...',
      result: null
    });

    setTimeout(async () => {
      setExecutionState(prev => ({
        ...prev,
        status: 'RUNNING',
        stepMessage: 'Evaluating solution against 42 test cases (edge & stress tests)...'
      }));

      try {
        const data = await submissionService.submitSolution({
          userId: 'usr_demo',
          problemId: problem?.problemId || id,
          problemTitle: problem?.title,
          code,
          language
        });

        const sub = data.submission;
        setExecutionState({
          status: 'COMPLETED',
          stepMessage: 'Evaluation verified',
          result: sub
        });

        // Add to local submissions history
        setSubmissionsHistory(prev => [sub, ...prev]);
      } catch (err) {
        setExecutionState({
          status: 'COMPLETED',
          stepMessage: 'Submission error',
          result: {
            verdict: 'RUNTIME_ERROR',
            runtimeError: err.message,
            runtimeMs: 0,
            memoryMb: 0,
            testcasesPassed: 0,
            totalTestcases: 42
          }
        });
      } finally {
        setIsExecuting(false);
      }
    }, 1100);
  };

  if (!problem) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-arena-muted font-mono">
        Loading problem environment...
      </div>
    );
  }

  const publicCases = problem.publicTestcases && problem.publicTestcases.length > 0
    ? problem.publicTestcases
    : (problem.examples || []).map(ex => ({ input: ex.input, expectedOutput: ex.output, explanation: ex.explanation }));

  const currentCase = publicCases[activeTestCaseIndex] || publicCases[0];

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-arena-bg">
      
      {/* Top Problem Header Navigation Bar */}
      <div className="px-6 py-2.5 bg-arena-bgElevated border-b border-arena-border flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/problems"
            className="p-1.5 rounded-lg bg-arena-card border border-arena-border text-arena-muted hover:text-arena-text transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono font-bold text-arena-muted">{problem.problemId || 'prob_1'}</span>
            <h1 className="text-base font-extrabold text-arena-text">{problem.title}</h1>
            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
              problem.difficulty === 'Easy' ? 'bg-arena-success/20 text-arena-success border-arena-success/30' :
              problem.difficulty === 'Medium' ? 'bg-arena-warning/20 text-arena-warning border-arena-warning/30' :
              'bg-arena-danger/20 text-arena-danger border-arena-danger/30'
            }`}>
              {problem.difficulty}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-5 text-xs font-mono text-arena-muted">
          <span>Acceptance: <strong className="text-arena-text">{problem.acceptanceRate || 65.0}%</strong></span>
          <span>Submissions: <strong className="text-arena-text">{problem.totalSubmissions?.toLocaleString() || '1,200'}</strong></span>
          <span>Time Limit: <strong className="text-arena-text">{problem.timeLimit || 2000}ms</strong></span>
          <span>Memory: <strong className="text-arena-text">{problem.memoryLimit || 256}MB</strong></span>
        </div>
      </div>

      {/* Main Split Layout: Left Problem Specs / Right Code Editor & Console */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT COLUMN: Problem Details, Tabs, Specs */}
        <div className="lg:col-span-5 border-r border-arena-border flex flex-col bg-arena-bg overflow-hidden">
          
          {/* Navigation Tabs */}
          <div className="px-4 bg-arena-bgElevated border-b border-arena-border flex space-x-1">
            {[
              { id: 'description', label: 'Description', icon: BookOpen },
              { id: 'hints', label: `Hints (${problem.hints?.length || 1})`, icon: Lightbulb },
              { id: 'editorial', label: 'Editorial', icon: FileCode },
              { id: 'submissions', label: `Submissions (${submissionsHistory.length})`, icon: History },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
                    isActive ? 'border-arena-primary text-arena-text' : 'border-transparent text-arena-muted hover:text-arena-text'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 text-arena-text text-sm leading-relaxed">
            
            {/* 1. DESCRIPTION TAB */}
            {activeTab === 'description' && (
              <>
                {/* Topics & Company Tags */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {problem.topics?.map((topic, i) => (
                      <span key={i} className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-arena-card border border-arena-border text-arena-muted">
                        {topic}
                      </span>
                    ))}
                  </div>

                  {problem.companies && problem.companies.length > 0 && (
                    <div className="p-3 rounded-xl bg-arena-card/60 border border-arena-border/70 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-arena-muted flex items-center space-x-1.5">
                        <Building2 className="w-3 h-3 text-arena-primary" />
                        <span>Commonly associated with interviews at</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {problem.companies.map((comp, i) => (
                          <span key={i} className="text-[11px] font-semibold px-2 py-0.5 rounded bg-arena-primary/10 text-arena-primary border border-arena-primary/20">
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Problem Statement */}
                <div className="text-arena-text leading-relaxed whitespace-pre-line">
                  {problem.description}
                </div>

                {/* Structured Examples */}
                {problem.examples && problem.examples.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-arena-text">Examples</h3>
                    {problem.examples.map((ex, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-arena-card border border-arena-border font-mono text-xs space-y-2">
                        <div className="text-arena-muted font-bold">Example {idx + 1}:</div>
                        <div>
                          <span className="text-arena-muted block text-[11px]">Input:</span>
                          <code className="text-arena-primary">{ex.input}</code>
                        </div>
                        <div>
                          <span className="text-arena-muted block text-[11px]">Output:</span>
                          <code className="text-arena-success">{ex.output}</code>
                        </div>
                        {ex.explanation && (
                          <div className="text-arena-muted text-[11px] pt-1 border-t border-arena-border/40">
                            <em>Explanation: {ex.explanation}</em>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Input & Output Format */}
                {(problem.inputFormat || problem.outputFormat) && (
                  <div className="space-y-3 pt-2 border-t border-arena-border/60">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-arena-text">I/O Format</h3>
                    {problem.inputFormat && (
                      <div className="text-xs text-arena-muted">
                        <strong className="text-arena-text block mb-1">Input Format:</strong>
                        <pre className="p-3 rounded-lg bg-arena-bg border border-arena-border font-mono text-xs whitespace-pre-line">{problem.inputFormat}</pre>
                      </div>
                    )}
                    {problem.outputFormat && (
                      <div className="text-xs text-arena-muted">
                        <strong className="text-arena-text block mb-1">Output Format:</strong>
                        <pre className="p-3 rounded-lg bg-arena-bg border border-arena-border font-mono text-xs whitespace-pre-line">{problem.outputFormat}</pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Constraints */}
                {problem.constraints && problem.constraints.length > 0 && (
                  <div className="pt-2 border-t border-arena-border/60 space-y-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-arena-text">Constraints</h3>
                    <ul className="list-disc list-inside space-y-1 font-mono text-xs text-arena-muted">
                      {problem.constraints.map((c, i) => (
                        <li key={i}><code className="text-arena-text">{c}</code></li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Expected Complexity Badge */}
                <div className="p-3.5 rounded-xl bg-arena-primary/10 border border-arena-primary/30 flex items-center justify-between text-xs">
                  <span className="font-bold text-arena-primary">Target Time Complexity:</span>
                  <span className="font-mono font-black text-arena-text">{problem.expectedComplexity?.time || 'O(N)'}</span>
                </div>
              </>
            )}

            {/* 2. HINTS TAB */}
            {activeTab === 'hints' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-arena-text">Algorithmic Hints</h3>
                {problem.hints && problem.hints.length > 0 ? (
                  problem.hints.map((hint, i) => (
                    <div key={i} className="p-4 rounded-xl bg-arena-card border border-arena-border text-arena-text text-xs space-y-1">
                      <div className="font-bold text-arena-warning flex items-center space-x-1.5">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Hint {i + 1}</span>
                      </div>
                      <p className="text-arena-muted leading-relaxed">{hint}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-arena-muted">No hints available for this problem.</p>
                )}
              </div>
            )}

            {/* 3. EDITORIAL TAB */}
            {activeTab === 'editorial' && (
              <div className="space-y-5">
                <div className="border-b border-arena-border pb-3">
                  <h3 className="text-base font-bold text-arena-text">Official Editorial & Solution Analysis</h3>
                  <p className="text-xs text-arena-muted mt-0.5">Authoritative algorithm proof and complexity trade-offs.</p>
                </div>

                {problem.editorial ? (
                  <>
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-arena-primary">Approach</h4>
                      <p className="text-xs text-arena-text">{problem.editorial.approach || 'Optimal Algorithm Design'}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-arena-primary">Intuition & Proof</h4>
                      <p className="text-xs text-arena-muted leading-relaxed">{problem.editorial.intuition}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-arena-card border border-arena-border">
                        <span className="text-[10px] uppercase font-bold text-arena-muted block">Time Complexity</span>
                        <strong className="text-xs font-mono text-arena-text">{problem.editorial.timeComplexity || 'O(N)'}</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-arena-card border border-arena-border">
                        <span className="text-[10px] uppercase font-bold text-arena-muted block">Space Complexity</span>
                        <strong className="text-xs font-mono text-arena-text">{problem.editorial.spaceComplexity || 'O(1)'}</strong>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-arena-muted">Editorial is being indexed by the judge committee.</p>
                )}
              </div>
            )}

            {/* 4. SUBMISSIONS HISTORY TAB */}
            {activeTab === 'submissions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-arena-border pb-3">
                  <h3 className="text-sm font-bold text-arena-text">Submission History</h3>
                  <span className="text-xs font-mono text-arena-muted">{submissionsHistory.length} total</span>
                </div>

                {submissionsHistory.length > 0 ? (
                  <div className="space-y-3">
                    {submissionsHistory.map((sub, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-arena-card border border-arena-border flex items-center justify-between text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              sub.verdict === 'ACCEPTED' ? 'bg-arena-success/20 text-arena-success border border-arena-success/30' : 'bg-arena-danger/20 text-arena-danger border border-arena-danger/30'
                            }`}>
                              {sub.verdict}
                            </span>
                            <span className="font-mono text-arena-text">{sub.language}</span>
                          </div>
                          <div className="text-[11px] text-arena-muted font-mono">
                            {new Date(sub.createdAt).toLocaleString()}
                          </div>
                        </div>

                        <div className="text-right font-mono text-xs space-y-0.5">
                          <div className="text-arena-primary">{sub.runtimeMs || 28}ms</div>
                          <div className="text-arena-muted text-[11px]">{sub.memoryMb || 18.2}MB</div>
                          <div className="text-arena-muted text-[10px]">{sub.testcasesPassed || 42}/{sub.totalTestcases || 42} passed</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-arena-muted text-xs">
                    No submissions recorded yet for this problem.
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN: Code Editor & Console Workspace */}
        <div className="lg:col-span-7 flex flex-col overflow-hidden bg-arena-bgDeep p-3 space-y-3">
          
          {/* Monaco-like Code Editor Panel */}
          <div className="flex-1 overflow-hidden min-h-[300px]">
            <CodeEditor
              code={code}
              onChange={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
              onRun={handleRunCode}
              onSubmit={handleSubmitCode}
              onReset={handleResetCode}
              isExecuting={isExecuting}
            />
          </div>

          {/* Bottom Console Panel (Test Cases & Output) */}
          <div className="h-60 rounded-2xl border border-arena-border bg-arena-card flex flex-col overflow-hidden shadow-lg">
            
            {/* Console Header Tabs */}
            <div className="px-4 bg-arena-bgElevated border-b border-arena-border flex items-center justify-between">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveConsoleTab('testcases')}
                  className={`px-3 py-2 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
                    activeConsoleTab === 'testcases' ? 'border-arena-primary text-arena-text' : 'border-transparent text-arena-muted hover:text-arena-text'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Test Cases</span>
                </button>

                <button
                  onClick={() => setActiveConsoleTab('result')}
                  className={`px-3 py-2 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
                    activeConsoleTab === 'result' ? 'border-arena-primary text-arena-text' : 'border-transparent text-arena-muted hover:text-arena-text'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Execution Result</span>
                  {executionState.status === 'RUNNING' && (
                    <span className="w-2 h-2 rounded-full bg-arena-warning animate-ping ml-1" />
                  )}
                </button>
              </div>

              {activeConsoleTab === 'testcases' && (
                <button
                  onClick={() => setIsCustomMode(!isCustomMode)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                    isCustomMode
                      ? 'bg-arena-primary text-white border-arena-primary'
                      : 'bg-arena-bg text-arena-muted border-arena-border hover:text-arena-text'
                  }`}
                >
                  {isCustomMode ? 'Using Custom Input' : '+ Custom Testcase'}
                </button>
              )}
            </div>

            {/* Console Body */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs">
              
              {/* TAB 1: TESTCASES */}
              {activeConsoleTab === 'testcases' && (
                <div className="space-y-3">
                  {!isCustomMode ? (
                    <>
                      {/* Case Selectors */}
                      <div className="flex items-center space-x-2">
                        {publicCases.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveTestCaseIndex(idx)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                              activeTestCaseIndex === idx
                                ? 'bg-arena-primary/20 text-arena-primary border border-arena-primary/40'
                                : 'bg-arena-bg text-arena-muted hover:text-arena-text border border-arena-border'
                            }`}
                          >
                            Case {idx + 1}
                          </button>
                        ))}
                      </div>

                      {/* Case Detail Box */}
                      <div className="p-3 rounded-xl bg-arena-bg border border-arena-border space-y-2">
                        <div>
                          <span className="text-[10px] text-arena-muted block uppercase">Input</span>
                          <div className="text-arena-text font-semibold">{currentCase.input}</div>
                        </div>
                        {currentCase.expectedOutput && (
                          <div>
                            <span className="text-[10px] text-arena-muted block uppercase">Expected Output</span>
                            <div className="text-arena-success font-semibold">{currentCase.expectedOutput}</div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <span className="text-[10px] text-arena-muted uppercase block">Custom Standard Input:</span>
                      <textarea
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="Enter custom input arguments..."
                        rows={3}
                        className="w-full p-2.5 rounded-lg bg-arena-bg border border-arena-border text-arena-text text-xs focus:outline-none focus:border-arena-primary resize-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: EXECUTION RESULT */}
              {activeConsoleTab === 'result' && (
                <div className="space-y-3">
                  
                  {/* Step Loading States */}
                  {executionState.status === 'QUEUED' && (
                    <div className="flex items-center space-x-3 text-arena-warning py-4">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>{executionState.stepMessage}</span>
                    </div>
                  )}

                  {executionState.status === 'RUNNING' && (
                    <div className="flex items-center space-x-3 text-arena-primary py-4">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>{executionState.stepMessage}</span>
                    </div>
                  )}

                  {/* Verdict Display */}
                  {executionState.status === 'COMPLETED' && executionState.result && (
                    <div className="space-y-3">
                      
                      <div className="flex items-center justify-between border-b border-arena-border pb-3">
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                            executionState.result.verdict === 'ACCEPTED'
                              ? 'bg-arena-success/20 text-arena-success border border-arena-success/40'
                              : 'bg-arena-danger/20 text-arena-danger border border-arena-danger/40'
                          }`}>
                            {executionState.result.verdict}
                          </span>
                          
                          <span className="text-arena-muted text-xs">
                            Tests: <strong className="text-arena-text">{executionState.result.testcasesPassed || 0} / {executionState.result.totalTestcases || 42}</strong>
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-xs">
                          <span className="flex items-center space-x-1 text-arena-primary">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{executionState.result.runtimeMs}ms</span>
                          </span>
                          <span className="flex items-center space-x-1 text-arena-muted">
                            <Cpu className="w-3.5 h-3.5" />
                            <span>{executionState.result.memoryMb}MB</span>
                          </span>
                        </div>
                      </div>

                      {/* Error or Diff Logs if any */}
                      {executionState.result.compilationError && (
                        <div className="p-3 rounded-xl bg-arena-danger/10 border border-arena-danger/30 text-arena-danger text-xs whitespace-pre-wrap">
                          {executionState.result.compilationError}
                        </div>
                      )}

                      {executionState.result.runtimeError && (
                        <div className="p-3 rounded-xl bg-arena-danger/10 border border-arena-danger/30 text-arena-danger text-xs whitespace-pre-wrap">
                          {executionState.result.runtimeError}
                        </div>
                      )}

                      {executionState.result.failedTestcase && (
                        <div className="p-3 rounded-xl bg-arena-card border border-arena-border space-y-1.5 text-xs">
                          <div className="text-arena-danger font-bold">Failed on Testcase #{executionState.result.failedTestcase.index}:</div>
                          <div>Input: <code className="text-arena-text">{executionState.result.failedTestcase.input}</code></div>
                          <div>Expected: <code className="text-arena-success">{executionState.result.failedTestcase.expectedOutput}</code></div>
                          <div>Actual: <code className="text-arena-danger">{executionState.result.failedTestcase.actualOutput}</code></div>
                        </div>
                      )}

                      {executionState.result.stdout && (
                        <div className="p-3 rounded-xl bg-arena-bg border border-arena-border text-arena-muted text-xs">
                          <span className="text-[10px] uppercase font-bold text-arena-muted block mb-1">Standard Output:</span>
                          <pre>{executionState.result.stdout}</pre>
                        </div>
                      )}

                    </div>
                  )}

                  {executionState.status === 'IDLE' && (
                    <div className="text-center py-8 text-arena-muted text-xs">
                      Run or Submit code to evaluate against test cases.
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

