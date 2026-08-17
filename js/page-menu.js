document.addEventListener("DOMContentLoaded", function () {
  var activeCategory = "all";
  var searchTerm = "";
  var tabsEl = document.getElementById("categoryTabs");
  var gridEl = document.getElementById("menuGrid");
  var noResultsEl = document.getElementById("noResults");
  var searchEl = document.getElementById("menuSearch");

  function renderTabs() {
    var all = [{ id: "all", label: "All" }].concat(window.SMARTBITE_CATEGORIES);
    tabsEl.innerHTML = all.map(function (cat) {
      var active = cat.id === activeCategory ? "btn-warning" : "btn-outline-secondary";
      return '<button type="button" class="btn btn-sm ' + active + '" data-cat="' + cat.id + '">' + cat.label + "</button>";
    }).join("");
  }

  function renderGrid() {
    var items = window.SMARTBITE_MENU.filter(function (i) {
      var matchesCat = activeCategory === "all" || i.category === activeCategory;
      var matchesSearch = !searchTerm || i.name.toLowerCase().indexOf(searchTerm) !== -1 || i.desc.toLowerCase().indexOf(searchTerm) !== -1;
      return matchesCat && matchesSearch;
    });
    noResultsEl.hidden = items.length !== 0;
    gridEl.innerHTML = items.map(function (item) {
      return '<div class="col-6 col-md-4 col-lg-3">' +
        '<div class="card h-100 shadow-sm">' +
        '<img src="' + item.img + '" class="card-img-top sb-card-img" alt="' + item.name + '">' +
        '<div class="card-body d-flex flex-column">' +
        '<h2 class="h6">' + item.name + "</h2>" +
        '<p class="text-muted small flex-grow-1">' + item.desc + "</p>" +
        '<div class="d-flex justify-content-between align-items-center">' +
        '<span class="fw-bold text-accent">' + window.formatPrice(item.price) + "</span>" +
        '<button class="btn btn-sm btn-warning" type="button" data-add="' + item.id + '">Add</button>' +
        "</div></div></div></div>";
    }).join("");
  }

  tabsEl.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-cat]");
    if (!btn) return;
    activeCategory = btn.getAttribute("data-cat");
    renderTabs();
    renderGrid();
  });

  searchEl.addEventListener("input", function () {
    searchTerm = searchEl.value.trim().toLowerCase();
    renderGrid();
  });

  gridEl.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-add]");
    if (!btn) return;
    var id = Number(btn.getAttribute("data-add"));
    window.SmartBiteCart.addToCart(id);
    window.SmartBiteChrome.renderNavbar();
    window.showToast(window.SmartBiteCart.findItem(id).name + " added to cart");
  });

  renderTabs();
  renderGrid();
});
