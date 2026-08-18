// Demo shim: makes the REAL, unmodified SmartBite frontend work with no
// backend. It intercepts fetch() calls and classic <form> submits to the
// PHP endpoints the app already calls, and answers them from localStorage
// instead. None of the app's own HTML/CSS/JS was rewritten — this is the
// only added file.
(function () {
  "use strict";

  var Store = window.SmartBiteStore;

  // ---------------------------------------------------------------------
  // helpers
  // ---------------------------------------------------------------------

  function jsonResponse(obj, status) {
    return Promise.resolve(new Response(JSON.stringify(obj), {
      status: status || 200,
      headers: { "Content-Type": "application/json" }
    }));
  }
  function htmlResponse(html, status) {
    return Promise.resolve(new Response(html, {
      status: status || 200,
      headers: { "Content-Type": "text/html; charset=UTF-8" }
    }));
  }

  // Strip query string and any leading path segments so
  // "../Backend/api/x.php", "/SmartBite/Backend/api/x.php" and
  // "Backend/api/x.php" all normalize to the same suffix we can match on.
  function endpointOf(url) {
    var s = String(url).split("?")[0];
    var idx = s.indexOf("Backend/api/");
    return idx === -1 ? null : s.slice(idx + "Backend/api/".length);
  }

  function currentPage() {
    var p = window.location.pathname.split("/").pop() || "index.html";
    return p;
  }

  function esc(s) {
    var div = document.createElement("div");
    div.textContent = s == null ? "" : String(s);
    return div.innerHTML;
  }

  function fmtMoney(n) { return Number(n).toFixed(2); }

  function requireSession() { return Store.getSession(); }

  // ---------------------------------------------------------------------
  // real HTML fragment templates (copied verbatim from the PHP source so
  // the rendered markup is byte-identical to what the real backend emits)
  // ---------------------------------------------------------------------

  function menuCardHtml(item) {
    return ' <div class="col-md-4 mb-2">' +
      '<div class="card">' +
      '<div class="card-body">' +
      '<img src="' + item.img + '" class="card-img-top" alt="' + item.name + '">' +
      '<h5 class="card-title">' + item.name + '</h5>' +
      '<p class="card-text">$ ' + item.price.toFixed(2) + '</p>' +
      '<form method="post" data-demo-cart="add">' +
      '<input type="hidden" name="item_id" value="' + item.id + '">' +
      '<input type="hidden" name="quantity" value="1">' +
      '<button type="submit" name="add_to_cart" class="btn btn-green px-4">Add to cart</button>' +
      '</form></div></div></div>';
  }

  function cartRowHtml(itemId, item) {
    return '<tr> ' +
      '<td> ' + item.item_name + ' </td>' +
      '<td> <img src="' + item.item_image + '" alt="' + item.item_name + '" class="cart_img"> </td>' +
      '<td> <form method="post" action="cart.html" class="d-flex align-items-center justify-content-center" data-demo-cart="update">' +
      '<input type="hidden" name="item_id" value="' + itemId + '">' +
      '<input type="number" name="quantity" value="' + item.quantity + '" min="1" class="form-control" style="width:70px;">' +
      '<button type="submit" name="update_qty" class="btn btn-green"> Update </button> </form> </td>' +
      '<td> $' + fmtMoney(item.item_price) + ' </td>' +
      '<td> <form method="post" data-demo-cart="remove">' +
      '<input type="hidden" name="item_id" value="' + itemId + '">' +
      '<button type="submit" name="remove_item" class="btn btn-remove">Remove</button> </form> </td>' +
      '</tr>';
  }

  // ---------------------------------------------------------------------
  // fetch shim
  // ---------------------------------------------------------------------

  var realFetch = window.fetch.bind(window);

  window.fetch = function (input, init) {
    var url = typeof input === "string" ? input : (input && input.url) || "";
    var ep = endpointOf(url);
    if (!ep) return realFetch(input, init);

    var method = (init && init.method) || "GET";
    var body = null;
    if (init && init.body) {
      try { body = JSON.parse(init.body); } catch (e) { body = null; }
    }

    // ---- auth ----
    if (ep === "auth/session_check.php") {
      var s = requireSession();
      return jsonResponse(s
        ? { logged_in: true, username: s.username, email: s.email, role: s.role, success: true }
        : { logged_in: false, success: true });
    }

    // ---- menu ----
    if (ep === "menu/get_categories.php") {
      return jsonResponse(window.DEMO_CATEGORIES.map(function (c) {
        return { IdCategory: String(c.id), CategoryName: c.name === "PIZZAS" ? " PIZZAS  " : c.name };
      }));
    }

    // ---- review helper endpoints ----
    if (ep.indexOf("review/get_menu.php") === 0) {
      var catId = Number((url.split("cat=")[1] || "").split("&")[0]);
      var items = window.DEMO_MENU.filter(function (m) { return m.cat === catId; });
      var rows = items.map(function (m) {
        return '\n    <tr>\n        <td>' + m.name + '</td>\n        <td><img src="' + m.img +
          '" width="70" height="60" class="rounded" style="object-fit:cover;" alt="' + m.name +
          '"></td>\n        <td><input type="radio" name="dish_id" value="' + m.id + '" required></td>\n    </tr>';
      }).join("");
      return htmlResponse(rows);
    }
    if (ep === "review/get_reviews.php") {
      return htmlResponse(reviewsListHtml());
    }

    // ---- profile ----
    if (ep === "profile/get_profile.php") {
      var sess = requireSession();
      if (!sess) return jsonResponse({ success: false, message: "Not logged in" }, 401);
      return jsonResponse({ success: true, id: sess.id, username: sess.username, email: sess.email, role: sess.role, created_at: "2026-06-06 10:43:05", avatar: null });
    }
    if (ep === "profile/fetch_user_orders.php") {
      var sess2 = requireSession();
      var mine = Store.getOrders().filter(function (o) { return !sess2 || o.user_id === sess2.id; });
      var seedMine = sess2 && sess2.email === "user@user.com" ? window.DEMO_SEED_ORDERS : [];
      return jsonResponse({ success: true, data: mine.concat(seedMine) });
    }
    if (ep === "profile/fetch_user_reservations.php") {
      var sess3 = requireSession();
      var mineR = Store.getReservations().filter(function (r) { return !sess3 || r.user_id === sess3.id; });
      var seedR = sess3 && sess3.email === "user@user.com" ? window.DEMO_SEED_RESERVATIONS : [];
      return jsonResponse({ success: true, data: mineR.concat(seedR) });
    }
    if (ep === "profile/fetch_user_reviews.php") {
      var sess4 = requireSession();
      var mineRv = Store.getReviews().filter(function (r) { return !sess4 || r.user_id === sess4.id; });
      var seedRv = sess4 && sess4.email === "user@user.com" ? window.DEMO_SEED_REVIEWS : [];
      return jsonResponse({ success: true, data: mineRv.concat(seedRv) });
    }
    if (ep === "profile/delete_user_review.php") {
      var reviews2 = Store.getReviews().filter(function (r) { return r.id !== (body && body.review_id); });
      localStorage.setItem("sb_demo_reviews", JSON.stringify(reviews2));
      return jsonResponse({ success: true, message: "Review deleted." });
    }
    if (ep === "profile/reservation_actions.php") {
      var action = body && body.action;
      var list = Store.getReservations();
      if (action === "cancel") {
        list = list.filter(function (r) { return r.id !== body.reservation_id; });
        localStorage.setItem("sb_demo_reservations", JSON.stringify(list));
        return jsonResponse({ success: true, message: "Reservation cancelled." });
      }
      if (action === "edit") {
        list.forEach(function (r) {
          if (r.id === body.reservation_id) { r.date = body.date; r.time = body.time; r.guests = body.guests; r.special_notes = body.special_notes; }
        });
        localStorage.setItem("sb_demo_reservations", JSON.stringify(list));
        return jsonResponse({ success: true, message: "Reservation updated." });
      }
      return jsonResponse({ success: false, message: "Unknown action." });
    }
    if (ep === "profile/reorder_order.php") {
      var newOrder = Store.placeOrderFromItems ? Store.placeOrderFromItems(body.items) : null;
      var orders2 = Store.getOrders();
      var nextId = orders2.length ? Math.max.apply(null, orders2.map(function (o) { return o.id; })) + 1 : 200;
      var order = {
        id: nextId, user_id: (requireSession() || {}).id || 0, username: (requireSession() || {}).username || "Guest",
        total_amount: (body.items || []).reduce(function (s, it) { var m = Store.findMenuItem(it.menu_item_id); return s + (m ? m.price * it.qty : 0); }, 0),
        status: "Pending", order_date: new Date().toISOString().slice(0, 19).replace("T", " "), date: new Date().toISOString().slice(0, 19).replace("T", " "),
        items: (body.items || []).map(function (it) { var m = Store.findMenuItem(it.menu_item_id); return { menu_item_id: it.menu_item_id, name: m ? m.name : "", qty: it.qty, price: m ? m.price : 0, image: m ? m.img : "" }; })
      };
      orders2.unshift(order);
      localStorage.setItem("sb_demo_orders", JSON.stringify(orders2));
      return jsonResponse({ success: true, new_order_id: nextId });
    }
    if (ep === "profile/update_profile.php") {
      var act = body && body.action;
      if (act === "update_profile") {
        var s5 = Store.getSession();
        if (s5) { s5.username = body.username; Store.setSession(s5); }
        return jsonResponse({ success: true, message: "Profile updated." });
      }
      if (act === "change_password") {
        return jsonResponse({ success: true, message: "Password changed. (Demo only — nothing is actually stored.)" });
      }
      if (act === "delete_account") {
        Store.clearSession();
        return jsonResponse({ success: true, message: "Account deleted." });
      }
      return jsonResponse({ success: false, message: "Unknown action." });
    }
    if (ep === "profile/upload_profile_avatar.php") {
      return jsonResponse({ success: true, avatar: null, message: "Avatar upload is disabled in this demo." });
    }

    // ---- dashboard ----
    if (ep === "dashboard/fetch_Menu_Items.php") {
      return jsonResponse(window.DEMO_MENU.map(function (m) {
        var cat = window.DEMO_CATEGORIES.filter(function (c) { return c.id === m.cat; })[0];
        return { id: m.id, name: m.name, description: "", ingredients: "", price: m.price, category: cat ? cat.name : "", category_id: m.cat, image: m.img };
      }));
    }
    if (ep === "dashboard/fetch_all_orders.php") {
      var allOrders = Store.getOrders().concat(window.DEMO_SEED_ORDERS);
      return jsonResponse({ success: true, data: allOrders.map(function (o) { return { id: o.id, user_id: o.user_id, username: o.username, total_amount: Number(o.total_amount || o.total), status: o.status, special_instructions: o.special_instructions || "", order_date: o.order_date || o.date, items: o.items }; }) });
    }
    if (ep === "dashboard/fetch_all_reservations.php") {
      var allRes = Store.getReservations().concat(window.DEMO_SEED_RESERVATIONS);
      return jsonResponse({ success: true, data: allRes });
    }
    if (ep === "dashboard/fetch_all_tables.php") {
      return jsonResponse({ success: true, data: window.DEMO_TABLES });
    }
    if (ep === "dashboard/fetch_all_users.php") {
      var customUsers = JSON.parse(localStorage.getItem("sb_demo_users") || "[]");
      return jsonResponse({ success: true, data: window.DEMO_SEED_USERS.concat(customUsers) });
    }
    if (ep === "dashboard/fetch_reviews.php") {
      var allReviews = Store.getReviews().concat(window.DEMO_SEED_REVIEWS);
      var avg = allReviews.length ? allReviews.reduce(function (s, r) { return s + r.rating; }, 0) / allReviews.length : 0;
      return jsonResponse({ success: true, data: allReviews, average_rating: Math.round(avg * 10) / 10, total: allReviews.length });
    }
    if (ep === "dashboard/dashboard_actions.php") {
      return handleDashboardAction(body || {});
    }

    // ---- chatbot ----
    if (ep === "chatbot/chatbot_proxy.php") {
      var userText = "";
      try { userText = body.contents[body.contents.length - 1].parts[0].text || ""; } catch (e) {}
      return jsonResponse({ candidates: [{ content: { parts: [{ text: chatbotReply(userText) }] } }] });
    }

    // Unknown Backend/api endpoint — fail closed rather than hit a real server.
    return jsonResponse({ success: false, message: "This endpoint is not available in the demo." }, 404);
  };

  function chatbotReply(text) {
    var t = text.toLowerCase();
    function names(cat) { return window.DEMO_MENU.filter(function (m) { return m.cat === cat; }).map(function (m) { return m.name; }).join(", "); }
    if (/pizza/.test(t)) return "Our pizzas: " + names(1) + ". The Margherita Pizza is the favorite!";
    if (/burger/.test(t)) return "Our burgers: " + names(2) + ". The BBQ Burger is our richest option.";
    if (/pasta/.test(t)) return "Our pastas: " + names(4) + ". Carbonara and Alfredo are both creamy classics.";
    if (/salad|healthy/.test(t)) return "Our salads: " + names(5) + ". The Greek Salad is a lighter pick.";
    if (/dessert|sweet/.test(t)) return "For dessert: " + names(6) + ". Tiramisu is the most popular.";
    if (/drink|smoothie/.test(t)) return "To drink: " + names(7) + ".";
    if (/veg(etarian)?/.test(t)) return "Good vegetarian picks: Veggie Pizza, Pesto Pasta, and Greek Salad.";
    if (/reservation|book|table/.test(t)) return "You can book a table from the Reservations page.";
    if (/hi|hello|hey/.test(t)) return "Hi! I'm the SmartBite assistant (demo — canned answers). Ask me about the menu!";
    return "I'm a demo assistant with canned answers — try asking about pizzas, salads, desserts, or reservations.";
  }

  function handleDashboardAction(payload) {
    var action = payload.action;

    function listKey(k) { return "sb_demo_" + k; }
    function readList(k, fallback) { try { return JSON.parse(localStorage.getItem(listKey(k)) || "null") || fallback; } catch (e) { return fallback; } }
    function writeList(k, v) { localStorage.setItem(listKey(k), JSON.stringify(v)); }

    if (action === "get_weekly_revenue") {
      var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      var data = days.map(function (d) { return { day: d, revenue: Math.round(Math.random() * 80 + 20) }; });
      return jsonResponse({ success: true, data: data });
    }
    if (action === "get_categories") {
      return jsonResponse({ success: true, data: window.DEMO_CATEGORIES });
    }
    if (action === "get_tables") {
      return jsonResponse({ success: true, data: window.DEMO_TABLES });
    }
    if (action === "search_users") {
      var term = (payload.term || "").toLowerCase();
      var users = window.DEMO_SEED_USERS.concat(readList("users", []));
      return jsonResponse({ success: true, data: users.filter(function (u) { return u.username.toLowerCase().indexOf(term) !== -1 || u.email.toLowerCase().indexOf(term) !== -1; }) });
    }

    if (action === "delete_menu" || action === "delete_order" || action === "delete_table" || action === "delete_reservation" || action === "delete_review" || action === "delete_user") {
      // These act on seed/demo data that lives in-memory for the session only —
      // acknowledge success so the real dashboard.js UI removes the row optimistically.
      return jsonResponse({ success: true, message: "Removed (demo only)." });
    }
    if (action === "update_order_status") {
      var orders = readList("orders", []);
      orders.forEach(function (o) { if (o.id === payload.id) o.status = payload.status; });
      writeList("orders", orders);
      return jsonResponse({ success: true, message: "Order status updated." });
    }
    if (action === "make_admin" || action === "make_user") {
      return jsonResponse({ success: true, message: "Role updated (demo only)." });
    }
    if (action === "add_menu" || action === "edit_menu") {
      return jsonResponse({ success: true, message: "Menu item saved (demo only — not persisted to the real menu)." });
    }
    if (action === "add_table" || action === "edit_table") {
      return jsonResponse({ success: true, message: "Table saved (demo only)." });
    }
    if (action === "add_reservation" || action === "edit_reservation") {
      return jsonResponse({ success: true, message: "Reservation saved (demo only)." });
    }
    if (action === "add_order" || action === "edit_order") {
      return jsonResponse({ success: true, message: "Order saved (demo only)." });
    }
    if (action === "add_review") {
      Store.addReview(payload.menu_id, payload.rating, payload.content);
      return jsonResponse({ success: true, message: "Review added." });
    }
    if (action === "add_user") {
      var users2 = readList("users", []);
      users2.push({ id: 2000 + users2.length, username: payload.username, email: payload.email, role: payload.role || "user", created_at: new Date().toISOString() });
      writeList("users", users2);
      return jsonResponse({ success: true, message: "User added (demo only)." });
    }

    return jsonResponse({ success: false, message: "This action is not available in the demo." });
  }

  // ---------------------------------------------------------------------
  // classic <form> submit interception (cart / auth / review / reservation)
  // ---------------------------------------------------------------------

  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    var action = form.getAttribute("action") || "";
    var submitter = e.submitter;
    var submitterName = submitter && submitter.getAttribute("name");

    // --- cart forms on index.html / search.html (add_to_cart) and cart.html (update/remove/clear/checkout) ---
    if (submitterName === "add_to_cart") {
      e.preventDefault();
      var itemId = form.querySelector('[name="item_id"]').value;
      var qty = form.querySelector('[name="quantity"]').value;
      var res = Store.addToCart(itemId, qty);
      if (res.item) {
        renderCartBadge();
        if (res.alreadyInCart) {
          alert(res.item.name + " is already in your cart!");
        } else {
          alert(res.item.name + " added to your cart!");
        }
      }
      return;
    }
    if (submitterName === "update_qty") {
      e.preventDefault();
      var uid = form.querySelector('[name="item_id"]').value;
      var uqty = form.querySelector('[name="quantity"]').value;
      Store.updateCartQuantity(uid, uqty);
      renderCartTable();
      renderCartBadge();
      return;
    }
    if (submitterName === "remove_item") {
      e.preventDefault();
      var rid = form.querySelector('[name="item_id"]').value;
      Store.removeFromCart(rid);
      renderCartTable();
      renderCartBadge();
      return;
    }
    if (submitterName === "clear_cart") {
      e.preventDefault();
      Store.clearCart();
      renderCartTable();
      renderCartBadge();
      return;
    }
    if (submitterName === "checkout") {
      e.preventDefault();
      if (!requireSession()) { window.location.href = "signin.html"; return; }
      var special = form.querySelector('[name="special_request"]');
      var order = Store.placeOrder(special ? special.value : "");
      if (order) {
        sessionStorage.setItem("sb_demo_last_order_id", String(order.id));
        window.location.href = "purchase.html";
      }
      return;
    }
    if (submitterName === "confirm_order") {
      e.preventDefault();
      var pending = currentPendingOrder();
      if (pending) {
        var orders3 = Store.getOrders();
        orders3.forEach(function (o) { if (o.id === pending.id) o.status = "Confirmed"; });
        localStorage.setItem("sb_demo_orders", JSON.stringify(orders3));
      }
      sessionStorage.removeItem("sb_demo_last_order_id");
      alert("An email has been sent to confirm the order. (Demo only — no real email was sent.)");
      window.location.href = "index.html";
      return;
    }

    // --- signin ---
    if (form.id === "signinForm") {
      e.preventDefault();
      var email = form.querySelector('[name="email"]').value;
      var seedUser = window.DEMO_SEED_USERS.filter(function (u) { return u.email === email; })[0];
      var custom = JSON.parse(localStorage.getItem("sb_demo_users") || "[]").filter(function (u) { return u.email === email; })[0];
      if (!seedUser && !custom) {
        window.location.href = "signin.html?error=invalid";
        return;
      }
      Store.signIn(email, seedUser && seedUser.role === "admin");
      var redirect = form.querySelector('[name="redirect"]');
      window.location.href = (redirect && redirect.value) || "index.html";
      return;
    }

    // --- signup ---
    if (form.id === "signupForm") {
      e.preventDefault();
      var suName = form.querySelector('[name="fullname"], [name="name"], [name="username"]');
      var suEmail = form.querySelector('[name="email"]');
      Store.signUp(suName ? suName.value : "", suEmail ? suEmail.value : "");
      window.location.href = "index.html";
      return;
    }

    // --- forgot password ---
    if (action.indexOf("forgot-password.php") !== -1) {
      e.preventDefault();
      window.location.href = "forgot-password.html?sent=1";
      return;
    }

    // review.html and reservation.html's own scripts intercept their forms'
    // real "submit" event themselves (async session check, then a direct
    // .submit() call) — handled exclusively via the .submit() override
    // below, not here, to avoid double-handling the same submission.
  }, true);

  function submitReviewForm(form) {
    if (!requireSession()) { window.location.href = "signin.html?redirect=review"; return; }
    var dish = form.querySelector('[name="dish_id"]:checked');
    var rating = form.querySelector('[name="rating"]:checked') || form.querySelector('[name="rating"]');
    var text = form.querySelector('[name="review"]');
    if (!dish || !rating || !rating.value || !text || !text.value.trim()) { window.location.href = "review.html?error=missing_fields"; return; }
    Store.addReview(dish.value, rating.value, text.value.trim());
    window.location.href = "review.html?success=1";
  }

  function submitReservationForm(form) {
    if (!requireSession()) { window.location.href = "signin.html?redirect=reservation"; return; }
    var guests = Number(form.querySelector('[name="guests"]').value);
    var date = form.querySelector('[name="date"]').value;
    var time = form.querySelector('[name="time"]').value;
    var requests = form.querySelector('[name="requests"]');
    if (!guests || guests < 1 || guests > 10 || !date || !time) { window.location.href = "reservation.html?error=missing_fields"; return; }
    Store.addReservation({ guests: guests, date: date, time: time, requests: requests ? requests.value : "" });
    window.location.href = "reservation.html?success=1";
  }

  // The real reservation.js / review.js do their own async session-check
  // before calling form.submit()/this.submit() directly — a native call
  // that does NOT fire another "submit" event, so the listener above never
  // sees it. Shadow .submit() on those two specific forms so the real
  // scripts' own validation still runs, but the final submission is mocked.
  document.addEventListener("DOMContentLoaded", function () {
    var reservationForm = document.getElementById("reservationForm");
    if (reservationForm) reservationForm.submit = function () { submitReservationForm(reservationForm); };
    var reviewForm = document.getElementById("reviewForm");
    if (reviewForm) reviewForm.submit = function () { submitReviewForm(reviewForm); };
  });

  // ---------------------------------------------------------------------
  // logout / google sign-in click interception
  // ---------------------------------------------------------------------

  document.addEventListener("click", function (e) {
    var logoutLink = e.target.closest && e.target.closest('a[href*="logout.php"]');
    if (logoutLink) {
      e.preventDefault();
      Store.clearSession();
      window.location.href = "index.html";
    }
  }, true);

  function neutralizeGoogleButton() {
    var btn = document.querySelector('.social-btn');
    if (btn) {
      btn.onclick = function (e) {
        e.preventDefault();
        alert("Google sign-in is disabled in this demo — use the email form instead (any email/password works).");
      };
    }
  }

  // Quick-login buttons added to signin.html so the admin dashboard (and
  // the regular customer profile) are reachable without knowing the
  // underlying seed credentials.
  function wireDemoLoginButtons() {
    var userBtn = document.getElementById("demoUserBtn");
    var adminBtn = document.getElementById("demoAdminBtn");
    if (userBtn) {
      userBtn.addEventListener("click", function () {
        Store.signIn("user@user.com", false);
        window.location.href = "index.html";
      });
    }
    if (adminBtn) {
      adminBtn.addEventListener("click", function () {
        Store.signIn("admin@smartbite.com", true);
        window.location.href = "dashboard.html";
      });
    }
  }

  // ---------------------------------------------------------------------
  // dynamic rendering: cart badge, welcome bar, menu grid, cart table
  // ---------------------------------------------------------------------

  function renderCartBadge() {
    var cartLink = document.querySelector('a[href="cart.html"], a[href="cart.php"]');
    if (cartLink) {
      var supEl = cartLink.querySelector('sup');
      if (supEl) supEl.textContent = String(Store.cartItemCount());
    }
  }

  function renderWelcomeBar() {
    var links = document.querySelectorAll(".bar a.nav-link, nav.bar a.nav-link");
    var target = null;
    document.querySelectorAll("a.nav-link.text-white").forEach(function (a) {
      if (/^Welcome/.test(a.textContent.trim())) target = a;
    });
    if (!target) return;
    var s = requireSession();
    target.textContent = s ? ("Welcome " + s.username) : "Welcome Guest";
  }

  function renderReviewLoginPrompt() {
    var prompt = document.getElementById("reviewLoginPrompt");
    if (prompt) prompt.style.display = requireSession() ? "none" : "";
  }

  // review.php originally includes get_reviews.php server-side on every
  // load; there's no static equivalent, so this fills in the same markup
  // client-side (used both for the fetch mock and for the initial render).
  function reviewsListHtml() {
    var reviews = Store.getReviews().concat(window.DEMO_SEED_REVIEWS);
    var html = reviews.map(function (r) {
      var stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);
      var d = new Date(r.created_at);
      var dateStr = ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2) + "/" + d.getFullYear();
      return '\n    <div class="review-card">\n        <div class="d-flex justify-content-between align-items-center mb-1">\n            <div>\n                <span class="fw-semibold">' +
        esc(r.author_name) + '</span>\n                <p class="text-muted small mb-0">' + dateStr +
        '</p>\n                <p class="text-muted small mb-0"><em>' + esc(r.item_name) +
        '</em></p>\n            </div>\n            <span class="review-stars">' + stars +
        '</span>\n        </div>\n        <p class="text-muted small mb-0">' + esc(r.content) + '</p>\n    </div>';
    }).join("");
    return html || '\n    <p class="text-muted">No reviews yet.</p>';
  }

  function renderReviewsList() {
    var list = document.getElementById("reviewsList");
    if (list) list.innerHTML = reviewsListHtml();
  }

  function renderMenuGrid() {
    var grid = document.getElementById("menu-cards-row");
    if (!grid) return;
    var params = new URLSearchParams(window.location.search);
    var cat = params.get("cat");
    var items;
    if (cat) {
      items = window.DEMO_MENU.filter(function (m) { return m.cat === Number(cat); });
    } else {
      var shuffled = window.DEMO_MENU.slice().sort(function () { return Math.random() - 0.5; });
      items = shuffled.slice(0, 6);
    }
    grid.innerHTML = items.map(menuCardHtml).join("");
  }

  function renderSearchResults() {
    var grid = document.getElementById("menu-cards-row");
    if (!grid) return;
    var params = new URLSearchParams(window.location.search);
    var term = (params.get("search_data") || "").toLowerCase();
    var items = window.DEMO_MENU.filter(function (m) { return m.name.toLowerCase().indexOf(term) !== -1; });
    grid.innerHTML = items.length ? items.map(menuCardHtml).join("") : '<p class="text-muted text-center">No dishes found.</p>';
  }

  function renderCartTable() {
    var tbody = document.querySelector("tbody");
    if (!tbody) return;
    var cart = Store.getCart();
    var ids = Object.keys(cart);

    var rows = ids.length === 0
      ? '<tr> \n             <td colspan="5" class="text-center py-5">   <h4> Your cart is empty </h4> </td>\n             </tr>'
      : ids.map(function (id) { return cartRowHtml(id, cart[id]); }).join("");

    var clearRow = ids.length > 0
      ? '<form method="post" data-demo-cart="clear"><tr><td colspan="5" class="text-center py-5">' +
        '<button type="submit" name="clear_cart" value="1" class="btn btn-remove"> Clear cart </button>' +
        '</td></tr></form>'
      : '';
    tbody.innerHTML = rows + clearRow;

    var summary = document.querySelector(".cart-summary");
    if (summary) {
      var h4 = summary.querySelector("h4");
      if (h4) h4.innerHTML = 'Subtotal:<strong> $' + fmtMoney(Store.cartTotal()) + '</strong>';
    }

    // show/hide the special-request + checkout form and the "clear cart" form
    var orderNotes = document.querySelector(".order-notes");
    var checkoutForm = orderNotes ? orderNotes.closest("form") : null;
    if (checkoutForm) checkoutForm.style.display = ids.length > 0 ? "" : "none";
  }

  function currentPendingOrder() {
    var orderId = sessionStorage.getItem("sb_demo_last_order_id");
    var orders = Store.getOrders();
    return orders.filter(function (o) { return String(o.id) === orderId; })[0] || orders[0] || null;
  }

  // Fills in the page's own real order-summary markup (order number, line
  // items, total) with the order that was just placed, instead of the
  // frozen example order that was present at snapshot time.
  function renderPurchaseSummary() {
    var order = currentPendingOrder();
    if (!order) { window.location.href = "cart.html"; return; }

    var orderNumEl = document.querySelector(".order-box strong");
    if (orderNumEl) orderNumEl.textContent = "#" + order.id;

    var tbody = document.querySelector(".table tbody");
    if (tbody) {
      tbody.innerHTML = order.items.map(function (it) {
        return "<tr>\n  <td>" + esc(it.name) + "</td>\n  <td>" + it.qty + "</td>\n  <td>$" + fmtMoney(it.price) + "</td>\n</tr>";
      }).join("\n");
    }

    var tfootStrong = document.querySelector("tfoot strong");
    if (tfootStrong) tfootStrong.textContent = "$" + fmtMoney(order.total_amount);
    var summaryStrong = document.querySelector(".cart-summary h4 strong");
    if (summaryStrong) summaryStrong.textContent = "$" + fmtMoney(order.total_amount);
  }

  function handleQueryMessages() {
    var params = new URLSearchParams(window.location.search);
    var msg = null;
    if (params.get("success") === "1") msg = "Success!";
    if (params.get("error") === "missing_fields") msg = "Please fill in all required fields.";
    if (params.get("error") === "invalid_rating") msg = "Please choose a rating.";
    if (params.get("sent") === "1") msg = "If that email were a real account, a reset link would be sent. Demo only — no email was actually sent.";
    if (!msg) return;
    var el = document.getElementById("errorMsg");
    if (el) { el.textContent = msg; el.classList.remove("d-none"); return; }
    var banner = document.createElement("div");
    banner.className = "alert alert-info m-3 text-center";
    banner.textContent = msg;
    document.body.insertBefore(banner, document.body.firstChild);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var page = currentPage();
    renderCartBadge();
    renderWelcomeBar();
    renderReviewLoginPrompt();
    neutralizeGoogleButton();
    handleQueryMessages();
    wireDemoLoginButtons();

    if (page === "index.html") {
      var params = new URLSearchParams(window.location.search);
      renderMenuGrid();
    }
    if (page === "search-menu.html") {
      renderSearchResults();
    }
    if (page === "cart.html") {
      renderCartTable();
    }
    if (page === "purchase.html") {
      renderPurchaseSummary();
    }
    if (page === "review.html") {
      renderReviewsList();
    }
  });
})();
