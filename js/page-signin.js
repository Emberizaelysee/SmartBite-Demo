document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("signinForm");
  var adminBtn = document.getElementById("adminSignIn");

  // Demo-only mock sign-in: the password field is intentionally never read.
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("email").value;
    window.SmartBiteSession.mockSignIn(email, false);
    window.location.href = "profile.html";
  });

  adminBtn.addEventListener("click", function () {
    window.SmartBiteSession.mockSignIn("admin@smartbite.demo", true);
    window.location.href = "dashboard.html";
  });
});
