import { SIGN_IN_USER, SIGN_OUT_USER } from '../actions/user.js';

const INITIAL_STATE = {
  displayName: '',
  email: '',
  signedIn: 'unresolved',
  photoURL: ''
};

const user = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN_USER:

      const user = action.user;  
      return {
        ...state,
        id: user.uid,
        displayName: user.displayName,
        email: user.email,
        signedIn: true,
        username: (typeof user.username == 'undefined' ? '' : user.username),
        photoURL: (typeof user.photoURL == 'string' ? user.photoURL : ''),
        userHash: user.userHash
      };
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