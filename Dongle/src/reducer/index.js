import * as reducers from './indexReducer'; 
import { combineReducers } from 'redux';

export default combineReducers({
  ...reducers, 
})