import { configureStore } from '@reduxjs/toolkit';

// Import your reducers here
import userReducer from '../modules/users/usersSlice';
import authReducer from '../modules/auth/authSlice';
import subscriptionReducer from '../modules/subscriptions/subscriptionSlice';

// Configure the store
const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    subscription: subscriptionReducer,
  },
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export the store
export default store;