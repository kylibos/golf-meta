/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';
import { installRouter } from 'pwa-helpers/router.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';
import CryptoES from 'crypto-es';

import './gm-login.js';
import './gm-blocker.js';
import { SharedStyles } from './shared-styles.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the actions needed by this element.
import {
  navigate,
  updateOffline,
  updateDrawerState
} from '../actions/app.js';

import {
  updateSwings
} from '../actions/swings.js';

import {
  signInUser,
  signOutUser
} from '../actions/user.js';

import { firebase } from '../firebase.js';

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import { menuIcon } from './my-icons.js';
import './snack-bar.js';

class MyApp extends connect(store)(LitElement) {
  static get properties() {
    return {
      appTitle: { type: String },
      _page: { type: String },
      _drawerOpened: { type: Boolean },
      _snackbarOpened: { type: Boolean },
      _offline: { type: Boolean },
      _signedIn: {type: Boolean},
      _block: {type: Boolean},
      _photoURL: {type: String}
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;

          --app-light-color: #e7ff8c;
          --app-color: #b2ff59;
          --app-dark-color: #7ecb20;

          --app-drawer-width: 256px;
          --app-primary-color: #E91E63;
          --app-secondary-color: #293237;
          --app-dark-text-color: var(--app-secondary-color);
          --app-light-text-color: white;
          --app-section-even-color: #f7f7f7;
          --app-section-odd-color: white;

          --app-header-background-color: white;
          --app-header-text-color:  white;
          --app-header-selected-color: var(--app-light-color);

          --app-drawer-background-color: var(--app-secondary-color);
          --app-drawer-text-color: var(--app-light-text-color);
          --app-drawer-selected-color: var(--app-color);
        }

        app-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          text-align: center;
          color: white;
          border-bottom: 1px solid #eee;
        }

        .toolbar-top {
          background-color: var(--app-color);
        }

        [main-title] {
          font-family: 'Pacifico';
          font-size: 30px;
          /* In the narrow layout, the toolbar is offset by the width of the
          drawer button, and the text looks not centered. Add a padding to
          match that button */
          text-shadow: 2px 2px var(--app-dark-color);
        }


        .menu-btn {
          background: none;
          border: none;
          fill: var(--app-header-text-color);
          cursor: pointer;
          height: 44px;
          width: 44px;
        }

        .drawer-list {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          padding: 24px;
          background: var(--app-drawer-background-color);
          position: relative;
        }

        .drawer-list > a {
          display: block;
          text-decoration: none;
          color: var(--app-drawer-text-color);
          line-height: 40px;
          padding: 0 24px;
        }

        .drawer-list > a[selected] {
          color: var(--app-drawer-selected-color);
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
        }

        .main-content {
          padding-top: 64px;
          min-height: 100vh;
        }

        .page {
          display: none;
        }

        .page[active] {
          display: block;
        }

        footer {
          padding: 24px;
          background: var(--app-drawer-background-color);
          color: var(--app-drawer-text-color);
          text-align: center;
        }

        .hide {
          display:none !important;
        }

        .show {
          display:block !important;
        }

        /* Wide layout: when the viewport width is bigger than 460px, layout
        changes to a wide layout */
        @media (min-width: 460px) {


          .main-content {
            padding-top: 107px;
          }

          /* The drawer button isn't shown in the wide layout, so we don't
          need to offset the title */
          [main-title] {
            padding-right: 0px;
          }
        }
      `
    ];
  }

  render() {
    // Anything that's related to rendering should be done in here.
    return html`
      <!-- Header -->
      <app-header condenses reveals effects="waterfall">
        <app-toolbar class="toolbar-top">
          <button class="menu-btn" title="Menu" @click="${this._menuButtonClicked}">${menuIcon}</button>
          <div main-title>Golf Meta</div>
          <div @click="${this._signOut}" style="display:flex; align-items: center; cursor:pointer;">
            x<img style="border-radius:50%; height:40px;" src="${this._photoURL}" />
          </div>
        </app-toolbar>


      </app-header>

