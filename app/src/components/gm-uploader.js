import { LitElement, html, css } from 'lit-element';
import { auth } from '../firebase.js';
import { SharedStyles } from './shared-styles.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';

// This element is *not* connected to the Redux store.
class GmUploader extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      amount: { type: String },
      price: { type: String },
      _gotVideo: {type: Boolean}
    };
  }

  constructor() {
    super();
    this._gotVideo = false;
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
          <div id="thumbnailContainer" class="${this._gotVideo ? 'show' : 'hide'}">
            <div id="cancelVideoButton">X</div>
            <video width="150" height="150">
              <source id="videoFile">
              Your browser does not support HTML5 video.
            </video>
          </div>
          <div class="${this._gotVideo ? 'hide' : 'show'}">
            <label for="videoFileInput" id="chooseButton">Choose a file ...</label>
          </div>
          <div style="display:flex; flex-direction:row;">
            <paper-dropdown-menu label="Club">
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
            <paper-dropdown-menu label="Handicap">
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
        <div class="bottomNav" @click="${this._cancel}">
          <paper-button style="color:blue;">Cancel</paper-button>
          <div style="flex:1; text-align:right;">
            <paper-button class="button">Upload</paper-button>
          </div>
        </div>
      </div>
    `;
  }

  _getLocalFile(e){
    console.log(e.target.files[0]);
    this.shadowRoot.getElementById('videoFile').src = URL.createObjectURL(e.target.files[0]);
    this.shadowRoot.getElementById('videoFile').parentElement.load();
    this._gotVideo = true;
  }

  _cancel(){
    this.dispatchEvent(new CustomEvent('closeUploadDialog', {bubbles: true, composed: true}));
  }
}

window.customElements.define('gm-uploader', GmUploader);