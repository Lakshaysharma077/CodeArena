import React from 'react';
import { motion } from 'framer-motion';

const CODE_SNIPPETS = [
  'function twoSum(nums, target) { return [i, j]; }',
  'dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) + cost;',
  'while (left <= right) { mid = (left + right) >> 1; }',
  'const graph = new Map(); graph.set(node, neighbors);',
  'O(N log N) | Space: O(1)',
  'verdict: ACCEPTED | 24ms | 18.2 MB',
  'queue.push({ curr, dist: d + 1 });'
];

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">

      {/* Ambient Radial Light Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[140px] animate-pulse-slow" style={{ background: 'color-mix(in srgb, var(--arena-primary) 15%, transparent)' }} />
      <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] rounded-full blur-[160px] animate-pulse-slow" style={{ background: 'color-mix(in srgb, var(--arena-primary) 10%, transparent)' }} />
      <div className="absolute -bottom-40 left-1/3 w-[28rem] h-[28rem] rounded-full blur-[150px]" style={{ background: 'color-mix(in srgb, var(--arena-warning) 8%, transparent)' }} />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern" />

      {/* Floating Code Snippets */}
      <div className="absolute inset-0">
        {CODE_SNIPPETS.map((snippet, idx) => {
          const topPos = (idx * 14 + 8) + '%';
          const leftPos = (idx % 2 === 0 ? (idx * 12 + 5) : (80 - idx * 10)) + '%';
          const duration = 14 + idx * 3;
          return (
            <motion.div
              key={idx}
              className="absolute font-mono text-xs px-3 py-1.5 rounded-lg border shadow-sm"
              style={{
                top: topPos,
                left: leftPos,
                color: 'color-mix(in srgb, var(--arena-primary) 35%, transparent)',
                background: 'color-mix(in srgb, var(--arena-card) 40%, transparent)',
                borderColor: 'color-mix(in srgb, var(--arena-primary) 10%, transparent)',
              }}
              animate={{ y: [0, -25, 0], opacity: [0.15, 0.35, 0.15] }}
              transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay: idx * 1.5 }}
            >
              {snippet}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
