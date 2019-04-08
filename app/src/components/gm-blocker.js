import { LitElement, html, css } from 'lit-element';
import { auth } from '../firebase.js';

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
      css`
        :host {
          display: block;
          background: red;
          position: fixed;
          top:0;
          bottom:0;
        }`
    ];
  }

  render() {
    return html`
      <div @click="${this.signInGoogle}" style="cursor:pointer;color:#757575; background:white; display:inline-block;">
        <div style="display:flex; flex-direction:row; padding:8px 16px; box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);">
          <img style="height:18px; width:18px;" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" />
          <div style="font-size:14px; vertical-align:middle; padding-left:16px;">Sign In With Google</div>
        </div>
      </div>    
    `;
  }

  signInGoogle(){
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(function(result) {
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
}

window.customElements.define('gm-blocker', GmBlocker);