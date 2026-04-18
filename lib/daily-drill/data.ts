export interface DrillQuestion {
  id: string
  question: string
  options: [string, string, string, string]
  correct: number
  reveal: string
  category: string
  xp: number
}

export const DRILL_POOL: DrillQuestion[] = [
  {
    id: 'd01', xp: 20, category: 'Vocabulary',
    question: 'What does "mise en place" mean in a professional kitchen?',
    options: ['A French dessert', 'Everything in its place — all ingredients prepped before service', 'The head chef\'s station', 'A method of plating food'],
    correct: 1,
    reveal: '"Mise en place" is French for "everything in its place." It means having all ingredients measured, cut and ready before service begins. It\'s a core principle of professional kitchen discipline.',
  },
  {
    id: 'd02', xp: 20, category: 'Guest Service',
    question: 'A guest says their food is cold. What is the best first response?',
    options: ['Tell them the kitchen is busy', 'Apologise sincerely and offer to replace the dish immediately', 'Ask them to wait a few more minutes', 'Offer a discount on their bill'],
    correct: 1,
    reveal: 'Always acknowledge the issue with a genuine apology first. Say: "I\'m so sorry about that. Let me take this back to the kitchen and have a fresh one prepared for you right away."',
  },
  {
    id: 'd03', xp: 20, category: 'Vocabulary',
    question: 'What is a "sommelier"?',
    options: ['A French appetiser', 'A kitchen trainee', 'A trained wine professional who advises on wine selection and service', 'The person who plates desserts'],
    correct: 2,
    reveal: 'A sommelier is a trained wine steward — an expert in wine selection, service, and food pairing. In a luxury restaurant, the sommelier helps guests choose the right wine for their meal.',
  },
  {
    id: 'd04', xp: 20, category: 'Phrases',
    question: 'How do you correctly offer water to a table?',
    options: ['"Do you want water?"', '"Water?"', '"Still or sparkling water for you this evening?"', '"Can I get you something to drink?"'],
    correct: 2,
    reveal: 'In fine dining, always offer choices with "still or sparkling." The phrasing "for you this evening" adds a touch of personalisation. Avoid one-word questions — they sound abrupt.',
  },
  {
    id: 'd05', xp: 20, category: 'Vocabulary',
    question: 'What does "al dente" mean when describing pasta?',
    options: ['Overcooked and soft', 'Cooked with olive oil', 'Firm to the bite — cooked but not soft', 'Served with extra sauce'],
    correct: 2,
    reveal: '"Al dente" is Italian for "to the tooth." It describes pasta or vegetables cooked until just firm when bitten — not hard, not mushy. This is considered the correct texture in professional cooking.',
  },
  {
    id: 'd06', xp: 20, category: 'Guest Service',
    question: 'A guest asks for your recommendation. What should you do first?',
    options: ['Recommend the most expensive dish', 'Ask about their preferences before suggesting anything', 'Recommend whatever is fastest to prepare', 'Say you don\'t have a personal preference'],
    correct: 1,
    reveal: 'Before recommending, ask: "Are you in the mood for something light, or something more hearty this evening?" or "Do you have any dietary preferences?" Tailored recommendations feel personal and professional.',
  },
  {
    id: 'd07', xp: 20, category: 'Vocabulary',
    question: 'What is an "amuse-bouche"?',
    options: ['A large sharing plate', 'A palate cleanser served between courses', 'A single complimentary bite from the chef, not on the menu', 'A type of dessert wine'],
    correct: 2,
    reveal: 'An amuse-bouche (French for "mouth amuser") is a tiny complimentary bite sent by the chef. It\'s not on the menu and sets the tone for the meal — an early impression of the kitchen\'s style.',
  },
  {
    id: 'd08', xp: 20, category: 'Vocabulary',
    question: 'What does "prix fixe" mean?',
    options: ['A dish fixed with a price tag', 'A set-price menu with predetermined courses', 'An à la carte option', 'A daily special'],
    correct: 1,
    reveal: '"Prix fixe" (French for "fixed price") is a menu offering a full meal at one set price. Guests choose from limited options per course. Common in fine dining for tasting menus and special events.',
  },
  {
    id: 'd09', xp: 20, category: 'Phrases',
    question: 'How do you correctly announce a dish when serving it?',
    options: ['Place it silently without saying anything', 'Say the guest\'s name loudly', 'Briefly state the dish name and key elements as you place it', 'Ask the guest if it looks right'],
    correct: 2,
    reveal: 'When placing a dish, say something like: "This is your pan-seared sea bass with lemon butter and seasonal vegetables." Keep it brief — 1–2 sentences. This confirms the order and adds a professional touch.',
  },
  {
    id: 'd10', xp: 20, category: 'Guest Service',
    question: 'A guest is celebrating a birthday. What should a professional waiter do?',
    options: ['Nothing — it is not your job', 'Mention it to the manager and suggest a small gesture from the kitchen', 'Ask them loudly in front of other guests', 'Offer a discount without approval'],
    correct: 1,
    reveal: 'Inform your manager or kitchen team. Most luxury restaurants offer a complimentary dessert or a small personalised touch. Proactively creating memorable moments is what separates good service from great service.',
  },
  {
    id: 'd11', xp: 20, category: 'Vocabulary',
    question: 'What is "upselling" in a restaurant context?',
    options: ['Charging too much for a dish', 'Suggesting premium additions or upgrades to enhance the guest\'s experience', 'Selling items the kitchen wants to clear', 'Recommending the cheapest option'],
    correct: 1,
    reveal: 'Upselling is the professional art of suggesting higher-value items — a premium wine pairing, truffle supplement, or aged spirit. Done well, it feels like personalised hospitality, not a sales pitch.',
  },
  {
    id: 'd12', xp: 20, category: 'Phrases',
    question: 'A guest is about to finish their main course. What should you say?',
    options: ['"Did you like it?"', '"Can I take that?"', '"May I clear your plate when you\'re ready?"', '"Dessert?"'],
    correct: 2,
    reveal: 'Always ask permission before clearing. "May I clear your plate when you\'re ready?" shows respect for the guest\'s pace. Never reach across or remove plates mid-conversation.',
  },
  {
    id: 'd13', xp: 20, category: 'Wine',
    question: 'Which wine typically pairs best with a grilled sea bass?',
    options: ['Full-bodied red like Cabernet Sauvignon', 'Light, crisp white like Sauvignon Blanc or Chablis', 'Sweet dessert wine', 'Rosé sparkling wine'],
    correct: 1,
    reveal: 'Light, delicate fish like sea bass calls for a crisp white wine. Sauvignon Blanc (Loire Valley) or Chablis (unoaked Chardonnay) are classic pairings — their acidity complements the fish without overpowering it.',
  },
  {
    id: 'd14', xp: 20, category: 'Vocabulary',
    question: 'What does "intermezzo" refer to in a fine dining meal?',
    options: ['A break between performers', 'A palate cleanser served between courses, usually sorbet', 'The main course', 'The dessert menu'],
    correct: 1,
    reveal: 'An intermezzo is a small palate cleanser — often a lemon or prosecco sorbet — served between the starter and main course (or between two heavy courses). It refreshes the palate for the next dish.',
  },
  {
    id: 'd15', xp: 20, category: 'Guest Service',
    question: 'How should you address a guest you do not know?',
    options: ['"Hey, what do you want?"', '"Buddy" or "mate"', '"Sir" or "Madam" — or use their name if you know it', 'By their first name immediately'],
    correct: 2,
    reveal: 'Always default to "Sir" or "Madam" for guests you haven\'t been introduced to. If you learn their name from a reservation, use "Mr [surname]" or "Ms [surname]" — unless they invite first-name terms.',
  },
  {
    id: 'd16', xp: 20, category: 'Phrases',
    question: 'A guest asks: "What\'s in this dish — I have a nut allergy." Best response?',
    options: ['"I think it\'s fine."', '"Let me check the ingredients list right now — I\'ll be back in a moment."', '"Most people are fine with it."', '"You can just remove the nuts."'],
    correct: 1,
    reveal: 'Never guess with allergens. Say: "I\'ll check with the kitchen right now to make sure. Please give me just a moment." Return with a definitive answer. An allergy mistake can be life-threatening.',
  },
  {
    id: 'd17', xp: 20, category: 'Vocabulary',
    question: 'What is a "tasting menu"?',
    options: ['A free sample menu', 'A multi-course chef\'s menu showcasing the kitchen\'s range, often 6–12 courses', 'A children\'s menu', 'A menu with pricing included'],
    correct: 1,
    reveal: 'A tasting menu (or dégustation menu) is a chef-curated experience of multiple small courses — typically 6 to 12. Each course is a small portion highlighting seasonal ingredients, technique, and the chef\'s vision.',
  },
  {
    id: 'd18', xp: 20, category: 'Wine',
    question: 'What does "tannin" mean in wine?',
    options: ['The sweetness level of a wine', 'A compound that creates a dry, grippy sensation in the mouth — found mainly in red wines', 'The colour of the wine', 'The age of the wine'],
    correct: 1,
    reveal: 'Tannins are natural polyphenols found in grape skins, seeds and oak barrels. They create a dry, astringent sensation. High-tannin wines (Cabernet Sauvignon, Barolo) are bold and age well.',
  },
  {
    id: 'd19', xp: 20, category: 'Guest Service',
    question: 'A guest complains about a long wait. You are not at fault. What do you say?',
    options: ['"It\'s not my fault, it\'s the kitchen."', '"I understand your frustration — let me check on your order right now and I\'ll be back to you in two minutes."', '"These things happen."', '"Other tables are waiting too."'],
    correct: 1,
    reveal: 'Never blame the kitchen in front of the guest. Take ownership of the experience and act immediately. Saying "I\'ll be back in two minutes" sets a clear expectation and shows you are in control.',
  },
  {
    id: 'd20', xp: 20, category: 'Vocabulary',
    question: 'What does "86" mean in restaurant language?',
    options: ['Table number 86', 'An item is sold out or unavailable', 'A customer complaint code', 'The temperature to rest meat'],
    correct: 1,
    reveal: '"86" is kitchen slang for an item being out of stock or unavailable. "We\'re 86 on the sea bass tonight" means it\'s sold out. It\'s used in fast communication between FOH (front of house) and BOH (back of house).',
  },
  {
    id: 'd21', xp: 20, category: 'Phrases',
    question: 'How do you greet a table professionally when you first approach?',
    options: ['"Hi guys, what are you having?"', '"Good evening. Welcome to [Restaurant Name]. My name is [Name] and I\'ll be taking care of you tonight."', '"Ready to order?"', '"Hello, have you been here before?"'],
    correct: 1,
    reveal: 'A professional greeting covers: time of day greeting, welcome to the restaurant, your name, and your role. This sets the tone and builds immediate rapport. Avoid casual openers like "Hi guys."',
  },
  {
    id: 'd22', xp: 20, category: 'Wine',
    question: 'When presenting a wine to a guest who ordered it, what should you do first?',
    options: ['Open it immediately', 'Pour a large glass to test', 'Show the label and confirm the wine with the guest before opening', 'Ask if they want ice'],
    correct: 2,
    reveal: 'Always present the bottle label to the person who ordered it, say the name and vintage, and wait for confirmation before opening. This avoids costly mistakes and shows precision.',
  },
  {
    id: 'd23', xp: 20, category: 'Guest Service',
    question: 'A VIP guest is unhappy with their seat. You cannot move them right now. What do you say?',
    options: ['"Sorry, nothing I can do."', '"That\'s the best table we have."', '"I completely understand, and I\'m personally going to arrange a better table for you as soon as one becomes available. In the meantime, may I offer you something from the bar?"', '"Someone else chose that table."'],
    correct: 2,
    reveal: 'Acknowledge the issue, take personal ownership, set a clear next step, and offer an immediate gesture of goodwill. This turns a potential complaint into a demonstration of exceptional service.',
  },
  {
    id: 'd24', xp: 20, category: 'Vocabulary',
    question: 'What does "FOH" stand for in a restaurant?',
    options: ['Full Order Handling', 'Front of House — the guest-facing area and staff', 'Food Operations Hub', 'Final Order Handoff'],
    correct: 1,
    reveal: 'FOH (Front of House) refers to all guest-facing areas: the dining room, bar, reception, and the staff who work there (waiters, hosts, sommeliers). BOH (Back of House) is the kitchen and prep areas.',
  },
  {
    id: 'd25', xp: 20, category: 'Phrases',
    question: 'A guest finishes their meal and says "Everything was lovely." What is the best response?',
    options: ['"Thanks."', '"No problem."', '"I\'m delighted to hear that. It was truly our pleasure to have you with us this evening."', '"I\'ll pass that on to the kitchen."'],
    correct: 2,
    reveal: 'Receive compliments graciously with warmth. "It was our pleasure" reinforces the guest\'s positive experience. You can also mention you\'ll pass the feedback to the kitchen — guests appreciate knowing the team is acknowledged.',
  },
  {
    id: 'd26', xp: 20, category: 'Wine',
    question: 'What is the correct temperature to serve a full-bodied red wine like Cabernet Sauvignon?',
    options: ['Straight from the fridge (8°C)', 'Room temperature in summer (28°C)', 'Slightly below room temperature (16–18°C)', 'Warm (22°C+)'],
    correct: 2,
    reveal: 'Red wines are best served slightly below room temperature — around 16–18°C. Too warm and the alcohol dominates; too cold and the aromas are muted. Always store reds away from direct heat.',
  },
  {
    id: 'd27', xp: 20, category: 'Guest Service',
    question: 'A guest at another table signals to you — but it\'s not your table. What do you do?',
    options: ['Ignore them — not your section', 'Walk past and pretend you didn\'t see', 'Acknowledge them immediately, attend to their need or find their waiter', 'Tell them their waiter will be with them soon without stopping'],
    correct: 2,
    reveal: 'In a professional restaurant, every guest is everyone\'s guest. Acknowledge the signal immediately — even a nod and "I\'ll be right with you" matters. Then either help directly or find their server immediately.',
  },
  {
    id: 'd28', xp: 20, category: 'Vocabulary',
    question: 'What does "cover" mean in restaurant operations?',
    options: ['The tablecloth', 'A plate cover to keep food warm', 'One guest served — restaurants track revenue and efficiency by "covers per shift"', 'The entrance of the restaurant'],
    correct: 2,
    reveal: 'A "cover" is one guest served. A restaurant that does "120 covers on a Friday night" served 120 guests. It\'s used to track service volume, revenue per cover, and staff-to-guest ratios.',
  },
  {
    id: 'd29', xp: 20, category: 'Phrases',
    question: 'How do you professionally present the bill to a guest?',
    options: ['Slide it across the table quietly without eye contact', 'Drop it and walk away', '"Here\'s your bill — whenever you\'re ready, there\'s absolutely no rush."', '"That\'ll be £120 please."'],
    correct: 2,
    reveal: 'Place the bill holder gently, make brief eye contact, and say there\'s no rush. This removes any pressure the guest might feel and leaves a positive final impression before they leave.',
  },
  {
    id: 'd30', xp: 20, category: 'Guest Service',
    question: 'What does "anticipatory service" mean?',
    options: ['Serving food before the guest orders', 'Rushing service to finish quickly', 'Noticing and fulfilling a guest\'s need before they have to ask', 'Having all menu items ready in advance'],
    correct: 2,
    reveal: 'Anticipatory service is the highest level of hospitality — refilling a water glass before it\'s empty, offering a jacket stand when you see a guest struggling, bringing extra napkins before the messy dish arrives. The guest never has to ask.',
  },
]

export function getDailyQuestions(): DrillQuestion[] {
  const today = new Date()
  const seed = today.getFullYear() * 1000 + today.getMonth() * 31 + today.getDate()
  const shuffled = [...DRILL_POOL].sort((a, b) => {
    const ha = parseInt(a.id.slice(1)) * seed % 97
    const hb = parseInt(b.id.slice(1)) * seed % 97
    return ha - hb
  })
  return shuffled.slice(0, 5)
}

export function getTodayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}
