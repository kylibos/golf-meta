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
import { star, emptyStar } from './my-icons.js';

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
      _swings: {type: Array},
      _vs: {type: Array}
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

        #videosContainer {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-around;
          padding:10px;
          background:whitesmoke;
        }

        #uploadDialog {
          margin:0;
          padding:0;
        }

        .swingCard {
          border:1px solid gainsboro;
          padding:10px;
          width:calc(50% - 30px);
          margin-bottom:10px;
          background:white;
        }

        .cardImage {
          width:100%;
          height:200px;
        }

        .cardOptions {
          padding-top:10px;
          display:flex;
          flex-direction:row;
        }

        .green {
          color:var(--app-color) !important;
        }

        .vs {
          color:gainsboro;
          font-size:24px;
        }

        .star {
          text-align:left;
          flex:1;
        }

        paper-fab {
          --paper-fab-background: var(--app-color);
        }`
    ];
  }

  constructor(){
    super();

    this._vs = [];
  }

  render() {
    return html`


      <div id="videosContainer">
        ${this._swings.map((item) => html`
          <div class="swingCard">
            <a href="/swingplayer?id=${item.key}" style="text-decoration:none;">
              <div class="cardImage" style="background-size:cover; background-position:center;background-image:url(${item.thumb});"></div>
            </a>
            <div class="cardOptions">
              <div class="star" style="height:35px;">${emptyStar}</div>
              <div class="vs" style="cursor:pointer; text-align:right; font-weight:800;" id="card_${item.key}" @click="${this._selectVs}">VS</div>
            </div>
          </div>`)}
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

  _selectVs(e){
    if (this._vs.length == 0){
      this._vs[0] = e.srcElement.id;
      this.shadowRoot.getElementById(e.srcElement.id).classList.add('green');
    } else if (this._vs.length == 1){
      if (e.srcElement.id == this._vs[0]){
        this.shadowRoot.getElementById(e.srcElement.id).classList.remove('green');
        this._vs = [];
        return;
      } else {
        this.shadowRoot.getElementById(e.srcElement.id).classList.add('green');
        const newLocation = '/vs?one='+this._vs[0].split('_')[1]+'&two='+e.srcElement.id.split('_')[1];
        this._vs = [];
        window.history.pushState({}, '', newLocation);
        this.dispatchEvent(new CustomEvent('goTo', {detail: newLocation, bubbles: true, composed: true}));
        this._clearVs();
      }
    }
  }

  _clearVs(){
    var greens = this.shadowRoot.querySelectorAll(".green");

    for (var i=0; i<greens.length; i++){
      greens[i].classList.remove('green');
    }
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
    this._swings = state.swings.swings;
  }
}

window.customElements.define('gm-home', GmHome);
