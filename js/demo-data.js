// Real menu data, copied verbatim from the SmartBite database seed —
// used only to drive the demo shim (js/demo-shim.js), never touched by
// the app's own real frontend scripts.
window.DEMO_MENU = [
  { id: 1, name: "ALFREDO PASTA", price: 5.00, img: "img/menu-img/alfredo pasta.webp", cat: 4 },
  { id: 2, name: "BOLOGNESE PASTA", price: 5.50, img: "img/menu-img/bolognese pasta.avif", cat: 4 },
  { id: 3, name: "CARBONARA PASTA", price: 5.00, img: "img/menu-img/carbonara pasta.webp", cat: 4 },
  { id: 4, name: "PESTO PASTA", price: 5.00, img: "img/menu-img/pesto pasta.avif", cat: 4 },
  { id: 5, name: "CHEESE BURGER", price: 5.20, img: "img/menu-img/cheese bur.jpg", cat: 2 },
  { id: 6, name: "CHICKEN BURGER", price: 5.50, img: "img/menu-img/chicken bur.webp", cat: 2 },
  { id: 7, name: "FISH BURGER", price: 5.50, img: "img/menu-img/fish bur.webp", cat: 2 },
  { id: 8, name: "BBQ BURGER", price: 5.70, img: "img/menu-img/BBQ bur.webp", cat: 2 },
  { id: 9, name: "MARGHERITA PIZZA", price: 5.00, img: "img/menu-img/margherita pizza.jpg", cat: 1 },
  { id: 10, name: "FOUR CHEESE PIZZA", price: 5.35, img: "img/menu-img/cheese pizza.jpg", cat: 1 },
  { id: 11, name: "HAWAIIN PIZZA", price: 5.75, img: "img/menu-img/hawaiin pizza.webp", cat: 1 },
  { id: 12, name: "VEGGIE PIZZA", price: 4.70, img: "img/menu-img/veggie pizza.jpeg", cat: 1 },
  { id: 13, name: "TUNA SALAD", price: 5.50, img: "img/menu-img/tunaa salad.jpg", cat: 5 },
  { id: 14, name: "CHICKEN CEASER SALAD", price: 5.80, img: "img/menu-img/chicken ceaser salad.jpg", cat: 5 },
  { id: 15, name: "GREEK SALAD", price: 5.15, img: "img/menu-img/greek salad.jpg", cat: 5 },
  { id: 16, name: "TACO SALAD", price: 5.55, img: "img/menu-img/taco salad.webp", cat: 5 },
  { id: 21, name: "STRAWBERRY SMOOTHIE", price: 3.50, img: "img/menu-img/strawberry smoothie.jpg", cat: 7 },
  { id: 22, name: "GREEN SMOOTHIE", price: 3.50, img: "img/menu-img/green smoothie.jpg", cat: 7 },
  { id: 23, name: "WATERMELON SMOOTHIE", price: 3.50, img: "img/menu-img/watermelon smoothie.jpg", cat: 7 },
  { id: 24, name: "SODA", price: 3.00, img: "img/menu-img/soda.jpg", cat: 7 },
  { id: 25, name: "SWISS ROLL", price: 4.50, img: "img/menu-img/swiss roll.avif", cat: 6 },
  { id: 26, name: "TIRAMISU", price: 4.45, img: "img/menu-img/tiramisu.jpg", cat: 6 },
  { id: 27, name: "CHOCOLATE CAKE", price: 5.00, img: "img/menu-img/chocolate cake.avif", cat: 6 },
  { id: 28, name: "CHOCOLATE ICE CREAM", price: 4.75, img: "img/menu-img/chocolate ice cream.jpg", cat: 6 }
];

window.DEMO_CATEGORIES = [
  { id: 1, name: "PIZZAS" },
  { id: 2, name: "BURGERS" },
  { id: 4, name: "PASTAS" },
  { id: 5, name: "SALADS" },
  { id: 6, name: "DESSERTS" },
  { id: 7, name: "DRINKS" }
];

window.DEMO_TABLES = [
  { id: 1, number: 1, capacity: 2, is_active: true },
  { id: 2, number: 2, capacity: 2, is_active: true },
  { id: 3, number: 3, capacity: 4, is_active: true },
  { id: 4, number: 4, capacity: 4, is_active: true },
  { id: 5, number: 5, capacity: 6, is_active: true },
  { id: 6, number: 6, capacity: 8, is_active: true },
  { id: 7, number: 7, capacity: 10, is_active: true }
];

// Seed users — demo-only mock accounts, not real credentials.
window.DEMO_SEED_USERS = [
  { id: 6, username: "Test User", email: "user@user.com", role: "user", created_at: "2026-06-06 10:43:05" },
  { id: 7, username: "Test admin", email: "admin@smartbite.com", role: "admin", created_at: "2026-06-06 10:46:16" }
];

window.DEMO_SEED_ORDERS = [
  { id: 1, user_id: 6, username: "Test User", total: "5.15", status: "Confirmed", date: "2026-06-06 10:43:27",
    items: [{ menu_item_id: 15, name: "GREEK SALAD", qty: 1, price: 5.15, image: "img/menu-img/greek salad.jpg" }] }
];

window.DEMO_SEED_RESERVATIONS = [
  { id: 6, user_id: 6, customer_name: "Test User", date: "2026-06-09", time: "17:30:00", guests: 2, table_id: 2, table_number: 2, special_notes: "", created_at: "2026-06-06 10:44:09" }
];

window.DEMO_SEED_REVIEWS = [
  { id: 3, user_id: 6, menu_id: 14, author_name: "Test User", rating: 4, content: "This is a Review", created_at: "2026-06-06 10:44:40", item_name: "CHICKEN CEASER SALAD", item_image: "img/menu-img/chicken ceaser salad.jpg" }
];
