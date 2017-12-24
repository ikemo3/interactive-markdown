const Clipboard = require('clipboard');

// <code>をクリップするとコピー
const clipboard = {
  init: function(selector) {
    "use strict";
    new Clipboard(selector, {
      target: function(trigger) {
        return trigger;
      }
    });
  }
}

module.exports = clipboard;
