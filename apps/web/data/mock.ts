// Mock data for TicketGrid Landing Page

import { getUpcomingEvents } from "@/lib/api";

export const getFeaturedEvents = async () => {
  const data = await getUpcomingEvents(1, 6);
  return data?.events || [];
};

export const featuredEvents = [
  {
    id: "event-1",
    title: "Summer Music Festival 2025",
    slug: "summer-music-festival-2025",
    description: "Enjoy live music performances from top artists.",
    startTime: "2025-06-15T18:00:00.000Z",
    endTime: "2025-06-15T23:00:00.000Z",
    price: 45,
    imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?crop=entropy&cs=srgb&fm=jpg&q=85",
    tags: ["MUSIC", "FESTIVAL"],
    location: {
      addressLine: "Central Park",
      city: "New York",
      state: "NY",
      country: "USA",
    },
  },
  {
    id: "event-2",
    title: "Tech Innovation Summit 2025",
    slug: "tech-innovation-summit-2025",
    description: "A summit showcasing the latest in tech innovation.",
    startTime: "2025-07-20T09:00:00.000Z",
    endTime: "2025-07-20T17:00:00.000Z",
    price: 199,
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=srgb&fm=jpg&q=85",
    tags: ["TECH", "CONFERENCE"],
    location: {
      addressLine: "Convention Center",
      city: "San Francisco",
      state: "CA",
      country: "USA",
    },
  },
  {
    id: "event-3",
    title: "Creative Design Workshop",
    slug: "creative-design-workshop",
    description: "Hands-on workshop for designers and creatives.",
    startTime: "2025-05-10T14:00:00.000Z",
    endTime: "2025-05-10T18:00:00.000Z",
    price: 75,
    imageUrl: "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?crop=entropy&cs=srgb&fm=jpg&q=85",
    tags: ["WORKSHOP", "DESIGN"],
    location: {
      addressLine: "Design Studio",
      city: "Brooklyn",
      state: "NY",
      country: "USA",
    },
  },
  {
    id: "event-4",
    title: "Community Fitness Marathon",
    slug: "community-fitness-marathon",
    description: "Join the city marathon and stay fit together.",
    startTime: "2025-08-05T07:00:00.000Z",
    endTime: "2025-08-05T12:00:00.000Z",
    price: 25,
    imageUrl: "https://images.unsplash.com/photo-1517130038641-a774d04afb3c?crop=entropy&cs=srgb&fm=jpg&q=85",
    tags: ["FITNESS", "COMMUNITY"],
    location: {
      addressLine: "Riverside Park",
      city: "Chicago",
      state: "IL",
      country: "USA",
    },
  },
  {
    id: "event-5",
    title: "Jazz Night Under Stars",
    slug: "jazz-night-under-stars",
    description: "Relax with smooth jazz under the open sky.",
    startTime: "2025-06-22T20:00:00.000Z",
    endTime: "2025-06-22T23:00:00.000Z",
    price: 60,
    imageUrl: "https://images.pexels.com/photos/196652/pexels-photo-196652.jpeg",
    tags: ["MUSIC", "JAZZ"],
    location: {
      addressLine: "Rooftop Lounge",
      city: "Miami",
      state: "FL",
      country: "USA",
    },
  },
  {
    id: "event-6",
    title: "AI & Machine Learning Workshop",
    slug: "ai-ml-workshop",
    description: "Learn AI & ML concepts with hands-on projects.",
    startTime: "2025-07-12T10:00:00.000Z",
    endTime: "2025-07-12T15:00:00.000Z",
    price: 89,
    imageUrl: "https://images.unsplash.com/photo-1623652554515-91c833e3080e?crop=entropy&cs=srgb&fm=jpg&q=85",
    tags: ["AI", "WORKSHOP", "TECH"],
    location: {
      addressLine: "Online",
      city: "Remote",
      state: "",
      country: "",
    },
  },
];

export const howItWorksSteps = [
  {
    step: 1,
    title: "Discover Events",
    description: "Browse through thousands of events across various categories and find what excites you."
  },
  {
    step: 2,
    title: "Book Tickets Securely",
    description: "Select your tickets and complete your booking with our secure payment system in seconds."
  },
  {
    step: 3,
    title: "Attend & Enjoy",
    description: "Receive instant confirmation and QR codes. Show up and enjoy your unforgettable experience."
  }
];

export const whyChooseFeatures = [
  {
    title: "Fast & Secure Booking",
    description: "Complete your purchase in seconds with bank-level security and encryption."
  },
  {
    title: "Real-time Availability",
    description: "See live seat availability and pricing updates as you browse events."
  },
  {
    title: "Instant Confirmations",
    description: "Get immediate booking confirmations and digital tickets sent to your email."
  },
  {
    title: "Easy Event Management",
    description: "Organizers can create, manage, and track their events effortlessly."
  }
];

export const stats = [
  { value: "10K+", label: "Events Hosted" },
  { value: "500K+", label: "Happy Attendees" },
  { value: "5K+", label: "Event Organizers" },
  { value: "50+", label: "Cities Covered" }
];