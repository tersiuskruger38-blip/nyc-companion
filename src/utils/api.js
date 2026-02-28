import Constants from 'expo-constants';

const ANTHROPIC_API_KEY = Constants.expoConfig?.extra?.anthropicApiKey || '';

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
Day 0 (Fri Mar 13): Arrive, Explore LES, Tompkins Sq Bagels, Rubirosa pizza
Day 1 (Sat Mar 14): High Line, Chelsea Market, Little Island, Brooklyn Bridge, DUMBO, rest at hotel, King Dumplings, Fiaschetteria Pistoia
Day 2 (Sun Mar 15): Central Park, Top of the Rock, lunch, MoMA (only museum today), Times Square quick stop, Grand Central, Katz's Deli, Comedy Cellar
Day 3 (Mon Mar 16): Met Museum (only museum today), Central Park upper loop, Levain Bakery, Upper West Side stroll, rest at hotel, Joe's Pizza, Village Vanguard
Day 4 (Tue Mar 17): St. Patrick's Day Parade, Koreatown lunch, Empire State Building, rest, McSorley's, East Village bar hop
Day 5 (Wed Mar 18): Russ & Daughters, Washington Square Park, pack up, flight home UA 994 EWR→BRU at 19:55

Important: They only have 2 museum visits planned (MoMA on Day 2, Met on Day 3). They need rest breaks — suggest downtime when they seem overloaded. They'll be walking a lot so factor in fatigue, especially after Day 2.`;

export async function sendChatMessage(userMessage, conversationHistory = [], settings = null) {
  let systemPrompt = SYSTEM_PROMPT;
  if (settings) {
    const prefs = [];
    if (settings.preferIndoor) prefs.push('They prefer indoor activities when possible.');
    if (settings.budgetLevel === 'budget') prefs.push('They are very budget-conscious.');
    if (settings.budgetLevel === 'splurge') prefs.push('They are happy to splurge on great experiences.');
    if (settings.walkingComfort === 'minimal') prefs.push('They prefer minimal walking — suggest nearby options and transit.');
    if (settings.walkingComfort === 'marathon') prefs.push('They love walking and exploring on foot.');
    if (settings.avoidCrowds) prefs.push('They prefer avoiding crowded tourist spots.');
    if (settings.foodPreferences?.length) prefs.push(`Food preferences: ${settings.foodPreferences.join(', ')}.`);
    if (prefs.length) systemPrompt += '\n\nUser preferences:\n' + prefs.join('\n');
  }

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
        system: systemPrompt,
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

export async function getSwapSuggestion(activity, weather, dayLabel, settings = null) {
  const prompt = `I need a replacement for this activity because of weather:

Activity: ${activity.name} (${activity.category}, ${activity.time}, ${activity.duration})
Weather: ${weather.label}, ${weather.temp}°C, ${weather.wind} km/h wind, ${weather.rain}% rain chance
Day: ${dayLabel}

${settings?.preferIndoor ? 'I prefer indoor activities.' : ''}
${settings?.budgetLevel === 'budget' ? 'Keep it cheap.' : ''}

Suggest ONE specific replacement activity. Reply in this exact JSON format only, no other text:
{"name":"...","category":"museum|food|entertainment|shopping|sightseeing","time":"${activity.time}","duration":"...","price":"free|$|$$|$$$","description":"...","address":"...","notes":"...","reason":"Why this is a better pick"}`;

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
        max_tokens: 300,
        system: 'You are an NYC activity recommender. Respond with valid JSON only, no markdown or extra text.',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const text = data.content?.[0]?.text;
    if (!text) return null;
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.warn('Swap suggestion failed:', error);
    return null;
  }
}
