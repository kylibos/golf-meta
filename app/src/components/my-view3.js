/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, css } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the actions needed by this element.
import { checkout } from '../actions/shop.js';

// We are lazy loading its reducer.
import shop, { cartQuantitySelector } from '../reducers/shop.js';
store.addReducers({
  shop
});

// These are the elements needed by this element.
import './shop-products.js';
import './shop-cart.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';
import { ButtonSharedStyles } from './button-shared-styles.js';
import { addToCartIcon } from './my-icons.js';

class MyView3 extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      // This is the data from the store.
      _quantity: { type: Number },
      _error: { type: String }
    };
  }

  static get styles() {
    return [
      SharedStyles,
      ButtonSharedStyles,
      css`
        button {
          border: 2px solid var(--app-dark-text-color);
          border-radius: 3px;
          padding: 8px 16px;
        }

        button:hover {
          border-color: var(--app-primary-color);
          color: var(--app-primary-color);
        }

        .cart,
        .cart svg {
          fill: var(--app-primary-color);
          width: 64px;
          height: 64px;
        }

        .circle.small {
          margin-top: -72px;
          width: 28px;
          height: 28px;
          font-size: 16px;
          font-weight: bold;
          line-height: 30px;
        }
      `
    ];
  }

  render() {
    return html`
        
      <section id="tester">
        <h2>Redux example: shopping cart</h2>
        <div class="cart">${addToCartIcon}<div class="circle small">${this._quantity}</div></div>
        <p>This is a slightly more advanced Redux example, that simulates a
          shopping cart: getting the products, adding/removing items to the
          cart, and a checkout action, that can sometimes randomly fail (to
          simulate where you would add failure handling). </p>
        <p>This view, as well as its 2 child elements, <code>&lt;shop-products&gt;</code> and
        <code>&lt;shop-cart&gt;</code> are connected to the Redux store.</p>
      </section>
      <section>
        <h3>Products</h3>
        <shop-products></shop-products>

        <br>
        <h3>Your Cart</h3>
        <shop-cart></shop-cart>

        <div>${this._error}</div>
        <br>
        <p>
          <button ?hidden="${this._quantity == 0}" @click="${this._checkoutButtonClicked}">
            Checkout
          </button>
        </p>
      </section>
      <iframe class="sproutvideo-player" src="https://videos.sproutvideo.com/embed/709adcb31f19e5c6f8/cd8cf2e796aa69d3" style="position:absolute;width:100%;height:100%;left:0;top:0" frameborder="0" allowfullscreen=""></iframe>
       <button id="testButton">Play</button>
    `;
  }

  _checkoutButtonClicked() {
    store.dispatch(checkout());
  }

  firstUpdated(){
/*
var JSON;
JSON || (JSON = {}),
  function () {
    function str(a, b) {
      var c, d, e, f, g = gap,
        h, i = b[a];
      i && typeof i == "object" && typeof i.toJSON == "function" && (i = i.toJSON(a)), typeof rep == "function" && (i = rep.call(b, a, i));
      switch (typeof i) {
        case "string":
          return quote(i);
        case "number":
          return isFinite(i) ? String(i) : "null";
        case "boolean":
        case "null":
          return String(i);
        case "object":
          if (!i) return "null";
          gap += indent, h = [];
          if (Object.prototype.toString.apply(i) === "[object Array]") {
            f = i.length;
            for (c = 0; c < f; c += 1) h[c] = str(c, i) || "null";
            e = h.length === 0 ? "[]" : gap ? "[\n" + gap + h.join(",\n" + gap) + "\n" + g + "]" : "[" + h.join(",") + "]", gap = g;
            return e
          }
          if (rep && typeof rep == "object") {
            f = rep.length;
            for (c = 0; c < f; c += 1) typeof rep[c] == "string" && (d = rep[c], e = str(d, i), e && h.push(quote(d) + (gap ? ": " : ":") + e))
          } else
            for (d in i) Object.prototype.hasOwnProperty.call(i, d) && (e = str(d, i), e && h.push(quote(d) + (gap ? ": " : ":") + e));
          e = h.length === 0 ? "{}" : gap ? "{\n" + gap + h.join(",\n" + gap) + "\n" + g + "}" : "{" + h.join(",") + "}", gap = g;
          return e
      }
    }

    function quote(a) {
      escapable.lastIndex = 0;
      return escapable.test(a) ? '"' + a.replace(escapable, function (a) {
        var b = meta[a];
        return typeof b == "string" ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
      }) + '"' : '"' + a + '"'
    }

    function f(a) {
      return a < 10 ? "0" + a : a
    }
    "use strict", typeof Date.prototype.toJSON != "function" && (Date.prototype.toJSON = function (a) {
      return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
    }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (a) {
      return this.valueOf()
    });
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      gap, indent, meta = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
      },
      rep;
    typeof JSON.stringify != "function" && (JSON.stringify = function (a, b, c) {
      var d;
      gap = "", indent = "";
      if (typeof c == "number")
        for (d = 0; d < c; d += 1) indent += " ";
      else typeof c == "string" && (indent = c);
      rep = b;
      if (!b || typeof b == "function" || typeof b == "object" && typeof b.length == "number") return str("", {
        "": a
      });
      throw new Error("JSON.stringify")
    }), typeof JSON.parse != "function" && (JSON.parse = function (text, reviver) {
      function walk(a, b) {
        var c, d, e = a[b];
        if (e && typeof e == "object")
          for (c in e) Object.prototype.hasOwnProperty.call(e, c) && (d = walk(e, c), d !== undefined ? e[c] = d : delete e[c]);
        return reviver.call(a, b, e)
      }
      var j;
      text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function (a) {
        return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
      }));
      if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
        j = eval("(" + text + ")");
        return typeof reviver == "function" ? walk({
          "": j
        }, "") : j
      }
      throw new SyntaxError("JSON.parse")
    })
  }();

  */

var SV;
if (!SV) {
  SV = {}
}( () => {
  if (!SV.players) {
    SV.players = {}
  }
  if (!SV.Player) {
    SV.Player = function (options) {
      var _videoId = options.videoId;
      var _playlistId = options.playlistId;
      var _volume = 1,
        _duration = 0,
        _currentTime = 0,
        _loaded = 0,
        _email = null,
        _listeners = {};
      var _sendMessage = function (message) {
        console.log('SEND MESSAGE', message);
        console.log('to iframe', _iframe.contentWindow);
        _iframe.contentWindow.postMessage(message, window.location.protocol + "//videos.sproutvideo.com")
      };
      var _getIframeByVideoId = (id, type) => {
        var className = type == "video" ? "sproutvideo-player" : "sproutvideo-playlist";
        var players = SV.utils.getElementsByClassName(className);
        console.log('got players', players);
        /*
        for (var i = 0; i < players.length; i++) {
          if (players[i].src.indexOf(id) > -1) {
            return players[i]
          }
        }
        */
        return players;
      };
      var _iframe = _getIframeByVideoId(_videoId || _playlistId, !!_videoId ? "video" : "playlist");
      if (!_iframe) {
        throw "Can not find video iframe"
      }
      var pub = {
        events: options.events,
        play: (index) => {
          console.log('PLAY IT');
          if (typeof index != "undefined") {
            _sendMessage('{"name":"playVideo", "data":"' + index + '"}')
          } else {
            _sendMessage('{"name":"play"}')
          }
        },
        pause: function () {
          _sendMessage('{"name":"pause"}')
        },
        setVolume: function (vol) {
          _sendMessage('{"name":"volume", "data":"' + vol + '"}')
        },
        getVolume: function () {
          return _volume
        },
        seek: function (loc) {
          _sendMessage('{"name":"seek", "data":"' + loc + '"}')
        },
        toggleHD: function () {
          _sendMessage('{"name":"toggleHD"}')
        },
        getCurrentTime: function () {
          return _currentTime
        },
        getPercentLoaded: function () {
          return _loaded
        },
        getDuration: function () {
          return _duration
        },
        getEmail: function () {
          return _email
        },
        frameForward: function () {
          _sendMessage('{"name":"frameForward"}')
        },
        frameBack: function () {
          _sendMessage('{"name":"frameBack"}')
        },
        getPaused: function () {
          _sendMessage('{"name":"getPaused"}')
        },
        updateStatus: function (message) {
          switch (message.type) {
            case "volume":
              _volume = message.data;
              break;
            case "progress":
              _currentTime = message.data.time;
              break;
            case "loading":
              _loaded = message.data;
              break;
            case "ready":
              _duration = message.data.duration;
              _email = message.data.email;
              break
          }
        },
        bind: function (type, listener) {
          if (typeof _listeners[type] == "undefined") {
            _listeners[type] = []
          }
          _listeners[type].push(listener)
        },
        fire: function (event) {
          if (typeof event == "string") {
            event = {
              type: event
            }
          }
          if (!event.target) {
            event.target = this
          }
          if (_listeners[event.type] instanceof Array) {
            var listeners = _listeners[event.type];
            for (var i = 0, len = listeners.length; i < len; i++) {
              var returnValue = listeners[i].call(this, event);
              if (returnValue == this.unbind) {
                this.unbind(event.type, listeners[i])
              }
            }
          }
        },
        unbind: function (type, listener) {
          if (_listeners[type] instanceof Array) {
            var listeners = _listeners[type];
            for (var i = 0, len = listeners.length; i < len; i++) {
              if (listeners[i] === listener) {
                listeners.splice(i, 1);
                break
              }
            }
          }
        }
      };
      SV.players[_videoId || _playlistId] = pub;
      return pub
    }
  }
  if (!SV.utils) {
    SV.utils = {
      getElementsByClassName: (classname) => {
        if (this.shadowRoot.querySelector) {
          //return document.getElementsByClassName(classname)
          return this.shadowRoot.querySelector('.'+classname);
        } else {
          var classElements = new Array;
          var els = document.getElementsByTagName("*");
          var elsLen = els.length;
          var pattern = new RegExp("(^|\\s)" + classname + "(\\s|$)");
          for (var i = 0, j = 0; i < elsLen; i++) {
            if (pattern.test(els[i].className)) {
              classElements[j] = els[i];
              j++
            }
          }
          return classElements
        }
      }
    }
  }
  if (!SV.routePlayerEvent) {
    SV.routePlayerEvent = function (e) {
      if (e.origin.split("//")[1] == "videos.sproutvideo.com") {
        try {
          var message = JSON.parse(e.data);
          var player = SV.players[message.id];
          player.updateStatus(message);
          player.fire({
            type: message.type,
            data: message.data
          });
          if (player && player.events && player.events["onStatus"]) {
            player.events["onStatus"](message)
          }
        } catch (e) {}
      }
    }
  }
  if (window.addEventListener) {
    window.addEventListener("message", SV.routePlayerEvent, false)
  } else {
    window.attachEvent("onmessage", SV.routePlayerEvent)
  }
})();


    console.log('FIRST UPDATED');
    var player = new SV.Player({videoId: '709adcb31f19e5c6f8'});
    console.log('player', player);

    this.shadowRoot.getElementById('testButton').addEventListener('click', (e)=>{
      console.log('fart');
      player.play();
      alert(player.getCurrentTime());
    });

    /*
    var player = this.shadowRoot.querySelectorAll(".sproutvideo-player");
    console.log('PLAYER', player);
    console.log('protocol', window.location.protocol);
    setTimeout(()=>{
      console.log('PLAY');
      player[0].contentWindow.postMessage({"name":"play"}, "https://videos.sproutvideo.com");
    },1000);
    */
  }

  // This is called every time something is updated in the store.
  stateChanged(state) {
    this._quantity = cartQuantitySelector(state);
    this._error = state.shop.error;
  }
}

window.customElements.define('my-view3', MyView3);
