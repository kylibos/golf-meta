import { html, css } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { playIcon, pauseIcon, skipForwardIcon, skipBackwardIcon } from './my-icons.js';
import '@polymer/paper-slider/paper-slider.js';

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
      _swings: {type: Array},
      _isPaused: {type: Boolean},
      _videoDuration: {type: Number},
      _videoCurrentTime: {type: Number}
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
          top:0px;
          left:0px;
          right:0px;
          display:flex;
          flex-direction:column;
        }

        #playerContainer {
          position:fixed;
          width:100%;
          height:100%;
          background:black;
          top:0px;
          right:0px;
          text-align:center;
        }

        .show {
          display: block !important;
        }

        .hide {
          display: none !important;
        }

        .icon {
          background:var(--app-color);
          color:black;
          border-radius:50%;
          height:60px;
          width:60px;
          margin-bottom:6px;
        }

        .bigIcon {
          margin-bottom:6px;
          background:var(--app-color);
          color:black;
          border-radius:50%;
          height:80px;
          width:80px;
        }`
    ];
  }

  constructor(){
    super();
    this._isPaused = true;
    this._videoDuration = 0;
    this._videoCurrentTime = 0;
  }

  render() {
    return html`
      <div id="playerContainer">
        <video id="video" src="${this._videoURL}"></video>
      </div>
      <div id="playerControlsContainer">
        <div style="flex:1;">...</div>
        <div style="display:flex; flex-direction:row;">
          <div style="flex:1;display:flex;align-items:flex-end;padding:16px;">
            <div style="color:red;">${this._videoCurrentTime}</div>
            <paper-slider id="slider" min="0" max="${this._videoDuration}" pin="true" step=".1" value="${this._videoCurrentTime}" style="width:100%;"></paper-slider>
          </div>
          <div style="padding:16px;align-items: center; display: flex;flex-direction: column;">
            <div @click="${this._skipForward}" class="icon">
              ${skipForwardIcon}
            </div>
            <div @click="${this._play}" class="${this._isPaused ? 'show' : 'hide'} bigIcon">
              ${playIcon}
            </div>
            <div @click="${this._pause}" class="${this._isPaused ? 'hide' : 'show'} bigIcon">
              ${pauseIcon}
            </div>
            <div @click="${this._skipBackward}" class="icon">
              ${skipBackwardIcon}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  firstUpdated(){

  }

  _skipBackward(){
    let v = this.shadowRoot.getElementById("video");
    v.pause();
    v.currentTime = v.currentTime - .05;
  }

  _skipForward(){
    let v = this.shadowRoot.getElementById("video");
    v.pause();
    v.currentTime = v.currentTime + .05;
  }

  _pause(){
    let v = this.shadowRoot.getElementById("video");
    v.pause();
    this._isPaused = true;
  }

  _play(){
    let v = this.shadowRoot.getElementById("video");
    v.play();
    this._isPaused = false;
  }

  updated(changedProps){
    var parsedUrl = new URL(window.location.href);
    this._videoId = parsedUrl.searchParams.get("id");
    this._videoURL = this._swings.find(obj => {
      return obj.key === this._videoId;
    }).url;

    let v = this.shadowRoot.getElementById("video");

    v.oncanplay = () => {
      this._videoDuration = v.duration;
      var slider = this.shadowRoot.getElementById('slider');
      slider.addEventListener('immediate-value-change', (e) => {
        v.currentTime = slider.immediateValue;
      });
    }; 
  }

  // This is called every time something is updated in the store.
  stateChanged(state) {
    this._swings = state.swings.swings;
  }
}

window.customElements.define('gm-swingplayer', GmSwingPlayer);
