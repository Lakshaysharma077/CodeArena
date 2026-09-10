import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const getInitialAuth = () => {
  try {
    const savedUser = localStorage.getItem('codearena_user');
    const savedToken = localStorage.getItem('codearena_token');
    if (savedUser && savedToken) {
      return {
        user: JSON.parse(savedUser),
        token: savedToken,
        isAuthenticated: true
      };
    }
  } catch (e) {
    console.error(e);
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false
  };
};

const initialAuth = getInitialAuth();

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token || localStorage.getItem('codearena_token');
    if (!token) throw new Error('No token found');
    
    const response = await fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch user');
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateUserStatsAPI = createAsyncThunk('auth/updateUserStatsAPI', async ({ newRating, newRank, isWin }, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = state.auth.token || localStorage.getItem('codearena_token');
    const userId = state.auth.user?.id || state.auth.user?._id;
    
    if (!token || !userId) throw new Error('Not authenticated');
    
    const response = await fetch('/api/user/update-stats', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-user-id': userId
      },
      body: JSON.stringify({ newRating, newRank, isWin })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update stats');
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialAuth.user,
    isAuthenticated: initialAuth.isAuthenticated,
    token: initialAuth.token,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      try {
        localStorage.removeItem('codearena_user');
        localStorage.removeItem('codearena_token');
      } catch (e) {
        console.error(e);
      }
    },
    updateRatingAndRank: (state, action) => {
      if (state.user) {
        state.user.rating = action.payload.newRating;
        state.user.rank = action.payload.newRank;
        if (!state.user.stats) {
          state.user.stats = { winCount: 0, lossCount: 0, currentStreak: 0, bestStreak: 0, winRate: 0 };
        }
        if (action.payload.isWin) {
          state.user.stats.winCount = (state.user.stats.winCount || 0) + 1;
          state.user.stats.currentStreak = (state.user.stats.currentStreak || 0) + 1;
          if (state.user.stats.currentStreak > (state.user.stats.bestStreak || 0)) {
            state.user.stats.bestStreak = state.user.stats.currentStreak;
          }
        } else {
          state.user.stats.lossCount = (state.user.stats.lossCount || 0) + 1;
          state.user.stats.currentStreak = 0;
        }
        const total = (state.user.stats.winCount || 0) + (state.user.stats.lossCount || 0);
        state.user.stats.winRate = total > 0 ? Math.round((state.user.stats.winCount / total) * 100) : 0;

        try {
          localStorage.setItem('codearena_user', JSON.stringify(state.user));
        } catch (e) {
          console.error(e);
        }
      }
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.tokens.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('codearena_user', JSON.stringify(action.payload.user));
      localStorage.setItem('codearena_token', action.payload.tokens.accessToken);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.tokens.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('codearena_user', JSON.stringify(action.payload.user));
      localStorage.setItem('codearena_token', action.payload.tokens.accessToken);
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch Current User
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      if (action.payload.user) {
        state.user = action.payload.user;
        localStorage.setItem('codearena_user', JSON.stringify(action.payload.user));
      }
    });
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('codearena_user');
      localStorage.removeItem('codearena_token');
    });

    // Update User Stats API
    builder.addCase(updateUserStatsAPI.fulfilled, (state, action) => {
      if (action.payload.user) {
        state.user = action.payload.user;
        localStorage.setItem('codearena_user', JSON.stringify(action.payload.user));
      }
    });
  }
});

export const { logout, updateRatingAndRank, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
