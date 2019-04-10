import { LitElement, html, css } from 'lit-element';
import { auth } from '../firebase.js';
import { SharedStyles } from './shared-styles.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';

// This element is *not* connected to the Redux store.
class GmUploader extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      amount: { type: String },
      price: { type: String }
    };
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
        }

        .bottomNav {
          padding:16px;
          border-top:1px solid gainsboro;
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
        <div style="padding:16px;">
          <div>
            <label for="videoFileInput">Choose a file</label>
          </div>
          <paper-input placeholder="Choose a video"></paper-input>
          <div style="display:flex; flex-direction:row;">
            <paper-input placeholder="Club" style="width:45%"></paper-input>
            <div style="width:10%">&nbsp;</div>
            <paper-input style="width:45%" placeholder="Handicap"></paper-input>
          </div>
        </div>
        <div class="bottomNav" @click="${this._cancel}">
          <paper-button style="color:blue;">Cancel</paper-button>
          <div style="flex:1; text-align:right;">
            <paper-button style="color:white;background:red;">Upload</paper-button>
          </div>
        </div>
      </div>
    `;
  }

  _getLocalFile(e){
    console.log(e);
  }

  _cancel(){
    this.dispatchEvent(new CustomEvent('closeUploadDialog', {bubbles: true, composed: true}));
  }
}

window.customElements.define('gm-uploader', GmUploader);