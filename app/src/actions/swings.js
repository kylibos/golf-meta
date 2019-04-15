import { firestore } from '../firebase.js';

export const UPDATE_SWINGS = 'UPDATE_SWINGS';

export const updateSwings = (swings) => {
  return {
    type: UPDATE_SWINGS,
    swings
  };
};