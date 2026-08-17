(function () {
  "use strict";
  var KEY = "smartbite-demo-session";
  var USERS_KEY = "smartbite-demo-users";

  function getSession() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setSession(session) {
    try {
      localStorage.setItem(KEY, JSON.stringify(session));
    } catch (e) { /* storage unavailable */ }
  }

  function clearSession() {
    try { localStorage.removeItem(KEY); } catch (e) { /* noop */ }
  }

  function getUsers() {
    try {
      var raw = localStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveUser(user) {
    var users = getUsers();
    users.push(user);
    try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch (e) { /* noop */ }
  }

  function nameFromEmail(email) {
    var local = String(email).split("@")[0] || "Guest";
    return local.charAt(0).toUpperCase() + local.slice(1);
  }

  // Demo-only mock auth: any email/password combination "signs in" successfully.
  // Nothing is validated against a real account and nothing is sent anywhere.
  function mockSignIn(email, asAdmin) {
    var session = {
      email: email || "guest@example.com",
      name: nameFromEmail(email || "guest"),
      role: asAdmin ? "admin" : "user",
      since: new Date().toISOString()
    };
    setSession(session);
    return session;
  }

  function mockSignUp(name, email) {
    var user = { name: name || nameFromEmail(email), email: email };
    saveUser(user);
    var session = { email: email, name: user.name, role: "user", since: new Date().toISOString() };
    setSession(session);
    return session;
  }

  window.SmartBiteSession = {
    getSession: getSession,
    setSession: setSession,
    clearSession: clearSession,
    mockSignIn: mockSignIn,
    mockSignUp: mockSignUp
  };
})();
