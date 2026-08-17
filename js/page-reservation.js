document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("reservationForm");
  var result = document.getElementById("reservationResult");
  var list = document.getElementById("reservationList");

  function renderList() {
    var reservations = window.SmartBiteCart.getReservations();
    if (reservations.length === 0) {
      list.innerHTML = '<p class="text-muted">No reservations yet.</p>';
      return;
    }
    list.innerHTML = '<ul class="list-group">' + reservations.map(function (r) {
      return '<li class="list-group-item d-flex justify-content-between">' +
        "<span>" + window.escHtml(r.name) + " — " + window.escHtml(r.date) + " at " + window.escHtml(r.time) + "</span>" +
        '<span class="text-muted">' + window.escHtml(r.party) + " guests</span></li>";
    }).join("") + "</ul>";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var res = window.SmartBiteCart.addReservation({
      name: document.getElementById("resName").value,
      date: document.getElementById("resDate").value,
      time: document.getElementById("resTime").value,
      party: document.getElementById("resParty").value
    });
    result.innerHTML = '<div class="alert alert-success">Table booked for ' + window.escHtml(res.name) + " on " + window.escHtml(res.date) + " at " + window.escHtml(res.time) + '. Demo only — nothing was actually reserved.</div>';
    form.reset();
    document.getElementById("resParty").value = 2;
    renderList();
  });

  renderList();
});
