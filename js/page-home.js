document.addEventListener("DOMContentLoaded", function () {
  var featuredIds = [1, 8, 18, 21];
  var grid = document.getElementById("featuredGrid");
  featuredIds.forEach(function (id) {
    var item = window.SmartBiteCart.findItem(id);
    if (!item) return;
    var col = document.createElement("div");
    col.className = "col-6 col-md-3";
    col.innerHTML =
      '<div class="card h-100 shadow-sm">' +
      '<img src="' + item.img + '" class="card-img-top sb-card-img" alt="' + item.name + '">' +
      '<div class="card-body d-flex flex-column">' +
      '<h3 class="h6">' + item.name + "</h3>" +
      '<p class="text-muted small flex-grow-1">' + item.desc + "</p>" +
      '<div class="d-flex justify-content-between align-items-center">' +
      '<span class="fw-bold text-accent">' + window.formatPrice(item.price) + "</span>" +
      '<button class="btn btn-sm btn-warning" type="button" data-add="' + item.id + '">Add</button>' +
      "</div></div></div>";
    grid.appendChild(col);
  });

  grid.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-add]");
    if (!btn) return;
    var id = Number(btn.getAttribute("data-add"));
    window.SmartBiteCart.addToCart(id);
    window.SmartBiteChrome.renderNavbar();
    var item = window.SmartBiteCart.findItem(id);
    window.showToast(item.name + " added to cart");
  });
});
