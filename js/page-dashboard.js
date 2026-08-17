document.addEventListener("DOMContentLoaded", function () {
  var body = document.getElementById("dashboardBody");
  var session = window.SmartBiteSession.getSession();

  if (!session || session.role !== "admin") {
    body.innerHTML =
      '<div class="text-center py-5">' +
      '<p class="text-muted">Admin access required for this page.</p>' +
      '<a href="signin.html" class="btn btn-warning">Sign in as demo admin</a>' +
      "</div>";
    return;
  }

  var HIDDEN_KEY = "smartbite-demo-hidden-items";
  function getHidden() {
    try { return JSON.parse(localStorage.getItem(HIDDEN_KEY) || "[]"); } catch (e) { return []; }
  }
  function setHidden(ids) {
    try { localStorage.setItem(HIDDEN_KEY, JSON.stringify(ids)); } catch (e) { /* noop */ }
  }

  function allOrders() {
    return window.SMARTBITE_SEED_ORDERS.concat(window.SmartBiteCart.getOrders());
  }

  function avgRating() {
    var reviews = window.SmartBiteReviews.getReviews();
    if (reviews.length === 0) return 0;
    return reviews.reduce(function (s, r) { return s + r.rating; }, 0) / reviews.length;
  }

  function render() {
    var hidden = getHidden();
    var orders = allOrders();
    var revenue = orders.reduce(function (s, o) { return s + o.total; }, 0);

    var stats =
      '<div class="row g-3 mb-4">' +
      statCard("Menu items", window.SMARTBITE_MENU.length - hidden.length) +
      statCard("Orders", orders.length) +
      statCard("Revenue", window.formatPrice(revenue)) +
      statCard("Avg. rating", avgRating().toFixed(1) + " / 5") +
      "</div>";

    var menuRows = window.SMARTBITE_MENU.map(function (item) {
      var isHidden = hidden.indexOf(item.id) !== -1;
      return "<tr" + (isHidden ? ' class="table-secondary"' : "") + ">" +
        "<td>" + window.escHtml(item.name) + "</td>" +
        "<td>" + window.escHtml(item.category) + "</td>" +
        "<td>" + window.formatPrice(item.price) + "</td>" +
        "<td>" + (isHidden ? '<span class="badge bg-secondary">Hidden</span>' : '<span class="badge bg-success">Live</span>') + "</td>" +
        '<td><button class="btn btn-sm btn-outline-secondary" type="button" data-toggle="' + item.id + '">' +
        (isHidden ? "Restore" : "Hide") + "</button></td></tr>";
    }).join("");

    var orderRows = orders.map(function (o) {
      return "<tr><td>" + window.escHtml(o.id) + "</td>" +
        "<td>" + window.escHtml(o.customer || session.name) + "</td>" +
        "<td>" + o.lines.map(function (l) { return window.escHtml(l.name) + " x" + l.qty; }).join(", ") + "</td>" +
        "<td>" + window.formatPrice(o.total) + "</td></tr>";
    }).join("");

    body.innerHTML =
      '<h1 class="h3 mb-4">Admin dashboard</h1>' +
      stats +
      '<h2 class="h5">Menu management</h2>' +
      '<div class="table-responsive mb-4"><table class="table table-sm align-middle">' +
      "<thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th></th></tr></thead>" +
      "<tbody>" + menuRows + "</tbody></table></div>" +
      '<h2 class="h5">Recent orders</h2>' +
      '<div class="table-responsive"><table class="table table-sm align-middle">' +
      "<thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th></tr></thead>" +
      "<tbody>" + orderRows + "</tbody></table></div>" +
      '<p class="text-muted small mt-3">"Hide"/"Restore" only changes what this browser sees — it\'s a local demo toggle, not a real database update.</p>';
  }

  function statCard(label, value) {
    return '<div class="col-6 col-md-3"><div class="card card-body text-center">' +
      '<div class="h4 mb-0">' + value + "</div>" +
      '<div class="text-muted small">' + label + "</div></div></div>";
  }

  body.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-toggle]");
    if (!btn) return;
    var id = Number(btn.getAttribute("data-toggle"));
    var hidden = getHidden();
    var idx = hidden.indexOf(id);
    if (idx === -1) hidden.push(id); else hidden.splice(idx, 1);
    setHidden(hidden);
    render();
  });

  render();
});
