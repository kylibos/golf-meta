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

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';


class GmVs extends connect(store)(PageViewElement) {

  static get properties() {
    return {
      _swings: {type: Array},
      _videoOneURL: {type: String},
      _videoTwoURL: {type: String}
    };
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        #playerContainer {
          background:rgba(0,0,0,.5);
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

        video {
          width:50%;
        }
      `
    ];
  }


  constructor(){
    super();
  }

  render() {
    return html`
      <div id="playerContainer">
        <video id="video" src="${this._videoOneURL}" playsinline muted preload></video>
        <video id="video" src="${this._videoTwoURL}" playsinline muted preload></video>
      </div>
    `;
  }

  updated(changedProps){
    console.log('CHANGED PROPS', changedProps);

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

  stateChanged(state) {
    console.log('DA STATE', state);
    this._swings = state.swings.swings;
    console.log('Da SWINGS',this._swings);
  }
}

window.customElements.define('gm-vs', GmVs);