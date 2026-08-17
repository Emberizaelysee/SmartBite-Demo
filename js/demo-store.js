// Client-side mock of SmartBite's PHP session + MySQL backend.
// Everything here lives in localStorage only — no data ever leaves the browser.
(function () {
  "use strict";

  var KEYS = {
    session: "sb_demo_session",
    cart: "sb_demo_cart",
    orders: "sb_demo_orders",
    reservations: "sb_demo_reservations",
    reviews: "sb_demo_reviews",
    users: "sb_demo_users",
    nextOrderId: "sb_demo_next_order_id",
    nextReservationId: "sb_demo_next_reservation_id",
    nextReviewId: "sb_demo_next_review_id"
  };

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
  }

  function findMenuItem(id) {
    id = Number(id);
    for (var i = 0; i < window.DEMO_MENU.length; i++) {
      if (window.DEMO_MENU[i].id === id) return window.DEMO_MENU[i];
    }
    return null;
  }

  // ---------- session ----------
  function getSession() { return readJSON(KEYS.session, null); }
  function setSession(s) { writeJSON(KEYS.session, s); }
  function clearSession() { try { localStorage.removeItem(KEYS.session); } catch (e) {} }

  function nameFromEmail(email) {
    var local = String(email).split("@")[0] || "Guest";
    return local.charAt(0).toUpperCase() + local.slice(1);
  }

  // Demo-only mock auth: any password "works", nothing is a real account.
  function signIn(email, asAdmin) {
    var seed = window.DEMO_SEED_USERS.filter(function (u) { return u.email === email; })[0];
    var users = readJSON(KEYS.users, []);
    var custom = users.filter(function (u) { return u.email === email; })[0];
    var base = seed || custom;
    var session = {
      id: base ? base.id : Date.now(),
      username: base ? base.username : nameFromEmail(email),
      email: email,
      role: asAdmin ? "admin" : (base ? base.role : "user")
    };
    setSession(session);
    return session;
  }

  function signUp(username, email) {
    var users = readJSON(KEYS.users, []);
    var user = { id: 1000 + users.length, username: username || nameFromEmail(email), email: email, role: "user", created_at: new Date().toISOString() };
    users.push(user);
    writeJSON(KEYS.users, users);
    setSession({ id: user.id, username: user.username, email: user.email, role: "user" });
    return user;
  }

  // ---------- cart ----------
  function getCart() { return readJSON(KEYS.cart, {}); }
  function saveCart(cart) { writeJSON(KEYS.cart, cart); }

  function addToCart(itemId, quantity) {
    var cart = getCart();
    itemId = Number(itemId);
    quantity = Number(quantity) || 1;
    if (cart[itemId]) return { alreadyInCart: true, item: findMenuItem(itemId) };
    var item = findMenuItem(itemId);
    if (!item) return { alreadyInCart: false, item: null };
    cart[itemId] = { item_id: item.id, item_name: item.name, item_price: item.price, item_image: item.img, quantity: quantity };
    saveCart(cart);
    return { alreadyInCart: false, item: item };
  }

  function removeFromCart(itemId) {
    var cart = getCart();
    delete cart[Number(itemId)];
    saveCart(cart);
  }

  function updateCartQuantity(itemId, quantity) {
    var cart = getCart();
    itemId = Number(itemId);
    quantity = Math.max(1, Number(quantity) || 1);
    if (cart[itemId]) { cart[itemId].quantity = quantity; saveCart(cart); return true; }
    return false;
  }

  function clearCart() { saveCart({}); }

  function cartItemCount() {
    var cart = getCart(), n = 0;
    for (var id in cart) n += cart[id].quantity;
    return n;
  }

  function cartTotal() {
    var cart = getCart(), t = 0;
    for (var id in cart) t += cart[id].item_price * cart[id].quantity;
    return t;
  }

  // ---------- orders ----------
  function getOrders() { return readJSON(KEYS.orders, []); }

  function placeOrder(specialInstructions) {
    var cart = getCart();
    var ids = Object.keys(cart);
    if (ids.length === 0) return null;
    var session = getSession();
    var nextId = readJSON(KEYS.nextOrderId, 100);
    var order = {
      id: nextId,
      user_id: session ? session.id : 0,
      username: session ? session.username : "Guest",
      total_amount: cartTotal(),
      total: cartTotal().toFixed(2),
      status: "Pending",
      special_instructions: specialInstructions || null,
      order_date: new Date().toISOString().slice(0, 19).replace("T", " "),
      date: new Date().toISOString().slice(0, 19).replace("T", " "),
      items: ids.map(function (id) {
        var line = cart[id];
        return { menu_item_id: line.item_id, name: line.item_name, qty: line.quantity, price: line.item_price, image: line.item_image };
      })
    };
    var orders = getOrders();
    orders.unshift(order);
    writeJSON(KEYS.orders, orders);
    writeJSON(KEYS.nextOrderId, nextId + 1);
    clearCart();
    return order;
  }

  // ---------- reservations ----------
  function getReservations() { return readJSON(KEYS.reservations, []); }

  function addReservation(data) {
    var session = getSession();
    var nextId = readJSON(KEYS.nextReservationId, 100);
    var table = window.DEMO_TABLES.filter(function (t) { return t.capacity >= data.guests; })[0] || window.DEMO_TABLES[0];
    var reservation = {
      id: nextId,
      user_id: session ? session.id : 0,
      customer_name: session ? session.username : "Guest",
      date: data.date,
      time: data.time,
      guests: data.guests,
      table_id: table.id,
      table_number: table.number,
      special_notes: data.requests || "",
      created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      can_modify: true
    };
    var reservations = getReservations();
    reservations.unshift(reservation);
    writeJSON(KEYS.reservations, reservations);
    writeJSON(KEYS.nextReservationId, nextId + 1);
    return reservation;
  }

  // ---------- reviews ----------
  function getReviews() { return readJSON(KEYS.reviews, []); }

  function addReview(menuId, rating, text) {
    var session = getSession();
    var item = findMenuItem(menuId);
    var nextId = readJSON(KEYS.nextReviewId, 100);
    var review = {
      id: nextId,
      user_id: session ? session.id : 0,
      menu_id: Number(menuId),
      author_name: session ? session.username : "Guest",
      rating: Number(rating),
      content: text,
      created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      item_name: item ? item.name : "",
      item_image: item ? item.img : ""
    };
    var reviews = getReviews();
    reviews.unshift(review);
    writeJSON(KEYS.reviews, reviews);
    writeJSON(KEYS.nextReviewId, nextId + 1);
    return review;
  }

  window.SmartBiteStore = {
    findMenuItem: findMenuItem,
    getSession: getSession, setSession: setSession, clearSession: clearSession, signIn: signIn, signUp: signUp,
    getCart: getCart, addToCart: addToCart, removeFromCart: removeFromCart, updateCartQuantity: updateCartQuantity,
    clearCart: clearCart, cartItemCount: cartItemCount, cartTotal: cartTotal,
    getOrders: getOrders, placeOrder: placeOrder,
    getReservations: getReservations, addReservation: addReservation,
    getReviews: getReviews, addReview: addReview
  };
})();
