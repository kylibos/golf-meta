import { LitElement, html, css } from 'lit-element';
import { SharedStyles } from './shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { firebase } from '../firebase.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import { store } from '../store.js';

// This element is *not* connected to the Redux store.
class GmUploader extends connect(store)(LitElement) {
  static get properties() {
    return {
      name: { type: String },
      amount: { type: String },
      price: { type: String },
      _gotVideo: {type: Boolean},
      _uploadError: {type: String},
      _uploadProgress: {type: Number}
    };
  }

  constructor() {
    super();
    this._gotVideo = false;
    this._uploadError = '';
    this._uploadProgress = 0;
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
        }

        .bottomNav {
          padding:16px;
          display:flex;
        }

        paper-input {
          --paper-input-container-focus-color:var(--app-dark-color);
        }

        .fileInput {
          width: 0.1px;
          height: 0.1px;
          opacity: 0;
          overflow: hidden;
          position: absolute;
          z-index: -1;
        }

        #dialogHeader {
          background:var(--app-light-color);
          color:#000;
          font-family: 'Pacifico';
          text-align: center;
          padding: 16px;
          font-size: 20px;
        }

        .button {
          color:white;
          background:var(--app-dark-color);
        }

        #thumbnailContainer {
          position:relative;
          padding:16px 32px;
          color:rgba(0,0,0,.4);
          background:white;
          border:3px dashed rgba(0,0,0,.4);
          border-radius:6px;
          font-size:16px;
          text-align:center;
          display:block;
        }

        #chooseButton {
          padding:16px 32px;
          color:rgba(0,0,0,.4);
          background:white;
          border:3px dashed rgba(0,0,0,.4);
          border-radius:6px;
          font-size:16px;
          text-align:center;
          display:block;
          cursor:pointer;
        }

        #uploadErrorContainer {
          padding-top:8px;
          padding-right:22px;
          color:red;
          border-top:1px solid gainsboro;
          text-align:right;
        }

        #cancelVideoButton {
          position: absolute;
          cursor:pointer;
          background: white;
          color: rgba(0,0,0,.4);
          top: -10px;
          left: -10px;
          border: 2px solid rgba(0,0,0,.4);
          border-radius: 50%;
          padding: 4px;
          width: 20px;
        }

        #chooseButton:hover {
          background:whitesmoke;
        }

        .hide {
          display:none !important;
        }

        .show {
          display: block !important;
        }

        paper-progress {
          width:100%;
        }

        paper-button[disabled] {
          background: whitesmoke;
          color:rgba(0,0,0,.4);
        }

        #dialogContainer {
          display:flex;
          flex-direction:column;
        }`
    ];
  }

  render() {
    return html`
      <input class="fileInput" accept="video/*" id="videoFileInput" @change="${this._getLocalFile}" type="file" />
      <div id="dialogContainer">
        <div id="dialogHeader">Upload Your Swing</div>

        <paper-progress value="${this._uploadProgress}"></paper-progress>
        <div style="padding:16px;">
          <div id="thumbnailContainer" class="${this._gotVideo ? 'show' : 'hide'}">
            <div id="cancelVideoButton" @click="${this._clearVideo}">X</div>
            <video id="video" width="150" height="150">
              <source id="videoFile">
              Your browser does not support HTML5 video.
            </video>
            <canvas id="thumbnailCanvas" style="background:#000; display:none;"></canvas>
          </div>
          <div class="${this._gotVideo ? 'hide' : 'show'}">
            <label for="videoFileInput" id="chooseButton">Choose a file ...</label>
          </div>
          <div style="display:flex; flex-direction:row;">
            <paper-dropdown-menu label="Club" id="clubSelector" no-animations="true">
              <paper-listbox slot="dropdown-content" class="dropdown-content">
                <paper-item>Driver</paper-item>
                <paper-item>3 wood</paper-item>
                <paper-item>5 wood</paper-item>
                <paper-item>2 hybrid</paper-item>
                <paper-item>3 hybrid</paper-item>
                <paper-item>4 hybrid</paper-item>
                <paper-item>5 hybrid</paper-item>
                <paper-item>2 iron</paper-item>
                <paper-item>3 iron</paper-item>
                <paper-item>4 iron</paper-item>
                <paper-item>5 iron</paper-item>
                <paper-item>6 iron</paper-item>
                <paper-item>7 iron</paper-item>
                <paper-item>8 iron</paper-item>
                <paper-item>9 iron</paper-item>
                <paper-item>Aw</paper-item>
                <paper-item>Pw</paper-item>
                <paper-item>Gw</paper-item>
                <paper-item>Can't Remember</paper-item>
              </paper-listbox>
            </paper-dropdown-menu>
            <div style="width:10%">&nbsp;</div>
            <paper-dropdown-menu label="Handicap" id="handicapSelector" no-animations="true">
              <paper-listbox slot="dropdown-content" class="dropdown-content">
                <paper-item>No Handicap</paper-item>
                <paper-item>0</paper-item>
                <paper-item>1</paper-item>
                <paper-item>2</paper-item>
                <paper-item>3</paper-item>
                <paper-item>4</paper-item>
                <paper-item>5</paper-item>
                <paper-item>6</paper-item>
                <paper-item>7</paper-item>
                <paper-item>8</paper-item>
                <paper-item>9</paper-item>
                <paper-item>10</paper-item>
                <paper-item>11</paper-item>
                <paper-item>12</paper-item>
                <paper-item>13</paper-item>
                <paper-item>14</paper-item>
                <paper-item>15</paper-item>
                <paper-item>16</paper-item>
                <paper-item>17</paper-item>
                <paper-item>18</paper-item>
                <paper-item>19</paper-item>
                <paper-item>20</paper-item>
                <paper-item>21</paper-item>
                <paper-item>22</paper-item>
                <paper-item>23</paper-item>
                <paper-item>24</paper-item>
                <paper-item>25</paper-item>
              </paper-listbox>
            </paper-dropdown-menu>
          </div>
        </div>
        <div id="uploadErrorContainer">${this._uploadError}</div>
        <div class="bottomNav">
          <paper-button @click="${this._cancel}" style="color:blue;">Cancel</paper-button>
          <div style="flex:1; text-align:right;">
            <paper-button ?disabled=${this._uploadProgress > 0 ? true : false} class="button" @click="${this._initializeVideo}">${this._uploadProgress ? html`${this._uploadProgress}%` : html`Upload`}</paper-button>
          </div>
        </div>
        <paper-progress value="${this._uploadProgress}"></paper-progress>
      </div>
    `;
  }

  _calcWidth(h,w){
    if (h>w){
      return (w/h)*300;
    } else if (h<w){
      return 300;
    } else {
      return 300;
    }
  }

  _calcHeight(h,w){
    if (h>w){
      return 300; 
    } else if (h<w){
      return (w/h)*300;
    } else {
      return 300;
    }
  }

  _uploadVideo(t,id){
    console.log('upload',t,id);

    var formData = new FormData();
    formData.append( 'source_video', this._videoFile );
    formData.append( 'token', t );
    formData.append( 'privacy', 0);
    if (window.location.hostname == '127.0.0.1'){
      console.log('DEV FIREBASE');
      formData.append( 'notification_url', 'https://us-central1-golf-meta-dev.cloudfunctions.net/golfmeta/sproutWebHook')
    } else if (window.location.hostname == 'golf-meta-staging.appspot.com') {
      console.log('STAGING FIREBASE');
      formData.append( 'notification_url', 'https://us-central1-golf-meta-staging.cloudfunctions.net/golfmeta/sproutWebHook');
    }
    
    fetch('https://api.sproutvideo.com/v1/videos', { // Your POST endpoint
        method: 'POST',
        body: formData // This is your file object
      })
      .then(
        (response) => {
          if (response.status !== 200 && response.status !== 201) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            console.log(typeof response.status)
            console.log(response);
            return;
          }

          // Examine the text in the response
          response.json().then((data) => {
            // create the fb to sprout lookup for webhook reference
            firebase.firestore().collection('videoLookup').add({
              sproutId: data.id, 
              fbId: id
            });
            firebase.firestore().collection('swings').doc(id).set({
              state: 'uploaded',
              sproutId: data.id,
              uploadedTs: firebase.firestore.FieldValue.serverTimestamp()
            },{merge:true});
            this._cancel();
            this.dispatchEvent(new CustomEvent('openAlertSnackbar', {detail: 'You video has been uploaded.  It can take up to a minute to process before you can watch it.', bubbles: true, composed: true}));
            setTimeout(()=>{
              this.dispatchEvent(new CustomEvent('closeAlertSnackbar', {bubbles: true, composed: true}));
            },7000);
          });
        }
      )
      .catch((err) => {
        console.log('Fetch Error :-S', err);
      });
  }

  _getToken(id){
    console.log('doc ref', id);
    firebase.firestore().collection('swings').doc(id).set({
      state: 'getting token'
    },{merge:true})
    .then((docRef) => {
      fetch('https://us-central1-golf-meta-staging.cloudfunctions.net/golfmeta/sproutToken')
        .then(
          (response) => {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' +
                response.status);
              return;
            }

            // Examine the text in the response
            response.json().then((data) => {
              console.log(data);
              this._uploadVideo(data.token, id);
            });
          }
        )
        .catch((err) => {
          console.log('Fetch Error :-S', err);
        });
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });

  }

  _initializeVideo(){

    this._uploadError = '';
    var club = this.shadowRoot.getElementById('clubSelector').value;
    var handicap = this.shadowRoot.getElementById('handicapSelector').value;

    // Validation
    if (typeof this._videoFile != 'object'){
      console.log('You must select a video');
      this._uploadError = 'Select Your Swing Video';
      return false;
    }

    if (this._videoFile.size > 70000000){
      console.log(this._videoFile.size);
      this._uploadError = 'You video file is too big.  70MB is the max.';
      return false;
    }

    if (typeof club == 'undefined'){
      console.log('You must select a club');
      this._uploadError = 'Select a Club';
      return false;
    }

    if (typeof handicap == 'undefined'){
      console.log('You must select a handicap');
      this._uploadError = 'Select Your Handicap';
      return false;
    }

    firebase.firestore().collection("swings").add({
      userHash: this._userHash,
      size: this._videoFile.size,
      type: this._videoFile.type,
      name: this._videoFile.name,
      state: 'initializing',
      initialRecordCreationTs: firebase.firestore.FieldValue.serverTimestamp(),
      club: this.shadowRoot.getElementById('clubSelector').value,
      handicap: this.shadowRoot.getElementById('handicapSelector').value,
    })
    .then((docRef) => {
      this._getToken(docRef.id);

    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
  }


  _clearVideo(){
    this.shadowRoot.getElementById('videoFile').value = '';
    this._gotVideo = false;
    this._videoFile = '';
    this._uploadError = '';
    this._uploadProgress = 0;
  }

  _getLocalFile(e){
    this._uploadError = '';
    this._videoFile = e.target.files[0];
    this.shadowRoot.getElementById('videoFile').src = URL.createObjectURL(e.target.files[0]);
    this.shadowRoot.getElementById('videoFile').parentElement.load();
    this._gotVideo = true;
    this._uploadProgress = 0;

    // send an event to center the dialog
    this.dispatchEvent(new CustomEvent('centerUploadDialog', {bubbles: true, composed: true}));
  }

  _generateFileName(id){
    return 'swing_' + id + '.' + this._videoFile.name.split('.').pop();
  }

  _cancel(){
    this.dispatchEvent(new CustomEvent('closeUploadDialog', {bubbles: true, composed: true}));
  }

  stateChanged(state) {
    this._userHash = state.user.userHash;
  }
}

window.customElements.define('gm-uploader', GmUploader);