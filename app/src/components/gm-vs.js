/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, css } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/paper-slider/paper-slider.js';
import '@polymer/paper-spinner/paper-spinner.js';
import { playIcon, pauseIcon, skipForwardIcon, skipBackwardIcon, backIcon, pullOutIcon, pushInIcon } from './my-icons.js';


// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';


class GmVs extends connect(store)(PageViewElement) {

  static get properties() {
    return {
      _swings: {type: Array},
      _videoOneURL: {type: String},
      _videoTwoURL: {type: String},
      _videoOneId: {type: String},
      _videoTwoId: {type: String},
      _isOneLoading: {type: Boolean},
      _isTwoLoading: {type: Boolean}
    };
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        #vsContainer {
          background:rgba(0,0,0,1);
          position:fixed;
          top:0;
          left:0;
          bottom:0;
          right:0;
          display:flex;
          justify-content:center;
          align-items:center;
          flex-direction:row;
        }

        #containerOne {
          width:50%;height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position:relative;
        }

        #containerTwo {
          width:50%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position:relative;
        }

        .showFlex {
          display: flex !important;
        }

        .show {
          display: block !important;
        }

        .hide {
          display: none !important;
        }

        video {
          width:100%;
        }

        .spinnerContainer {
          position:absolute;
          width:100%;
          height:100%;
          background:var(--app-color);
          top:0px;
          right:0px;
          left:0px;
          bottom:0px;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .backIcon {
          color: var(--app-color);
          background: rgba(0,0,0,.4);
          border-radius:50%;
          height:40px;
          width:40px;
          margin:16px;
          cursor:pointer;
          display:inline-block;
          position:fixed;
          top:0;
          left:0;
        }

        .playerContainer {
          display:flex;
          justify-content:center;
          position:absolute;
          width:100%;
          height:100%;
          background:black;
          top:0px;
          right:0px;
          text-align:center;
        }
      `
    ];
  }


  render() {
    return html`
      <div id="vsContainer">
        <div id="containerOne">
          <div class="spinnerContainer">
            <paper-spinner active></paper-spinner>
          </div>
          <div class="playerContainer ${this._isOneLoading ? 'hide' : 'showFlex'}">
            <video id="videoOne" src="${this._videoOneURL}" playsinline muted preload></video>
          </div>
          <div class="canvasContainer" class="${this._isOneLoading ? 'hide' : 'show'}">
            <div class="backIcon" @click="${this._goBack}">${backIcon}</div>
          </div>
        </div>
        <div id="containerTwo">
          <div class="spinnerContainer">
            <paper-spinner active></paper-spinner>
          </div>
          <div class="playerContainer ${this._isTwoLoading ? 'hide' : 'showFlex'}"">
            <video id="videoTwo" src="${this._videoTwoURL}" playsinline muted preload></video>
          </div>
        </div>
      </div>
    `;
  }

  constructor(){
    super();
    this._isOneLoading = true;
    this._isTwoLoading = true;
  }

  firstUpdated(){
    let vOne = this.shadowRoot.getElementById("videoOne");
    let vTwo = this.shadowRoot.getElementById("videoTwo");

    vOne.addEventListener('canplaythrough', (e) => {
      this._isOneLoading = false;
    });

    vTwo.addEventListener('canplaythrough', (e) => {
      this._isTwoLoading = false;
    });
  }

  updated(changedProps){

    if (changedProps.has("_videoOneId")){
      this._isOneLoading = true;
      this.shadowRoot.getElementById("videoOne").load();
    }

    if (changedProps.has("_videoTwoId")){
      this._isTwoLoading = true;
      this.shadowRoot.getElementById("videoTwo").load();
    }

    var parsedUrl = new URL(window.location.href);
    this._videoOneId = parsedUrl.searchParams.get("one");
    this._videoTwoId = parsedUrl.searchParams.get("two");
    if (this._swings.length > 0){
      this._videoOneURL = this._swings.find(obj => {
        return obj.key === this._videoOneId;
      }).url;
      this._videoTwoURL = this._swings.find(obj => {
        return obj.key === this._videoTwoId;
      }).url;
    }
  }

  _goBack(){
    window.history.back();
  }

  stateChanged(state) {
    this._swings = state.swings.swings;
  }
}

window.customElements.define('gm-vs', GmVs);