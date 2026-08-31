export const brand = {
  name: "EXCELLENT EVENT PLANNER",
  shortName: "Excellent Event Planner",
  tagline: "Where Every Celebration Deserves a Royal Experience",
  heroHeadline: "Where Grand Celebrations Become Timeless Memories",
  heroSub:
    "Host your weddings, receptions, corporate events and unforgettable celebrations in an elegant setting designed for extraordinary moments.",
  phones: ["0321 4597653", "0345 2085808"],
  phone: "+92 321 4597653",
  phoneTel: "+923214597653",
  whatsapp: "923214597653",
  whatsappMessage:
    "Assalam o Alaikum! I would like to inquire about booking Excellent Event Planner for my event.",
  email: "bm3595352@gmail.com",
  address:
    "PQ6P+4XG, ROYAL Marquee Faisal Hills Block-A Markaz Main G-T Road Taxila, N-5 Rawalpindi, Pakistan",
  addressShort: "ROYAL Marquee, Faisal Hills Block-A Markaz, Main G-T Road, Taxila",
  hours: "Open daily · Visits by appointment",
  mapsEmbedUrl:
    "https://www.google.com/maps?q=PQ6P%2B4XG,+ROYAL+Marquee+Faisal+Hills+Block-A+Markaz+Main+G-T+Road+Taxila,+N-5+Rawalpindi,+Pakistan&output=embed",
  mapsDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=PQ6P%2B4XG,+ROYAL+Marquee+Faisal+Hills+Block-A+Markaz+Main+G-T+Road+Taxila,+N-5+Rawalpindi,+Pakistan",
  mapsPinUrl:
    "https://www.google.com/maps/search/?api=1&query=PQ6P%2B4XG,+ROYAL+Marquee+Faisal+Hills+Block-A+Markaz+Main+G-T+Road+Taxila,+N-5+Rawalpindi,+Pakistan",
  social: {
    facebook: "",
    instagram: "",
  },
};

export const logoUrl = "/images/logo.png";
export const menuCardUrl = "/images/menu.png";
export const filmUrl = "/videos/function_highlights.mp4";

export const gallery = [
  { url: "/videos/function_highlights.mp4", title: "Royal Marquee Wedding & Function Highlights", tag: "Videos" },
  { url: "/videos/a2.mp4", title: "Grand Entrance & Royal Night Illuminations", tag: "Videos" },
  { url: "/videos/a4.mp4", title: "Luxury Bridal Stage & Hall Walkthrough", tag: "Videos" },
  { url: "/images/gold_stage_new.png", title: "Grand Royal Wedding Stage Setup", tag: "Weddings" },
  { url: "/images/royal_marquee_entrance.jpg", title: "Royal Marquee Grand Illuminated Entrance", tag: "Venue" },
  { url: "/images/royal_marquee_stage.jpg", title: "Royal Floral Wedding Stage & Pavilion", tag: "Weddings" },
  { url: "/images/gold_stage.jpg", title: "Grand Gold Stage & Chandelier Aisle", tag: "Décor" },
  { url: "/images/r3.png", title: "Crystal Canopy Bridal Aisle", tag: "Weddings" },
  { url: "/images/s4.png", title: "Mirror Pavilion by the Water", tag: "Venue" },
  { url: "/images/r2.png", title: "Blush Floral Mandap Setup", tag: "Weddings" },
  { url: "/images/s2.png", title: "Grand Royal Banquet & Dining Hall", tag: "Venue" },
  { url: "/images/s3.png", title: "Ivory & Gold Grand Stage", tag: "Décor" },
  { url: "/images/r1.png", title: "Celestial Outdoor Marquee", tag: "Events" },
  { url: "/images/s1.png", title: "Festive Mehndi Celebration Night", tag: "Events" },
];

export const heroImage = "/images/gold_stage_new.png";

export const trustBar = [
  { title: "Elegant Venue", text: "A refined setting for grand celebrations" },
  { title: "Premium Catering", text: "Curated menus for every occasion" },
  { title: "Grand Celebrations", text: "Weddings, walimas & receptions" },
  { title: "Personalized Events", text: "Flexible planning for your vision" },
];