      <!-- Drawer content -->
      <app-drawer
          .opened="${this._drawerOpened}"
          @opened-changed="${this._drawerOpenedChanged}">
        <nav class="drawer-list">
          <a ?selected="${this._page === 'home'}" href="/home">Videos</a>
          <a ?selected="${this._page === 'view2'}" href="/view2">View Two</a>
          <a ?selected="${this._page === 'view3'}" href="/view3">View Three</a>
        </nav>
      </app-drawer>

      <!-- Main content -->
      <main role="main" class="main-content">
        <gm-swingplayer class="page" ?active="${this._page === 'swingplayer'}"></gm-swingplayer>
        <gm-home class="page" ?active="${this._page === 'home'}"></gm-home>
        <my-view2 class="page" ?active="${this._page === 'view2'}"></my-view2>
        <my-view3 class="page" ?active="${this._page === 'view3'}"></my-view3>
        <my-view404 class="page" ?active="${this._page === 'view404'}"></my-view404>
      </main>

      <footer>
        <p>Made with &hearts; by the Polymer team.</p>
      </footer>

      <gm-login class="${this._signedIn ? 'hide' : 'show'}"></gm-login>
      <gm-blocker class="${this._block ? 'show' : 'hide'}"></gm-blocker>

      <snack-bar ?active="${this._snackbarOpened}">
        You are now ${this._offline ? 'offline' : 'online'}.
      </snack-bar>
    `;
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);

    this._block = true;

    firebase.auth().onAuthStateChanged((user) => {
      if (user){
        var wordArray = CryptoES.SHA1(user.providerData[0].email);
        user.providerData[0].userHash = wordArray.toString(CryptoES.enc.Base64);
        //console.log('user hash',userHash);
        firebase.firestore().collection('userMethods').doc(user.uid).set({
          uid: user.uid,
          displayName: user.providerData[0].displayName,
          email: user.providerData[0].email,
          photoURL: user.providerData[0].photoURL,
          providerId: user.providerData[0].providerId,
          phoneNumber: user.providerData[0].phoneNumber,
          providerUid: user.providerData[0].uid,
          userHash: user.providerData[0].userHash
        }, {merge: true});

        store.dispatch(signInUser(user.providerData[0]));
      } else {
        store.dispatch(signOutUser());
      }
      //console.log('auth state changed', user);
    });

    firebase.auth().getRedirectResult().then(function(result) {
      console.log('redirect result',result);
      if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        //console.log('token', token);
        // ...
      }
      // The signed-in user info.
      var user = result.user;
    }).catch(function(error) {
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

  firstUpdated() {
    installRouter((location) => store.dispatch(navigate(decodeURIComponent(location.pathname))));
    installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)));
    installMediaQueryWatcher(`(min-width: 460px)`,
        () => store.dispatch(updateDrawerState(false)));
  }

  updated(changedProps) {
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  _menuButtonClicked() {
    store.dispatch(updateDrawerState(true));
  }

  _drawerOpenedChanged(e) {
    store.dispatch(updateDrawerState(e.target.opened));
  }

  _getSwings(){
    var swings = [];
    firebase.firestore().collection('swings').get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var i = swings.push(doc.data());
            swings[i-1].key = doc.id;
        });
      store.dispatch(updateSwings(swings));
    })
    .catch(function(error) {
        //console.log("Error getting documents: ", error);
    });
  }

  stateChanged(state) {
    //if (state.user.signedIn != this._signedIn || typeof this._swings == 'undefined' || state.swings.swings.length != this._swings.length){
    //if (state.user.signedIn == true && this._signedIn != 'unresolved' && state.app.swings && state.app.swings.length == 0){
    if (state.user.signedIn == true && state.swings.swings.length == 0){
      this._getSwings();
    }
    //}
    this._swings = state.swings.swings;
    this._page = state.app.page;
    this._offline = state.app.offline;
    this._snackbarOpened = state.app.snackbarOpened;
    this._drawerOpened = state.app.drawerOpened;
    this._signedIn = state.user.signedIn;
    this._photoURL = state.user.photoURL;
    console.log(state.user);
    if (this._signedIn === false){
      this._block = false;
    }
    if (this._signedIn === true && typeof state.user.email == 'string'){
      this._block = false;
    }
  }

  _signOut(){
    firebase.auth().signOut();
  }
}

window.customElements.define('my-app', MyApp);
