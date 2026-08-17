(function () {
  "use strict";
  window.showToast = function (msg) {
    var el = document.getElementById("toast");
    var body = document.getElementById("toastBody");
    if (!el || !body || !window.bootstrap) return;
    body.textContent = msg;
    var toast = window.bootstrap.Toast.getOrCreateInstance(el, { delay: 2400 });
    toast.show();
  };

  window.formatPrice = function (n) { return "$" + n.toFixed(2); };

  window.escHtml = function (s) {
    var div = document.createElement("div");
    div.textContent = String(s == null ? "" : s);
    return div.innerHTML;
  };
})();
