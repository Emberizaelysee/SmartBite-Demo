(function () {
  "use strict";
  var CART_KEY = "smartbite-demo-cart";
  var ORDERS_KEY = "smartbite-demo-orders";
  var RESERVATIONS_KEY = "smartbite-demo-reservations";

  function findItem(id) {
    for (var i = 0; i < window.SMARTBITE_MENU.length; i++) {
      if (window.SMARTBITE_MENU[i].id === id) return window.SMARTBITE_MENU[i];
    }
    return null;
  }

  function getCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveCart(cart) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* noop */ }
  }

  function addToCart(id) {
    var cart = getCart();
    cart[id] = (cart[id] || 0) + 1;
    saveCart(cart);
    return cart;
  }

  function changeQty(id, delta) {
    var cart = getCart();
    var next = (cart[id] || 0) + delta;
    if (next <= 0) delete cart[id]; else cart[id] = next;
    saveCart(cart);
    return cart;
  }

  function clearCart() {
    saveCart({});
  }

  function cartCount() {
    var cart = getCart();
    var n = 0;
    for (var id in cart) n += cart[id];
    return n;
  }

  function cartLines() {
    var cart = getCart();
    var lines = [];
    for (var id in cart) {
      var item = findItem(Number(id));
      if (item) lines.push({ item: item, qty: cart[id] });
    }
    return lines;
  }

  function cartSubtotal() {
    return cartLines().reduce(function (sum, line) { return sum + line.item.price * line.qty; }, 0);
  }

  function getOrders() {
    try {
      var raw = localStorage.getItem(ORDERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function placeOrder() {
    var lines = cartLines();
    if (lines.length === 0) return null;
    var order = {
      id: "SB-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      date: new Date().toISOString(),
      lines: lines.map(function (l) { return { name: l.item.name, price: l.item.price, qty: l.qty }; }),
      total: cartSubtotal()
    };
    var orders = getOrders();
    orders.unshift(order);
    try { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders.slice(0, 20))); } catch (e) { /* noop */ }
    clearCart();
    return order;
  }

  function getReservations() {
    try {
      var raw = localStorage.getItem(RESERVATIONS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function addReservation(res) {
    var reservations = getReservations();
    var record = Object.assign({ id: "RES-" + Math.random().toString(36).slice(2, 8).toUpperCase() }, res);
    reservations.unshift(record);
    try { localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations.slice(0, 20))); } catch (e) { /* noop */ }
    return record;
  }

  window.SmartBiteCart = {
    findItem: findItem,
    getCart: getCart,
    addToCart: addToCart,
    changeQty: changeQty,
    clearCart: clearCart,
    cartCount: cartCount,
    cartLines: cartLines,
    cartSubtotal: cartSubtotal,
    getOrders: getOrders,
    placeOrder: placeOrder,
    getReservations: getReservations,
    addReservation: addReservation
  };
})();
