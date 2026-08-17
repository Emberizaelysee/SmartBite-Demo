document.addEventListener("DOMContentLoaded", function () {
  var body = document.getElementById("cartBody");

  function render() {
    var lines = window.SmartBiteCart.cartLines();
    if (lines.length === 0) {
      body.innerHTML =
        '<div class="text-center py-5">' +
        '<p class="text-muted">Your cart is empty.</p>' +
        '<a href="menu.html" class="btn btn-warning">Browse the menu</a>' +
        "</div>";
      return;
    }

    var rows = lines.map(function (line) {
      return "<tr>" +
        '<td class="d-flex align-items-center gap-2">' +
        '<img src="' + line.item.img + '" alt="" width="48" height="48" class="rounded" style="object-fit:cover;">' +
        "<span>" + line.item.name + "</span></td>" +
        "<td>" + window.formatPrice(line.item.price) + "</td>" +
        '<td><div class="btn-group btn-group-sm" role="group">' +
        '<button class="btn btn-outline-secondary sb-qty-btn" type="button" data-qty="-1" data-id="' + line.item.id + '">-</button>' +
        '<span class="btn btn-outline-secondary disabled">' + line.qty + "</span>" +
        '<button class="btn btn-outline-secondary sb-qty-btn" type="button" data-qty="1" data-id="' + line.item.id + '">+</button>' +
        "</div></td>" +
        '<td class="fw-bold">' + window.formatPrice(line.item.price * line.qty) + "</td>" +
        '<td><button class="btn btn-sm btn-link text-danger" type="button" data-remove="' + line.item.id + '">Remove</button></td>' +
        "</tr>";
    }).join("");

    body.innerHTML =
      '<div class="table-responsive"><table class="table align-middle">' +
      "<thead><tr><th>Item</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr></thead>" +
      "<tbody>" + rows + "</tbody></table></div>" +
      '<div class="d-flex justify-content-between align-items-center mt-3">' +
      '<button class="btn btn-outline-secondary btn-sm" id="clearCartBtn" type="button">Clear cart</button>' +
      '<div class="text-end">' +
      '<div class="h5">Subtotal: ' + window.formatPrice(window.SmartBiteCart.cartSubtotal()) + "</div>" +
      '<a href="checkout.html" class="btn btn-warning btn-lg">Proceed to checkout</a>' +
      "</div></div>";
  }

  body.addEventListener("click", function (e) {
    var qtyBtn = e.target.closest("[data-qty]");
    var removeBtn = e.target.closest("[data-remove]");
    if (qtyBtn) {
      window.SmartBiteCart.changeQty(Number(qtyBtn.getAttribute("data-id")), Number(qtyBtn.getAttribute("data-qty")));
      window.SmartBiteChrome.renderNavbar();
      render();
    } else if (removeBtn) {
      var id = Number(removeBtn.getAttribute("data-remove"));
      var cart = window.SmartBiteCart.getCart();
      window.SmartBiteCart.changeQty(id, -(cart[id] || 0));
      window.SmartBiteChrome.renderNavbar();
      render();
    } else if (e.target.id === "clearCartBtn") {
      window.SmartBiteCart.clearCart();
      window.SmartBiteChrome.renderNavbar();
      render();
    }
  });

  render();
});
