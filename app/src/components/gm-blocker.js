import { LitElement, html, css } from 'lit-element';
import { firebase } from '../firebase.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';

import { SharedStyles } from './shared-styles.js';

// This element is *not* connected to the Redux store.
class GmBlocker extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      amount: { type: String },
      price: { type: String }
    };
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: block;
          background: var(--app-color);
          position: fixed;
          top:0;
          bottom:0;
          left:0;
          right:0;
        }

        paper-spinner-lite {
          --paper-spinner-color: white;
          --paper-spinner-stroke-width: 4px;
        }

        #blocker {
          display: flex; 
          align-items: center; 
          justify-content: center; 
          height:100%; 
          flex-direction:column;
        }`
    ];
  }

  render() {
    return html`
    <div id="blocker">
      <paper-spinner-lite active></paper-spinner-lite>
    </div>
    `;
  }

  _signInTwitter(){
    var provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithRedirect(provider).then(function(result) {

    });
  }

  _signInYahoo(){
    var provider = new firebase.auth.OAuthProvider('yahoo.com');
    provider.setCustomParameters({
      // Prompt user to re-authenticate to Yahoo.
      prompt: 'consent'
    });
    console.log('ask for consent');
    firebase.auth().signInWithRedirect(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;

      store.dispatch(signInUser(result.user));
      // ...
    }).catch(function(error) {
      console.log(error);
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  _signInGoogle(){
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    firebase.auth().signInWithRedirect(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log(result);

      //store.dispatch(signInUser(result.user));
      // ...
    }).catch(function(error) {
      console.log(error);
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }
}

window.customElements.define('gm-blocker', GmBlocker);