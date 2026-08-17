document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("resetForm");
  var result = document.getElementById("resetResult");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("email").value;
    result.innerHTML = '<div class="alert alert-success">If ' + window.escHtml(email) + " were a real account, a reset link would be sent. Demo only — no email was actually sent.</div>";
    form.reset();
  });
});
