window.SMARTBITE_MENU = [
  { id: 1, name: "Margherita Pizza", category: "pizzas", price: 5.00, img: "img/margherita-pizza.jpg", desc: "Tomato sauce, fresh mozzarella, basil, olive oil." },
  { id: 2, name: "Four Cheese Pizza", category: "pizzas", price: 5.35, img: "img/four-cheese-pizza.jpg", desc: "Mozzarella, parmesan, gorgonzola & cheddar." },
  { id: 3, name: "Hawaiian Pizza", category: "pizzas", price: 5.75, img: "img/hawaiian-pizza.webp", desc: "Smoked ham, pineapple, mozzarella." },
  { id: 4, name: "Veggie Pizza", category: "pizzas", price: 4.70, img: "img/veggie-pizza.jpeg", desc: "Peppers, mushrooms, onions, olives, corn." },

  { id: 5, name: "Cheese Burger", category: "burgers", price: 5.20, img: "img/cheese-burger.jpg", desc: "Beef patty, cheddar, lettuce, tomato, pickles." },
  { id: 6, name: "Chicken Burger", category: "burgers", price: 5.50, img: "img/chicken-burger.webp", desc: "Crispy chicken fillet, lettuce, garlic sauce." },
  { id: 7, name: "Fish Burger", category: "burgers", price: 5.50, img: "img/fish-burger.webp", desc: "Crispy fish fillet, tartar sauce, lettuce." },
  { id: 8, name: "BBQ Burger", category: "burgers", price: 5.70, img: "img/bbq-burger.webp", desc: "Beef, smoked cheese, bacon, BBQ sauce, onion rings." },

  { id: 9, name: "Alfredo Pasta", category: "pastas", price: 5.00, img: "img/alfredo-pasta.webp", desc: "Creamy parmesan sauce, garlic." },
  { id: 10, name: "Bolognese Pasta", category: "pastas", price: 5.50, img: "img/bolognese-pasta.avif", desc: "Slow-cooked beef & tomato ragu." },
  { id: 11, name: "Carbonara Pasta", category: "pastas", price: 5.00, img: "img/carbonara-pasta.webp", desc: "Egg, pecorino, bacon, black pepper." },
  { id: 12, name: "Pesto Pasta", category: "pastas", price: 5.00, img: "img/pesto-pasta.avif", desc: "Basil, pine nut & parmesan pesto." },

  { id: 13, name: "Tuna Salad", category: "salads", price: 5.50, img: "img/tuna-salad.jpg", desc: "Tuna, lettuce, celery, lemon, olive oil." },
  { id: 14, name: "Chicken Caesar Salad", category: "salads", price: 5.80, img: "img/chicken-caesar-salad.jpg", desc: "Grilled chicken, romaine, parmesan, croutons." },
  { id: 15, name: "Greek Salad", category: "salads", price: 5.15, img: "img/greek-salad.jpg", desc: "Tomato, cucumber, feta, olives, red onion." },
  { id: 16, name: "Taco Salad", category: "salads", price: 5.55, img: "img/taco-salad.webp", desc: "Seasoned beef, cheddar, corn, salsa, tortilla chips." },

  { id: 17, name: "Swiss Roll", category: "desserts", price: 4.50, img: "img/swiss-roll.avif", desc: "Soft sponge cake, vanilla cream." },
  { id: 18, name: "Tiramisu", category: "desserts", price: 4.45, img: "img/tiramisu.jpg", desc: "Espresso, mascarpone, cocoa." },
  { id: 19, name: "Chocolate Cake", category: "desserts", price: 5.00, img: "img/chocolate-cake.avif", desc: "Rich dark chocolate layers." },
  { id: 20, name: "Chocolate Ice Cream", category: "desserts", price: 4.75, img: "img/chocolate-ice-cream.jpg", desc: "Creamy chocolate ice cream scoop." },

  { id: 21, name: "Strawberry Smoothie", category: "drinks", price: 3.50, img: "img/strawberry-smoothie.jpg", desc: "Strawberry, banana, milk, honey." },
  { id: 22, name: "Green Smoothie", category: "drinks", price: 3.50, img: "img/green-smoothie.jpg", desc: "Spinach, green apple, banana, kiwi." },
  { id: 23, name: "Watermelon Smoothie", category: "drinks", price: 3.50, img: "img/watermelon-smoothie.jpg", desc: "Watermelon, mint, lemon." },
  { id: 24, name: "Soda", category: "drinks", price: 3.00, img: "img/soda.jpg", desc: "Classic fizzy soft drink." }
];

window.SMARTBITE_CATEGORIES = [
  { id: "pizzas", label: "Pizzas" },
  { id: "burgers", label: "Burgers" },
  { id: "pastas", label: "Pastas" },
  { id: "salads", label: "Salads" },
  { id: "desserts", label: "Desserts" },
  { id: "drinks", label: "Drinks" }
];

window.SMARTBITE_SEED_ORDERS = [
  { id: "SB-8K2P1Q", date: "2026-08-15T18:32:00Z", lines: [{ name: "Margherita Pizza", price: 5.00, qty: 2 }, { name: "Tiramisu", price: 4.45, qty: 1 }], total: 14.45, customer: "Rana H." },
  { id: "SB-3F9X7Z", date: "2026-08-16T12:05:00Z", lines: [{ name: "BBQ Burger", price: 5.70, qty: 1 }, { name: "Soda", price: 3.00, qty: 1 }], total: 8.70, customer: "Marc D." },
  { id: "SB-6T1H4L", date: "2026-08-16T19:47:00Z", lines: [{ name: "Chicken Caesar Salad", price: 5.80, qty: 1 }], total: 5.80, customer: "Sara B." }
];

window.SMARTBITE_SEED_REVIEWS = [
  { id: 1, menuId: 1, author: "Jad K.", rating: 5, text: "Best margherita I've had outside of Naples. Crust is perfect.", date: "2026-06-02" },
  { id: 2, menuId: 8, author: "Rana H.", rating: 4, text: "BBQ Burger is huge and the sauce is great, a bit messy to eat though.", date: "2026-06-10" },
  { id: 3, menuId: 18, author: "Marc D.", rating: 5, text: "Tiramisu tastes homemade. Will order again.", date: "2026-06-15" },
  { id: 4, menuId: 3, author: "Sara B.", rating: 4, text: "Good balance of sweet and savory, pineapple wasn't overpowering.", date: "2026-06-18" }
];
