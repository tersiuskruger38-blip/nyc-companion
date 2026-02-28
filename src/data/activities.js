export const initialActivities = {
  0: {
    // Friday Mar 13 — Arrival day. Suzanne arrives ~13:30, Tersius ~20:30. Take it easy.
    morning: [],
    afternoon: [
      { id: "0a1", name: "Arrive & Check In", category: "hotel", time: "14:30", price: "free", duration: "45 min", description: "Arrive at Madison LES Hotel. Drop bags, freshen up, get oriented.", address: "77 Ludlow St, New York, NY 10002", notes: "Suzanne arrives ~13:30, Tersius ~20:30. Rest if jet-lagged!", status: "upcoming" },
      { id: "0a2", name: "Explore Lower East Side", category: "walk", time: "15:30", price: "free", duration: "60 min", description: "Gentle walk around the neighborhood — street art, vintage shops, local vibes.", address: "Lower East Side, Manhattan", notes: "Check out Orchard St and Rivington St. Don't overdo it, long flight behind you.", status: "upcoming" },
      { id: "0a3", name: "Tompkins Square Bagels", category: "food", time: "16:45", price: "$", duration: "30 min", description: "Top-rated NYC bagels. Everything bagel + scallion cream cheese.", address: "165 Avenue A, New York, NY 10009", notes: "Cash-only! Usually a short line.", status: "upcoming" },
    ],
    evening: [
      { id: "0e1", name: "Rubirosa", category: "food", time: "20:00", price: "$$", duration: "90 min", description: "Famous tie-dye vodka pizza — crispy thin crust with a kick.", address: "235 Mulberry St, New York, NY 10012", notes: "Reservations essential! 15 min walk from hotel.", status: "upcoming" },
    ],
  },
  1: {
    // Saturday Mar 14 — First full day. West side morning, Brooklyn afternoon. Pace yourselves!
    morning: [
      { id: "1m1", name: "High Line Walk", category: "park", time: "09:00", price: "free", duration: "75 min", description: "Elevated park on old railway tracks. Art, gardens, city views.", address: "High Line, New York, NY 10011", notes: "Enter at Gansevoort St. Less crowded before 10am. Walk north to 23rd St.", status: "upcoming" },
      { id: "1m2", name: "Chelsea Market", category: "food", time: "10:30", price: "$$", duration: "60 min", description: "Indoor food hall — Los Tacos No. 1 or Miznon for brunch. Sit down and refuel.", address: "75 9th Ave, New York, NY 10011", notes: "Right at the south end of the High Line. Good rest stop.", status: "upcoming" },
    ],
    afternoon: [
      { id: "1a1", name: "Little Island", category: "park", time: "12:00", price: "free", duration: "40 min", description: "Floating park on tulip-shaped pillars in the Hudson.", address: "Pier 55 at Hudson River Park, NY 10014", notes: "5 min walk from Chelsea Market. Quick visit, nice views.", status: "upcoming" },
      { id: "1a2", name: "Brooklyn Bridge Walk", category: "walk", time: "14:00", price: "free", duration: "45 min", description: "Walk Manhattan → Brooklyn. Incredible skyline views.", address: "Brooklyn Bridge, New York, NY", notes: "Take subway (A/C to Fulton St) to skip the long walk downtown. Use the pedestrian lane.", status: "upcoming" },
      { id: "1a3", name: "DUMBO Waterfront", category: "photo", time: "15:00", price: "free", duration: "45 min", description: "Manhattan Bridge framed between brick buildings — the classic shot.", address: "Washington St & Water St, Brooklyn, NY 11201", notes: "Also check Jane's Carousel. Grab a coffee and sit by the water.", status: "upcoming" },
      { id: "1a4", name: "Rest at Hotel", category: "hotel", time: "16:30", price: "free", duration: "90 min", description: "Head back to LES. Rest your feet, shower, recharge before dinner.", address: "77 Ludlow St, New York, NY 10002", notes: "F train from York St (DUMBO) → Delancey St. Don't skip this — you'll need the energy!", status: "upcoming" },
    ],
    evening: [
      { id: "1e1", name: "King Dumplings", category: "food", time: "18:30", price: "$", duration: "30 min", description: "Handmade dumplings, $3.50 for a massive portion. Quick pre-dinner snack.", address: "19 Allen St, New York, NY 10002", notes: "Cash only! 5 min walk from hotel.", status: "upcoming" },
      { id: "1e2", name: "Fiaschetteria Pistoia", category: "food", time: "20:00", price: "$$$", duration: "90 min", description: "Upscale Italian. Cacio e pepe is perfection. Treat-yourself dinner.", address: "114 E 7th St, New York, NY 10009", notes: "Reservations a must. 10 min walk from hotel.", status: "upcoming" },
    ],
  },
  2: {
    // Sunday Mar 15 — Central Park, Top of the Rock, MoMA. The one museum day.
    morning: [
      { id: "2m1", name: "Central Park Morning Walk", category: "park", time: "09:00", price: "free", duration: "90 min", description: "Enter from 59th St. See Bethesda Fountain, Bow Bridge, Strawberry Fields.", address: "Central Park, New York, NY", notes: "Grab coffee from a cart at Columbus Circle. Don't go deeper than 72nd St — save your legs.", status: "upcoming" },
      { id: "2m2", name: "Top of the Rock", category: "sightseeing", time: "11:00", price: "$$$", duration: "60 min", description: "Observation deck at Rockefeller Center. 360° views including Empire State Building.", address: "30 Rockefeller Plaza, New York, NY 10112", notes: "Pre-book timed tickets. 15 min walk south from park.", status: "upcoming" },
    ],
    afternoon: [
      { id: "2a1", name: "Lunch near Rockefeller", category: "food", time: "12:30", price: "$$", duration: "45 min", description: "Grab lunch in Midtown. Urbanspace Vanderbilt or grab pizza at Joe's of 6th Ave.", address: "Midtown Manhattan", notes: "Sit-down lunch to rest before the museum.", status: "upcoming" },
      { id: "2a2", name: "MoMA", category: "museum", time: "13:30", price: "$$", duration: "105 min", description: "Museum of Modern Art — Starry Night, Campbell's Soup, and more. Don't try to see everything.", address: "11 W 53rd St, New York, NY 10019", notes: "Pick 2-3 floors max. The sculpture garden is a nice break. Feet will be tired by now.", status: "upcoming" },
      { id: "2a3", name: "Times Square Quick Stop", category: "sightseeing", time: "16:00", price: "free", duration: "20 min", description: "Love it or hate it — you have to see it once. Pure sensory overload.", address: "Times Square, Manhattan, NY 10036", notes: "Quick photo stop, don't linger. Watch for scams. 10 min walk from MoMA.", status: "upcoming" },
      { id: "2a4", name: "Grand Central Terminal", category: "sightseeing", time: "16:30", price: "free", duration: "30 min", description: "Stunning Beaux-Arts architecture. Check the ceiling constellation mural.", address: "89 E 42nd St, New York, NY 10017", notes: "Great food hall downstairs. 10 min walk from Times Square.", status: "upcoming" },
    ],
    evening: [
      { id: "2e1", name: "Katz's Delicatessen", category: "food", time: "19:00", price: "$$", duration: "60 min", description: "Legendary pastrami sandwiches since 1888. 'I'll have what she's having.'", address: "205 E Houston St, New York, NY 10002", notes: "5 min from hotel! Don't lose your ticket! Split a sandwich — they're huge.", status: "upcoming" },
      { id: "2e2", name: "Comedy Cellar", category: "entertainment", time: "21:00", price: "$$", duration: "90 min", description: "Legendary comedy club. You might see someone famous doing a surprise set.", address: "117 MacDougal St, New York, NY 10012", notes: "Book online well in advance. 2-drink minimum. Subway or cab back — you'll be tired.", status: "upcoming" },
    ],
  },
  3: {
    // Monday Mar 16 — Met Museum + Upper East/West Side. ONE museum, easy pace.
    morning: [
      { id: "3m1", name: "The Met Museum", category: "museum", time: "10:00", price: "$$", duration: "150 min", description: "One of the world's greatest art museums. Egyptian Temple of Dendur, European paintings, rooftop garden.", address: "1000 5th Ave, New York, NY 10028", notes: "Pick 3-4 sections max. The Egyptian wing + European paintings are must-sees. Take breaks on the benches!", status: "upcoming" },
    ],
    afternoon: [
      { id: "3a1", name: "Central Park Upper Loop", category: "walk", time: "13:00", price: "free", duration: "45 min", description: "Walk through the north end of Central Park — Belvedere Castle, the Reservoir. Less touristy, more peaceful.", address: "Central Park, near 79th St", notes: "Exit west side for Levain. Easy, shaded walk to decompress after the museum.", status: "upcoming" },
      { id: "3a2", name: "Levain Bakery", category: "food", time: "14:00", price: "$", duration: "20 min", description: "NYC's most famous cookies — giant, gooey, life-changing.", address: "167 W 74th St, New York, NY 10023", notes: "Get the chocolate chip walnut. Share one, they're huge.", status: "upcoming" },
      { id: "3a3", name: "Upper West Side Stroll", category: "walk", time: "14:30", price: "free", duration: "45 min", description: "Browse Columbus Avenue shops, brownstone streets. Relaxed neighborhood vibe.", address: "Columbus Ave, Upper West Side", notes: "Great bookshops and cafes. Grab a coffee and people-watch.", status: "upcoming" },
      { id: "3a4", name: "Rest at Hotel", category: "hotel", time: "16:00", price: "free", duration: "120 min", description: "Back to LES. Proper rest before the evening. Nap, shower, recharge.", address: "77 Ludlow St, New York, NY 10002", notes: "Subway: 1 train to Houston St or B/D to Grand St. Your feet will thank you.", status: "upcoming" },
    ],
    evening: [
      { id: "3e1", name: "Joe's Pizza", category: "food", time: "18:30", price: "$", duration: "20 min", description: "No-frills classic NYC slice. This is what pizza is supposed to taste like.", address: "7 Carmine St, New York, NY 10014", notes: "Fold it in half like a local. Quick stop before jazz.", status: "upcoming" },
      { id: "3e2", name: "Village Vanguard", category: "nightlife", time: "20:30", price: "$$", duration: "120 min", description: "World-famous jazz club since 1935. Intimate, legendary acoustics.", address: "178 7th Ave S, New York, NY 10014", notes: "Book ahead. No talking during sets! Cab home after.", status: "upcoming" },
    ],
  },
  4: {
    // Tuesday Mar 17 — St. Patrick's Day! Parade, Empire State, pubs. Fun day, don't overdo the drinks.
    morning: [
      { id: "4m1", name: "St. Patrick's Day Parade", category: "sightseeing", time: "11:00", price: "free", duration: "90 min", description: "NYC's biggest parade — bagpipes, marching bands, green everywhere on 5th Ave.", address: "5th Avenue, Midtown Manhattan", notes: "Arrive early for a good spot around 50th St. Wear green! Huge crowds — stay together.", status: "upcoming" },
    ],
    afternoon: [
      { id: "4a1", name: "Koreatown Lunch", category: "food", time: "13:00", price: "$$", duration: "60 min", description: "K-Town is right near the parade route. Korean BBQ, fried chicken, or bibimbap.", address: "32nd St between 5th & 6th Ave, Manhattan", notes: "BCD Tofu House or Her Name is Han are great picks. Sit-down meal to recover from the crowds.", status: "upcoming" },
      { id: "4a2", name: "Empire State Building", category: "sightseeing", time: "14:30", price: "$$$", duration: "90 min", description: "The iconic observation deck. 86th floor outdoor terrace is a must.", address: "20 W 34th St, New York, NY 10001", notes: "Pre-book Express Pass to skip the line. 5 min walk from K-Town.", status: "upcoming" },
      { id: "4a3", name: "Rest & Freshen Up", category: "hotel", time: "16:30", price: "free", duration: "90 min", description: "Head back to hotel. Shower and rest before the St. Paddy's evening festivities.", address: "77 Ludlow St, New York, NY 10002", notes: "You'll want energy for tonight! Quick nap recommended.", status: "upcoming" },
    ],
    evening: [
      { id: "4e1", name: "McSorley's Old Ale House", category: "bar", time: "19:00", price: "$", duration: "60 min", description: "NYC's oldest bar (1854). They only serve light or dark ale — two at a time.", address: "15 E 7th St, New York, NY 10003", notes: "Cash only! Will be buzzing on St. Patrick's Day. 10 min walk from hotel.", status: "upcoming" },
      { id: "4e2", name: "East Village Bar Hop", category: "nightlife", time: "20:30", price: "$$", duration: "150 min", description: "2-3 bars max in the East Village / LES. The whole city is celebrating.", address: "East Village, Manhattan", notes: "Stay near the hotel so you can walk home. Pace yourselves! 🍀 Hydrate between drinks.", status: "upcoming" },
    ],
  },
  5: {
    // Wednesday Mar 18 — Last day. Chill morning, pack up, head to airport.
    morning: [
      { id: "5m1", name: "Russ & Daughters", category: "food", time: "09:00", price: "$$", duration: "45 min", description: "Legendary appetizing shop since 1914. Lox, bagels, smoked fish perfection.", address: "179 E Houston St, New York, NY 10002", notes: "The classic combo: bagel, cream cheese, nova lox. 5 min from hotel — perfect last breakfast.", status: "upcoming" },
      { id: "5m2", name: "Last Walk — Washington Square Park", category: "walk", time: "10:00", price: "free", duration: "45 min", description: "Soak in Greenwich Village. Street performers, the arch, NYU campus vibes.", address: "Washington Square Park, New York, NY 10012", notes: "Great final NYC memory spot. Grab a last coffee.", status: "upcoming" },
    ],
    afternoon: [
      { id: "5a1", name: "Pack & Check Out", category: "hotel", time: "12:00", price: "free", duration: "60 min", description: "Pack up, check out of Madison LES. Hotel can hold bags if needed.", address: "77 Ludlow St, New York, NY 10002", notes: "Checkout is usually 11am — ask for late checkout. Buy last-minute souvenirs on the way.", status: "upcoming" },
      { id: "5a2", name: "Head to Newark Airport", category: "sightseeing", time: "16:00", price: "$$", duration: "90 min", description: "NJ Transit or Uber to EWR. Flight is at 19:55, arrive 3hrs early for international.", address: "Newark Liberty International Airport", notes: "PATH train + AirTrain (~$15) or Uber (~$50-70). Leave plenty of buffer time.", status: "upcoming" },
    ],
    evening: [
      { id: "5e1", name: "Flight Home ✈️", category: "sightseeing", time: "19:55", price: "free", duration: "480 min", description: "UA 994 EWR → BRU. Overnight flight, arrive 08:05+1. Tot ziens, New York! 🗽", address: "Newark Liberty International Airport, Terminal C", notes: "Boarding starts ~19:20. Gate closes 19:40.", status: "upcoming" },
    ],
  },
};
