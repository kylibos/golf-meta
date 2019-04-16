import { html, css } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { playIcon, pauseIcon, skipForwardIcon, skipBackwardIcon, backIcon, pullOutIcon, pushInIcon } from './my-icons.js';
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
      _videoCurrentTime: {type: Number},
      _showPositions: {type:Boolean}
    };
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        video {
          min-width: 100%; 
          min-height: 100%; 
          
          /* Setting width & height to auto prevents the browser from stretching or squishing the video */
          width: auto;
          height: auto;
          
          /* Center the video */
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
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

       .showPositions {
          display: flex !important;
        }

        .hidePositions {
          display: none !important;
        }

        .show {
          display: block !important;
        }

        .hide {
          display: none !important;
        }

        paper-slider {
          --paper-slider-active-color: var(--app-color);
          --paper-slider-pin-color: var(--app-color);
          --paper-slider-knob-color: var(--app-color);
          --paper-slider-knob-start-border-color: var(--app-color);
          --paper-slider-font-color: #000;
          --paper-slider-container-color: rgba(0,0,0,.4);
          --paper-slider-height: 10px;
        }

        .backIcon {
          color: var(--app-color);
          background: rgba(0,0,0,.4);
          border-radius:50%;
          height:40px;
          width:40px;
          margin:16px;
        }

        .icon {
          background:rgba(0,0,0,.4);
          color:black;
          border-radius:50%;
          height:60px;
          width:60px;
          margin-bottom:6px;
        }

        .bigIcon {
          margin-bottom:6px;
          background:rgba(0,0,0,.4);
          color:black;
          border-radius:50%;
          height:80px;
          width:80px;
        }

        #positionContainer {
          background:rgba(0,0,0,.4);
          display:flex;
          flex-direction:row;
        }

        .pButton {
          color: var(--app-color);
          font-weight:800;
          padding:8px;
          font-size:22px;
          height:32px;
          border-bottom:1px solid #000;
          border-right:1px solid #000;
          text-align:center;
        }
        #pushInIcon {
          background:rgba(0,0,0,.4);
          height:40px;
          width:40px;
          border-top-left-radius:50%;
          border-bottom-left-radius:50%;
        }

        #pullOutIcon {
          background:rgba(0,0,0,.4);
          height:40px;
          width:40px;
          border-top-left-radius:50%;
          border-bottom-left-radius:50%;
        }`
    ];
  }

  constructor(){
    super();
    this._isPaused = true;
    this._videoDuration = 0;
    this._videoCurrentTime = 0;
    this._showPositions = false;
  }

  render() {
    return html`
      <div id="playerContainer">
        <video id="video" src="${this._videoURL}" preload="auto" muted></video>
      </div>
      <div id="playerControlsContainer">
        <div>
          <div class="backIcon" @click="${this._goBack}">${backIcon}</div>
        </div>
        <div style="flex:1; flex-direction:row;display:flex; align-items:center; justify-content:right;">
          <div id="pullOutIcon" @click="${this._showPositionButtons}" class="${this._showPositions ? 'hide' : 'show'}">${pullOutIcon}</div>
          <div id="pushInIcon" @click="${this._hidePositionButtons}" class="${this._showPositions ? 'show' : 'hide'}">${pushInIcon}</div>
          <div id="positionContainer" class="${this._showPositions ? 'showPositions' : 'hidePositions'}">
            <div>
            <div class="pButton">P1</div>
            <div class="pButton">P3</div>
            <div class="pButton">P5</div>
            <div class="pButton">P7</div>
            <div class="pButton">P9</div>
            </div>
            <div>
            <div class="pButton">P2</div>
            <div class="pButton">P4</div>
            <div class="pButton">P6</div>
            <div class="pButton">P8</div>
            <div class="pButton">P10</div>
            </div>
          </div>
        </div>
        <div style="display:flex; flex-direction:row;">
          <div style="flex:1;display:flex;align-items:flex-end;padding:16px;">
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

  _showPositionButtons(){
    this._showPositions = true;
    console.log('show');
  }
  _hidePositionButtons(){
    this._showPositions = false;
    console.log('hide');
  }

  _goBack(){
    window.history.back();
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

    v.onprogress = function(e) {
      //console.log(e.total, e.loaded);
    }; 

    v.ontimeupdate = () => {
      console.log(v.currentTime);
      this._videoCurrentTime = parseFloat( v.currentTime.toFixed(1) );
    };

    v.oncanplay = () => {
      this._videoDuration = v.duration;
      var slider = this.shadowRoot.getElementById('slider');
      slider.addEventListener('immediate-value-change', (e) => {
        v.currentTime = slider.immediateValue;
      });
      slider.addEventListener('change', (e) => {
        v.currentTime = slider.value;
      });
    }; 
  }

  // This is called every time something is updated in the store.
  stateChanged(state) {
    this._swings = state.swings.swings;
  }
}

window.customElements.define('gm-swingplayer', GmSwingPlayer);
