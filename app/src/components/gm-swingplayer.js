import { html, css } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { playIcon, pauseIcon, skipForwardIcon, skipBackwardIcon, backIcon, pullOutIcon, pushInIcon } from './my-icons.js';
import '@polymer/paper-slider/paper-slider.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/paper-button/paper-button.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

import { firebase } from '../firebase.js';

// These are the elements needed by this element.
import './counter-element.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class GmSwingPlayer extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      _videoId: {type: String},
      _videoURL: {type: String},
      _swing: {type: Object},
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
      _videoWidth: {type: Number},
      _isLoading: {type: Boolean},
      _isMouseDown: {type: Boolean},
      _mouse: {type: Object}
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

        #positionButtonContainer {
          width:100%;
          background:rgba(0,0,0,.4);
          display:flex;
          flex-direction:row;
          justify-content:space-between;
        }

        #spinnerContainer {
          position:fixed;
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

       .showPositions {
          display: flex !important;
        }

        .hidePositions {
          display: none !important;
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
          display:inline-block;
          position:fixed;
          top:0;
          left:0;
        }

        .icon {
          background:rgba(0,0,0,.4);
          color:black;
          border-radius:50%;
          height:50px;
          width:50px;
          margin-bottom:6px;
          cursor:pointer;
        }

        .bigIcon {
          margin-bottom:6px;
          background:rgba(0,0,0,.4);
          color:black;
          border-radius:50%;
          height:70px;
          width:70px;
          cursor:pointer;
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

        #canvasContainer {
          position:fixed;
          width:100%;
          height:100%;
          top:0px;
          right:0px;
          left:0px;
          bottom:0px;
        }

        #canvas {
        }

        .positionButton{
          padding: 8px;
          border-radius: 50%;
          background: var(--app-color);
          display: flex;
          font-size: 13px;
          width: 17px;
          height: 17px;
          align-items: center;
          justify-content: center;
          cursor:pointer;
          position:relative;
        }

        #instructionsContainer {
          background: rgba(0,0,0,.01);
          position:fixed;
          top:0;
          bottom:0;
          left:0;
          right:0;
          display:flex;
          justify-content:center;
          align-items:center;
          display:none;
        }

        .instruction {
          background:rgba(0,0,0,.5);
          border-radius:10px;
          padding:10px;
          color:white;
          display:none;
          max-width:60%;
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
        }


        /* Wide layout: when the viewport width is bigger than 460px, layout
        changes to a wide layout */
        @media (min-width: 460px) {



          .positionButton {
            font-size: 16px;
            width: 25px;
            height: 25px;
          }
        }
        `
    ];
  }

  constructor(){
    super();
    this._isPaused = true;
    this._isLoading = true;
    this._videoDuration = 0;
    this._videoCurrentTime = 0;
    this._showPositions = false;
    this._windowHeight = 0;
    this._windowWidth = 0;
    this._videoHeight = '0px';
    this._videoWidth = '0px';
    this._mouse = {};
    this._isMouseDown = false;
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

    // Resize the canvas
    let c = this.shadowRoot.getElementById("canvas");
    c.width = this._windowWidth;
    c.height = this._windowHeight;
  }

  render() {
    return html`
      <div id="spinnerContainer">
        <paper-spinner active></paper-spinner>
      </div>
      <div id="playerContainer" class="${this._isLoading ? 'hide' : 'showFlex'}">
          <video height=${this._videoHeight} width=${this._videoWidth} id="video" src="${this._videoURL}" playsinline muted preload></video>
      </div>

      <div id="canvasContainer" class="${this._isLoading ? 'hide' : 'show'}">
        <canvas id="canvas" @click="${this._clickedCanvas}"></canvas>
        <div class="backIcon" @click="${this._goBack}">${backIcon}</div>
        <div id="instructionsContainer">
          <div class="instruction" id="instructionp1">
            P1 is your initial set up position.
            <paper-button id="save_p1" @click="${this._savePosition}">Save</paper-button>
          </div>
          <div class="instruction" id="instructionp2">
            P2 is shaft parallel to the ground in the backswing.
            <paper-button id="save_p2" @click="${this._savePosition}">Save</paper-button>
          </div>
          <div class="instruction" id="instructionp3">
            P3 is the right arm parallet to the ground in the backswing.
            <paper-button id="save_p3" @click="${this._savePosition}">Save</paper-button>
          </div>
          <div class="instruction" id="instructionp4">
            P4 is the end of your backswing.
            <paper-button id="save_p4" @click="${this._savePosition}">Save</paper-button>
          </div>
          <div class="instruction" id="instructionp5">
            P5 is the right arm parallel to the ground in the downswing.
            <paper-button id="save_p5" @click="${this._savePosition}">Save</paper-button>
          </div>
          <div class="instruction" id="instructionp6">
            P6 is the shaft parallel to the ground in the downswing.
            <paper-button id="save_p6" @click="${this._savePosition}">Save</paper-button>
          </div>
          <div class="instruction" id="instructionp7">
            P7 is impact.
            <paper-button id="save_p7" @click="${this._savePosition}">Save</paper-button>
          </div>
          <div class="instruction" id="instructionp8">
            P8 is shaft parallel to the ground in the follow through.
            <paper-button id="save_p8" @click="${this._savePosition}">Save</paper-button>
          </div>
          <div class="instruction" id="instructionp9">
            P9 is the right arm parallel to the ground in the follow through.
            <paper-button id="save_p9" @click="${this._savePosition}">Save</paper-button>
          </div>
          <div class="instruction" id="instructionp10">
            P10 is finish of your swing.
            <paper-button id="save_p10" @click="${this._savePosition}">Save</paper-button>
          </div>
        </div>
        <div style="bottom:0;right:0;left:0;position:fixed;padding:16px 8px;align-items: center; display: flex;flex-direction: column;">
          <div style="display:flex; width:100%;align-items:center;flex-direction:row;">
            <div style="flex:1;display:flex;align-items:flex-end;padding:16px 0px;">
              <paper-slider id="slider" min="0" max="${this._videoDuration}" pin="true" step=".1" value="${this._videoCurrentTime}" style="width:100%;"></paper-slider>
            </div>
            <div @click="${this._skipBackward}" class="icon">
              ${skipBackwardIcon}
            </div>
            <div @click="${this._play}" class="${this._isPaused ? 'show' : 'hide'} bigIcon">
              ${playIcon}
            </div>
            <div @click="${this._pause}" class="${this._isPaused ? 'hide' : 'show'} bigIcon">
              ${pauseIcon}
            </div>
            <div @click="${this._skipForward}" class="icon">
              ${skipForwardIcon}
            </div>
          </div>
          <div style="width:100%;">
            <div id="positionButtonContainer">
              <div class="positionButton" id="button_p1" @click="${this._swingPosition}">
                <paper-ripple></paper-ripple>1
              </div>
              <div class="positionButton" id="button_p2" @click="${this._swingPosition}">
                <paper-ripple></paper-ripple>
                2
              </div>
              <div class="positionButton" id="button_p3" @click="${this._swingPosition}">
                <paper-ripple></paper-ripple>
                3
              </div>
              <div class="positionButton" id="button_p4" @click="${this._swingPosition}">
                <paper-ripple></paper-ripple>
                4
              </div>
              <div class="positionButton" id="button_p5" @click="${this._swingPosition}">
                <paper-ripple></paper-ripple>
                5
              </div>
              <div class="positionButton" id="button_p6" @click="${this._swingPosition}">
                <paper-ripple></paper-ripple>
                6
              </div>
              <div class="positionButton" id="button_p7" @click="${this._swingPosition}">
                <paper-ripple></paper-ripple>
                7
              </div>
              <div class="positionButton" id="button_p8" @click="${this._swingPosition}">
                <paper-ripple></paper-ripple>
                8
              </div>
              <div class="positionButton" id="button_p9" @click="${this._swingPosition}">
                <paper-ripple></paper-ripple>
                9
              </div>
              <div class="positionButton" id="button_p10" @click="${this._swingPosition}">
                <paper-ripple></paper-ripple>
                10
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _savePosition(e){
    var p = e.srcElement.id.split('_')[1];
    var ct = this.shadowRoot.getElementById("video").currentTime;
    firebase.firestore().collection('swings').doc(this._videoId).set({
      [p]: ct
    },{merge:true});

    var is = this.shadowRoot.querySelectorAll(".instruction");

    for (var i=0; i<is.length; i++){
      is[i].classList.add('hide');
      is[i].classList.remove('show');
      this.shadowRoot.getElementById("instructionsContainer").classList.remove('showFlex');
      this.shadowRoot.getElementById("instructionsContainer").classList.add('hide');
    }
  }

  _swingPosition(e){

    var p = e.srcElement.id.split('_')[1];
    if (typeof this._swing[e.srcElement.id.split('_')[1]] == 'number'){
      console.log('GOT POSITION ',p,'!!!');
      this.shadowRoot.getElementById("video").currentTime = this._swing[e.srcElement.id.split('_')[1]];
    } else {
      var is = this.shadowRoot.querySelectorAll(".instruction");

      for (var i=0; i<is.length; i++){
        is[i].classList.add('hide');
      }
      console.log('show instruction');
      let instruction = 'instruction'+p;
      this.shadowRoot.getElementById("instructionsContainer").classList.add('showFlex');
      this.shadowRoot.getElementById("instructionsContainer").classList.remove('hide');
      this.shadowRoot.getElementById(instruction).classList.add('show');
      this.shadowRoot.getElementById(instruction).classList.remove('hide');
    }
  }

  firstUpdated(){
    let v = this.shadowRoot.getElementById("video");

    v.addEventListener('play', (e) => {
      //console.log('play', e);
    });    

    v.addEventListener('waiting', (e) => {
      //console.log('waiting', e);
    });

    v.addEventListener('loadedmetadata', (e) => {
      //console.log('loadedmetadata', e);
    });

    v.addEventListener('canplaythrough', (e) => {
      //console.log('canplaythrough', e);
      // remove the spinner
      this._isLoading = false;
    });

    let c = this.shadowRoot.getElementById("canvas");
    c.addEventListener("mousedown", (e) => {
      this._mouseDown = e;
      this._isMouseDown = true;
      this._lineStart = {x: e.clientX, y:e.clientY};
      //console.log('line start', this._lineStart);
    });
    
    c.addEventListener("mouseup", (e) => {
      this._isMouseDown = false;
      // erase?
      if (e.clientX == this._lineStart.x && e.clientY == this._lineStart.y){
        this._clearCanvas();
      }
    });
    
    c.addEventListener("mousemove", (e) => {
      if (this._isMouseDown){
        this._lineEnd = {x:e.clientX, y:e.clientY};
        this._drawLine();
      }
    });  

    c.addEventListener("touchstart", (e) =>{
      this._isMouseDown = true;
      this._lineStart = {x: e.touches[0].clientX, y:e.touches[0].clientY};
    });

    c.addEventListener("touchmove", (e) =>{
      if (this._isMouseDown){
        this._lineEnd = {x:e.touches[0].clientX, y:e.touches[0].clientY};
        this._drawLine();
      }
    });

  }

  _clearCanvas(){
    let c = this.shadowRoot.getElementById("canvas");
            console.log('clear it');
        const ctx = c.getContext('2d');

        ctx.clearRect(0, 0, c.width, c.height);
  }

  _drawLine(){
    console.log('DRAW LINE');
    let c = this.shadowRoot.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    console.log(this._lineStart.x, this._lineEnd.x);
    ctx.strokeStyle = "#b2ff59";
    ctx.lineWidth = 6;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.moveTo(this._lineStart.x, this._lineStart.y);
    ctx.lineTo(this._lineEnd.x, this._lineEnd.y);
    ctx.stroke();
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
      this._swing = this._swings.find(obj => {
        return obj.key === this._videoId;
      });

      this._videoURL = this._swings.find(obj => {
        return obj.key === this._videoId;
      }).url;
    }

    if (changedProps.has("_videoId")){
      this._isLoading = true;
      this.shadowRoot.getElementById("video").load();
    }

    let v = this.shadowRoot.getElementById("video");

    v.ontimeupdate = () => {
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
