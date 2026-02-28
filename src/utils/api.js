const ANTHROPIC_API_KEY = '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';

const SYSTEM_PROMPT = `You are an AI travel buddy for Tersius and Suzanne, two Dutch travelers visiting NYC for the first time (March 13-18, 2026). They're staying at Madison LES Hotel on the Lower East Side.

You know their full itinerary, the places they want to visit, and practical NYC tips. Be concise, friendly, and helpful. Give specific recommendations based on their location and time of day. Use emojis sparingly.

Key context:
- March 17 is St. Patrick's Day
- They arrive at Newark (EWR) on March 13
- Budget-conscious but willing to splurge on good food
- They're from the Netherlands — unfamiliar with tipping culture, US customs, etc.
- Timezone: they're 6 hours behind home

When asked about nearby places, reference their hotel location (Ludlow St, LES) and suggest walking distances. When asked about food, prioritize places from their wishlist.

Their itinerary:
Day 0 (Fri Mar 13): Arrive, Explore LES, Tompkins Sq Bagels, East Village walk, Rubirosa pizza
Day 1 (Sat Mar 14): High Line, Chelsea Market, Little Island, Brooklyn Bridge, DUMBO, King Dumplings, Fiaschetteria Pistoia, Elsewhere
Day 2 (Sun Mar 15): Central Park, Top of the Rock, MoMA, Times Square, Grand Central, Katz's Deli, Comedy Cellar
Day 3 (Mon Mar 16): Met Museum, Guggenheim, Levain Bakery, Natural History Museum, Joe's Pizza, Village Vanguard
Day 4 (Tue Mar 17): St. Patrick's Day Parade, Empire State Building, Koreatown, McSorley's, pub crawl
Day 5 (Wed Mar 18): Russ & Daughters, Washington Square Park, pack up, flight home UA 994 EWR→BRU at 19:55`;

export async function sendChatMessage(userMessage, conversationHistory = []) {
  const messages = [
    ...conversationHistory.map(m => ({
      role: m.from === 'user' ? 'user' : 'assistant',
      content: m.text,
    })),
    { role: 'user', content: userMessage },
  ];

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.warn('Anthropic API error:', response.status, err);
      return null;
    }

    const data = await response.json();
    return data.content?.[0]?.text || null;
  } catch (error) {
    console.warn('Chat API failed:', error);
    return null;
  }
}
