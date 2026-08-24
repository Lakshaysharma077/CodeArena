import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, X, Trophy, Skull, Zap, Clock, Cpu, CheckCircle2, XCircle, Award, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BattleResultModal({ isOpen, onClose, onRematch, resultData }) {
  useEffect(() => {
    if (isOpen && resultData?.result === 'VICTORY') {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen, resultData]);

  if (!isOpen || !resultData) return null;

  const isWin = resultData.result === 'VICTORY';
  const isDraw = resultData.result === 'DRAW';
  const userSolvedCount = resultData.userSolvedCount !== undefined ? resultData.userSolvedCount : 2;
  const opponentSolvedCount = resultData.opponentSolvedCount !== undefined ? resultData.opponentSolvedCount : 1;
  const totalProblems = resultData.totalProblems || 3;

  const userRating = resultData.userRating || {
    oldRating: 1642,
    newRating: 1669,
    delta: 27,
    formattedDelta: '+27'
  };
  const opponentRating = resultData.opponentRating || {
    oldRating: 1678,
    newRating: 1651,
    delta: -27,
    formattedDelta: '-27',
    username: 'voidwalker'
  };
  const performance = resultData.performance || {
    timeElapsed: '08:42',
    score: `${userSolvedCount} / 3 Solved`,
    opponentScore: `${opponentSolvedCount} / 3 Solved`,
    accuracy: userSolvedCount === 3 ? '100% (Sweep!)' : '67%'
  };
  const breakdown = resultData.breakdown || {
    baseDelta: 25,
    speedBonus: 5,
    cleanAttemptBonus: 6,
    attemptPenalty: 0
  };

  const problemSummary = resultData.problemSummary || [
    { problemId: 'p1', title: 'Question 1', isUserSolved: true, isOpponentSolved: true },
    { problemId: 'p2', title: 'Question 2', isUserSolved: true, isOpponentSolved: false },
    { problemId: 'p3', title: 'Question 3', isUserSolved: false, isOpponentSolved: false }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg rounded-3xl border border-arena-border bg-arena-card p-6 sm:p-8 shadow-2xl space-y-5 text-arena-text"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-arena-bg hover:bg-arena-bgElevated border border-arena-border text-arena-muted hover:text-arena-text transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Headline Verdict */}
          <div className="text-center space-y-1.5">
            <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center border shadow-glow-primary bg-arena-bg">
              {isWin ? (
                <Trophy className="w-8 h-8 text-arena-warning animate-bounce" />
              ) : isDraw ? (
                <Award className="w-8 h-8 text-arena-primary" />
              ) : (
                <Skull className="w-8 h-8 text-arena-danger" />
              )}
            </div>

            <h2 className={`text-3xl font-black tracking-tight ${
              isWin ? 'text-arena-success' : isDraw ? 'text-arena-warning' : 'text-arena-danger'
            }`}>
              {isWin ? 'VICTORY' : isDraw ? 'STALEMATE DRAW' : 'DEFEAT'}
            </h2>

            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-arena-bg border border-arena-border text-xs font-mono">
              <span>Final Score:</span>
              <strong className="text-arena-primary font-bold">{userSolvedCount}/{totalProblems} Solved (You)</strong>
              <span>vs</span>
              <strong className="text-arena-warning font-bold">{opponentSolvedCount}/{totalProblems} Solved (Opponent)</strong>
            </div>
          </div>

          {/* 3-Question Breakdown Table */}
          <div className="p-3.5 rounded-2xl bg-arena-bg border border-arena-border space-y-2">
            <span className="text-[10px] uppercase font-bold text-arena-muted tracking-wider block">
              3-Question Match Outcome:
            </span>
            <div className="space-y-1.5 text-xs font-mono">
              {problemSummary.map((p, idx) => (
                <div key={p.problemId || idx} className="flex items-center justify-between p-2 rounded-xl bg-arena-card border border-arena-border/50">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold text-arena-muted">Q{idx + 1}:</span>
                    <span className="text-arena-text font-semibold">{p.title}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px]">
                    <span className="flex items-center space-x-1">
                      <span className="text-arena-muted text-[10px]">You:</span>
                      {p.isUserSolved ? (
                        <span className="text-arena-success font-bold flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-0.5 inline" /> Solved</span>
                      ) : (
                        <span className="text-arena-muted flex items-center"><XCircle className="w-3.5 h-3.5 mr-0.5 inline text-arena-danger/60" /> Unsolved</span>
                      )}
                    </span>
                    <span className="opacity-30">|</span>
                    <span className="flex items-center space-x-1">
                      <span className="text-arena-muted text-[10px]">Opponent:</span>
                      {p.isOpponentSolved ? (
                        <span className="text-arena-warning font-bold flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-0.5 inline" /> Solved</span>
                      ) : (
                        <span className="text-arena-muted flex items-center"><XCircle className="w-3.5 h-3.5 mr-0.5 inline text-arena-danger/60" /> Unsolved</span>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Head-to-head Rating Delta Cards */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Player 1 (You) */}
            <div className="p-4 rounded-2xl bg-arena-bg border border-arena-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-arena-muted">Your Rating</span>
                <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded ${
                  userRating.delta >= 0 ? 'bg-arena-success/20 text-arena-success border border-arena-success/30' : 'bg-arena-danger/20 text-arena-danger border border-arena-danger/30'
                }`}>
                  {userRating.formattedDelta}
                </span>
              </div>
              <div className="flex items-center space-x-2 font-mono">
                <span className="text-sm text-arena-muted">{userRating.oldRating}</span>
                <ArrowRight className="w-3.5 h-3.5 text-arena-muted" />
                <span className="text-xl font-black text-arena-text">{userRating.newRating}</span>
              </div>
              {resultData.isPromoted && (
                <span className="text-[10px] font-bold text-arena-warning block uppercase tracking-wider">
                  ★ Promoted to {resultData.newRank}!
                </span>
              )}
            </div>

            {/* Player 2 (Opponent) */}
            <div className="p-4 rounded-2xl bg-arena-bg border border-arena-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-arena-muted truncate">{opponentRating.username}</span>
                <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded ${
                  opponentRating.delta >= 0 ? 'bg-arena-success/20 text-arena-success border border-arena-success/30' : 'bg-arena-danger/20 text-arena-danger border border-arena-danger/30'
                }`}>
                  {opponentRating.formattedDelta}
                </span>
              </div>
              <div className="flex items-center space-x-2 font-mono">
                <span className="text-sm text-arena-muted">{opponentRating.oldRating}</span>
                <ArrowRight className="w-3.5 h-3.5 text-arena-muted" />
                <span className="text-xl font-black text-arena-text">{opponentRating.newRating}</span>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-arena-bg hover:bg-arena-bgElevated border border-arena-border text-arena-text text-xs font-bold transition-colors cursor-pointer"
            >
              Return to Lobby
            </button>
            {onRematch && (
              <button
                onClick={onRematch}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-arena-primary to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-glow-primary transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Find Next 3-Problem Battle</span>
              </button>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
