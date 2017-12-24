const shortcode = {
  init: function(selector, variables) {
    "use strict";

    const root = document.querySelector(selector);

    // テキストノードのみWalk
    const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

    // 置換対象のノードのペアの配列
    const replaces = new Array();

    while(treeWalker.nextNode()) {
      let currentNode = treeWalker.currentNode;
      let currentText = currentNode.textContent;
      let text = currentText;

      // マッチするものがなくなるまで繰り返す
      while(true) {
        const found = text.match(/{{< *variable +name="([^"]+)" *>}}/);
        if (!found) {
          break;
        }

        const matched = found[0];
        const name = found[1];
        const variable = variables[name];
        if (variable === undefined) {
          text = text.replace(matched, `変数${name}が定義されていません。`);
          continue;
        }

        const type = variable['type'] || "text";

        if (type == "select") {
          let replaceHTML = "<select>";
          variables[name]['options'].forEach(function(option) {
            const label = option.label ? `${option.label}(${option.value})` : option.value;
            replaceHTML += `<option value="${option.value}">${label}`;
          });
          replaceHTML += "</select>";

          text = text.replace(matched, replaceHTML);
        } else {
          text = text.replace(matched, `<input type="${type}" v-model="${name}">`);
        }
      }

      if (currentText != text) {
        const range = document.createRange();
        const newNode = range.createContextualFragment(text);

        // 一旦配列に格納する(途中でノードを変更するとTreeWalkerが動かないため)
        replaces.push([currentNode, newNode]);
      }
    }

    replaces.forEach(function(pair) {
      const currentNode = pair[0];
      const newNode = pair[1];

      currentNode.parentNode.replaceChild(newNode, currentNode);
    });
  }
};

module.exports = shortcode;
