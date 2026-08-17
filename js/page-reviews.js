document.addEventListener("DOMContentLoaded", function () {
  var dishSelect = document.getElementById("reviewDish");
  var form = document.getElementById("reviewForm");
  var list = document.getElementById("reviewList");

  dishSelect.innerHTML = window.SMARTBITE_MENU.map(function (i) {
    return '<option value="' + i.id + '">' + i.name + "</option>";
  }).join("");

  function stars(n) {
    return "★".repeat(n) + "☆".repeat(5 - n);
  }

  function render() {
    var reviews = window.SmartBiteReviews.getReviews();
    if (reviews.length === 0) {
      list.innerHTML = '<p class="text-muted">No reviews yet — be the first.</p>';
      return;
    }
    list.innerHTML = reviews.map(function (r) {
      var dish = window.SmartBiteCart.findItem(r.menuId);
      return '<div class="card card-body mb-3">' +
        '<div class="d-flex justify-content-between">' +
        "<strong>" + (dish ? window.escHtml(dish.name) : "Menu item") + "</strong>" +
        '<span class="text-warning">' + stars(r.rating) + "</span></div>" +
        '<p class="mb-1">' + window.escHtml(r.text) + "</p>" +
        '<small class="text-muted">' + window.escHtml(r.author) + " — " + window.escHtml(r.date) + "</small></div>";
    }).join("");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var session = window.SmartBiteSession.getSession();
    window.SmartBiteReviews.addReview({
      menuId: Number(dishSelect.value),
      rating: Number(document.getElementById("reviewRating").value),
      text: document.getElementById("reviewText").value,
      author: session ? session.name : "Guest"
    });
    form.reset();
    render();
    window.showToast("Review posted");
  });

  render();
});
