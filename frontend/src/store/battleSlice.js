import { createSlice } from '@reduxjs/toolkit';

const getStarterForLang = (prob, lang = 'Java') => {
  if (!prob?.starterCode) return '// Write solution here...';
  const norm = (lang || 'Java').toLowerCase();
  if (norm === 'java') return prob.starterCode.java || '// Java solution';
  if (norm === 'python' || norm === 'py') return prob.starterCode.python || '# Python solution';
  if (norm === 'c++' || norm === 'cpp') return prob.starterCode.cpp || '// C++ solution';
  return prob.starterCode.javascript || prob.starterCode[norm] || '// JavaScript solution';
};

const battleSlice = createSlice({
  name: 'battle',
  initialState: {
    status: 'IDLE', // IDLE | MATCHMAKING | MATCH_FOUND | BATTLE_ACTIVE | SUBMITTING | BATTLE_RESULT
    matchmakingState: {
      queueSeconds: 0,
      preferredRangeMin: 1592,
      preferredRangeMax: 1692,
      playersSearching: 247,
      estimatedWait: '< 20 sec'
    },
    countdownSeconds: 3,
    privateRoomCode: null,
    currentBattle: null,
    opponent: null,
    timerSeconds: 900,
    activeProblemIndex: 0,
    problems: [], // 3 problems array
    userCodes: {}, // { [problemId]: { [language]: code } }
    userCode: '',
    selectedLanguage: 'Java',
    userSolvedProblemIds: [],
    opponentSolvedProblemIds: [],
    opponentSolvedCount: 0,
    opponentTelemetry: {
      status: 'Connecting...',
      testcasesPassed: 0,
      totalTestcases: 42,
      opponentSolvedCount: 0,
      hasSubmitted: false
    },
    submissionProgress: {
      status: 'IDLE', // IDLE | QUEUED | RUNNING | COMPLETED
      stepMessage: '',
      testsPassed: 0,
      totalTests: 42
    },
    resultData: null,
    loading: false
  },
  reducers: {
    createPrivateRoomStart: (state) => {
      state.status = 'CREATING_PRIVATE_ROOM';
    },
    createPrivateRoomSuccess: (state, action) => {
      state.status = 'WAITING_IN_PRIVATE_ROOM';
      state.privateRoomCode = action.payload;
    },
    joinPrivateRoomStart: (state) => {
      state.status = 'JOINING_PRIVATE_ROOM';
    },
    startMatchmaking: (state, action) => {
      const userRating = action.payload?.rating || 1642;
      state.status = 'MATCHMAKING';
      state.matchmakingState = {
        queueSeconds: 0,
        preferredRangeMin: userRating - 50,
        preferredRangeMax: userRating + 50,
        playersSearching: Math.floor(Math.random() * 60 + 220),
        estimatedWait: '< 20 sec'
      };
    },
    tickMatchmaking: (state) => {
      state.matchmakingState.queueSeconds += 1;
      const s = state.matchmakingState.queueSeconds;
      const baseRating = 1642;
      if (s >= 10) {
        state.matchmakingState.preferredRangeMin = baseRating - 200;
        state.matchmakingState.preferredRangeMax = baseRating + 200;
      } else if (s >= 5) {
        state.matchmakingState.preferredRangeMin = baseRating - 100;
        state.matchmakingState.preferredRangeMax = baseRating + 100;
      }
    },
    matchFoundTrigger: (state, action) => {
      state.status = 'MATCH_FOUND';
      state.currentBattle = action.payload;
      state.opponent = action.payload.player2;
      state.countdownSeconds = 3;
      state.timerSeconds = action.payload.durationSeconds || 900;
      state.activeProblemIndex = 0;
      state.userSolvedProblemIds = [];
      state.opponentSolvedProblemIds = [];
      state.opponentSolvedCount = 0;

      const probs = action.payload.problems || (action.payload.problem ? [action.payload.problem] : []);
      state.problems = probs;

      // Initialize starter codes for each problem
      const initialCodes = {};
      probs.forEach((p) => {
        initialCodes[p.problemId] = {
          Java: getStarterForLang(p, 'Java'),
          Python: getStarterForLang(p, 'Python'),
          'C++': getStarterForLang(p, 'C++'),
          JavaScript: getStarterForLang(p, 'JavaScript')
        };
      });
      state.userCodes = initialCodes;

      const firstProb = probs[0];
      state.userCode = firstProb ? getStarterForLang(firstProb, state.selectedLanguage) : '// Write solution';
    },
    tickCountdown: (state) => {
      if (state.countdownSeconds > 0) {
        state.countdownSeconds -= 1;
      }
    },
    startBattleActive: (state) => {
      state.status = 'BATTLE_ACTIVE';
      state.opponentTelemetry = {
        status: 'Reading Question 1 constraints...',
        testcasesPassed: 0,
        totalTestcases: 42,
        opponentSolvedCount: 0,
        hasSubmitted: false
      };
    },
    setActiveProblemIndex: (state, action) => {
      const newIndex = action.payload;
      if (newIndex >= 0 && newIndex < state.problems.length) {
        const currentProb = state.problems[state.activeProblemIndex];
        // Save current code
        if (currentProb) {
          if (!state.userCodes[currentProb.problemId]) state.userCodes[currentProb.problemId] = {};
          state.userCodes[currentProb.problemId][state.selectedLanguage] = state.userCode;
        }

        state.activeProblemIndex = newIndex;
        const nextProb = state.problems[newIndex];
        const saved = state.userCodes[nextProb.problemId]?.[state.selectedLanguage];
        state.userCode = saved || getStarterForLang(nextProb, state.selectedLanguage);
      }
    },
    updateUserCode: (state, action) => {
      state.userCode = action.payload;
      const currentProb = state.problems[state.activeProblemIndex];
      if (currentProb) {
        if (!state.userCodes[currentProb.problemId]) state.userCodes[currentProb.problemId] = {};
        state.userCodes[currentProb.problemId][state.selectedLanguage] = action.payload;
      }
    },
    setSelectedLanguage: (state, action) => {
      const newLang = action.payload;
      const currentProb = state.problems[state.activeProblemIndex];

      // Save current code under previous language
      if (currentProb) {
        if (!state.userCodes[currentProb.problemId]) state.userCodes[currentProb.problemId] = {};
        state.userCodes[currentProb.problemId][state.selectedLanguage] = state.userCode;
      }

      state.selectedLanguage = newLang;

      // Load code for new language
      if (currentProb) {
        const saved = state.userCodes[currentProb.problemId]?.[newLang];
        state.userCode = saved || getStarterForLang(currentProb, newLang);
      }
    },
    markProblemSolved: (state, action) => {
      const probId = action.payload;
      if (!state.userSolvedProblemIds.includes(probId)) {
        state.userSolvedProblemIds.push(probId);
      }
    },
    tickBattleTimer: (state) => {
      if (state.timerSeconds > 0) {
        state.timerSeconds -= 1;
      }
    },
    updateOpponentTelemetry: (state, action) => {
      state.opponentTelemetry = { ...state.opponentTelemetry, ...action.payload };
      if (action.payload.opponentSolvedCount !== undefined) {
        state.opponentSolvedCount = action.payload.opponentSolvedCount;
      }
      if (action.payload.opponentSolvedProblemIds) {
        state.opponentSolvedProblemIds = action.payload.opponentSolvedProblemIds;
      }
    },
    setSubmissionProgress: (state, action) => {
      state.submissionProgress = { ...state.submissionProgress, ...action.payload };
    },
    setBattleResult: (state, action) => {
      state.status = 'BATTLE_RESULT';
      state.resultData = action.payload;
    },
    resetBattleState: (state) => {
      state.status = 'IDLE';
      state.privateRoomCode = null;
      state.currentBattle = null;
      state.opponent = null;
      state.timerSeconds = 900;
      state.activeProblemIndex = 0;
      state.problems = [];
      state.userCodes = {};
      state.userCode = '';
      state.userSolvedProblemIds = [];
      state.opponentSolvedProblemIds = [];
      state.opponentSolvedCount = 0;
      state.resultData = null;
      state.submissionProgress = {
        status: 'IDLE',
        stepMessage: '',
        testsPassed: 0,
        totalTests: 42
      };
      state.opponentTelemetry = {
        status: 'Connecting...',
        testcasesPassed: 0,
        totalTestcases: 42,
        opponentSolvedCount: 0,
        hasSubmitted: false
      };
    }
  }
});

export const {
  createPrivateRoomStart,
  createPrivateRoomSuccess,
  joinPrivateRoomStart,
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
  resetBattleState
} = battleSlice.actions;

export default battleSlice.reducer;
