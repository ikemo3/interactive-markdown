const Vue = require('vue');

let vue;
var inject = {
  init: function(variables, computed, delimiters, element) {
    vue = new Vue({
      delimiters: delimiters,
      el: element,
      data: variables,
      computed: computed
    });
  }
}

module.exports = inject;
