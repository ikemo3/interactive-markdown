const get_fence_esa = function() {
  "use strict";
  const elements = document.querySelectorAll('.code-filename');
  for (let e of elements) {
    let filename = e.textContent.trim();
    if (filename === "params") {
      let yaml = e.parentNode.querySelector('pre.yaml');
      if (yaml) {
        return { e: yaml, lang: "yaml" };
      }

      let json = e.parentNode.querySelector('pre.json');
      if (json) {
        return { e: json, lang: "json" };
      }
    }
  }

  return null;
}

const get_fence_qiita = function() {
  "use strict";
  const elements = document.querySelectorAll('.code-lang');
  for (let e of elements) {
    let filename = e.textContent.trim();
    if (filename === "params") {
      let parentNode = e.parentNode;
      let lang = parentNode.getAttribute("data-lang");
      let element = parentNode.querySelector('.highlight > pre');
      if (element) {
        return { e: element, lang: lang };
      }
    }
  }

  return null;
}

module.exports = {
  load: function() {
    "use strict";

    return [
      {
        clipboard: 'code',
        get_fence: get_fence_esa,
        post_body: '.post-body',
      },
      {
        clipboard: 'code',
        get_fence: get_fence_qiita,
        post_body: 'section.it-MdContent',
      }
    ];
  }
}
