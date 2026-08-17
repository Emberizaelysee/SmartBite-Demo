(function () {
  "use strict";
  var KEY = "smartbite-demo-reviews";

  function getReviews() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* fall through to seed */ }
    saveReviews(window.SMARTBITE_SEED_REVIEWS);
    return window.SMARTBITE_SEED_REVIEWS.slice();
  }

  function saveReviews(reviews) {
    try { localStorage.setItem(KEY, JSON.stringify(reviews)); } catch (e) { /* noop */ }
  }

  function addReview(review) {
    var reviews = getReviews();
    var record = Object.assign({ id: Date.now(), date: new Date().toISOString().slice(0, 10) }, review);
    reviews.unshift(record);
    saveReviews(reviews);
    return record;
  }

  window.SmartBiteReviews = { getReviews: getReviews, addReview: addReview };
})();
