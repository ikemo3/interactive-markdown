const shortcode = require('./lib/shortcode.js');
const clipboard = require('./lib/clipboard.js');
const variables = require('./lib/variables.js');
const Settings = require('./lib/settings.js');
const vue = require('./lib/vue.js');

// 設定の読み込み
const settings = Settings.load();

for (let setting of settings) {
  // 実行済みの場合は除外
  if (document.documentElement.getAttribute("data-interactive-markdown")) {
    break;
  }

  // code fenceを取得
  const fence = setting.get_fence();
  if (fence === null) {
    continue;
  }

  // 変数の取得
  const params = variables.get_fence_params(fence.e, fence.lang);

  // 変数定義が見つかった場合
  if (params != null) {
    // shortcodeの置換
    shortcode.init(setting.post_body, params.variables);

    // Vue.jsの呼び出し
    vue.init(params.vue_data, params.vue_computed, params.vue_delimiters, setting.post_body);

    // 実行したことを表すフラグを追加
    document.documentElement.setAttribute("data-interactive-markdown", "true");
    break;
  }

  // クリップボード対応
  clipboard.init(setting.clipboard);
}
