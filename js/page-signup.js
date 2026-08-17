document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("signupForm");

  // Demo-only mock sign-up: the password field is intentionally never read.
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    window.SmartBiteSession.mockSignUp(name, email);
    window.location.href = "profile.html";
  });
});
