import { createSlice } from '@reduxjs/toolkit';

const problemSlice = createSlice({
  name: 'problem',
  initialState: {
    problems: [],
    currentProblem: null,
    selectedLanguage: 'JavaScript',
    activeTab: 'description', // 'description' | 'hints' | 'editorial' | 'submissions'
    activeTestCaseIndex: 0,
    filters: {
      difficulty: 'All',
      topic: 'All',
      company: 'All',
      search: ''
    },
    submissions: [],
    executionState: {
      status: 'IDLE', // 'IDLE' | 'QUEUED' | 'RUNNING' | 'COMPLETED'
      stepMessage: '',
      result: null
    },
    loading: false,
    error: null
  },
  reducers: {
    setProblems: (state, action) => {
      state.problems = action.payload;
    },
    setCurrentProblem: (state, action) => {
      state.currentProblem = action.payload;
    },
    setSelectedLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setActiveTestCaseIndex: (state, action) => {
      state.activeTestCaseIndex = action.payload;
    },
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = { difficulty: 'All', topic: 'All', company: 'All', search: '' };
    },
    setSubmissions: (state, action) => {
      state.submissions = action.payload;
    },
    addSubmission: (state, action) => {
      state.submissions.unshift(action.payload);
    },
    setExecutionState: (state, action) => {
      state.executionState = { ...state.executionState, ...action.payload };
    },
    resetExecutionState: (state) => {
      state.executionState = {
        status: 'IDLE',
        stepMessage: '',
        result: null
      };
    }
  }
});

export const {
  setProblems,
  setCurrentProblem,
  setSelectedLanguage,
  setActiveTab,
  setActiveTestCaseIndex,
  setFilter,
  resetFilters,
  setSubmissions,
  addSubmission,
  setExecutionState,
  resetExecutionState
} = problemSlice.actions;

export default problemSlice.reducer;

