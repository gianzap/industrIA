import { configureStore } from '@reduxjs/toolkit';
import authReducer     from './slices/authSlice';
import machinesReducer from './slices/machinesSlice';
import alarmsReducer   from './slices/alarmsSlice';
import ticketsReducer  from './slices/ticketsSlice';
import aiReducer       from './slices/aiSlice';

export default configureStore({
  reducer: {
    auth:     authReducer,
    machines: machinesReducer,
    alarms:   alarmsReducer,
    tickets:  ticketsReducer,
    ai:       aiReducer,
  },
});