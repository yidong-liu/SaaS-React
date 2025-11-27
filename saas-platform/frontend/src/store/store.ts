import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// Import your reducers here
import userReducer from '../modules/users/usersSlice';
import authReducer from '../modules/auth/authSlice';
import subscriptionReducer from '../modules/subscriptions/subscriptionSlice';

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  subscription: subscriptionReducer,
});

// Configure the store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// Export the store
export default store;