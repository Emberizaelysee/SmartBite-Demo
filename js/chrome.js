(function () {
  "use strict";

  function esc(s) {
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function navLink(href, label) {
    var current = window.location.pathname.split("/").pop() || "index.html";
    var active = current === href ? " active" : "";
    return '<li class="nav-item"><a class="nav-link' + active + '" href="' + href + '">' + label + "</a></li>";
  }

  function renderNavbar() {
    var root = document.getElementById("navbar-root");
    if (!root) return;
    var session = window.SmartBiteSession.getSession();
    var count = window.SmartBiteCart.cartCount();

    var authArea;
    if (session) {
      var profileOrDash = session.role === "admin"
        ? '<a class="dropdown-item" href="dashboard.html">Dashboard</a>'
        : '<a class="dropdown-item" href="profile.html">Profile</a>';
      authArea =
        '<li class="nav-item dropdown">' +
        '<a class="nav-link dropdown-toggle" href="#" id="userMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">' +
        esc(session.name) + (session.role === "admin" ? ' <span class="badge bg-warning text-dark">admin</span>' : "") +
        "</a>" +
        '<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">' +
        "<li>" + profileOrDash + "</li>" +
        '<li><hr class="dropdown-divider"></li>' +
        '<li><button class="dropdown-item" id="signOutBtn" type="button">Sign out</button></li>' +
        "</ul></li>";
    } else {
      authArea =
        '<li class="nav-item"><a class="nav-link" href="signin.html">Sign in</a></li>' +
        '<li class="nav-item"><a class="btn btn-sm btn-warning ms-lg-2" href="signup.html">Sign up</a></li>';
    }

    root.innerHTML =
      '<nav class="navbar navbar-expand-lg navbar-dark sb-navbar sticky-top">' +
      '<div class="container">' +
      '<a class="navbar-brand fw-bold" href="index.html">SmartBite</a>' +
      '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#sbNav" aria-controls="sbNav" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>' +
      '<div class="collapse navbar-collapse" id="sbNav">' +
      '<ul class="navbar-nav me-auto mb-2 mb-lg-0">' +
      navLink("index.html", "Home") +
      navLink("menu.html", "Menu") +
      navLink("reservation.html", "Reservations") +
      navLink("reviews.html", "Reviews") +
      "</ul>" +
      '<ul class="navbar-nav align-items-lg-center">' +
      '<li class="nav-item"><a class="nav-link position-relative" href="cart.html">Cart' +
      (count > 0 ? ' <span class="badge rounded-pill bg-danger" id="navCartBadge">' + count + "</span>" : '<span id="navCartBadge" class="d-none"></span>') +
      "</a></li>" +
      authArea +
      "</ul>" +
      "</div></div></nav>";

    var signOutBtn = document.getElementById("signOutBtn");
    if (signOutBtn) {
      signOutBtn.addEventListener("click", function () {
        window.SmartBiteSession.clearSession();
        window.location.href = "index.html";
      });
    }
  }

  function renderFooter() {
    var root = document.getElementById("footer-root");
    if (!root) return;
    root.innerHTML =
      '<footer class="sb-footer py-4 mt-5">' +
      '<div class="container d-flex flex-wrap justify-content-between align-items-center gap-2">' +
      '<span>SmartBite demo &mdash; mock data only, nothing is stored on a server.</span>' +
      '<a href="https://elichaamhanna.netlify.app/projects/smartbite.html" class="text-decoration-none">&larr; Back to project details</a>' +
      "</div></footer>";
  }

  function renderChatWidget() {
    if (document.getElementById("chatToggle")) return; // already present (index.html defines it inline)
    var wrap = document.createElement("div");
    wrap.innerHTML =
      '<button id="chatToggle" class="sb-chat-fab" type="button" aria-haspopup="true" aria-controls="chatPanel" aria-expanded="false"><span aria-hidden="true">💬</span></button>' +
      '<div id="chatPanel" class="sb-chat" hidden>' +
      '<div class="sb-chat__header"><span>Menu Assistant <small>(demo &mdash; canned answers)</small></span>' +
      '<button id="chatClose" class="btn-close btn-close-white" type="button" aria-label="Close assistant"></button></div>' +
      '<div id="chatLog" class="sb-chat__log" role="log" aria-live="polite"></div>' +
      '<div class="sb-chat__quick" id="chatQuick"></div>' +
      '<form id="chatForm" class="sb-chat__form">' +
      '<input id="chatInput" type="text" class="form-control form-control-sm" placeholder="Ask about the menu…" autocomplete="off">' +
      '<button type="submit" class="btn btn-sm btn-warning">Send</button>' +
      "</form></div>";
    document.body.appendChild(wrap);
    if (window.SmartBiteChat) window.SmartBiteChat.init();
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderNavbar();
    renderFooter();
    renderChatWidget();
  });

  window.SmartBiteChrome = { renderNavbar: renderNavbar };
})();
