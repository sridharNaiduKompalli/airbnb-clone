import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Pre-populated mock listing data for zero-config fallback (~50 listings)
const mockListings = [
  // â”€â”€â”€ CABINS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 1,
    title: "A-Frame Forest Cabin",
    description: "Nestled deep in the pine woods, this cozy A-frame cabin offers the perfect off-grid escape with modern amenities including a wood-fired hot tub, outdoor fire pit, and floor-to-ceiling windows for stargazing.",
    price: 150,
    location: "Cascade Mountains, Washington",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600"],
    rating: 4.92, reviews_count: 124, type: "cabins",
    host_name: "Sarah & Mark", host_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    amenities: ["Hot Tub", "Fire Pit", "Wifi", "Kitchen", "Mountain View"]
  },
  {
    id: 7,
    title: "Riverfront Glass A-Frame",
    description: "Perched right above the running river, this modern glass A-frame boasts wrapping decks, modern kitchen, fireplace, and hot tub. Listen to the gentle rapids as you fall asleep.",
    price: 180,
    location: "Blue Ridge, Georgia",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600"],
    rating: 4.95, reviews_count: 98, type: "cabins",
    host_name: "Deborah", host_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    amenities: ["River View", "Hot Tub", "Fire Pit", "Wifi", "Coffee Bar"]
  },
  {
    id: 13,
    title: "Smoky Mountain Log Cabin",
    description: "Classic hewn-log construction with a covered porch, rocking chairs, and panoramic smoky mountain ridge views. Ideal for hiking enthusiasts and families.",
    price: 120,
    location: "Great Smoky Mountains, Tennessee",
    image: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600"],
    rating: 4.78, reviews_count: 201, type: "cabins",
    host_name: "Bobby Ray", host_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Covered Porch", "Fireplace", "BBQ", "Wifi", "Hiking Trails"]
  },
  {
    id: 14,
    title: "Black Forest Tiny Cabin",
    description: "A minimalist retreat surrounded by black fir trees in Germany's Black Forest. Eco-designed with a composting toilet, solar panels, and a wood-fired stove.",
    price: 95,
    location: "Black Forest, Germany",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=600"],
    rating: 4.83, reviews_count: 76, type: "cabins",
    host_name: "Hans", host_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Wood Stove", "Solar Power", "Eco-friendly", "Wifi", "Forest View"]
  },
  {
    id: 15,
    title: "Lakeside Pioneer Cabin",
    description: "Spend a week in rustic simplicity beside a glassy Adirondack lake. Canoe from the dock, fish from shore, or simply watch the loons in the morning mist.",
    price: 135,
    location: "Adirondacks, New York",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600"],
    rating: 4.74, reviews_count: 143, type: "cabins",
    host_name: "Margaret", host_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    amenities: ["Canoe", "Fishing", "Private Dock", "Fireplace", "Wifi"]
  },

  // â”€â”€â”€ BEACHFRONT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 2,
    title: "Minimalist Beachfront Villa",
    description: "Wake up to the sound of waves. This stunning modernist villa features private beach access, infinity pool, open-concept living, and breathtaking panoramic ocean views from every room.",
    price: 320,
    location: "Malibu, California",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1473116763269-255ea76e7acb?auto=format&fit=crop&q=80&w=600"],
    rating: 4.88, reviews_count: 85, type: "beachfront",
    host_name: "Elena", host_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    amenities: ["Infinity Pool", "Beach Access", "AC", "Gym", "Ocean View"]
  },
  {
    id: 8,
    title: "Ocean-Side Modernist Studio",
    description: "A gorgeous oceanfront studio suite just steps from the sand. Relax on your private balcony, take in sunset views, or splash in the shared beachfront pool.",
    price: 210,
    location: "Miami Beach, Florida",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1473116763269-255ea76e7acb?auto=format&fit=crop&q=80&w=600"],
    rating: 4.81, reviews_count: 54, type: "beachfront",
    host_name: "Carlos", host_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    amenities: ["Beach View", "Balcony", "AC", "Wifi", "Pool Access"]
  },
  {
    id: 16,
    title: "Clifftop Aegean Retreat",
    description: "Perched on a white-washed cliff above the Aegean Sea. Classic Cycladic architecture, private plunge pool, and breathtaking views of the caldera sunset.",
    price: 380,
    location: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1473116763269-255ea76e7acb?auto=format&fit=crop&q=80&w=600"],
    rating: 4.97, reviews_count: 312, type: "beachfront",
    host_name: "Nikos", host_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Plunge Pool", "Caldera View", "Breakfast", "Wifi", "Terrace"]
  },
  {
    id: 17,
    title: "Tulum Jungle Beach Bungalow",
    description: "Steps from the turquoise Caribbean, surrounded by jungle. An open-sided palapa bungalow with a queen hammock, outdoor shower, and direct beach access.",
    price: 175,
    location: "Tulum, Mexico",
    image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1473116763269-255ea76e7acb?auto=format&fit=crop&q=80&w=600"],
    rating: 4.89, reviews_count: 188, type: "beachfront",
    host_name: "Isabella", host_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    amenities: ["Beach Access", "Outdoor Shower", "Hammock", "Jungle Views", "Eco-friendly"]
  },
  {
    id: 18,
    title: "Amalfi Coast Sea Cave Villa",
    description: "Dramatically carved into the limestone cliffs, this unique villa has a private sea cave pool, terraced lemon gardens, and sweeping views of the Amalfi Coast.",
    price: 450,
    location: "Amalfi Coast, Italy",
    image: "https://images.unsplash.com/photo-1473116763269-255ea76e7acb?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1473116763269-255ea76e7acb?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=600"],
    rating: 4.99, reviews_count: 67, type: "beachfront",
    host_name: "Francesca", host_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    amenities: ["Sea Cave Pool", "Lemon Garden", "Chef Service", "Wifi", "Coast Views"]
  },

  // â”€â”€â”€ TREEHOUSES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 3,
    title: "Redwood Treehouse Canopy",
    description: "Suspended 30 feet above the forest floor, this luxury treehouse is connected by suspension bridges. Experience the redwood canopy in style with a hot tub, wrap-around deck, and outdoor shower.",
    price: 240,
    location: "Santa Cruz, California",
    image: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600"],
    rating: 4.97, reviews_count: 210, type: "treehouses",
    host_name: "Dustin", host_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    amenities: ["Suspension Bridge", "Hot Tub", "Espresso Machine", "Wifi", "Forest View"]
  },
  {
    id: 9,
    title: "Bamboo Forest Eco Treehouse",
    description: "An eco-friendly bamboo villa hanging high in the canopy of a tropical forest. It features an open-air plunge tub, hammock nets, and organic breakfast served daily.",
    price: 130,
    location: "Ubud, Bali",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600"],
    rating: 4.94, reviews_count: 320, type: "treehouses",
    host_name: "Ketut", host_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Outdoor Bath", "Hammock", "Breakfast Included", "Forest Views", "Eco-friendly"]
  },
  {
    id: 19,
    title: "Cloud Forest Canopy Suite",
    description: "Elevated 50 feet in Costa Rica's misty cloud forest. Wake to howler monkeys and toucans. Features a glass-floor observation deck and zip-line from your doorstep.",
    price: 265,
    location: "Monteverde, Costa Rica",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600"],
    rating: 4.91, reviews_count: 155, type: "treehouses",
    host_name: "Diego", host_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    amenities: ["Glass Floor Deck", "Zip-line", "Wildlife Guides", "Breakfast", "Cloud View"]
  },
  {
    id: 20,
    title: "Pacific Northwest Canopy Nest",
    description: "Nestled 40 feet up in old-growth Douglas firs, this hexagonal nest treehouse has a stargazing skylight, wood-burning stove, and a rope ladder entrance.",
    price: 195,
    location: "Olympic Peninsula, Washington",
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600"],
    rating: 4.86, reviews_count: 89, type: "treehouses",
    host_name: "Owen", host_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Skylight", "Wood Stove", "Rope Ladder", "Wifi", "Forest Trails"]
  },

  // â”€â”€â”€ DESERT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 4,
    title: "Desert Dome Oasis",
    description: "A geodesic dome situated on 5 acres of private desert. Experience surreal sunsets and stargazing. Includes heated plunge pool, stargazing deck, and modern bohemian interior design.",
    price: 180,
    location: "Joshua Tree, California",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1472214222541-d510753a4707?auto=format&fit=crop&q=80&w=600"],
    rating: 4.75, reviews_count: 94, type: "desert",
    host_name: "Ronnie", host_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Plunge Pool", "Boho Decor", "AC", "Fire Pit", "Stargazing Deck"]
  },
  {
    id: 10,
    title: "Stargazing Desert Container Home",
    description: "Experience the remote beauty of the red rocks. This custom-built shipping container home includes an expansive rooftop deck designed specifically for night-sky viewing.",
    price: 195,
    location: "Moab, Utah",
    image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1472214222541-d510753a4707?auto=format&fit=crop&q=80&w=600"],
    rating: 4.87, reviews_count: 72, type: "desert",
    host_name: "Wyatt", host_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Stargazing Deck", "AC", "Fire Pit", "Wifi", "Kitchen"]
  },
  {
    id: 21,
    title: "Sahara Desert Nomad Tent Camp",
    description: "Sleep under a billion stars in a luxury Berber tent on the edge of the Sahara. Camel treks at sunrise, fire storytelling at night, and traditional tagine meals.",
    price: 220,
    location: "Merzouga, Morocco",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1472214222541-d510753a4707?auto=format&fit=crop&q=80&w=600"],
    rating: 4.93, reviews_count: 245, type: "desert",
    host_name: "Youssef", host_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Camel Trek", "Traditional Meals", "Stargazing", "Cultural Experience", "Desert Views"]
  },
  {
    id: 22,
    title: "Wadi Rum Martian Bubble",
    description: "A transparent bubble dome on the red sands of Wadi Rum. Watch shooting stars through the bubble roof while sleeping. Includes Jeep safari and traditional Bedouin dinner.",
    price: 310,
    location: "Wadi Rum, Jordan",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1472214222541-d510753a4707?auto=format&fit=crop&q=80&w=600"],
    rating: 4.98, reviews_count: 133, type: "desert",
    host_name: "Ahmad", host_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Transparent Bubble", "Jeep Safari", "Bedouin Dinner", "Stargazing", "Red Desert Views"]
  },

  // â”€â”€â”€ HISTORIC â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 5,
    title: "Historic Italian Countryside Stone House",
    description: "Enjoy Italian living in this beautifully restored 16th-century stone house nestled among olive groves. Experience private olive oil tastings and relax under the pergola.",
    price: 110,
    location: "Tuscany, Italy",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?auto=format&fit=crop&q=80&w=600"],
    rating: 4.91, reviews_count: 142, type: "historic",
    host_name: "Giovanni", host_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Olive Grove", "Pergola", "Kitchen", "Fireplace", "Vineyard View"]
  },
  {
    id: 11,
    title: "18th-Century Chateau Royal Suite",
    description: "Live like French royalty. This grand suite features soaring ceilings, antiques, a private library, and access to 10 acres of immaculate manor gardens.",
    price: 280,
    location: "Loire Valley, France",
    image: "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?auto=format&fit=crop&q=80&w=600"],
    rating: 4.96, reviews_count: 110, type: "historic",
    host_name: "Jean-Pierre", host_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Manor Gardens", "Breakfast Served", "Fireplace", "Library Access", "Wifi"]
  },
  {
    id: 23,
    title: "Ottoman Pasha Mansion",
    description: "A faithfully restored 19th-century Ottoman pasha's mansion in Istanbul's old quarter. Hammam on-site, original tilework, and a rooftop terrace with Bosphorus views.",
    price: 190,
    location: "Istanbul, Turkey",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?auto=format&fit=crop&q=80&w=600"],
    rating: 4.84, reviews_count: 98, type: "historic",
    host_name: "TarÄ±k", host_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Hammam", "Rooftop Terrace", "Bosphorus View", "Antique Decor", "Wifi"]
  },
  {
    id: 24,
    title: "Scottish Highland Castle Room",
    description: "Stay in an actual 14th-century castle on a Scottish loch. Each room is uniquely decorated with tartan, armour, and Highland antiques. Whisky tasting included.",
    price: 250,
    location: "Scottish Highlands, Scotland",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?auto=format&fit=crop&q=80&w=600"],
    rating: 4.90, reviews_count: 76, type: "historic",
    host_name: "Angus", host_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Whisky Tasting", "Loch View", "4-poster Beds", "Armor Decor", "Highland Tours"]
  },

  // â”€â”€â”€ LAKE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 6,
    title: "Modern Glass Lakehouse",
    description: "Stunning floor-to-ceiling glass walls look out over a peaceful lake. Features private dock, kayaks, paddleboards, and a modern sauna for ultimate relaxation.",
    price: 260,
    location: "Lake Placid, New York",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=600"],
    rating: 4.85, reviews_count: 67, type: "lake",
    host_name: "Amanda", host_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    amenities: ["Private Dock", "Sauna", "Kayaks", "Wifi", "Lake View"]
  },
  {
    id: 12,
    title: "Cozy Lakefront Cedar Cabin",
    description: "Walk out directly to your private sandy beach on the lake. Enjoy lakeside views, a wood-fired sauna, kayaks, and a wrap-around cedar deck with a grill.",
    price: 290,
    location: "Lake Tahoe, California",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=600"],
    rating: 4.89, reviews_count: 180, type: "lake",
    host_name: "Laura", host_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    amenities: ["Private Beach", "Sauna", "Kayaks", "Deck Grill", "Wifi"]
  },
  {
    id: 25,
    title: "Floating Houseboat on Dal Lake",
    description: "A hand-carved traditional wooden houseboat on the famous Dal Lake. Your shikara boat brings fresh flowers and meals every morning. Included with sunrise kayak.",
    price: 115,
    location: "Srinagar, Kashmir",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=600"],
    rating: 4.86, reviews_count: 290, type: "lake",
    host_name: "Bashir", host_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Shikara Boat", "Breakfast Delivered", "Lake View", "Kayak", "Carved Interior"]
  },
  {
    id: 26,
    title: "Norwegian Fjord Boathouse",
    description: "A weathered red boathouse right on the edge of a dramatic fjord. Traditional wood interiors, a sauna heated by a cast iron stove, and kayaking directly from the door.",
    price: 200,
    location: "Hardangerfjord, Norway",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=600"],
    rating: 4.93, reviews_count: 119, type: "lake",
    host_name: "Ingrid", host_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    amenities: ["Fjord View", "Sauna", "Kayak", "Nordic Breakfast", "Fishing"]
  },

  // â”€â”€â”€ MOUNTAIN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 27,
    title: "Alpine Dolomite Chalet",
    description: "A picture-perfect Alpine chalet nestled in the Dolomites. Stone walls, a grand fireplace, and a sundeck from which you can ski directly onto groomed trails.",
    price: 340,
    location: "Val Gardena, Italy",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=600"],
    rating: 4.95, reviews_count: 178, type: "mountain",
    host_name: "Klaus", host_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Ski-in Ski-out", "Stone Fireplace", "Sundeck", "Mountain View", "Sauna"]
  },
  {
    id: 28,
    title: "Himalayan Eco Lodge",
    description: "A sustainably built lodge at 2800m with sweeping views of the Annapurna range. Includes yoga sessions, ayurvedic meals, and guided sunrise treks.",
    price: 105,
    location: "Pokhara, Nepal",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=600"],
    rating: 4.92, reviews_count: 204, type: "mountain",
    host_name: "Priya", host_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    amenities: ["Mountain View", "Yoga Classes", "Ayurvedic Meals", "Trekking Guide", "Eco-friendly"]
  },
  {
    id: 29,
    title: "Andean Cloud Hacienda",
    description: "A colonial hacienda at 3500m in the Ecuadorian Andes. Llamas roam the grounds, condors soar overhead, and evenings are spent around a log fire with mate.",
    price: 145,
    location: "Cotopaxi Province, Ecuador",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=600"],
    rating: 4.88, reviews_count: 91, type: "mountain",
    host_name: "MarÃ­a JosÃ©", host_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    amenities: ["Horse Riding", "Log Fire", "Colonial Architecture", "Llama Farm", "Volcano Views"]
  },
  {
    id: 30,
    title: "Swiss Alps Glass Cabin",
    description: "A cube of glass and timber perched on a mountain pass in the Swiss Alps. 360Â° panoramic views of snow-capped peaks, helicopter access only. Pure solitude.",
    price: 520,
    location: "GraubÃ¼nden, Switzerland",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=600"],
    rating: 5.0, reviews_count: 38, type: "mountain",
    host_name: "Lukas", host_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    amenities: ["360Â° Views", "Helicopter Access", "Heated Glass Floor", "Gourmet Kitchen", "Total Solitude"]
  },
  {
    id: 31,
    title: "Appalachian Summit Yurt",
    description: "A cozy Mongolian-style yurt on the ridgeline of the Appalachians. Wood stove, colorful wool rugs, and a star-watching skylight window above the king bed.",
    price: 140,
    location: "Asheville, North Carolina",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600"],
    rating: 4.80, reviews_count: 113, type: "mountain",
    host_name: "Rachel", host_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    amenities: ["Skylight", "Wood Stove", "Wool Rugs", "Hiking Trails", "Ridge Views"]
  },

  // â”€â”€â”€ TROPICAL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 32,
    title: "Kauai Jungle Hideaway Villa",
    description: "A lush private villa hidden in Kauai's Na Pali jungle. Plunge pool among tropical flowers, open-air living room, and hammocks strung between palm trees.",
    price: 415,
    location: "Kauai, Hawaii",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600"],
    rating: 4.94, reviews_count: 202, type: "tropical",
    host_name: "Leilani", host_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    amenities: ["Plunge Pool", "Open-air Living", "Hammocks", "Tropical Garden", "Private"]
  },
  {
    id: 33,
    title: "Maldives Overwater Bungalow",
    description: "Your own overwater bungalow above a turquoise lagoon. Glass floor panels reveal tropical fish below. Private deck ladder leads directly into the warm Indian Ocean.",
    price: 680,
    location: "Baa Atoll, Maldives",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600"],
    rating: 4.99, reviews_count: 441, type: "tropical",
    host_name: "Amina", host_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    amenities: ["Glass Floor", "Direct Ocean Access", "Snorkelling", "Breakfast Included", "Sunset Deck"]
  },
  {
    id: 34,
    title: "Bali Rice Terrace Villa",
    description: "A traditional Balinese villa on the edge of the iconic Tegalalang rice terraces. Infinity pool, daily temple ceremonies, and an included cooking class.",
    price: 200,
    location: "Ubud, Bali",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600"],
    rating: 4.91, reviews_count: 335, type: "tropical",
    host_name: "Made", host_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    amenities: ["Infinity Pool", "Rice Terrace View", "Cooking Class", "Temple Ceremony", "Spa"]
  },
  {
    id: 35,
    title: "Seychelles Granite Cove Villa",
    description: "Tucked between dramatic pink granite boulders on MahÃ©'s hidden cove. Your private beach, coral reef snorkelling, and a chef who cooks fresh catches daily.",
    price: 550,
    location: "MahÃ©, Seychelles",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600"],
    rating: 4.97, reviews_count: 88, type: "tropical",
    host_name: "Claude", host_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Private Beach", "Chef", "Snorkelling", "Granite Boulders", "Cove View"]
  },
  {
    id: 36,
    title: "Langkawi Rainforest Villa",
    description: "Hidden in Langkawi's ancient rainforest, a luxury villa with a private infinity pool overlooking the Andaman Sea. Spot hornbills and monitor lizards from your deck.",
    price: 285,
    location: "Langkawi, Malaysia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600"],
    rating: 4.89, reviews_count: 148, type: "tropical",
    host_name: "Amirah", host_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    amenities: ["Infinity Pool", "Rainforest Walk", "Sea View", "Wildlife Spotting", "Breakfast"]
  },

  // â”€â”€â”€ ARCTIC â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 37,
    title: "Aurora Glass Igloo",
    description: "A thermally insulated glass igloo deep in Finland's Arctic wilderness. Watch the Northern Lights dance above while staying warm in your king bed. Reindeer sleigh included.",
    price: 490,
    location: "SaariselkÃ¤, Finland",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600"],
    rating: 4.98, reviews_count: 367, type: "arctic",
    host_name: "Erika", host_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    amenities: ["Northern Lights View", "Glass Roof", "Reindeer Sleigh", "Sauna", "Arctic Wilderness"]
  },
  {
    id: 38,
    title: "Icelandic Lava Field Cabin",
    description: "A dramatic black volcanic stone cabin on Iceland's Reykjanes Peninsula. Five minutes from a natural geothermal hot pot. Witness the aurora and midnight sun.",
    price: 270,
    location: "Reykjanes, Iceland",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600"],
    rating: 4.90, reviews_count: 151, type: "arctic",
    host_name: "BjÃ¶rn", host_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Geothermal Hot Pot", "Aurora Viewing", "Lava Field Walk", "Wifi", "Midnight Sun"]
  },
  {
    id: 39,
    title: "Svalbard Arctic Base Camp",
    description: "An expedition-grade insulated cabin at 78Â°N in Norway's Svalbard archipelago. Polar bear sightings, snowmobile safaris, and the only darkness you'll feel is the void of space.",
    price: 360,
    location: "Longyearbyen, Svalbard",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600"],
    rating: 4.85, reviews_count: 42, type: "arctic",
    host_name: "Lars", host_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Polar Bear Guide", "Snowmobile Safari", "Arctic Kit Provided", "Warm Meals", "Midnight Sun"]
  },
  {
    id: 40,
    title: "Yukon Wilderness Log Retreat",
    description: "Deep in Canada's Yukon, this remote log lodge sits on a frozen lake 6 months of the year. Dog sledding, ice fishing, and aurora hunting from the sauna deck.",
    price: 295,
    location: "Whitehorse, Yukon, Canada",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600"],
    rating: 4.88, reviews_count: 79, type: "arctic",
    host_name: "Mackenzie", host_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    amenities: ["Dog Sledding", "Ice Fishing", "Aurora Deck", "Sauna", "Wilderness"]
  },

  // â”€â”€â”€ GLAMPING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 41,
    title: "Safari Glamping Tent, Masai Mara",
    description: "A luxury canvas tent in the Masai Mara. Wake to lions roaring outside. Your private butler brings breakfast as giraffes pass by the viewing deck.",
    price: 420,
    location: "Masai Mara, Kenya",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600"],
    rating: 4.97, reviews_count: 287, type: "glamping",
    host_name: "Zawadi", host_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    amenities: ["Safari Drives", "Butler Service", "Wildlife Views", "Gourmet Meals", "Private Bath"]
  },
  {
    id: 42,
    title: "Vineyard Glamping Pod",
    description: "An egg-shaped glamping pod perched between vine rows in Napa Valley. Wake to sunrise over rolling vines, with included wine tasting at the estate cellar.",
    price: 230,
    location: "Napa Valley, California",
    image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600"],
    rating: 4.90, reviews_count: 194, type: "glamping",
    host_name: "Sophia", host_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    amenities: ["Wine Tasting", "Vineyard View", "Gourmet Breakfast", "Heated Floors", "Outdoor Shower"]
  },
  {
    id: 43,
    title: "Okavango Delta Floating Camp",
    description: "A mobile floating camp on the Okavango Delta's private channels. Mokoro canoe through papyrus beds, spot hippos at dinner, and sleep under mosquito-net canopies.",
    price: 395,
    location: "Okavango Delta, Botswana",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600"],
    rating: 4.96, reviews_count: 113, type: "glamping",
    host_name: "Tebogo", host_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    amenities: ["Mokoro Canoe", "Hippo Spotting", "All-inclusive", "Delta Views", "Bush Walks"]
  },
  {
    id: 44,
    title: "Patagonian Dome at the End of the World",
    description: "A transparent dome on a cliff above Torres del Paine. Watch pumas, guanacos, and condors from your panoramic bed. Wind howls outside, warmth glows within.",
    price: 460,
    location: "Torres del Paine, Chile",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600"],
    rating: 4.98, reviews_count: 66, type: "glamping",
    host_name: "Valentina", host_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    amenities: ["Panoramic Dome", "Puma Tracking", "Gourmet Meals", "Trekking", "Towers View"]
  },
  {
    id: 45,
    title: "ProvenÃ§al Lavender Field Glamping",
    description: "A bell tent in the middle of a sea of ProvenÃ§al lavender. Vintage decor, a wood-fired bathtub, and a daily hamper of artisanal local produce.",
    price: 185,
    location: "Valensole, Provence, France",
    image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600"],
    rating: 4.87, reviews_count: 222, type: "glamping",
    host_name: "Camille", host_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    amenities: ["Lavender Views", "Wood Bath", "Local Hamper", "Vintage Decor", "Cycling"]
  },

  // â”€â”€â”€ EXTRA BEACHFRONT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 46,
    title: "Phuket Cliffside Infinity Pool Villa",
    description: "A secluded villa perched on Phuket's west cliffs. Infinity pool seemingly merges with the Andaman Sea, while private beach stairs lead to crystal waters below.",
    price: 375,
    location: "Kamala, Phuket, Thailand",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600"],
    rating: 4.92, reviews_count: 168, type: "beachfront",
    host_name: "Nong", host_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    amenities: ["Infinity Pool", "Private Beach Stairs", "Sea View", "Chef", "4-wheel Golf Cart"]
  },
  {
    id: 47,
    title: "Cape Cod Saltbox Cottage",
    description: "A classic Cape Cod saltbox cottage steps from a private stretch of Atlantic beach. Whitewashed shingles, a blue-painted porch, and morning lobster rolls included.",
    price: 195,
    location: "Wellfleet, Cape Cod, Massachusetts",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1473116763269-255ea76e7acb?auto=format&fit=crop&q=80&w=600"],
    rating: 4.83, reviews_count: 230, type: "beachfront",
    host_name: "Martha", host_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    amenities: ["Private Beach", "Lobster Rolls", "Blue Porch", "Bikes", "Wifi"]
  },
  {
    id: 48,
    title: "Gold Coast Surf House",
    description: "A sun-soaked surf house with direct access to Burleigh Heads beach break. Surfboards, wetsuits, and a daily surf lesson from your hostâ€”a 12-year WCT veteran.",
    price: 215,
    location: "Gold Coast, Australia",
    image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1473116763269-255ea76e7acb?auto=format&fit=crop&q=80&w=600"],
    rating: 4.86, reviews_count: 174, type: "beachfront",
    host_name: "Blake", host_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    amenities: ["Surfboards", "Wetsuits", "Surf Lesson", "Beach Access", "Outdoor Shower"]
  },
  {
    id: 49,
    title: "Algarve Sea Stack Suite",
    description: "A boutique suite carved into the golden limestone cliffs of the Algarve. Sea stacks frame your private terrace. Included: guided kayak tour through the sea caves.",
    price: 240,
    location: "Lagos, Algarve, Portugal",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1473116763269-255ea76e7acb?auto=format&fit=crop&q=80&w=600"],
    rating: 4.93, reviews_count: 127, type: "beachfront",
    host_name: "Filipa", host_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    amenities: ["Sea Cave Kayak", "Cliff Terrace", "Golden Cliffs", "Fishing Village", "Local Wine"]
  },
  {
    id: 50,
    title: "Mozambique Sandbank Retreat",
    description: "A private tented retreat on a remote sandbank in the Quirimbas Archipelago. Dhow sailing at sunset, whale shark swimming, and a private chef who digs fresh clams.",
    price: 580,
    location: "Quirimbas Archipelago, Mozambique",
    image: "https://images.unsplash.com/photo-1473116763269-255ea76e7acb?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1473116763269-255ea76e7acb?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600"],
    rating: 4.99, reviews_count: 41, type: "beachfront",
    host_name: "Zara", host_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    amenities: ["Dhow Sailing", "Whale Shark Swim", "Private Chef", "Sandbank", "Total Seclusion"]
  },
];



  const mockBookings = [];

