const jsyaml = require('js-yaml');
const moment = require('moment');
moment.locale('ja');
const safeEval = require('notevil');
const sprintf = require('sprintf-js').sprintf;

const variables = {
  get_fence_params: function(element, lang) {
    "use strict";

    let params;
    if (lang === "yaml") {
      params = jsyaml.safeLoad(element.innerText);
    } else if (lang === "json") {
      params = JSON.parse(element.innerText);
    }

    const vue_variables = this.get_variables(params['variables']);
    const vue_computed = this.get_computed(params['computed']);
    const vue_delimiters = this.get_delimiters(params['delimiters']);
    const variables = params['variables'];
    return {
      vue_data: vue_variables,
      vue_computed: vue_computed,
      vue_delimiters: vue_delimiters,
      variables: variables
    };
  },

  get_variables: function(params) {
    "use strict";

    if (params === undefined) {
      return new Object();
    }

    const ret = {};
    Object.keys(params).forEach(function(key) {
      const value = params[key];
      if (value['function'] !== undefined) {
        const funcstr = value['function'];
        const func = safeEval(funcstr, {
          moment: function() {
            return moment();
          },
          sprintf: function(...args) {
            return sprintf(...args);
          }
        })

        ret[key] = func;
      } else if (value['datetime'] !== undefined) {
        ret[key] = moment().format(value['datetime']);
      } else if (value['value'] !== undefined) {
        ret[key] = value['value'];
      } else {
        if (value['type'] != "select") {
          console.log("変数" + key + "に'function'も'datetime'も'value'も定義されていません。");
        }
      }
    });

    return ret;
  },

  get_computed: function(params) {
    "use strict";

    if (params === undefined) {
      return new Object();
    }

    const ret = {};
    Object.keys(params).forEach(function(key) {
      const value = params[key];
      if (value['value'] !== undefined) {
        const func = function() {
          return safeEval.Function("moment", "sprintf", value['value']).call(this, moment, sprintf);
        }
        ret[key] = func;
      } else {
        console.log("算出値" + key + "に'value'が定義されていません。");
      }
    });

    return ret;
  },

  get_delimiters: function(params) {
    "use strict";

    if (params !== undefined) {
      return params;
    } else {
      return ["{{", "}}"];
    }
  }
}

module.exports = variables;
