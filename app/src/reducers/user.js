import { SIGN_IN_USER, SIGN_OUT_USER } from '../actions/user.js';

const INITIAL_STATE = {
  displayName: '',
  email: '',
  signedIn: 'unresolved'
};

const user = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN_USER:

      const user = action.user;
      
  console.log('in the user reducer');
  console.log(action);
      if (typeof user.username == 'undefined'){
        return {
          ...state,
          id: user.uid,
          displayName: user.displayName,
          email: user.email,
          signedIn: true
        };
      } else {
        return {
          ...state,
          id: user.uid,
          displayName: user.displayName,
          email: user.email,
          username: user.username,
          signedIn: true
        };
      }
    case SIGN_OUT_USER:
      return {
        ...state,
        displayName: '',
        email: '',
        signedIn: false
      };
    default:
      return state;
  }
};

export default user;