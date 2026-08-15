import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("Seeding...");

  await db.orderItem.deleteMany();
  await db.payment.deleteMany();
  await db.order.deleteMany();
  await db.reservation.deleteMany();
  await db.booking.deleteMany();
  await db.menuItem.deleteMany();
  await db.menuCategory.deleteMany();
  await db.room.deleteMany();
  await db.roomType.deleteMany();
  await db.restaurantTable.deleteMany();
  await db.user.deleteMany();

  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const guestPassword = await bcrypt.hash("Guest@123", 10);

  await db.user.create({
    data: {
      name: "Ayomide Administrator",
      email: "admin@tawnystay.com",
      passwordHash: adminPassword,
      role: "ADMIN",
      phone: "+234 9036084447",
    },
  });

  await db.user.create({
    data: {
      name: "Tom Server",
      email: "staff@tawnystay.com",
      passwordHash: adminPassword,
      role: "STAFF",
      phone: "+234 9156301371",
    },
  });

  await db.user.create({
    data: {
      name: "Guest Traveler",
      email: "guest@tawnystay.com",
      passwordHash: guestPassword,
      role: "CUSTOMER",
      phone: "+234 8104840552",
    },
  });

  // ---------- Room types & rooms ----------

  const roomTypes = [
    {
      name: "Cozy Cream Single",
      slug: "cozy-cream-single",
      description:
        "A warm, sunlit single room finished in soft cream tones — perfect for solo travelers who still want boutique comfort.",
      basePrice: 89,
      capacity: 1,
      bedType: "Single",
      sizeSqft: 220,
      amenities: ["Free Wi-Fi", "Air conditioning", "Work desk", "Rain shower"],
      images: [
        "https://images.pexels.com/photos/16197244/pexels-photo-16197244.jpeg?auto=compress&cs=tinysrgb&w=1200",
      ],
      roomCount: 4,
    },
    {
      name: "Sandstone Double",
      slug: "sandstone-double",
      description:
        "Our signature double room with sandy-brown accents, a plush queen bed, and a private balcony overlooking the courtyard.",
      basePrice: 149,
      capacity: 2,
      bedType: "Queen",
      sizeSqft: 320,
      amenities: [
        "Free Wi-Fi",
        "Air conditioning",
        "Balcony",
        "Minibar",
        "Rain shower",
      ],
      images: [
        "https://images.pexels.com/photos/8082220/pexels-photo-8082220.jpeg?auto=compress&cs=tinysrgb&w=1200",
      ],
      roomCount: 6,
    },
    {
      name: "Amber Family Suite",
      slug: "amber-family-suite",
      description:
        "A spacious two-room suite with a living area, ideal for families — two queen beds plus a sofa bed for the little ones.",
      basePrice: 249,
      capacity: 4,
      bedType: "2 Queen + Sofa bed",
      sizeSqft: 520,
      amenities: [
        "Free Wi-Fi",
        "Air conditioning",
        "Living area",
        "Minibar",
        "Bathtub",
        "Kids' welcome kit",
      ],
      images: [
        "https://images.pexels.com/photos/29649738/pexels-photo-29649738.jpeg?auto=compress&cs=tinysrgb&w=1200",
      ],
      roomCount: 3,
    },
    {
      name: "Tawny Penthouse",
      slug: "tawny-penthouse",
      description:
        "Top-floor penthouse with a wraparound terrace, king bed, and skyline views — the most indulgent stay in the house.",
      basePrice: 399,
      capacity: 2,
      bedType: "King",
      sizeSqft: 780,
      amenities: [
        "Free Wi-Fi",
        "Private terrace",
        "Jacuzzi",
        "Butler service",
        "Minibar",
        "Skyline view",
      ],
      images: [
        "https://images.pexels.com/photos/20021123/pexels-photo-20021123.jpeg?auto=compress&cs=tinysrgb&w=1200",
      ],
      roomCount: 2,
    },
  ];

  for (const rt of roomTypes) {
    const { roomCount, amenities, images, ...data } = rt;
    const roomType = await db.roomType.create({
      data: {
        ...data,
        amenities: JSON.stringify(amenities),
        images: JSON.stringify(images),
      },
    });

    for (let i = 1; i <= roomCount; i++) {
      const floor = Math.ceil(i / 2) + 1;
      await db.room.create({
        data: {
          roomNumber: `${roomType.slug.slice(0, 2).toUpperCase()}-${floor}0${i}`,
          floor,
          status: "AVAILABLE",
          roomTypeId: roomType.id,
        },
      });
    }
  }

  // ---------- Restaurant tables ----------

  const tableSeeds = [
    { tableNumber: "T1", capacity: 2, location: "INDOOR" },
    { tableNumber: "T2", capacity: 2, location: "INDOOR" },
    { tableNumber: "T3", capacity: 4, location: "INDOOR" },
    { tableNumber: "T4", capacity: 4, location: "INDOOR" },
    { tableNumber: "T5", capacity: 6, location: "INDOOR" },
    { tableNumber: "P1", capacity: 8, location: "PRIVATE" },
    { tableNumber: "O1", capacity: 2, location: "OUTDOOR" },
    { tableNumber: "O2", capacity: 4, location: "OUTDOOR" },
    { tableNumber: "O3", capacity: 4, location: "OUTDOOR" },
  ];

  for (const t of tableSeeds) {
    await db.restaurantTable.create({ data: t });
  }

  // ---------- Menu ----------

  const menu = [
    {
      name: "Starters",
      slug: "starters",
      sortOrder: 1,
      items: [
        {
          name: "Sandstone Bruschetta",
          slug: "sandstone-bruschetta",
          description: "Grilled sourdough, heirloom tomato, basil, aged balsamic.",
          price: 9.5,
          image:
            "https://images.pexels.com/photos/34874473/pexels-photo-34874473.jpeg?auto=compress&cs=tinysrgb&w=800",
          isVeg: true,
          spiceLevel: 0,
        },
        {
          name: "Charred Corn Fritters",
          slug: "charred-corn-fritters",
          description: "Sweetcorn and scallion fritters with smoked paprika aioli.",
          price: 10,
          image:
            "https://images.pexels.com/photos/13365026/pexels-photo-13365026.jpeg?auto=compress&cs=tinysrgb&w=800",
          isVeg: true,
          spiceLevel: 1,
        },
        {
          name: "Amber Glazed Wings",
          slug: "amber-glazed-wings",
          description: "Sticky sandy-brown honey-chili glaze, sesame, spring onion.",
          price: 12.5,
          image:
            "https://images.pexels.com/photos/33869804/pexels-photo-33869804.jpeg?auto=compress&cs=tinysrgb&w=800",
          isVeg: false,
          spiceLevel: 2,
        },
      ],
    },
    {
      name: "Mains",
      slug: "mains",
      sortOrder: 2,
      items: [
        {
          name: "Herb-Roasted Chicken",
          slug: "herb-roasted-chicken",
          description: "Half chicken, rosemary jus, roasted root vegetables.",
          price: 22,
          image:
            "https://images.pexels.com/photos/698308/pexels-photo-698308.jpeg?auto=compress&cs=tinysrgb&w=800",
          isVeg: false,
          spiceLevel: 0,
        },
        {
          name: "Tawny Butter Paneer",
          slug: "tawny-butter-paneer",
          description: "Paneer simmered in a cashew-tomato sauce, basmati rice.",
          price: 18,
          image:
            "https://images.pexels.com/photos/12737799/pexels-photo-12737799.jpeg?auto=compress&cs=tinysrgb&w=800",
          isVeg: true,
          spiceLevel: 2,
        },
        {
          name: "Pan-Seared Salmon",
          slug: "pan-seared-salmon",
          description: "Citrus beurre blanc, charred asparagus, wild rice.",
          price: 26,
          image:
            "https://images.pexels.com/photos/6839650/pexels-photo-6839650.jpeg?auto=compress&cs=tinysrgb&w=800",
          isVeg: false,
          spiceLevel: 0,
        },
        {
          name: "Wild Mushroom Risotto",
          slug: "wild-mushroom-risotto",
          description: "Arborio rice, porcini, parmesan, truffle oil.",
          price: 19,
          image:
            "https://images.pexels.com/photos/31779539/pexels-photo-31779539.jpeg?auto=compress&cs=tinysrgb&w=800",
          isVeg: true,
          spiceLevel: 0,
        },
      ],
    },
    {
      name: "Desserts",
      slug: "desserts",
      sortOrder: 3,
      items: [
        {
          name: "Caramel Sand Tart",
          slug: "caramel-sand-tart",
          description: "Salted caramel, brown-butter crust, vanilla bean cream.",
          price: 8,
          image:
            "https://images.pexels.com/photos/37124105/pexels-photo-37124105.jpeg?auto=compress&cs=tinysrgb&w=800",
          isVeg: true,
          spiceLevel: 0,
        },
        {
          name: "Dark Chocolate Fondant",
          slug: "dark-chocolate-fondant",
          description: "Molten center, raspberry coulis, pistachio crumble.",
          price: 9,
          image:
            "https://images.pexels.com/photos/36183209/pexels-photo-36183209.jpeg?auto=compress&cs=tinysrgb&w=800",
          isVeg: true,
          spiceLevel: 0,
        },
      ],
    },
    {
      name: "Drinks",
      slug: "drinks",
      sortOrder: 4,
      items: [
        {
          name: "Iced Amber Chai",
          slug: "iced-amber-chai",
          description: "House-spiced chai concentrate, oat milk, ice.",
          price: 5.5,
          image:
            "https://images.pexels.com/photos/35024895/pexels-photo-35024895.jpeg?auto=compress&cs=tinysrgb&w=800",
          isVeg: true,
          spiceLevel: 1,
        },
        {
          name: "Sparkling Elderflower",
          slug: "sparkling-elderflower",
          description: "Elderflower cordial, soda, fresh lime.",
          price: 4.5,
          image:
            "https://images.pexels.com/photos/6794879/pexels-photo-6794879.jpeg?auto=compress&cs=tinysrgb&w=800",
          isVeg: true,
          spiceLevel: 0,
        },
      ],
    },
  ];

  for (const category of menu) {
    const { items, ...catData } = category;
    const created = await db.menuCategory.create({ data: catData });
    for (const item of items) {
      await db.menuItem.create({ data: { ...item, categoryId: created.id } });
    }
  }

  console.log("Seed complete.");
  console.log("Admin login:  admin@tawnystay.com / Admin@123");
  console.log("Staff login:  staff@tawnystay.com / Admin@123");
  console.log("Guest login:  guest@tawnystay.com / Guest@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
