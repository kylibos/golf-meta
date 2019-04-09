/*
if (window.location.hostname == '127.0.0.1'){
	// Dev
	var config = {
		apiKey: "AIzaSyBwLD9Zz3OgXt-3D7jex8cfd0F3prp_G54",
		authDomain: "golf-meta-dev.firebaseapp.com",
		databaseURL: "https://golf-meta-dev.firebaseio.com",
		projectId: "golf-meta-dev",
		storageBucket: "golf-meta-dev.appspot.com",
		messagingSenderId: "823322072217"
	};
} else {
	console.log('Hey Colin, you need to go to your firebase.js file and set up config for', window.location.hostname);
}

firebase.initializeApp(config);

const firestore = firebase.firestore();
const auth = firebase.auth();

console.log('firebase !!!', window.location.hostname);

export default firebase;

export {
  firestore,
  auth
};
*/


  export const firebase = window.firebase;

  // Initialize Firebase
  // TODO: Replace with your project's customized code snippet
  	if (window.location.hostname == '127.0.0.1'){
  		console.log('DEV FIREBASE');
		var config = {
			apiKey: "AIzaSyBwLD9Zz3OgXt-3D7jex8cfd0F3prp_G54",
			authDomain: "golf-meta-dev.firebaseapp.com",
			databaseURL: "https://golf-meta-dev.firebaseio.com",
			projectId: "golf-meta-dev",
			storageBucket: "golf-meta-dev.appspot.com",
			messagingSenderId: "823322072217"
		};
	} else if (window.location.hostname == 'golf-meta-staging.appspot.com') {
  		console.log('STAGING FIREBASE');
		var config = {
			apiKey: "AIzaSyCUlM-SNrfMuv9jO0XGpwdNANPj0eq1He0",
			authDomain: "golf-meta-staging.firebaseapp.com",
			databaseURL: "https://golf-meta-staging.firebaseio.com",
			projectId: "golf-meta-staging",
			storageBucket: "golf-meta-staging.appspot.com",
			messagingSenderId: "1052400024871"
		};

	}
  firebase.initializeApp(config);