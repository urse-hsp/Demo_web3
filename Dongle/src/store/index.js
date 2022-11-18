import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import reducer from '../reducer'

const middlewares = [thunk];
try {
  if (__DEV__) { 
    // middlewares.push(logger);
  }
} catch (error) {
  console.debug(error,'ddddddd')
}
const store = createStore(
  reducer,
  applyMiddleware(...middlewares)
)

export default store