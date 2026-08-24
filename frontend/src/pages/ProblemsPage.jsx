import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, CheckCircle, ArrowRight, Building2, Tag, Filter, Layers } from 'lucide-react';
import { problemService } from '../services/problemService';

const TOPIC_CATEGORIES = [
  'All',
  'Arrays', 'Strings', 'Hash Table', 'Two Pointers', 'Sliding Window', 'Stack',
  'Queue', 'Linked List', 'Binary Search', 'Trees', 'Binary Tree', 'BST',
  'Heap', 'Graph', 'BFS', 'DFS', 'Backtracking', 'Greedy', 'Dynamic Programming',
  'Math', 'Bit Manipulation', 'Intervals', 'Prefix Sum', 'Union Find', 'Topological Sort', 'Trie', 'Design'
];

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [companiesList, setCompaniesList] = useState([]);

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [difficulty, selectedTopic, selectedCompany]);

  const fetchMetadata = async () => {
    try {
      const comps = await problemService.getCompanies();
      setCompaniesList(['All', ...comps]);
    } catch {
      setCompaniesList(['All', 'Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Netflix', 'Uber', 'Bloomberg']);
    }
  };

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const data = await problemService.getProblems({
        difficulty,
        topic: selectedTopic,
        company: selectedCompany,
        search
      });
      setProblems(data.problems || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = problems.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.topics && p.topics.some(t => t.toLowerCase().includes(q))) ||
      (p.companies && p.companies.some(c => c.toLowerCase().includes(q)))
    );
  });

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Easy': return 'bg-arena-success/15 text-arena-success border-arena-success/30';
      case 'Medium': return 'bg-arena-warning/15 text-arena-warning border-arena-warning/30';
      case 'Hard': return 'bg-arena-danger/15 text-arena-danger border-arena-danger/30';
      default: return 'bg-arena-card text-arena-muted border-arena-border';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-arena-border">
        <div>
          <h1 className="text-3xl font-extrabold text-arena-text flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-arena-primary" />
            <span>Competitive Problem Library</span>
          </h1>
          <p className="text-sm text-arena-muted mt-1">
            Curated algorithmic challenge suite with multi-language starter templates, hidden stress suites, and performance benchmarking.
          </p>
        </div>

        {/* Quick Filter Counts */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1.5 rounded-xl bg-arena-card border border-arena-border text-arena-muted">
            Total: <strong className="text-arena-text">{problems.length}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-arena-success/10 border border-arena-success/30 text-arena-success">
            Easy: <strong>{problems.filter(p => p.difficulty === 'Easy').length}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-arena-warning/10 border border-arena-warning/30 text-arena-warning">
            Medium: <strong>{problems.filter(p => p.difficulty === 'Medium').length}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-arena-danger/10 border border-arena-danger/30 text-arena-danger">
            Hard: <strong>{problems.filter(p => p.difficulty === 'Hard').length}</strong>
          </span>
        </div>
      </div>

      {/* 27-Topic Taxonomy Horizontal Filter Bar */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-arena-muted">
          <Layers className="w-3.5 h-3.5 text-arena-primary" />
          <span>Filter by Topic Taxonomy</span>
        </div>
        
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {TOPIC_CATEGORIES.map((topic) => {
            const isActive = selectedTopic === topic;
            return (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
                  isActive
                    ? 'bg-arena-primary text-white border-arena-primary shadow-glow-primary'
                    : 'bg-arena-card text-arena-muted hover:text-arena-text border-arena-border hover:border-arena-primary/40'
                }`}
              >
                <span>{topic}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Filter Controls Bar */}
      <div className="p-4 rounded-2xl glass-card border border-arena-border flex flex-col md:flex-row items-center gap-4 bg-arena-card">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-arena-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search problems by title, topic, company interview tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-arena-bg border border-arena-border text-sm text-arena-text placeholder-arena-muted focus:outline-none focus:border-arena-primary transition-colors"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs font-bold text-arena-muted uppercase whitespace-nowrap">Difficulty:</span>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-arena-bg border border-arena-border text-arena-text text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-arena-primary cursor-pointer"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Company Interview Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs font-bold text-arena-muted uppercase whitespace-nowrap">Company Tag:</span>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="bg-arena-bg border border-arena-border text-arena-text text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-arena-primary cursor-pointer"
          >
            {companiesList.map(comp => (
              <option key={comp} value={comp}>{comp === 'All' ? 'All Companies' : comp}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Problems Table */}
      <div className="overflow-hidden rounded-2xl glass-card border border-arena-border bg-arena-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-arena-bgElevated text-xs uppercase font-extrabold text-arena-muted border-b border-arena-border">
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Problem</th>
              <th className="py-4 px-6">Difficulty</th>
              <th className="py-4 px-6">Interview Association</th>
              <th className="py-4 px-6">Acceptance</th>
              <th className="py-4 px-6">Complexity</th>
              <th className="py-4 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-arena-border/60 text-sm">
            {filtered.length > 0 ? (
              filtered.map((prob) => (
                <tr key={prob.problemId || prob._id || prob.id} className="hover:bg-arena-cardGlow/50 transition-colors">
                  
                  {/* Status Indicator */}
                  <td className="py-4 px-6">
                    <CheckCircle className="w-4 h-4 text-arena-success/60" />
                  </td>

                  {/* Title & Topics */}
                  <td className="py-4 px-6 font-semibold text-arena-text">
                    <Link to={`/problems/${prob.slug || prob.problemId}`} className="hover:text-arena-primary transition-colors flex items-center space-x-2">
                      <span>{prob.title}</span>
                    </Link>
                    
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      {prob.topics?.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-arena-bg border border-arena-border text-arena-muted">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Difficulty */}
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getDifficultyBadge(prob.difficulty)}`}>
                      {prob.difficulty}
                    </span>
                  </td>

                  {/* Company Interview Associations */}
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap items-center gap-1 max-w-xs">
                      {prob.companies && prob.companies.length > 0 ? (
                        prob.companies.slice(0, 3).map((comp, idx) => (
                          <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-arena-primary/10 border border-arena-primary/20 text-arena-primary">
                            {comp}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-arena-muted">General Interview</span>
                      )}
                      {prob.companies && prob.companies.length > 3 && (
                        <span className="text-[10px] text-arena-muted font-mono">+{prob.companies.length - 3}</span>
                      )}
                    </div>
                  </td>

                  {/* Acceptance Rate */}
                  <td className="py-4 px-6 font-mono text-xs text-arena-muted">
                    <div>{prob.acceptanceRate || 65.0}%</div>
                    <div className="text-[10px] text-arena-muted/60">{prob.totalSubmissions?.toLocaleString() || '1,200'} subs</div>
                  </td>

                  {/* Expected Complexity */}
                  <td className="py-4 px-6 font-mono text-xs text-arena-primary">
                    {prob.expectedComplexity?.time || 'O(N)'}
                  </td>

                  {/* Action Link */}
                  <td className="py-4 px-6 text-right">
                    <Link
                      to={`/problems/${prob.slug || prob.problemId}`}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-arena-primary/15 hover:bg-arena-primary border border-arena-primary/30 text-arena-primary hover:text-white font-bold text-xs transition-all duration-200"
                    >
                      <span>Solve</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-12 text-center text-arena-muted font-medium">
                  {loading ? 'Loading problem library...' : 'No problems found matching your filters.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

