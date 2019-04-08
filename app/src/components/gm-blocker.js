import { LitElement, html, css } from 'lit-element';

// This element is *not* connected to the Redux store.
class GmBlocker extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      amount: { type: String },
      price: { type: String }
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          background: red;
          position: fixed;
          top:0;
          bottom:0;
        }`
    ];
  }

  render() {
    return html`
      Here we go
    `;
  }
}

window.customElements.define('gm-blocker', GmBlocker);