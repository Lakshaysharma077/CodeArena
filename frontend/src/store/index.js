import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import battleReducer from './battleSlice';
import problemReducer from './problemSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    battle: battleReducer,
    problem: problemReducer
  }
});
