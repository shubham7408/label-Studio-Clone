import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userReducer';
import projectReducer from './projectReducer';
import navbarReducer from './navbarReducer';
import alertReducer from './alertReducer';
import tableFilterReducer from './tableFilterReducer';

export default configureStore({
  reducer: {
    user: userReducer,
    project: projectReducer,
    navbar: navbarReducer,
    alert: alertReducer,
    tableFilter: tableFilterReducer,
    progressBar: () => ({}),
  },
})