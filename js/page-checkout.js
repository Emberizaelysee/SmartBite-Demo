document.addEventListener("DOMContentLoaded", function () {
  var body = document.getElementById("checkoutBody");

  function renderSummary() {
    var lines = window.SmartBiteCart.cartLines();
    if (lines.length === 0) {
      body.innerHTML =
        '<div class="text-center py-5"><p class="text-muted">Your cart is empty.</p>' +
        '<a href="menu.html" class="btn btn-warning">Browse the menu</a></div>';
      return;
    }
    var rows = lines.map(function (l) {
      return "<tr><td>" + l.item.name + " &times; " + l.qty + "</td><td class=\"text-end\">" + window.formatPrice(l.item.price * l.qty) + "</td></tr>";
    }).join("");
    body.innerHTML =
      '<table class="table"><tbody>' + rows + "</tbody>" +
      '<tfoot><tr class="fw-bold"><td>Total</td><td class="text-end">' + window.formatPrice(window.SmartBiteCart.cartSubtotal()) + "</td></tr></tfoot></table>" +
      '<form id="checkoutForm" class="mt-3">' +
      '<div class="mb-3"><label class="form-label" for="ccName">Name on card</label><input class="form-control" id="ccName" placeholder="Jane Doe"></div>' +
      '<div class="row">' +
      '<div class="col-8 mb-3"><label class="form-label" for="ccNumber">Card number</label><input class="form-control" id="ccNumber" placeholder="4242 4242 4242 4242"></div>' +
      '<div class="col-4 mb-3"><label class="form-label" for="ccExp">Expiry</label><input class="form-control" id="ccExp" placeholder="MM/YY"></div>' +
      "</div>" +
      '<p class="text-muted small">This is a demo — the payment fields above are decorative and are never read, validated, or sent anywhere.</p>' +
      '<button type="submit" class="btn btn-warning btn-lg w-100">Place order</button>' +
      "</form>";

    document.getElementById("checkoutForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var order = window.SmartBiteCart.placeOrder();
      window.SmartBiteChrome.renderNavbar();
      if (!order) return;
      body.innerHTML =
        '<div class="text-center py-5">' +
        '<div class="display-6 mb-3">✅</div>' +
        '<h2 class="h4">Order placed!</h2>' +
        '<p class="text-muted">Order <strong>' + order.id + "</strong> — " + window.formatPrice(order.total) + '</p>' +
        '<p class="text-muted small">Demo only — nothing was actually sent or charged.</p>' +
        '<a href="menu.html" class="btn btn-outline-secondary me-2">Back to menu</a>' +
        '<a href="profile.html" class="btn btn-warning">View order history</a>' +
        "</div>";
    });
  }

  renderSummary();
});
