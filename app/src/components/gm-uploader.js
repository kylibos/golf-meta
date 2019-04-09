import { LitElement, html, css } from 'lit-element';
import { auth } from '../firebase.js';
import { SharedStyles } from './shared-styles.js';

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
          background: var(--app-dark-color);
        }`
    ];
  }

  render() {
    return html`
      <div>Mr. Uplaoder</div>
      <div @click="${this._cancel}">
        Cancel
      </div>
    `;
  }

  _cancel(){
    //alert('cancel');
    var x = this.dispatchEvent(new CustomEvent('closeUploadDialog', {bubbles: true, composed: true}));
    console.log(x);
    // send an event to close the dialog
  }

}

window.customElements.define('gm-uploader', GmUploader);