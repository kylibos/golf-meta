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

import '@polymer/paper-fab/paper-fab.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/iron-iconset-svg/iron-iconset-svg.js';
import '@polymer/iron-icon/iron-icon.js';
import './gm-uploader.js';

class GmHome extends connect(store)(PageViewElement) {

  static get properties() {
    return {
      _swings: {type: Array}
    };
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        #addVideoButton {
          display: block;
          position: fixed;
          bottom:40px;
          right: 40px;
        }

        #uploadDialog {
          margin:0;
          padding:0;
        }

        paper-fab {
          --paper-fab-background: var(--app-color);
        }`
    ];
  }

  render() {
    return html`


      <div id="videosContainer">
        ${this._swings.map((item) => html`
          <a href="/swingplayer?id=${item.key}" style="text-decoration:none;">
            <img src="${item.thumb}" style="display:block;margin:0;padding:0; border-radius:8px;" />
          </a>`)}
      </div>

      <iron-iconset-svg name="inline" size="24">
        <svg fill="#7ecb20" height="24" viewBox="0 0 24 24" width="24">
          <defs>
            <g id="plus">
              <path fill="#7ecb20" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </g>
          </defs>
        </svg>
      </iron-iconset-svg>

      <paper-fab id="addVideoButton" icon="inline:plus" @click="${this._addVideoButtonClicked}"></paper-fab>

      <paper-dialog id="uploadDialog" modal style="padding:0px;margin:0px;">
        <gm-uploader style="padding:0px;margin:0px;"></gm-uploader>
      </paper-dialog>
    `;
  }

  firstUpdated() {
    console.log('create listener');
    this.addEventListener('closeUploadDialog', (e) => this._closeDialog());
  }

  _closeDialog(){
    this.shadowRoot.getElementById('uploadDialog').close();
  }

  _addVideoButtonClicked(){
    this.shadowRoot.getElementById('uploadDialog').open();
  }

  stateChanged(state) {
    console.log(state.swings.swings);
    this._swings = state.swings.swings;
  }
}

window.customElements.define('gm-home', GmHome);
