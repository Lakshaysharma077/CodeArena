import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Swords,
  Shield,
  Trophy,
  Flame,
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Users,
  Activity,
  ArrowRight,
  ExternalLink,
  MessageSquareOff,
  RefreshCw,
  Flag,
  HelpCircle,
  Code2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CodeEditor from '../components/CodeEditor';
import BattleResultModal from '../components/BattleResultModal';
import {
  startMatchmaking,
  tickMatchmaking,
  matchFoundTrigger,
  tickCountdown,
  startBattleActive,
  setActiveProblemIndex,
  updateUserCode,
  setSelectedLanguage,
  markProblemSolved,
  tickBattleTimer,
  updateOpponentTelemetry,
  setSubmissionProgress,
  setBattleResult,
  resetBattleState,
  createPrivateRoomStart,
  createPrivateRoomSuccess,
  joinPrivateRoomStart
} from '../store/battleSlice';
import { updateRatingAndRank } from '../store/authSlice';
import { matchService } from '../services/matchService';

export default function ArenaPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const battle = useSelector((state) => state.battle);

  const [activeTestcasesPassed, setActiveTestcasesPassed] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [runLogs, setRunLogs] = useState(null);
  const [showEndBattleConfirm, setShowEndBattleConfirm] = useState(false);
  const [solveBanner, setSolveBanner] = useState(null);
  const [joinCodeInput, setJoinCodeInput] = useState('');

  // Active current problem out of the 3 problems
  const problems = battle.problems || (battle.currentBattle?.problems || (battle.currentBattle?.problem ? [battle.currentBattle.problem] : []));
  const currentProblem = problems[battle.activeProblemIndex] || problems[0] || {
    title: 'Loading Question...',
    difficulty: 'Medium',
    description: 'Please wait...',
    starterCode: {}
  };

  // 1. MATCHMAKING TIMER & POLLING
  useEffect(() => {
    let interval;
    if (battle.status === 'MATCHMAKING') {
      interval = setInterval(() => {
        dispatch(tickMatchmaking());
      }, 1000);

      // Trigger realistic match found after 3.5 seconds
      const matchTimeout = setTimeout(async () => {
        try {
          const data = await matchService.findMatch({
            userId: user?.id || 'usr_demo',
            username: user?.username || 'Lakshay',
            rating: user?.rating || 1642,
            rank: user?.rank || 'Platinum'
          });

          dispatch(matchFoundTrigger(data.battle));
        } catch (err) {
          console.error(err);
        }
      }, 3500);

      return () => {
        clearInterval(interval);
        clearTimeout(matchTimeout);
      };
    }
  }, [battle.status, user, dispatch]);

  // PRIVATE ROOM POLLING
  useEffect(() => {
    let interval;
    if (battle.status === 'WAITING_IN_PRIVATE_ROOM' && battle.privateRoomCode) {
      interval = setInterval(async () => {
        try {
          const room = await matchService.checkPrivateRoomStatus(battle.privateRoomCode);
          if (room.status === 'STARTED' && room.battle) {
            dispatch(matchFoundTrigger(room.battle));
          }
        } catch (err) {
          console.error(err);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [battle.status, battle.privateRoomCode, dispatch]);

  const handleCreatePrivateRoom = async () => {
    dispatch(createPrivateRoomStart());
    try {
      const data = await matchService.createPrivateRoom({
        userId: user?.id || 'usr_demo',
        username: user?.username || 'Lakshay',
        rating: user?.rating || 1642,
        rank: user?.rank || 'Platinum'
      });
      dispatch(createPrivateRoomSuccess(data.roomId));
    } catch (err) {
      console.error(err);
      dispatch(resetBattleState());
    }
  };

  const handleJoinPrivateRoom = async () => {
    if (!joinCodeInput.trim()) return;
    try {
      const data = await matchService.joinPrivateRoom({
        roomId: joinCodeInput.trim().toUpperCase(),
        userId: user?.id || 'usr_joiner',
        username: user?.username || 'Challenger',
        rating: user?.rating || 1500,
        rank: user?.rank || 'Gold'
      });
      dispatch(matchFoundTrigger(data.battle));
    } catch (err) {
      alert(err.message || 'Failed to join room');
    }
  };

  // 2. MATCH FOUND COUNTDOWN (3 -> 2 -> 1 -> ACTIVE)
  useEffect(() => {
    let countdownTimer;
    if (battle.status === 'MATCH_FOUND') {
      if (battle.countdownSeconds > 0) {
        countdownTimer = setTimeout(() => {
          dispatch(tickCountdown());
        }, 1000);
      } else {
        dispatch(startBattleActive());
      }
    }
    return () => clearTimeout(countdownTimer);
  }, [battle.status, battle.countdownSeconds, dispatch]);

  // 3. SYNCHRONIZED BATTLE TIMER & OPPONENT TELEMETRY STREAM
  useEffect(() => {
    let timerInterval;
    let telemetryInterval;

    if (battle.status === 'BATTLE_ACTIVE') {
      // 15:00 countdown clock
      timerInterval = setInterval(() => {
        dispatch(tickBattleTimer());
      }, 1000);

      // Real-time opponent telemetry poll every 3 seconds
      telemetryInterval = setInterval(async () => {
        if (!battle.currentBattle?.id) return;
        const elapsed = (900 - battle.timerSeconds);
        const data = await matchService.getOpponentStatus(battle.currentBattle.id, elapsed);
        dispatch(updateOpponentTelemetry(data));
      }, 3000);
    }

    return () => {
      clearInterval(timerInterval);
      clearInterval(telemetryInterval);
    };
  }, [battle.status, battle.timerSeconds, battle.currentBattle, dispatch]);

  // Handle Run Code on current question
  const handleRunBattleCode = async () => {
    if (!currentProblem?.problemId) {
      setRunLogs({ type: 'error', message: '⚠️ No active problem. Please join a Ranked Match or Private Room first!' });
      return;
    }
    setIsEvaluating(true);
    setRunLogs({ type: 'info', message: 'Running compiler tests against public cases...' });
    try {
      const res = await fetch('/api/submissions/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: battle.userCode,
          language: battle.selectedLanguage.toLowerCase(),
          problemId: currentProblem.problemId
        })
      });
      const data = await res.json();
      setIsEvaluating(false);

      if (data.verdict === 'ACCEPTED') {
        setActiveTestcasesPassed(data.testcasesPassed || 2);
        setRunLogs({ type: 'success', message: `✅ Accepted: ${data.testcasesPassed}/${data.totalTestcases} test cases passed (${data.runtimeMs}ms).` });
      } else if (data.verdict === 'WRONG_ANSWER') {
        setRunLogs({ type: 'error', message: `❌ Wrong Answer on Case #${data.failedTestcase?.index || 1}:\nExpected: ${data.failedTestcase?.expectedOutput}\nActual: ${data.failedTestcase?.actualOutput}` });
      } else if (data.verdict === 'COMPILATION_ERROR') {
        setRunLogs({ type: 'error', message: `⚠️ Compilation Error:\n${data.compilationError}` });
      } else {
        setRunLogs({ type: 'error', message: `⚠️ Runtime Error: ${data.runtimeError || 'Script failed'}` });
      }
    } catch (err) {
      setIsEvaluating(false);
      setRunLogs({ type: 'error', message: 'Error running tests. Please verify code syntax.' });
    }
  };

  // Submit Current Problem in 3-Question Battle
  const handleSubmitBattleProblem = async () => {
    if (!currentProblem?.problemId) {
      setRunLogs({ type: 'error', message: '⚠️ No active problem. Please join a Ranked Match or Private Room first!' });
      return;
    }
    setIsEvaluating(true);
    setRunLogs({ type: 'info', message: `Submitting solution to judge for Question ${battle.activeProblemIndex + 1}...` });

    try {
      const elapsed = 900 - battle.timerSeconds;
      const res = await matchService.submitBattleSolution({
        battleId: battle.currentBattle?.id,
        userId: user?.id || 'usr_demo',
        problemId: currentProblem.problemId,
        code: battle.userCode,
        language: battle.selectedLanguage,
        elapsedSeconds: elapsed,
        solvedProblemIds: battle.userSolvedProblemIds
      });

      setIsEvaluating(false);

      if (res.isAccepted) {
        dispatch(markProblemSolved(currentProblem.problemId));
        setSolveBanner(`🎉 Question ${battle.activeProblemIndex + 1} (${currentProblem.title}) Solved!`);
        setTimeout(() => setSolveBanner(null), 4000);

        setRunLogs({ type: 'success', message: `🎉 ACCEPTED! Question ${battle.activeProblemIndex + 1} passed 100% of testcases.` });

        const updatedCount = (battle.userSolvedProblemIds.includes(currentProblem.problemId) ? battle.userSolvedProblemIds.length : battle.userSolvedProblemIds.length + 1);

        // If user solved all 3 questions, immediately conclude battle with perfect victory!
        if (updatedCount === 3) {
          setTimeout(() => {
            handleEndBattle(true);
          }, 1200);
        }
      } else if (res.verdict === 'COMPILATION_ERROR') {
        setRunLogs({ type: 'error', message: `⚠️ Compilation Error:\n${res.compilationError}` });
      } else {
        setRunLogs({ type: 'error', message: `❌ Submission Failed: ${res.verdict}.\n${res.failedTestcase ? `Failed on Case #${res.failedTestcase.index}:\nExpected: ${res.failedTestcase.expectedOutput}\nActual: ${res.failedTestcase.actualOutput}` : ''}` });
      }
    } catch (err) {
      setIsEvaluating(false);
      setRunLogs({ type: 'error', message: 'Submission failed. Please check connection and retry.' });
    }
  };

  // End Battle & Finalize Match Scores
  const handleEndBattle = async (isPerfectSweep = false) => {
    setShowEndBattleConfirm(false);
    setIsEvaluating(true);

    try {
      const elapsed = 900 - battle.timerSeconds;
      const res = await matchService.endBattle({
        battleId: battle.currentBattle?.id,
        userId: user?.id || 'usr_demo',
        userSolvedIds: battle.userSolvedProblemIds,
        opponentSolvedCount: battle.opponentSolvedCount,
        elapsedSeconds: elapsed
      });

      setIsEvaluating(false);

      // Update auth store with new rating and rank
      if (res.userRating?.newRating) {
        dispatch(updateRatingAndRank({
          rating: res.userRating.newRating,
          rank: res.newRank
        }));
      }

      dispatch(setBattleResult(res));
    } catch (err) {
      setIsEvaluating(false);
      console.error('Failed to end battle', err);
    }
  };

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col bg-arena-bg text-arena-text">

      {/* ──────────────────────────────────────────────────
          STATE 1: IDLE MATCHMAKING LOBBY
          ────────────────────────────────────────────────── */}
      {battle.status === 'IDLE' && (
        <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl p-8 sm:p-10 rounded-3xl glass-panel border border-arena-border text-center space-y-8 bg-arena-card shadow-2xl relative z-10"
          >
            {/* Top Icon Badge */}
            <div className="w-20 h-20 mx-auto rounded-3xl bg-arena-primary/10 border border-arena-primary/30 p-1 flex items-center justify-center shadow-glow-primary">
              <Swords className="w-10 h-10 text-arena-primary animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-arena-primary/10 border border-arena-primary/20 text-arena-primary text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ranked 3-Question Battle</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-arena-text tracking-tight">
                1v1 Algorithmic Arena
              </h1>
              <p className="text-sm text-arena-muted max-w-md mx-auto leading-relaxed">
                Compete head-to-head in real time. Both players receive the <strong>exact same 3 coding questions</strong>. Solve more problems or end the battle early to lock in your score!
              </p>
            </div>

            {/* Current Player Rank Summary Card */}
            <div className="p-4 rounded-2xl bg-arena-bg border border-arena-border flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-arena-primary/40"
                  alt="You"
                />
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-arena-text">{user?.username || 'Lakshay'}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-arena-primary/20 text-arena-primary border border-arena-primary/30 uppercase">
                      {user?.rank || 'Platinum'}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-arena-muted">
                    Rating: <strong className="text-arena-text">{user?.rating || 1642} RR</strong> • Win Rate: <strong className="text-arena-success">{user?.stats?.winRate || 74}%</strong>
                  </span>
                </div>
              </div>

              <div className="text-right text-xs font-mono">
                <span className="text-arena-warning font-bold block">{user?.stats?.currentStreak || 6} 🔥 Streak</span>
                <span className="text-[11px] text-arena-muted">3-Question Format</span>
              </div>
            </div>

            {/* Find Match CTA Button */}
            <button
              onClick={() => dispatch(startMatchmaking({ rating: user?.rating || 1642 }))}

              className="w-full py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-arena-primary to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-base sm:text-lg shadow-glow-primary transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3 cursor-pointer"
            >
              <Swords className="w-5 h-5" />
              <span>ENTER 3-QUESTION RANKED QUEUE</span>
            </button>

            {/* Private Room Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCreatePrivateRoom}
                className="flex-1 py-3 rounded-2xl bg-arena-bg hover:bg-arena-bgElevated border border-arena-border text-arena-text font-bold text-sm shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Users className="w-4 h-4 text-arena-primary" />
                <span>Create Private Room</span>
              </button>
              <button
                onClick={() => dispatch(joinPrivateRoomStart())}
                className="flex-1 py-3 rounded-2xl bg-arena-bg hover:bg-arena-bgElevated border border-arena-border text-arena-text font-bold text-sm shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Flame className="w-4 h-4 text-arena-warning" />
                <span>Join Private Room</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────
          STATE 2: MATCHMAKING SEARCHING RADAR
          ────────────────────────────────────────────────── */}
      {battle.status === 'MATCHMAKING' && (
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-8 sm:p-10 rounded-3xl glass-card border border-arena-primary/40 bg-arena-card text-center space-y-6 shadow-glow-primary"
          >
            {/* Spinning Radar Indicator */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-arena-primary/20 border-t-arena-primary animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-arena-primary/10 animate-ping opacity-40" />
              <Activity className="w-10 h-10 text-arena-primary animate-pulse" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-arena-text">Searching for opponent...</h2>
              <p className="text-xs text-arena-muted mt-1 font-mono">
                Matching Elo Rating Range ({battle.matchmakingState.preferredRangeMin} - {battle.matchmakingState.preferredRangeMax})
              </p>
            </div>

            {/* Queue Info */}
            <div className="p-4 rounded-2xl bg-arena-bg border border-arena-border grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded-xl bg-arena-card border border-arena-border/50">
                <span className="text-arena-muted block text-[10px]">IN QUEUE</span>
                <strong className="text-arena-text text-sm">{battle.matchmakingState.playersSearching}</strong>
              </div>
              <div className="p-2 rounded-xl bg-arena-card border border-arena-border/50">
                <span className="text-arena-muted block text-[10px]">EST. WAIT</span>
                <strong className="text-arena-success text-sm">{battle.matchmakingState.estimatedWait}</strong>
              </div>
            </div>

            <div className="text-xs font-mono text-arena-muted">
              Queue Elapsed: <span className="text-arena-primary font-bold">{battle.matchmakingState.queueSeconds}s</span>
            </div>

            <button
              onClick={() => dispatch(resetBattleState())}
              className="px-6 py-2 rounded-xl bg-arena-bg hover:bg-arena-bgElevated border border-arena-border text-xs font-bold text-arena-muted hover:text-arena-text transition-colors cursor-pointer"
            >
              Cancel Matchmaking
            </button>
          </motion.div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────
          STATE: WAITING IN PRIVATE ROOM
          ────────────────────────────────────────────────── */}
      {battle.status === 'WAITING_IN_PRIVATE_ROOM' && (
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-8 sm:p-10 rounded-3xl glass-card border border-arena-primary/40 bg-arena-card text-center space-y-6 shadow-glow-primary"
          >
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-arena-primary/20 border-t-arena-primary animate-spin" />
              <Users className="w-10 h-10 text-arena-primary" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-arena-text">Private Room Created</h2>
              <p className="text-sm text-arena-muted mt-2">Share this code with your opponent</p>
            </div>

            <div className="p-4 rounded-2xl bg-arena-bg border border-arena-primary/30 flex items-center justify-center">
              <span className="text-4xl font-black text-arena-primary tracking-widest">{battle.privateRoomCode}</span>
            </div>

            <p className="text-xs text-arena-muted italic">Waiting for opponent to join...</p>

            <button
              onClick={() => dispatch(resetBattleState())}
              className="px-6 py-2 rounded-xl bg-arena-bg hover:bg-arena-bgElevated border border-arena-border text-xs font-bold text-arena-muted hover:text-arena-text transition-colors cursor-pointer"
            >
              Cancel Room
            </button>
          </motion.div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────
          STATE: JOINING PRIVATE ROOM
          ────────────────────────────────────────────────── */}
      {battle.status === 'JOINING_PRIVATE_ROOM' && (
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-8 sm:p-10 rounded-3xl glass-card border border-arena-primary/40 bg-arena-card text-center space-y-6 shadow-glow-primary"
          >
            <Flame className="w-12 h-12 text-arena-warning mx-auto" />

            <div>
              <h2 className="text-2xl font-extrabold text-arena-text">Join Private Room</h2>
              <p className="text-sm text-arena-muted mt-2">Enter the 6-character room code</p>
            </div>

            <input
              type="text"
              placeholder="Enter Room Code"
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
              maxLength={6}
              className="w-full text-center p-4 rounded-2xl bg-arena-bg border border-arena-border text-2xl font-black text-arena-text tracking-widest focus:outline-none focus:border-arena-primary"
            />

            <button
              onClick={handleJoinPrivateRoom}
              className="w-full py-3 rounded-xl bg-arena-primary hover:bg-arena-primary/80 text-white font-bold transition-all shadow-glow-primary cursor-pointer"
            >
              Join Battle
            </button>

            <button
              onClick={() => dispatch(resetBattleState())}
              className="px-6 py-2 rounded-xl bg-arena-bg hover:bg-arena-bgElevated border border-arena-border text-xs font-bold text-arena-muted hover:text-arena-text transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────
          STATE 3: MATCH FOUND COUNTDOWN SHOWDOWN
          ────────────────────────────────────────────────── */}
      {battle.status === 'MATCH_FOUND' && (
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg p-8 rounded-3xl glass-card border border-arena-primary bg-arena-card text-center space-y-6 shadow-glow-primary"
          >
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-arena-success/20 text-arena-success text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>3-Question Match Found!</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-arena-text">
                Battle Initializing
              </h2>
            </div>

            {/* Versus Player Showdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 py-3">

              {/* Player 1 (You) */}
              <div className="p-4 rounded-2xl bg-arena-bg border border-arena-primary/30 text-center space-y-2">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                  className="w-16 h-16 mx-auto rounded-2xl object-cover ring-2 ring-arena-primary"
                  alt="You"
                />
                <div>
                  <span className="text-sm font-extrabold text-arena-text block">{user?.username || 'Lakshay'}</span>
                  <span className="text-xs font-mono text-arena-primary">{user?.rank || 'Platinum'} ({user?.rating || 1642} RR)</span>
                </div>
              </div>

              {/* VS Badge */}
              <div className="flex flex-col items-center justify-center space-y-1">
                <span className="text-2xl font-black text-arena-warning italic">VS</span>
                <span className="text-[11px] font-mono text-arena-muted">
                  Diff: {battle.currentBattle?.ratingDiff || 36} RR
                </span>
              </div>

              {/* Player 2 (Opponent) */}
              <div className="p-4 rounded-2xl bg-arena-bg border border-arena-border text-center space-y-2">
                <img
                  src={battle.opponent?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'}
                  className="w-16 h-16 mx-auto rounded-2xl object-cover ring-2 ring-arena-warning"
                  alt="Opponent"
                />
                <div>
                  <span className="text-sm font-extrabold text-arena-text block">{battle.opponent?.username || 'voidwalker'}</span>
                  <span className="text-xs font-mono text-arena-warning">{battle.opponent?.rank || 'Platinum'} ({battle.opponent?.rating || 1678} RR)</span>
                </div>
              </div>

            </div>

            {/* 3 Questions Preview & Countdown */}
            <div className="p-3 rounded-2xl bg-arena-bg border border-arena-border space-y-2 text-left text-xs font-mono">
              <span className="text-[10px] text-arena-muted block uppercase font-bold">3 Matched Questions:</span>
              <div className="space-y-1">
                {problems.map((p, idx) => (
                  <div key={p.problemId || idx} className="flex justify-between items-center text-arena-text">
                    <span>Q{idx + 1}: {p.title}</span>
                    <span className="text-arena-warning font-bold text-[10px]">({p.difficulty})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-arena-primary/10 border border-arena-primary/20">
              <span className="text-xs text-arena-muted font-bold">Starting Battle In:</span>
              <span className="text-2xl font-black text-arena-primary">{battle.countdownSeconds}</span>
            </div>

          </motion.div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────
          STATE 4: LIVE 1v1 COMPETITIVE BATTLE ROOM (3 QUESTIONS)
          ────────────────────────────────────────────────── */}
      {battle.status === 'BATTLE_ACTIVE' && battle.currentBattle && (
        <div className="flex-1 flex flex-col overflow-hidden bg-arena-bg">

          {/* Top Serious Header HUD Bar with Score & End Battle Button */}
          <div className="px-6 py-2.5 bg-arena-bgElevated border-b border-arena-border flex flex-wrap items-center justify-between gap-3">

            {/* Player 1 HUD (You) */}
            <div className="flex items-center space-x-3">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-arena-primary"
                alt="You"
              />
              <div>
                <span className="text-xs font-bold text-arena-text block">{user?.username || 'Lakshay'} (You)</span>
                <span className="text-[10px] font-mono text-arena-primary">{user?.rating || 1642} RR</span>
              </div>
            </div>

            {/* Center Live Score & Match Timer */}
            <div className="flex items-center space-x-3">

              {/* Score Badge */}
              <div className="px-3.5 py-1.5 rounded-xl bg-arena-bg border border-arena-primary/40 flex items-center space-x-2 font-mono text-xs font-black shadow-inner">
                <span className="text-arena-primary font-bold">{battle.userSolvedProblemIds.length}/3 Solved</span>
                <span className="text-arena-muted font-normal">⚔️</span>
                <span className="text-arena-warning font-bold">{battle.opponentSolvedCount}/3 Opponent</span>
              </div>

              {/* Timer */}
              <div className="px-3.5 py-1.5 rounded-xl bg-arena-bg border border-arena-border flex items-center space-x-2 text-arena-text font-mono text-sm font-black shadow-inner">
                <Clock className="w-3.5 h-3.5 text-arena-warning animate-pulse" />
                <span>{formatTimer(battle.timerSeconds)}</span>
              </div>

              {/* END BATTLE BUTTON */}
              <button
                type="button"
                onClick={() => setShowEndBattleConfirm(true)}
                className="px-3.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-white border border-red-500/40 text-xs font-extrabold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>End Battle</span>
              </button>
            </div>

            {/* Player 2 HUD (Opponent) */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <span className="text-xs font-bold text-arena-text block">{battle.opponent?.username || 'voidwalker'}</span>
                <span className="text-[10px] font-mono text-arena-warning">{battle.opponent?.rating || 1678} RR</span>
              </div>
              <img
                src={battle.opponent?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-arena-warning"
                alt="Opponent"
              />
            </div>

          </div>

          {/* 3-Question Navigation Bar */}
          <div className="px-6 py-2 bg-arena-card border-b border-arena-border flex items-center justify-between overflow-x-auto">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-arena-muted uppercase font-mono mr-1">Questions:</span>
              {problems.map((prob, idx) => {
                const isActive = battle.activeProblemIndex === idx;
                const isSolved = battle.userSolvedProblemIds.includes(prob.problemId);
                return (
                  <button
                    key={prob.problemId || idx}
                    type="button"
                    onClick={() => dispatch(setActiveProblemIndex(idx))}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 border cursor-pointer ${isActive
                        ? 'bg-arena-primary text-white border-arena-primary shadow-glow-primary'
                        : isSolved
                          ? 'bg-arena-success/15 text-arena-success border-arena-success/30 hover:bg-arena-success/25'
                          : 'bg-arena-bg text-arena-muted hover:text-arena-text border-arena-border hover:border-arena-border/80'
                      }`}
                  >
                    <span>Q{idx + 1}: {prob.title}</span>
                    {isSolved ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-arena-success fill-current/20" />
                    ) : (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded uppercase ${isActive ? 'bg-black/30 text-white' : 'bg-arena-card text-arena-muted'
                        }`}>
                        {prob.difficulty}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {solveBanner && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-3 py-1 rounded-lg bg-arena-success/20 border border-arena-success text-arena-success text-xs font-bold font-mono"
              >
                {solveBanner}
              </motion.div>
            )}
          </div>

          {/* 3-Column Competitive Workspace Grid */}
          <div className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-hidden bg-arena-bgDeep">

            {/* LEFT: Problem Brief for Active Question */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-arena-card border border-arena-border overflow-y-auto space-y-4 text-xs leading-relaxed">
              <div className="flex items-center justify-between border-b border-arena-border/60 pb-3">
                <div>
                  <span className="text-[10px] text-arena-primary font-mono font-bold block uppercase">
                    Question {battle.activeProblemIndex + 1} of 3
                  </span>
                  <h2 className="text-base font-bold text-arena-text">{currentProblem.title}</h2>
                </div>
                <div className="flex items-center space-x-1.5">
                  {battle.userSolvedProblemIds.includes(currentProblem.problemId) && (
                    <span className="px-2 py-0.5 rounded bg-arena-success/20 text-arena-success text-[10px] font-extrabold border border-arena-success/40">
                      ✓ SOLVED
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded bg-arena-warning/20 text-arena-warning text-[10px] font-extrabold border border-arena-warning/30">
                    {currentProblem.difficulty}
                  </span>
                </div>
              </div>

              <p className="text-arena-text whitespace-pre-line leading-relaxed">
                {currentProblem.description}
              </p>

              {currentProblem.examples && (
                <div className="space-y-2 pt-2 border-t border-arena-border/40">
                  <span className="text-[10px] uppercase font-bold text-arena-muted block">Example 1:</span>
                  <div className="p-3 rounded-xl bg-arena-bg border border-arena-border font-mono text-[11px] space-y-1">
                    <div>Input: <code className="text-arena-primary">{currentProblem.examples[0]?.input}</code></div>
                    <div>Output: <code className="text-arena-success">{currentProblem.examples[0]?.output}</code></div>
                  </div>
                </div>
              )}

              {currentProblem.constraints && (
                <div className="space-y-1 pt-2 border-t border-arena-border/40 font-mono text-[11px] text-arena-muted">
                  <span className="text-[10px] uppercase font-bold text-arena-text block">Constraints:</span>
                  {currentProblem.constraints.map((c, i) => (
                    <div key={i}>• {c}</div>
                  ))}
                </div>
              )}
            </div>

            {/* CENTER: Monaco Code Editor */}
            <div className="lg:col-span-5 flex flex-col space-y-2 overflow-hidden">
              <div className="flex-1 overflow-hidden">
                <CodeEditor
                  code={battle.userCode}
                  onChange={(val) => dispatch(updateUserCode(val))}
                  language={battle.selectedLanguage}
                  onLanguageChange={(lang) => dispatch(setSelectedLanguage(lang))}
                  onRun={handleRunBattleCode}
                  onSubmit={handleSubmitBattleProblem}
                  isExecuting={isEvaluating}
                  runLabel="Run Code"
                  submitLabel={`Submit Q${battle.activeProblemIndex + 1}`}
                />
              </div>

              {runLogs && (
                <div className={`p-3 rounded-xl border text-xs font-mono whitespace-pre-wrap ${runLogs.type === 'success' ? 'bg-arena-success/10 border-arena-success/40 text-arena-success' :
                    runLogs.type === 'error' ? 'bg-red-500/10 border-red-500/40 text-red-400' :
                      'bg-arena-card border-arena-border text-arena-primary'
                  }`}>
                  {runLogs.message}
                </div>
              )}
            </div>

            {/* RIGHT: Live Opponent Telemetry & Battle HUD */}
            <div className="lg:col-span-3 flex flex-col space-y-3">

              {/* Opponent Live Activity Card */}
              <div className="p-4 rounded-2xl bg-arena-card border border-arena-border space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-arena-border/60 pb-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-arena-muted">Opponent Telemetry</span>
                  <span className="flex items-center space-x-1 text-[10px] font-mono text-arena-success">
                    <span className="w-2 h-2 rounded-full bg-arena-success animate-pulse" />
                    <span>Live (24ms)</span>
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <img
                    src={battle.opponent?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-arena-warning"
                    alt={battle.opponent?.username}
                  />
                  <div>
                    <span className="font-bold text-arena-text block">{battle.opponent?.username || 'voidwalker'}</span>
                    <span className="text-[11px] text-arena-muted font-mono">{battle.opponent?.college || 'Waterloo'} • {battle.opponent?.country || 'Canada'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-arena-bg border border-arena-border space-y-1 font-mono text-xs">
                  <span className="text-[10px] text-arena-muted block uppercase">Current Action:</span>
                  <div className="text-arena-warning font-bold flex items-center space-x-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{battle.opponentTelemetry.status}</span>
                  </div>
                </div>
              </div>

              {/* 3-Question Match Score Tracker */}
              <div className="p-4 rounded-2xl bg-arena-card border border-arena-border space-y-3 text-xs font-mono">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-arena-muted block">3-Question Match Score</span>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-arena-text font-bold">Your Score</span>
                      <span className="text-arena-primary font-bold">{battle.userSolvedProblemIds.length} / 3 Solved</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-arena-bg overflow-hidden">
                      <div
                        className="h-full bg-arena-primary transition-all duration-300"
                        style={{ width: `${(battle.userSolvedProblemIds.length / 3) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-arena-text font-bold">Opponent Score</span>
                      <span className="text-arena-warning font-bold">{battle.opponentSolvedCount} / 3 Solved</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-arena-bg overflow-hidden">
                      <div
                        className="h-full bg-arena-warning transition-all duration-300"
                        style={{ width: `${(battle.opponentSolvedCount / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick End Battle Card */}
              <div className="p-3.5 rounded-2xl bg-arena-card border border-arena-border text-center space-y-2">
                <span className="text-[11px] text-arena-muted block">
                  Finished solving or want to conclude?
                </span>
                <button
                  type="button"
                  onClick={() => setShowEndBattleConfirm(true)}
                  className="w-full py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 hover:text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>END BATTLE & SUBMIT SCORE</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ──────────────────────────────────────────────────
          END BATTLE CONFIRMATION MODAL
          ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showEndBattleConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl border border-red-500/40 bg-arena-card p-6 shadow-2xl space-y-5 text-arena-text"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                  <Flag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-arena-text">End Battle Now?</h3>
                  <p className="text-xs text-arena-muted">Finalize match and compute Elo rating</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-arena-bg border border-arena-border font-mono text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-arena-muted">Your Current Score:</span>
                  <strong className="text-arena-primary">{battle.userSolvedProblemIds.length} / 3 Solved</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-arena-muted">Opponent Score:</span>
                  <strong className="text-arena-warning">{battle.opponentSolvedCount} / 3 Solved</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-arena-muted">Time Elapsed:</span>
                  <strong className="text-arena-text">{formatTimer(900 - battle.timerSeconds)}</strong>
                </div>
              </div>

              <p className="text-xs text-arena-muted leading-relaxed">
                Ending the battle will immediately compare your solved count against your opponent's to resolve the match.
              </p>

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowEndBattleConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-arena-bg hover:bg-arena-bgElevated border border-arena-border text-xs font-bold text-arena-muted hover:text-arena-text transition-colors cursor-pointer"
                >
                  Cancel & Keep Coding
                </button>
                <button
                  type="button"
                  onClick={() => handleEndBattle(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-extrabold shadow-lg transition-all cursor-pointer"
                >
                  Confirm & End Battle
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ──────────────────────────────────────────────────
          STATE 6: BATTLE VICTORY / DEFEAT MODAL (3 QUESTIONS)
          ────────────────────────────────────────────────── */}
      <BattleResultModal
        isOpen={battle.status === 'BATTLE_RESULT'}
        onClose={() => dispatch(resetBattleState())}
        onRematch={() => {
          dispatch(resetBattleState());
          dispatch(startMatchmaking({ rating: user?.rating || 1642 }));
        }}
        resultData={battle.resultData}
      />

    </div>
  );
}
