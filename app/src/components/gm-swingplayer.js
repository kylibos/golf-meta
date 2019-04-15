import { html, css } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';


// These are the elements needed by this element.
import './counter-element.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class GmSwingPlayer extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      _videoId: {type: String},
      _videoURL: {type: String},
      _swings: {type: Array}
    };
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        video {
          height: 100%;
        }

        #playerControlsContainer {
          position:fixed;
          bottom:0px;
          background:yellow;
        }

        #playerContainer {
          position:fixed;
          width:100%;
          height:100%;
          background:black;
          top:0px;
          right:0px;
          text-align:center;
        }`
    ];
  }

  render() {
    return html`
      <div id="playerContainer">
        <video id="video" src="${this._videoURL}"></video>
      </div>
      <div id="playerControlsContainer">
        <div @click="${this._play}">Play</div>
        <div @click="${this._pause}">Pause</div>
        <div @click="${this._skipForward}">>></div>
        <div @click="${this._skipBackward}"><<</div>
      </div>
    `;
  }

  _skipBackward(){

    let v = this.shadowRoot.getElementById("video");
    console.log(v.currentTime);
    v.fastSeek(v.currentTime-.05);
  }

  _skipForward(){
    let v = this.shadowRoot.getElementById("video");
    console.log(v.currentTime);
    v.fastSeek(v.currentTime+.05);
  }

  _pause(){
    let v = this.shadowRoot.getElementById("video");
    v.pause();
  }

  _play(){
    let v = this.shadowRoot.getElementById("video");
    v.play();
    console.log('duration',v.duration);
    console.log('seekable',v.seekable);
    console.log('playbackrate',v.playbackRate);
    console.log('defaultplaybackrate',v.defaultPlaybackRate);
    //v.fastSeek(5);
  }

  updated(changedProps){
    var parsedUrl = new URL(window.location.href);
    this._videoId = parsedUrl.searchParams.get("id");
    this._videoURL = this._swings.find(obj => {
      return obj.key === this._videoId;
    }).url;
  }

  // This is called every time something is updated in the store.
  stateChanged(state) {
    this._swings = state.swings.swings;
  }
}

window.customElements.define('gm-swingplayer', GmSwingPlayer);
