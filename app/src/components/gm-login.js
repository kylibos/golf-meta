import { LitElement, html, css } from 'lit-element';
import { firebase } from '../firebase.js';

import { SharedStyles } from './shared-styles.js';

// This element is *not* connected to the Redux store.
class GmLogin extends LitElement {
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

        #blocker {
          display: flex; 
          align-items: center; 
          justify-content: center; 
          height:100%; 
          flex-direction:column;
        }

        #title {
          font-family: 'Pacifico';
          color:white;
          font-size:30px;
          padding-bottom:10px;
          
          text-shadow: 3px 3px var(--app-dark-color);
        }

        #signInButtonContainer {
        }

        .button {
          width:100%;
        }

        #subTitle {
          color:var(--app-dark-color);
          font-size:20px;
          font-family: 'Pacifico';
          padding-bottom:44px;
        }`
    ];
  }

  render() {
    return html`
    <div id="blocker">
      <div id="title">Golf Meta</div>
      <div id="subTitle">Share Your Swing</div>
      <div id="signInButtonContainer">
        <div class="button" @click="${this._signInGoogle}" style="cursor:pointer;color:#757575; background:white; display:inline-block;">
          <div style="display:flex; flex-direction:row; padding:8px 16px; box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);">
            <img style="height:18px; width:18px;" src="images/google.svg" />
            <div style="font-size:14px; vertical-align:middle; padding-left:16px;">Sign In With Google</div>
          </div>
        </div>       
        <div style="height:10px;"></div>
        <div class="button" @click="${this._signInTwitter}" style="cursor:pointer;color:#fff; background:#1da1f2; display:inline-block;">
          <div style="display:flex; flex-direction:row; padding:4px 16px; box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);">
            <img style="height:28px; width:28px;" src="images/twitterLogo.png" />
            <div style="font-size:14px; display:flex; justify-content:center; flex-direction:column; padding-left:16px;">Sign In With Twitter</div>
          </div>
        </div>         
        <div style="height:10px;"></div>
        <div class="button" @click="${this._signInMicrosoft}" style="cursor:pointer;color:#fff; background:#000; display:inline-block;">
          <div style="display:flex; flex-direction:row; padding:8px 16px; box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);">
            <img style="height:18px; width:18px;" src="images/microsoftLogo.svg" />
            <div style="font-size:14px; vertical-align:middle; padding-left:16px;">Sign In With Microsoft</div>
          </div>
        </div> 
        <!--
        <div style="height:10px;"></div>
        <div class="button" @click="${this._signInYahoo}" style="cursor:pointer;color:#fff; background:purple; display:inline-block;">
          <div style="display:flex; flex-direction:row; padding:8px 16px; box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);">
            <img style="height:18px; width:18px;" src="images/yahooIcon.svg" />
            <div style="font-size:14px; vertical-align:middle; padding-left:16px;">Sign In With Yahoo</div>
          </div>
        </div> 
        -->
      </div>
    </div>
    `;
  }

  _signInTwitter(){
    var provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithRedirect(provider).then(function(result) {

    });
  }

  _signInMicrosoft(){
    var provider = new firebase.auth.OAuthProvider('microsoft.com');
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

window.customElements.define('gm-login', GmLogin);