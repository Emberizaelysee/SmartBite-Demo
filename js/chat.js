(function () {
  "use strict";

  var QUICK_REPLIES = ["Recommend a pizza", "Vegetarian options", "Something sweet", "Cheapest items"];

  function itemsByCategory(cat) {
    return window.SMARTBITE_MENU.filter(function (i) { return i.category === cat; });
  }
  function nameList(items, limit) {
    return items.slice(0, limit || items.length).map(function (i) { return i.name; }).join(", ");
  }
  function cheapestItems(n) {
    return window.SMARTBITE_MENU.slice().sort(function (a, b) { return a.price - b.price; }).slice(0, n);
  }
  function formatPrice(n) { return "$" + n.toFixed(2); }

  function botReply(rawText) {
    var text = rawText.toLowerCase();
    if (/pizza/.test(text)) return "Our pizzas: " + nameList(itemsByCategory("pizzas")) + ". The Margherita is the crowd favorite.";
    if (/burger/.test(text)) return "Our burgers: " + nameList(itemsByCategory("burgers")) + ". The BBQ Burger is our richest option.";
    if (/pasta/.test(text)) return "Our pastas: " + nameList(itemsByCategory("pastas")) + ". Carbonara and Alfredo are both creamy favorites.";
    if (/salad|healthy|light/.test(text)) return "Our salads: " + nameList(itemsByCategory("salads")) + ". The Greek Salad is a lighter, fresher pick.";
    if (/sweet|dessert/.test(text)) return "For dessert: " + nameList(itemsByCategory("desserts")) + ". Tiramisu is the most popular.";
    if (/drink|smoothie|thirsty/.test(text)) return "To drink: " + nameList(itemsByCategory("drinks")) + ".";
    if (/veg(etarian)?|vegan/.test(text)) return "Good vegetarian picks: Veggie Pizza, Pesto Pasta, and Greek Salad.";
    if (/cheap|budget|price|cost/.test(text)) {
      var cheap = cheapestItems(3);
      return "Our best-value picks: " + cheap.map(function (i) { return i.name + " (" + formatPrice(i.price) + ")"; }).join(", ") + ".";
    }
    if (/reservation|book|table/.test(text)) return "You can book a table on the Reservations page — pick a date, time, and party size.";
    if (/hi|hello|hey/.test(text)) return "Hi! Ask me about pizzas, burgers, pastas, salads, desserts, drinks, vegetarian options, or reservations.";
    return "I'm a demo assistant with canned answers — try asking about pizzas, vegetarian options, dessert, or reservations.";
  }

  function appendMessage(log, text, who) {
    var msg = document.createElement("div");
    msg.className = "sb-msg sb-msg--" + who;
    msg.textContent = text;
    log.appendChild(msg);
    log.scrollTop = log.scrollHeight;
  }

  function init() {
    var chatToggle = document.getElementById("chatToggle");
    var chatClose = document.getElementById("chatClose");
    var chatPanel = document.getElementById("chatPanel");
    var chatLog = document.getElementById("chatLog");
    var chatQuick = document.getElementById("chatQuick");
    var chatForm = document.getElementById("chatForm");
    var chatInput = document.getElementById("chatInput");
    if (!chatToggle || !chatPanel) return;

    QUICK_REPLIES.forEach(function (label) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "sb-chip";
      chip.textContent = label;
      chip.addEventListener("click", function () {
        appendMessage(chatLog, label, "user");
        appendMessage(chatLog, botReply(label), "bot");
      });
      chatQuick.appendChild(chip);
    });

    function openChat() {
      chatPanel.hidden = false;
      chatToggle.setAttribute("aria-expanded", "true");
      if (!chatLog.dataset.greeted) {
        appendMessage(chatLog, "Hi! I'm the SmartBite menu assistant (demo — canned answers, not a real AI call). Ask me what to order.", "bot");
        chatLog.dataset.greeted = "1";
      }
    }
    function closeChat() {
      chatPanel.hidden = true;
      chatToggle.setAttribute("aria-expanded", "false");
    }

    chatToggle.addEventListener("click", function () { if (chatPanel.hidden) openChat(); else closeChat(); });
    chatClose.addEventListener("click", closeChat);
    chatForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var text = chatInput.value.trim();
      if (!text) return;
      appendMessage(chatLog, text, "user");
      appendMessage(chatLog, botReply(text), "bot");
      chatInput.value = "";
    });
  }

  window.SmartBiteChat = { init: init };
})();
