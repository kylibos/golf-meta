import { firebase } from '../firebase.js';

export const SIGN_IN_USER = 'SIGN_IN_USER';
export const SIGN_OUT_USER = 'SIGN_OUT_USER';

export const signInUser = (user) => (dispatch, getState) => {
	// check for username
	firebase.firestore().collection('users').doc(user.uid).get().then((doc) => {
		if (doc.exists) {
			if (doc.data().username){
				//console.log('alreday has a username', doc.data.username);
				user.username = doc.data().username;
			} else {
				//console.log('no usersname!!!');
			}
			//console.log(user);
		}
		dispatch(signIn(user));
	});

};

const signIn = (user) => {
	return {
		type: SIGN_IN_USER,
		user
	};
}

export const signOutUser = () => {
  return {
    type: SIGN_OUT_USER
  };
};