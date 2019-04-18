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
      _showPositions: {type:Boolean},
      _windowHeight: {type: Number},
      _windowWidth: {type: Number},
      _initialVideoHeight: {type: Number},
      _initialVideoWidth: {type: Number},
      _videoHeight: {type: Number},
      _videoWidth: {type: Number}
    };
  }

  static get styles() {
    return [
      SharedStyles,
      css`
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
          display:flex;
          justify-content:center;
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
          cursor:pointer;
        }

        .icon {
          background:rgba(0,0,0,.4);
          color:black;
          border-radius:50%;
          height:60px;
          width:60px;
          margin-bottom:6px;
          cursor:pointer;
        }

        .bigIcon {
          margin-bottom:6px;
          background:rgba(0,0,0,.4);
          color:black;
          border-radius:50%;
          height:80px;
          width:80px;
          cursor:pointer;
        }

        #positionContainer {
          background:rgba(0,0,0,.4);
          display:flex;
          flex-direction:row;
          border:1px solid var(--app-color);
          border-right:none;
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
          cursor:pointer;
        }

        .pButton:hover {
          background:#000;
        }

        #pushInIcon {
          background:rgba(0,0,0,.4);
          height:40px;
          width:40px;
          border-top-left-radius:50%;
          border-bottom-left-radius:50%;
          border:1px solid var(--app-color);
          border-right:1px solid #000;
          position:relative;
          right:-1px;
          cursor:pointer;
        }

        #pullOutIcon {
          background:rgba(0,0,0,.4);
          height:40px;
          width:40px;
          border-top-left-radius:50%;
          border-bottom-left-radius:50%;
          border:1px solid var(--app-color);
          border-right:none;
          cursor:pointer;
        }`
    ];
  }

  constructor(){
    super();
    this._isPaused = true;
    this._videoDuration = 0;
    this._videoCurrentTime = 0;
    this._showPositions = false;
    this._windowHeight = 0;
    this._windowWidth = 0;
    this._videoHeight = '0px';
    this._videoWidth = '0px';
    window.addEventListener('resize', () => {
      this._windowHeight = window.innerHeight;
      this._windowWidth = window.innerWidth;
      this._fitVideo();
    }, false);
  }

  _fitVideo(){
    let windowAspectRatio = this._windowWidth/this._windowHeight;
    let videoAspectRatio = this._initialVideoWidth/this._initialVideoHeight;

    if (windowAspectRatio > videoAspectRatio){
      this._videoHeight = this._windowHeight+'px';
      this._videoWidth = (this._videoHeight*videoAspectRatio)+'px';
    } else {
      this._videoWidth = this._windowWidth+'px';
      this._videoHeight = (this._videoWidth*(1/videoAspectRatio))+'px';
    }
  }

  render() {
    return html`
      <div id="playerContainer">
          <video height=${this._videoHeight} width=${this._videoWidth} id="video" src="${this._videoURL}" preload="auto" muted></video>
        
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
  }
  _hidePositionButtons(){
    this._showPositions = false;
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
    if (this._swings.length > 0){
      this._videoURL = this._swings.find(obj => {
        return obj.key === this._videoId;
      }).url;
    }

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
      this._initialVideoHeight = v.videoHeight;
      this._initialVideoWidth = v.videoWidth;
      this._windowHeight = window.innerHeight;
      this._windowWidth = window.innerWidth;
      this._fitVideo();
    }; 
  }

  // This is called every time something is updated in the store.
  stateChanged(state) {
    this._swings = state.swings.swings;
  }
}

window.customElements.define('gm-swingplayer', GmSwingPlayer);
