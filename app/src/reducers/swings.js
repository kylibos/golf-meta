import { UPDATE_SWINGS } from '../actions/swings.js';
import { firestore } from '../firebase.js';
import { auth } from '../firebase.js';

const INITIAL_STATE = {
  swings: []
};

const swings = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_SWINGS:
      const swings = action.swings;
      return {
        ...state,
        swings: swings
      };
    default:
      return state;
  }
};

export default swings;