let pool = null;
let isPostgres = false;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
    });
    isPostgres = true;
    console.log("Database connector initialized with PostgreSQL.");
  } catch (error) {
    console.error("Failed to initialize PostgreSQL pool, falling back to mock database.", error);
    isPostgres = false;
  }
} else {
  console.log("DATABASE_URL is not set. Using in-memory fallback database.");
}

// Function to initialize tables in PostgreSQL
export async function initializeDatabase() {
  if (!isPostgres) return;

  const client = await pool.connect();
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create listings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        location VARCHAR(255) NOT NULL,
        image TEXT NOT NULL,
        images TEXT[] NOT NULL,
        rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0,
        reviews_count INTEGER NOT NULL DEFAULT 0,
        type VARCHAR(50) NOT NULL,
        host_name VARCHAR(100) NOT NULL,
        host_avatar TEXT NOT NULL,
        amenities TEXT[] NOT NULL,
        host_id INTEGER REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    // Create bookings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        check_in VARCHAR(50) NOT NULL,
        check_out VARCHAR(50) NOT NULL,
        guest_name VARCHAR(100) NOT NULL,
        total_price INTEGER NOT NULL,
        payment_status VARCHAR(50) DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Upgrade existing tables if they were created before
    await client.query(`ALTER TABLE listings ADD COLUMN IF NOT EXISTS host_id INTEGER REFERENCES users(id) ON DELETE SET NULL;`).catch(() => {});
    await client.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;`).catch(() => {});
    await client.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'completed';`).catch(() => {});

    // Seed mock data if listings table is empty
    const checkListings = await client.query('SELECT COUNT(*) FROM listings');
    if (parseInt(checkListings.rows[0].count) === 0) {
      console.log("Seeding initial mock listings to PostgreSQL...");
      // Add default admin user
      const adminInsert = await client.query(
        `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email RETURNING id`,
        ['Admin User', 'admin@tropica.com', '$2b$10$C8.1zM.1T1/aG0.1H1.1/.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1', 'admin'] // Fake hash for mock, they should register
      );
      const adminId = adminInsert.rows[0].id;

      for (const item of mockListings) {
        await client.query(
          `INSERT INTO listings (id, title, description, price, location, image, images, rating, reviews_count, type, host_name, host_avatar, amenities, host_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
          [item.id, item.title, item.description, item.price, item.location, item.image, item.images || [item.image], item.rating, item.reviews_count, item.type, item.host_name, item.host_avatar, item.amenities, adminId]
        );
      }
      console.log("Mock listings seeded successfully.");
    }

    // Always fix sequences in case seeding inserted explicit IDs
    await client.query(`SELECT setval('listings_id_seq', COALESCE((SELECT MAX(id) FROM listings), 0) + 1, false)`);
    await client.query(`SELECT setval('bookings_id_seq', COALESCE((SELECT MAX(id) FROM bookings), 0) + 1, false)`);
    await client.query(`SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 0) + 1, false)`);
    console.log("Sequences synced.");

  } catch (error) {
    console.error("Database initialization failed:", error);
  } finally {
    client.release();
  }
}

// CRUD Wrappers
export async function getListings(typeFilter, searchQuery) {
  if (isPostgres) {
    try {
      let query = 'SELECT * FROM listings';
      const params = [];
      const conditions = [];

      if (typeFilter) {
        params.push(typeFilter);
        conditions.push(`type = $${params.length}`);
      }

      if (searchQuery) {
        params.push(`%${searchQuery}%`);
        conditions.push(`(location ILIKE $${params.length} OR title ILIKE $${params.length})`);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY id ASC';
      const res = await pool.query(query, params);
      return res.rows;
    } catch (error) {
      console.error("Postgres error, using mock data:", error);
    }
  }

  // Fallback
  let results = mockListings;
  if (typeFilter) {
    results = results.filter(l => l.type === typeFilter);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    results = results.filter(l => l.location.toLowerCase().includes(q) || l.title.toLowerCase().includes(q));
  }
  return results;
}

export async function getListingById(id) {
  const numId = parseInt(id);
  if (isPostgres) {
    try {
      const res = await pool.query('SELECT * FROM listings WHERE id = $1', [numId]);
      return res.rows[0] || null;
    } catch (error) {
      console.error("Postgres error, using mock data:", error);
    }
  }

  // Fallback
  return mockListings.find(l => l.id === numId) || null;
}

export async function createBooking(booking) {
  const { listing_id, check_in, check_out, guest_name, total_price } = booking;
  const numListingId = parseInt(listing_id);

  if (isPostgres) {
    try {
      const res = await pool.query(
        `INSERT INTO bookings (listing_id, check_in, check_out, guest_name, total_price)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [numListingId, check_in, check_out, guest_name, total_price]
      );
      return res.rows[0];
    } catch (error) {
      console.error("Postgres error, using mock data:", error);
    }
  }

  // Fallback
  const newBooking = {
    id: mockBookings.length + 1,
    listing_id: numListingId,
    check_in,
    check_out,
    guest_name,
    total_price,
    created_at: new Date().toISOString()
  };
  mockBookings.push(newBooking);
  return newBooking;
}