export const venues = [
  {
    name: "Grand Illuminated Entrance",
    capacity: "First Impression",
    image: "/images/royal_marquee_entrance.jpg",
    blurb:
      "A grand illuminated entrance with glowing gold crown architecture on Main GT Road — monumental arches, ambient lighting, and an unforgettable VIP arrival for your guests.",
    features: ["Grand illuminated facade", "VIP arrival reception", "Monumental entrance"],
  },
  {
    name: "Royal Floral Wedding Stage",
    capacity: "Signature Setup",
    image: "/images/royal_marquee_stage.jpg",
    blurb:
      "An opulent bridal stage featuring classical arched backdrops, lush floral arrangements, plush sofa seating, and polished marble flooring.",
    features: ["Custom floral canopy", "Bespoke stage styling", "Plush luxury seating"],
  },
  {
    name: "Main Event Space",
    capacity: "Signature Hall",
    image: "/images/r1.png",
    blurb:
      "An immersive celebration space with crystal chandeliers, lounge seating and scenic open-air grandeur.",
    features: ["Grand seating layouts", "Scenic backdrop", "Premium décor"],
  },
  {
    name: "Elegant Décor Experience",
    capacity: "Styled to Perfection",
    image: "/images/s3.png",
    blurb:
      "Ivory and gold stage concepts with lush florals — tailored to your celebration theme and photography vision.",
    features: ["Custom décor themes", "Floral installations", "Stage styling"],
  },
];

export const events = [
  {
    title: "Weddings",
    text: "Create a magical setting for unforgettable wedding celebrations.",
    image: "/images/r2.png",
  },
  {
    title: "Walima & Receptions",
    text: "Elegant receptions designed for grand hospitality and lasting memories.",
    image: "/images/s2.png",
  },
  {
    title: "Engagements",
    text: "Intimate and elevated engagement gatherings with refined ambience.",
    image: "/images/gold_stage.jpg",
  },
  {
    title: "Mehndi Celebrations",
    text: "Vibrant mehndi nights with festive décor, music and curated catering.",
    image: "/images/s1.png",
  },
  {
    title: "Birthday Events",
    text: "Stylish private birthday celebrations with personalized planning.",
    image: "/images/s4.png",
  },
  {
    title: "Corporate Events",
    text: "Conferences, galas and company celebrations with professional execution.",
    image: "/images/r3.png",
  },
  {
    title: "Private & VIP Celebrations",
    text: "Family functions and exclusive gatherings hosted with royal care.",
    image: "/images/royal_marquee_entrance.jpg",
  },
];

export const services = events.map((e) => ({ title: e.title, text: e.text }));

export const menus = [
  {
    name: "Menu 6",
    badge: "Signature",
    featured: true,
    sections: [
      { label: "Starter", items: ["Soup / Juice", "Finger Chicken", "Fried Wings"] },
      {
        label: "Main Course",
        items: [
          "Mutton Pulao / Chicken Biryani",
          "Mutton Qorma (Red / White)",
          "Chicken Makhani Handi / Chicken Karahi",
          "Chicken Pasta / Chicken Chowmein",
          "Crumb Fried Fish",
          "Mutton Foil Roast / Mutton Fried Chops",
          "Chicken Malai Boti / Dhaka Chicken",
          "Tawa Qeema / Chapal Kabab",
          "Seekh Kabab (Chicken / Beef)",
          "Nan (Variety)",
          "Salad 5 Types",
          "Sauce 4 Types",
        ],
      },
      {
        label: "Dessert",
        items: ["Halwa Seasonal / Ice Cream", "Shahi Tukra", "Hot Gulab Jaman", "Shahi Kheer"],
      },
    ],
  },
  {
    name: "Rasm-e-Hina 1",
    badge: "Mehndi",
    featured: false,
    sections: [
      {
        label: "Full Service",
        items: [
          "Vegetable Pulao",
          "Chicken Qorma / Karahi",
          "Seekh Kabab",
          "Lahori Chanay",
          "Aloo Achari",
          "Nan (Variety)",
          "Salad 2 Types",
          "Mint Sauce",
          "Halwa Suji + Puri",
          "Gulab Jaman",
        ],
      },
    ],
  },
  {
    name: "Rasm-e-Hina 2",
    badge: "Mehndi Deluxe",
    featured: false,
    sections: [
      { label: "Starter", items: ["Gol Gappy", "Chana Chat"] },
      {
        label: "Main Course",
        items: [
          "Chinese Rice",
          "Chicken Qorma / Karahi",
          "Chicken Boti",
          "Lahori Chanay",
          "Aloo Achari",
          "Pathora",
          "Nan Variety",
          "Salad 2 Types",
          "Mint Sauce",
          "Halwa Suji + Puri",
          "Jalabi",
        ],
      },
    ],
  },
];

