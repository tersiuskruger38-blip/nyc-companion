export const initialActivities = {
  0: {
    morning: [],
    afternoon: [
      { id: "0a1", name: "Arrive & Check In", category: "hotel", time: "14:30", price: "free", duration: "30 min", description: "Arrive at Madison LES Hotel. Drop bags, freshen up!", address: "77 Ludlow St, New York, NY 10002", notes: "Suzanne arrives ~13:30, Tersius ~20:30.", status: "upcoming" },
      { id: "0a2", name: "Explore Lower East Side", category: "walk", time: "15:00", price: "free", duration: "60 min", description: "Walk around the neighborhood — street art, vintage shops, local vibes.", address: "Lower East Side, Manhattan", notes: "Check out Orchard St and Rivington St.", status: "upcoming" },
      { id: "0a3", name: "Tompkins Square Bagels", category: "food", time: "16:30", price: "$", duration: "30 min", description: "Top-rated NYC bagels. Everything bagel + scallion cream cheese.", address: "165 Avenue A, New York, NY 10009", notes: "Cash-only! Usually a short line.", status: "upcoming" },
      { id: "0a4", name: "Walk Through East Village", category: "walk", time: "17:15", price: "free", duration: "45 min", description: "Quirky shops, bookstores, ramen places, great people watching.", address: "East Village, Manhattan", notes: "Check out St Marks Place.", status: "upcoming" },
    ],
    evening: [
      { id: "0e1", name: "Rubirosa", category: "food", time: "21:00", price: "$$", duration: "90 min", description: "Famous tie-dye vodka pizza — crispy thin crust with a kick.", address: "235 Mulberry St, New York, NY 10012", notes: "Reservations essential!", status: "upcoming" },
      { id: "0e2", name: "First Night Walk", category: "walk", time: "22:30", price: "free", duration: "60 min", description: "Manhattan at night — Little Italy through SoHo.", address: "SoHo / Nolita, Manhattan", notes: "Safe and lively on Friday nights.", status: "upcoming" },
    ],
  },
  1: {
    morning: [
      { id: "1m1", name: "High Line Walk", category: "park", time: "08:30", price: "free", duration: "90 min", description: "Elevated park on old railway tracks. Art, gardens, city views.", address: "High Line, New York, NY 10011", notes: "Enter at Gansevoort St. Less crowded before 10am.", status: "upcoming" },
      { id: "1m2", name: "Chelsea Market", category: "food", time: "10:00", price: "$$", duration: "60 min", description: "Indoor food hall — Los Tacos No. 1 or Miznon for brunch.", address: "75 9th Ave, New York, NY 10011", notes: "Gets busy by 11am.", status: "upcoming" },
      { id: "1m3", name: "Little Island", category: "park", time: "11:15", price: "free", duration: "45 min", description: "Floating park on tulip-shaped pillars in the Hudson.", address: "Pier 55 at Hudson River Park, NY 10014", notes: "May need timed tickets on weekends.", status: "upcoming" },
    ],
    afternoon: [
      { id: "1a1", name: "Brooklyn Bridge Walk", category: "walk", time: "13:00", price: "free", duration: "45 min", description: "Walk Manhattan → Brooklyn. Incredible skyline views.", address: "Brooklyn Bridge, New York, NY", notes: "Use the pedestrian lane (not bike!).", status: "upcoming" },
      { id: "1a2", name: "DUMBO Waterfront", category: "photo", time: "14:00", price: "free", duration: "60 min", description: "Manhattan Bridge framed between brick buildings — the classic shot.", address: "Washington St & Water St, Brooklyn, NY 11201", notes: "Also check Jane's Carousel.", status: "upcoming" },
      { id: "1a3", name: "King Dumplings", category: "food", time: "16:00", price: "$", duration: "30 min", description: "Handmade dumplings, $3.50 for a massive portion.", address: "19 Allen St, New York, NY 10002", notes: "Cash only! No frills, incredible value.", status: "upcoming" },
    ],
    evening: [
      { id: "1e1", name: "Fiaschetteria Pistoia", category: "food", time: "19:30", price: "$$$", duration: "90 min", description: "Upscale Italian. Cacio e pepe is perfection.", address: "114 E 7th St, New York, NY 10009", notes: "Reservations a must.", status: "upcoming" },
      { id: "1e2", name: "Elsewhere", category: "nightlife", time: "22:00", price: "$$", duration: "180 min", description: "Multi-room live music venue in Bushwick. Rooftop bar.", address: "599 Johnson Ave, Brooklyn, NY 11237", notes: "L train to Jefferson St.", status: "upcoming" },
    ],
  },
  2: {
    morning: [
      { id: "2m1", name: "Central Park South Walk", category: "park", time: "09:00", price: "free", duration: "90 min", description: "Enter from 59th St. See Bethesda Fountain, Bow Bridge, Strawberry Fields.", address: "Central Park, New York, NY", notes: "Grab coffee from a cart at Columbus Circle first.", status: "upcoming" },
      { id: "2m2", name: "Top of the Rock", category: "sightseeing", time: "11:00", price: "$$$", duration: "60 min", description: "Observation deck at Rockefeller Center. 360° views including Empire State Building.", address: "30 Rockefeller Plaza, New York, NY 10112", notes: "Book timed tickets online ahead of time.", status: "upcoming" },
    ],
    afternoon: [
      { id: "2a1", name: "MoMA", category: "museum", time: "13:00", price: "$$", duration: "120 min", description: "Museum of Modern Art — Starry Night, Campbell's Soup, and more.", address: "11 W 53rd St, New York, NY 10019", notes: "Get the audio guide, it's worth it.", status: "upcoming" },
      { id: "2a2", name: "Times Square", category: "sightseeing", time: "15:30", price: "free", duration: "30 min", description: "Love it or hate it — you have to see it once. Pure sensory overload.", address: "Times Square, Manhattan, NY 10036", notes: "Quick photo stop, don't linger. Watch for scams.", status: "upcoming" },
      { id: "2a3", name: "Grand Central Terminal", category: "sightseeing", time: "16:15", price: "free", duration: "30 min", description: "Stunning Beaux-Arts architecture. Check the ceiling constellation mural.", address: "89 E 42nd St, New York, NY 10017", notes: "Great food hall downstairs.", status: "upcoming" },
    ],
    evening: [
      { id: "2e1", name: "Katz's Delicatessen", category: "food", time: "19:00", price: "$$", duration: "60 min", description: "Legendary pastrami sandwiches since 1888. 'I'll have what she's having.'", address: "205 E Houston St, New York, NY 10002", notes: "Don't lose your ticket! Cash or card.", status: "upcoming" },
      { id: "2e2", name: "Comedy Cellar", category: "entertainment", time: "21:00", price: "$$", duration: "90 min", description: "Legendary comedy club. You might see someone famous doing a surprise set.", address: "117 MacDougal St, New York, NY 10012", notes: "Book online, 2-drink minimum.", status: "upcoming" },
    ],
  },
  3: {
    morning: [
      { id: "3m1", name: "Met Museum", category: "museum", time: "10:00", price: "$$", duration: "150 min", description: "One of the world's greatest art museums. Egyptian Temple, European paintings, rooftop garden.", address: "1000 5th Ave, New York, NY 10028", notes: "Perfect rainy day activity. Don't try to see everything.", status: "upcoming" },
    ],
    afternoon: [
      { id: "3a1", name: "Guggenheim Museum", category: "museum", time: "13:30", price: "$$", duration: "90 min", description: "Frank Lloyd Wright's spiral masterpiece. Walk the ramps.", address: "1071 5th Ave, New York, NY 10128", notes: "Start at the top and spiral down.", status: "upcoming" },
      { id: "3a2", name: "Levain Bakery", category: "food", time: "15:30", price: "$", duration: "20 min", description: "NYC's most famous cookies — giant, gooey, life-changing.", address: "167 W 74th St, New York, NY 10023", notes: "Get the chocolate chip walnut. Share one, they're huge.", status: "upcoming" },
      { id: "3a3", name: "American Museum of Natural History", category: "museum", time: "16:00", price: "$$", duration: "120 min", description: "Dinosaurs, space, ocean life. The new Gilder Center is incredible.", address: "200 Central Park West, New York, NY 10024", notes: "See the whale room and the planetarium.", status: "upcoming" },
    ],
    evening: [
      { id: "3e1", name: "Joe's Pizza", category: "food", time: "19:00", price: "$", duration: "20 min", description: "No-frills classic NYC slice. This is what pizza is supposed to taste like.", address: "7 Carmine St, New York, NY 10014", notes: "Fold it in half like a local.", status: "upcoming" },
      { id: "3e2", name: "Village Vanguard", category: "nightlife", time: "20:30", price: "$$", duration: "120 min", description: "World-famous jazz club since 1935. Intimate, legendary acoustics.", address: "178 7th Ave S, New York, NY 10014", notes: "Book ahead. No talking during sets!", status: "upcoming" },
    ],
  },
  4: {
    morning: [
      { id: "4m1", name: "St. Patrick's Day Parade", category: "sightseeing", time: "11:00", price: "free", duration: "90 min", description: "NYC's biggest parade — bagpipes, marching bands, green everywhere on 5th Ave.", address: "5th Avenue, Midtown Manhattan", notes: "Arrive early for a good spot. Wear green! Huge crowds.", status: "upcoming" },
    ],
    afternoon: [
      { id: "4a1", name: "Empire State Building", category: "sightseeing", time: "14:00", price: "$$$", duration: "90 min", description: "The iconic observation deck. 86th floor outdoor terrace is a must.", address: "20 W 34th St, New York, NY 10001", notes: "Pre-book Express Pass to skip the line.", status: "upcoming" },
      { id: "4a2", name: "Koreatown Lunch", category: "food", time: "16:00", price: "$$", duration: "60 min", description: "K-Town is right near the Empire State. Korean BBQ, fried chicken, or bibimbap.", address: "32nd St between 5th & 6th Ave, Manhattan", notes: "BCD Tofu House or Her Name is Han are great picks.", status: "upcoming" },
    ],
    evening: [
      { id: "4e1", name: "McSorley's Old Ale House", category: "bar", time: "19:00", price: "$", duration: "60 min", description: "NYC's oldest bar (1854). They only serve light or dark ale — two at a time.", address: "15 E 7th St, New York, NY 10003", notes: "Cash only! St. Patrick's Day here is wild.", status: "upcoming" },
      { id: "4e2", name: "St. Patrick's Day Pub Crawl", category: "nightlife", time: "21:00", price: "$$", duration: "180 min", description: "East Village → LES bar hop. The whole city is celebrating.", address: "East Village, Manhattan", notes: "Pace yourselves 🍀", status: "upcoming" },
    ],
  },
  5: {
    morning: [
      { id: "5m1", name: "Russ & Daughters", category: "food", time: "09:00", price: "$$", duration: "45 min", description: "Legendary appetizing shop since 1914. Lox, bagels, smoked fish perfection.", address: "179 E Houston St, New York, NY 10002", notes: "The classic combo: bagel, cream cheese, nova lox.", status: "upcoming" },
      { id: "5m2", name: "Last Walk — Washington Square Park", category: "walk", time: "10:00", price: "free", duration: "45 min", description: "Soak in Greenwich Village. Street performers, the arch, NYU campus vibes.", address: "Washington Square Park, New York, NY 10012", notes: "Great final NYC memory spot.", status: "upcoming" },
    ],
    afternoon: [
      { id: "5a1", name: "Pack & Check Out", category: "hotel", time: "12:00", price: "free", duration: "60 min", description: "Pack up, check out of Madison LES. Hotel can hold bags if needed.", address: "77 Ludlow St, New York, NY 10002", notes: "Checkout is usually 11am — ask for late checkout.", status: "upcoming" },
      { id: "5a2", name: "Head to Newark Airport", category: "sightseeing", time: "16:00", price: "$$", duration: "90 min", description: "NJ Transit or Uber to EWR. Flight is at 19:55, arrive 3hrs early for international.", address: "Newark Liberty International Airport", notes: "PATH train + AirTrain or just Uber (~$50-70).", status: "upcoming" },
    ],
    evening: [
      { id: "5e1", name: "Flight Home ✈️", category: "sightseeing", time: "19:55", price: "free", duration: "480 min", description: "UA 994 EWR → BRU. Overnight flight, arrive 08:05+1. Tot ziens, New York! 🗽", address: "Newark Liberty International Airport, Terminal C", notes: "Boarding starts ~19:20. Gate closes 19:40.", status: "upcoming" },
    ],
  },
};