export async function getBookings() {
  if (isPostgres) {
    try {
      const res = await pool.query(`
        SELECT b.*, l.title as listing_title, l.image as listing_image, l.location as listing_location
        FROM bookings b
        JOIN listings l ON b.listing_id = l.id
        ORDER BY b.id DESC
      `);
      return res.rows;
    } catch (error) {
      console.error("Postgres error, using mock data:", error);
    }
  }

  // Fallback
  return mockBookings.map(b => {
    const listing = mockListings.find(l => l.id === b.listing_id) || {};
    return {
      ...b,
      listing_title: listing.title || "Unknown Listing",
      listing_image: listing.image || "",
      listing_location: listing.location || "Unknown Location"
    };
  });
}

// Auth wrappers
export async function getUserByEmail(email) {
  if (isPostgres) {
    try {
      const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      return res.rows[0] || null;
    } catch (error) {
      console.error(error);
    }
  }
  return null;
}

export async function createUser(user) {
  if (isPostgres) {
    try {
      const res = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role',
        [user.name, user.email, user.password_hash]
      );
      return res.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  return null;
}

// Host wrappers
export async function createListing(listing, hostId, hostName) {
  if (isPostgres) {
    try {
      // Support both images[] array and single image URL
      const imageUrl = listing.image || (listing.images && listing.images[0]) || 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800';
      const imagesArray = (listing.images && listing.images.length > 0)
        ? listing.images
        : [imageUrl, imageUrl, imageUrl, imageUrl, imageUrl];

      const hostAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150';
      const amenities = listing.amenities && listing.amenities.length > 0 ? listing.amenities : ['Wifi', 'Kitchen'];

      const res = await pool.query(
        `INSERT INTO listings (title, description, price, location, image, images, rating, reviews_count, type, host_name, host_avatar, amenities, host_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
        [
          listing.title,
          listing.description || 'A wonderful place to stay.',
          Number(listing.price) || 100,
          listing.location || 'Unknown Location',
          imageUrl,
          imagesArray,
          5.0,
          0,
          listing.type || 'cabins',
          hostName || 'Host',
          hostAvatar,
          amenities,
          hostId
        ]
      );
      return res.rows[0];
    } catch (error) {
      console.error('createListing DB error:', error.message, error.detail || '');
      throw error;
    }
  }
  return null;
}

export async function getDashboardStats() {
  if (isPostgres) {
    try {
      const users = await pool.query('SELECT COUNT(*) FROM users');
      const listings = await pool.query('SELECT COUNT(*) FROM listings');
      const bookings = await pool.query('SELECT COUNT(*) as count, SUM(total_price) as revenue FROM bookings');
      
      return {
        users: parseInt(users.rows[0].count),
        listings: parseInt(listings.rows[0].count),
        bookings: parseInt(bookings.rows[0].count),
        revenue: parseInt(bookings.rows[0].revenue || 0)
      };
    } catch (error) {
      console.error(error);
    }
  }
  return { users: 0, listings: 0, bookings: 0, revenue: 0 };
}

// --- FAVOURITES ---
export async function getFavourites(userId) {
  if (isPostgres) {
    try {
      const res = await pool.query(`
        SELECT l.*, f.created_at as favourited_at
        FROM favourites f
        JOIN listings l ON f.listing_id = l.id
        WHERE f.user_id = $1
        ORDER BY f.created_at DESC
      `, [userId]);
      return res.rows;
    } catch (error) {
      console.error(error);
    }
  }
  return [];
}

export async function addFavourite(userId, listingId) {
  if (isPostgres) {
    try {
      await pool.query(
        'INSERT INTO favourites (user_id, listing_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [userId, listingId]
      );
      return { success: true };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  return { success: false };
}

export async function removeFavourite(userId, listingId) {
  if (isPostgres) {
    try {
      await pool.query(
        'DELETE FROM favourites WHERE user_id = $1 AND listing_id = $2',
        [userId, listingId]
      );
      return { success: true };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  return { success: false };
}

export async function isFavourite(userId, listingId) {
  if (isPostgres) {
    try {
      const res = await pool.query(
        'SELECT id FROM favourites WHERE user_id = $1 AND listing_id = $2',
        [userId, listingId]
      );
      return res.rows.length > 0;
    } catch (error) {
      console.error(error);
    }
  }
  return false;
}

// --- USER DASHBOARD ---
export async function getUserProfile(userId) {
  if (isPostgres) {
    try {
      const res = await pool.query(
        'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
        [userId]
      );
      return res.rows[0] || null;
    } catch (error) {
      console.error(error);
    }
  }
  return null;
}

export async function getUserListings(userId) {
  if (isPostgres) {
    try {
      const res = await pool.query(
        'SELECT * FROM listings WHERE host_id = $1 ORDER BY id DESC',
        [userId]
      );
      return res.rows;
    } catch (error) {
      console.error(error);
    }
  }
  return [];
}

export async function getUserBookings(userId) {
  if (isPostgres) {
    try {
      const res = await pool.query(`
        SELECT b.*, l.title as listing_title, l.image as listing_image, l.location as listing_location
        FROM bookings b
        LEFT JOIN listings l ON b.listing_id = l.id
        WHERE b.user_id = $1
        ORDER BY b.created_at DESC
      `, [userId]);
      return res.rows;
    } catch (error) {
      console.error(error);
    }
  }
  return [];
}

export async function updateUserProfile(userId, updates) {
  if (isPostgres) {
    try {
      const res = await pool.query(
        'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email, role',
        [updates.name, userId]
      );
      return res.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  return null;
}

// --- ADMIN: list all users and bookings ---
export async function getAllUsers() {
  if (isPostgres) {
    try {
      const res = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY id DESC');
      return res.rows;
    } catch (error) {
      console.error(error);
    }
  }
  return [];
}

export async function getAllBookings() {
  if (isPostgres) {
    try {
      const res = await pool.query(`
        SELECT b.*, l.title as listing_title, l.location as listing_location, u.name as user_name, u.email as user_email
        FROM bookings b
        LEFT JOIN listings l ON b.listing_id = l.id
        LEFT JOIN users u ON b.user_id = u.id
        ORDER BY b.created_at DESC
      `);
      return res.rows;
    } catch (error) {
      console.error(error);
    }
  }
  return [];
}

// Export raw pool for tests or custom operations
export { pool, isPostgres };
