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
            <paper-button ?disabled=${this._uploadProgress > 0 ? true : false} class="button" @click="${this._uploadVideo}">${this._uploadProgress ? html`${this._uploadProgress}%` : html`Upload`}</paper-button>
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

  _uploadVideo(){

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

    // Create thumbnail
    var video = this.shadowRoot.getElementById('video');
    console.log(this.shadowRoot.getElementById('video').videoWidth);
    var w = this._calcWidth(video.videoHeight, video.videoWidth);
    var h = this._calcHeight(video.videoHeight, video.videoWidth);
    var canvas = this.shadowRoot.getElementById('thumbnailCanvas');
  
    canvas.width = w;
    canvas.height = h;

    var context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, w, h);

    firebase.firestore().collection("swings").add({
      userHash: this._userHash,
      size: this._videoFile.size,
      type: this._videoFile.type,
      name: this._videoFile.name,
      state: 'uploading',
      created: firebase.firestore.FieldValue.serverTimestamp(),
      club: this.shadowRoot.getElementById('clubSelector').value,
      handicap: this.shadowRoot.getElementById('handicapSelector').value,
    })
    .then((docRef) => {
      
      console.log("Document successfully written!");

      // Upload the video


      var ref = firebase.storage().ref();
      var storageRef = ref.child('swings/'+this._generateFileName(docRef.id));
      var file = this._videoFile;

      var uploadTask = storageRef.put(file);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
        var percent = snapshot.bytesTransferred / snapshot.totalBytes * 100;
        this._uploadProgress = Math.round(percent);
        if (this._uploadProgress == 100) {
          this._uploadComplete();
          //console.log(storageRef.getDownloadURL());
        }
      }, (error)=>{
        console.log(error);
      }, ()=>{
        //console.log('donwload URL:',storageRef.getDownloadURL());
        storageRef.getDownloadURL().then((url) => {
          firebase.firestore().collection("swings").doc(docRef.id).set({
            url: url
          }, { merge: true })
          .then(() => {
            this._uploadThumbnail(docRef.id);
            return Promise.resolve();
          })
          .catch(function(error) {
              console.error("Error writing document: ", error);
            return Promise.resolve();
          });
        });
      });
      

      // Upload the Thumbnail

      this.swingListenerUnsubscribe = firebase.firestore().collection('swings').doc(docRef.id).onSnapshot((doc) => {
        if (doc.data().state == 'deployed'){
          alert('Your video is ready!!!');
          this.swingListenerUnsubscribe();
        }
      });
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
    
    console.log(this.shadowRoot.getElementById('clubSelector').value);
  }

  _uploadThumbnail(id){
    console.log('upload thumbnail');

    var canvas = this.shadowRoot.getElementById('thumbnailCanvas');
    console.log('image',canvas.toDataURL("image/jpeg"));

    var ref = firebase.storage().ref();
    var storageRef = ref.child('thumbs/'+this._generateThumbFileName(id));
    var uploadTask = storageRef.putString(canvas.toDataURL(), 'data_url');

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
      var percent = snapshot.bytesTransferred / snapshot.totalBytes * 100;
      this._uploadProgress = Math.round(percent);
      if (this._uploadProgress == 100) {
        //this._uploadComplete();
        //console.log(storageRef.getDownloadURL());
        console.log('THIMB UPLOADED!');
      }
    }, (error)=>{
      console.log(error);
    }, ()=>{
      storageRef.getDownloadURL().then((url) => {
        firebase.firestore().collection("swings").doc(id).set({
          thumb: url
        }, { merge: true })
        .then(() => {
          console.log('thumbnail has been uploaded');
          return Promise.resolve();
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
          return Promise.resolve();
        });
      });
    });
  }

  _uploadComplete(){
    this._uploadProgress = 0;
    this.shadowRoot.getElementById('clubSelector').value = '';
    this.shadowRoot.getElementById('handicapSelector').value = '';
    this._clearVideo();
    this._cancel();
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
  }

  _generateThumbFileName(id){
    return 'swing_' + id + '.jpg';
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