export const additionalSelection = [
  "Soup",
  "Juice",
  "Mint Margarita",
  "Refreshment Corner",
  "Bakra Roast (Full)",
  "Leg Roast (Mutton)",
  "Fried Prawns",
  "Fried Fish",
  "Chicken Sajji / Roast (Full)",
  "Takka Tak",
  "Chapal Kabab",
  "Halwa Seasonal",
  "Sweet Bar",
  "Fruit Bar",
  "Salad Bar",
  "Sag Makai Roti + Lassi (Stall)",
  "Pan Stall",
  "Qulfa Faluda / Ice Cream",
  "Pink Tea / Green Tea / Black Tea",
  "Cold Drinks / Mineral Water",
];

export const whyChoose = [
  {
    title: "Prime Location",
    text: "Conveniently located on Main G-T Road near Faisal Hills, Taxila.",
  },
  {
    title: "Elegant Event Experience",
    text: "A refined setting designed for memorable celebrations.",
  },
  {
    title: "Premium Catering",
    text: "Carefully curated food experiences for your guests.",
  },
  {
    title: "Personalized Planning",
    text: "Flexible arrangements according to your event requirements.",
  },
  {
    title: "Easy Booking",
    text: "Simple inquiry and availability process with dedicated follow-up.",
  },
];

export const timeline = [
  {
    step: "01",
    title: "Send an Inquiry",
    text: "Tell us about your celebration.",
  },
  {
    step: "02",
    title: "Plan Your Experience",
    text: "Discuss your requirements and preferences.",
  },
  {
    step: "03",
    title: "Confirm Your Date",
    text: "Secure your special occasion.",
  },
  {
    step: "04",
    title: "Celebrate in Royal Style",
    text: "Enjoy an unforgettable event experience.",
  },
];

export const faqs = [
  {
    q: "How can I check date availability?",
    a: "Use the Check Availability form on this website, call us, or message on WhatsApp. Our team will confirm open dates within 24 hours.",
  },
  {
    q: "How do I book Excellent Event Planner?",
    a: "Submit an inquiry with your preferred date and guest count, visit the venue for a consultation, then confirm your booking with our events team.",
  },
  {
    q: "Can the menu be customized?",
    a: "Yes. Our packages are fully flexible — dishes can be adjusted, and additional selections such as live stalls and specialty items can be added.",
  },
  {
    q: "Can we visit the venue before booking?",
    a: "Absolutely. We encourage a site visit. Use Book a Visit or WhatsApp to schedule a convenient time.",
  },
  {
    q: "Which events can be hosted?",
    a: "Weddings, walima & receptions, engagements, mehndi celebrations, birthdays, corporate events and private family gatherings.",
  },
  {
    q: "How can I request a quote?",
    a: "Share your event type, date, guest count and preferred package in the inquiry form. We will send a tailored proposal promptly.",
  },
];

export const testimonials = [
  {
    quote:
      "Our celebration felt truly royal. The décor, catering and hospitality made every guest feel special.",
    name: "Demo Guest",
    event: "Wedding Reception — Demo content",
    rating: 5,
  },
  {
    quote:
      "From the first inquiry to the final course, the Excellent Event Planner team was professional, warm and detail-oriented.",
    name: "Demo Client",
    event: "Walima — Demo content",
    rating: 5,
  },
  {
    quote:
      "A beautiful venue on G-T Road with excellent catering options. Highly recommended for grand events.",
    name: "Demo Family",
    event: "Mehndi Night — Demo content",
    rating: 5,
  },
];

export const stats = [
  { value: "GT Road", label: "Prime Location" },
  { value: "7+", label: "Event Types" },
  { value: "3", label: "Signature Menus" },
  { value: "24h", label: "Inquiry Response" },
];

export function whatsappUrl(customMessage?: string) {
  const text = encodeURIComponent(customMessage ?? brand.whatsappMessage);
  return `https://wa.me/${brand.whatsapp}?text=${text}`;
}

export function telUrl(phone = brand.phoneTel) {
  return `tel:${phone}`;
}
