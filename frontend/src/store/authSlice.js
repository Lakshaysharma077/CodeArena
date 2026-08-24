import { createSlice } from '@reduxjs/toolkit';

const initialUser = {
  id: 'usr_demo',
  username: 'Lakshay',
  email: 'lakshay@codearena.dev',
  role: 'user',
  rating: 1642,
  rank: 'Platinum',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  country: 'India',
  college: 'IIT Delhi',
  stats: {
    solvedCount: 84,
    winCount: 62,
    lossCount: 22,
    winRate: 74,
    accuracyRate: 81,
    currentStreak: 6,
    bestStreak: 14
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    isAuthenticated: true,
    token: 'mock_jwt_token_2026',
    loading: false,
    error: null
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    updateRatingAndRank: (state, action) => {
      if (state.user) {
        state.user.rating = action.payload.newRating;
        state.user.rank = action.payload.newRank;
        if (action.payload.isWin) {
          state.user.stats.winCount += 1;
          state.user.stats.currentStreak += 1;
          if (state.user.stats.currentStreak > state.user.stats.bestStreak) {
            state.user.stats.bestStreak = state.user.stats.currentStreak;
          }
        } else {
          state.user.stats.lossCount += 1;
          state.user.stats.currentStreak = 0;
        }
        state.user.stats.winRate = Math.round(
          (state.user.stats.winCount / Math.max(1, state.user.stats.winCount + state.user.stats.lossCount)) * 100
        );
      }
    }
  }
});

export const { loginSuccess, logout, updateRatingAndRank } = authSlice.actions;
export default authSlice.reducer;

