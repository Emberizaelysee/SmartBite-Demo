document.addEventListener("DOMContentLoaded", function () {
  var body = document.getElementById("profileBody");
  var session = window.SmartBiteSession.getSession();

  if (!session) {
    body.innerHTML =
      '<div class="text-center py-5">' +
      '<p class="text-muted">You need to sign in to view your profile.</p>' +
      '<a href="signin.html" class="btn btn-warning">Sign in</a>' +
      "</div>";
    return;
  }

  if (session.role === "admin") {
    window.location.href = "dashboard.html";
    return;
  }

  var orders = window.SmartBiteCart.getOrders();
  var reservations = window.SmartBiteCart.getReservations();

  var ordersHtml = orders.length === 0
    ? '<p class="text-muted">No orders yet — <a href="menu.html">browse the menu</a>.</p>'
    : '<ul class="list-group mb-4">' + orders.map(function (o) {
        return '<li class="list-group-item d-flex justify-content-between">' +
          "<span>" + window.escHtml(o.id) + " — " + o.lines.map(function (l) { return window.escHtml(l.name) + " x" + l.qty; }).join(", ") + "</span>" +
          '<span class="fw-bold">' + window.formatPrice(o.total) + "</span></li>";
      }).join("") + "</ul>";

  var reservationsHtml = reservations.length === 0
    ? '<p class="text-muted">No reservations yet — <a href="reservation.html">book a table</a>.</p>'
    : '<ul class="list-group">' + reservations.map(function (r) {
        return '<li class="list-group-item">' + window.escHtml(r.date) + " at " + window.escHtml(r.time) + " for " + window.escHtml(r.party) + " guests</li>";
      }).join("") + "</ul>";

  body.innerHTML =
    '<div class="d-flex align-items-center gap-3 mb-4">' +
    '<div class="bg-secondary bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center" style="width:64px;height:64px;font-size:1.5rem;">' +
    window.escHtml(session.name.charAt(0).toUpperCase()) + "</div>" +
    "<div><h1 class=\"h4 mb-0\">" + window.escHtml(session.name) + "</h1>" +
    '<p class="text-muted mb-0">' + window.escHtml(session.email) + "</p></div></div>" +
    '<h2 class="h5">Order history</h2>' + ordersHtml +
    '<h2 class="h5">Reservations</h2>' + reservationsHtml;
});
