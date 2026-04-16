import type { Scene } from './types'

export const SCENES: Scene[] = [
  // Scene 1 — Guest Audio
  {
    type: 'guest-audio',
    id: 1,
    title: 'First Impression',
    situation: 'A couple arrives at the restaurant. The hostess is presenting them to you.',
    guestNationality: 'american',
    guestGender: 'male',
    guestAudio:
      "Good evening. The hostess said you'd be taking care of us tonight. We have a reservation — table for two, anniversary dinner.",
    rickTip:
      'Use the guest\'s name if the hostess mentioned it. Smile, make eye contact, and open with a warm personalized greeting. Never say "no problem" or "sure".',
    evaluationCriteria:
      'Proper greeting with name, warm tone, acknowledgment of the occasion, professional language, no filler words',
    sopReference: 'Forbes SOP 1.1 — Arrival & First Contact',
  },

  // Scene 2 — Inspector
  {
    type: 'inspector',
    id: 2,
    title: 'Seating Sequence',
    situation: 'The couple is walking toward their table.',
    inspectorMessage:
      'The guests are approaching the table — what is the correct Forbes 5-star seating sequence?',
    options: [
      {
        label: 'Pull the chair for the lady first, then the gentleman, present menus closed',
        quality: 'excellent',
        explanation:
          'Correct Forbes sequence: lady first, then gentleman, menus presented closed face-down until guests are settled.',
      },
      {
        label: 'Let guests choose their seats, then hand menus open to both simultaneously',
        quality: 'tricky',
        explanation:
          'Guests should never have to choose — the waiter guides. Menus are not handed open.',
      },
      {
        label: 'Point to the table and tell guests to sit wherever they prefer',
        quality: 'wrong',
        explanation: 'Completely contrary to Forbes standards. No pointing, no self-seating.',
      },
    ],
    correctIndex: 0,
    sopReference: 'Forbes SOP 2.1 — Seating Protocol',
  },

  // Scene 3 — Guest Audio
  {
    type: 'guest-audio',
    id: 3,
    title: 'Menu Presentation',
    situation: 'The couple is now seated. The gentleman speaks.',
    guestNationality: 'british',
    guestGender: 'male',
    guestAudio:
      "Right, we're ready for the menu. Also — do you have a tasting menu this evening? My wife is rather fond of those.",
    rickTip:
      'Present the menu with both hands, open to the first page. Confirm the tasting menu with enthusiasm. Never say "I don\'t know" — say "Allow me to check for you."',
    evaluationCriteria:
      'Confident menu presentation, tasting menu knowledge or graceful recovery, proper language register for British guest',
    sopReference: 'Forbes SOP 3.1 — Menu Presentation',
  },

  // Scene 4 — Inspector
  {
    type: 'inspector',
    id: 4,
    title: 'Menu Delivered — Next Step',
    situation: 'You have just presented the menus to both guests.',
    inspectorMessage:
      'Menus have been delivered. What is the correct Forbes next step before leaving the table?',
    options: [
      {
        label:
          'Offer still or sparkling water, mention the chef\'s special, and excuse yourself gracefully',
        quality: 'excellent',
        explanation:
          'Forbes standard: always offer water choice, mention a highlight, and excuse yourself with a phrase like "Take your time — I\'ll return shortly."',
      },
      {
        label: 'Ask if they are ready to order',
        quality: 'tricky',
        explanation:
          'Too rushed. Guests need time to settle. Asking immediately creates pressure — contrary to Forbes pacing.',
      },
      {
        label: 'Walk away and wait for them to call you',
        quality: 'wrong',
        explanation: 'Passive service is never acceptable at Forbes 5-star level.',
      },
    ],
    correctIndex: 0,
    sopReference: 'Forbes SOP 3.2 — Post-Menu Protocol',
  },

  // Scene 5 — Guest Audio
  {
    type: 'guest-audio',
    id: 5,
    title: 'Recommendation Request',
    situation: 'The couple has been reading the menu for a few minutes. The lady speaks.',
    guestNationality: 'french',
    guestGender: 'female',
    guestAudio:
      "Excusez-moi — we are having trouble deciding. What would you personally recommend for a special evening? Something light but memorable.",
    rickTip:
      'Never say "everything is good." Pick one specific dish, describe it with sensory language — texture, origin, preparation. Show passion. Make her feel special.',
    evaluationCriteria:
      'Specific confident recommendation, sensory description, personal touch, no generic phrases, appropriate language for French guest',
    sopReference: 'Forbes SOP 4.1 — Suggestive Selling',
  },

  // Scene 6 — Inspector
  {
    type: 'inspector',
    id: 6,
    title: 'Water & Eye Contact',
    situation: 'The table has been set with water. A guest glances up briefly.',
    inspectorMessage:
      'While guests read the menu, a guest briefly makes eye contact with you from across the room. What do you do?',
    options: [
      {
        label: 'Give a subtle acknowledging nod and move discreetly closer to be available',
        quality: 'excellent',
        explanation:
          'Forbes standard: always acknowledge eye contact — never ignore a guest. A nod signals attentiveness without interruption.',
      },
      {
        label: 'Approach immediately and ask what they need',
        quality: 'tricky',
        explanation:
          'Too aggressive. Eye contact may be accidental. Approach only if sustained or accompanied by a gesture.',
      },
      {
        label: 'Continue what you are doing — they will call you if needed',
        quality: 'wrong',
        explanation:
          'Ignoring guest eye contact is a Forbes violation. Attentiveness is non-negotiable.',
      },
    ],
    correctIndex: 0,
    sopReference: 'Forbes SOP 5.1 — Floor Presence & Attentiveness',
  },

  // Scene 7 — Guest Audio
  {
    type: 'guest-audio',
    id: 7,
    title: 'Taking the Order',
    situation: 'The couple closes their menus — the signal they are ready.',
    guestNationality: 'italian',
    guestGender: 'male',
    guestAudio:
      "We will start with the burrata and the beef carpaccio. For main — she will have the sea bass and I want the Wagyu, medium rare. And please — no rush. Tonight we celebrate.",
    rickTip:
      'Repeat the order back precisely — dish name, preparation, who gets what. Acknowledge the occasion warmly. Write it down; never pretend to memorize.',
    evaluationCriteria:
      'Order confirmation with correct repetition, acknowledgment of celebration, no rushing language, professional close',
    sopReference: 'Forbes SOP 6.1 — Order Taking',
  },

  // Scene 8 — Inspector
  {
    type: 'inspector',
    id: 8,
    title: 'After Taking the Order',
    situation: 'You have confirmed the order. The guests are relaxed.',
    inspectorMessage: 'Order taken and confirmed. What is the exact Forbes sequence before heading to the kitchen?',
    options: [
      {
        label:
          'Collect the menus gracefully, suggest a wine pairing, confirm timing, then excuse yourself',
        quality: 'excellent',
        explanation:
          'Menus must be removed — leaving them is clutter. A wine suggestion adds value. Confirming timing manages expectations.',
      },
      {
        label: 'Take the menus and go directly to the kitchen without another word',
        quality: 'tricky',
        explanation:
          'Removing menus is correct but leaving without excusing yourself or offering wine is incomplete Forbes service.',
      },
      {
        label: 'Leave the menus in case guests want to change their minds',
        quality: 'wrong',
        explanation:
          'Menus stay on the table only until the order is placed. Leaving them after is poor table management.',
      },
    ],
    correctIndex: 0,
    sopReference: 'Forbes SOP 6.2 — Post-Order Protocol',
  },

  // Scene 9 — Guest Audio
  {
    type: 'guest-audio',
    id: 9,
    title: 'Bread Service & Water Request',
    situation: 'You have served the bread basket. The lady speaks.',
    guestNationality: 'american',
    guestGender: 'female',
    guestAudio:
      "Oh this bread looks amazing. Could we get some sparkling water? And actually — what's in the bread basket? My husband has a gluten sensitivity.",
    rickTip:
      'Address the allergy first — always before anything else. Get confirmation from the kitchen. Then handle the water request. Safety before service.',
    evaluationCriteria:
      'Allergy handled first and seriously, proper escalation language, water confirmation, no panic or dismissiveness',
    sopReference: 'Forbes SOP 7.1 — Allergy Protocol',
  },

  // Scene 10 — Inspector
  {
    type: 'inspector',
    id: 10,
    title: 'Waiting for the Starter',
    situation: 'Guests are waiting. The kitchen is slightly delayed.',
    inspectorMessage:
      'The starter is taking longer than expected. Guests have been waiting 12 minutes. What do you do?',
    options: [
      {
        label:
          'Approach proactively, acknowledge the wait without excuses, offer something (water, amuse-bouche) and give an updated time',
        quality: 'excellent',
        explanation:
          'Forbes standard: never let a guest notice a delay without acknowledgment. Proactive communication + a small gesture = retained trust.',
      },
      {
        label: 'Wait until they call you — they seem engaged in conversation',
        quality: 'tricky',
        explanation:
          'Do not assume engagement means comfort. A delay without communication is always felt, even if guests appear absorbed.',
      },
      {
        label: 'Tell them the kitchen is busy tonight',
        quality: 'wrong',
        explanation:
          'Never share operational problems with guests. It destroys confidence and is explicitly against Forbes standards.',
      },
    ],
    correctIndex: 0,
    sopReference: 'Forbes SOP 8.1 — Managing Delays',
  },

  // Scene 11 — Guest Audio
  {
    type: 'guest-audio',
    id: 11,
    title: 'Starter Served & Wine List',
    situation: 'You have just placed the starters. The gentleman speaks.',
    guestNationality: 'arabic',
    guestGender: 'male',
    guestAudio:
      "Excellent presentation, thank you. Now — we would like to see the wine list. I'm thinking something bold for the Wagyu. What do you suggest?",
    rickTip:
      'Present the wine list and lead with a specific recommendation. For Wagyu: Napa Cabernet, Barolo, or Brunello. Show confidence — uncertainty kills trust.',
    evaluationCriteria:
      'Confident specific wine recommendation, rationale given, proper wine list presentation, no vague language',
    sopReference: 'Forbes SOP 9.1 — Wine Service & Pairing',
  },

  // Scene 12 — Inspector
  {
    type: 'inspector',
    id: 12,
    title: 'Wine Service Sequence',
    situation: 'The guest has selected a bottle of red wine.',
    inspectorMessage: 'Guest has chosen a Barolo. What is the correct Forbes wine service sequence?',
    options: [
      {
        label:
          'Present the bottle to the host, open tableside, pour a tasting portion for the host, serve ladies first, then gentlemen, then top up the host',
        quality: 'excellent',
        explanation:
          'This is the exact Forbes sequence: present → open tableside → taste → ladies → gentlemen → host.',
      },
      {
        label:
          'Open the bottle at a side station, pour for everyone starting with the host, then ladies',
        quality: 'tricky',
        explanation:
          'Opening away from the table and starting with the host (before the taste) are both Forbes violations.',
      },
      {
        label: 'Pour wine for all guests at once to save time',
        quality: 'wrong',
        explanation: 'Speed over ritual is never acceptable in Forbes 5-star wine service.',
      },
    ],
    correctIndex: 0,
    sopReference: 'Forbes SOP 9.2 — Wine Pouring Protocol',
  },

  // Scene 13 — Guest Audio
  {
    type: 'guest-audio',
    id: 13,
    title: 'Main Course & Napkin Request',
    situation: 'You have just placed the main courses. The lady speaks.',
    guestNationality: 'japanese',
    guestGender: 'female',
    guestAudio:
      "The sea bass looks beautiful, thank you. Oh — I dropped my napkin on the floor. Could I have a fresh one? And could you add a little more lemon on the side?",
    rickTip:
      'Never pick up a dropped napkin from the floor and put it on the table. Bring a fresh folded one on a small tray. Handle the lemon request simultaneously — never make two separate trips.',
    evaluationCriteria:
      'Fresh napkin protocol followed (not floor napkin), presented on tray, lemon handled in same trip, graceful execution',
    sopReference: 'Forbes SOP 10.1 — Napkin & Linen Protocol',
  },

  // Scene 14 — Inspector
  {
    type: 'inspector',
    id: 14,
    title: 'Check-Back Timing',
    situation: 'Guests have been eating for about 3 minutes.',
    inspectorMessage:
      'Guests are eating their main course. When and how should you do the Forbes check-back?',
    options: [
      {
        label:
          'After 2-3 bites, approach quietly and ask if everything is to their satisfaction — one question, then step back',
        quality: 'excellent',
        explanation:
          'Forbes check-back: early enough to correct issues, non-intrusive, one question only. Do not linger.',
      },
      {
        label: 'Wait until they are halfway through to avoid interrupting',
        quality: 'tricky',
        explanation:
          'Too late — if there is an issue, half the meal is gone. Forbes mandates early check-back while correction is still possible.',
      },
      {
        label: 'Ask repeatedly every few minutes if everything is okay',
        quality: 'wrong',
        explanation: 'Excessive check-ins are intrusive and destroy the dining experience.',
      },
    ],
    correctIndex: 0,
    sopReference: 'Forbes SOP 11.1 — Check-Back Standards',
  },

  // Scene 15 — Guest Audio
  {
    type: 'guest-audio',
    id: 15,
    title: 'Dessert Conversation',
    situation: 'The couple is nearly finished with their main course. The gentleman speaks.',
    guestNationality: 'german',
    guestGender: 'male',
    guestAudio:
      "Compliments to the chef — the Wagyu was extraordinary. I must say, this has been a wonderful evening. Now — what desserts would you recommend? Something to share, perhaps?",
    rickTip:
      'Use this moment — he is happy. Reinforce the compliment warmly, then pivot to dessert with enthusiasm. Recommend a shareable dessert with specific sensory detail. This is your upsell moment.',
    evaluationCriteria:
      'Warm compliment acknowledgment, specific shareable dessert recommendation, sensory language, clean upsell without pressure',
    sopReference: 'Forbes SOP 12.1 — Dessert Presentation & Upselling',
  },

  // Scene 16 — Inspector
  {
    type: 'inspector',
    id: 16,
    title: 'Table Clearing Sequence',
    situation: 'Both guests have finished their main courses.',
    inspectorMessage: 'Main courses are finished. What is the correct Forbes table-clearing sequence?',
    options: [
      {
        label:
          'Ask permission to clear, remove plates from the right, clear crumbs with a crumber, reset cutlery for dessert',
        quality: 'excellent',
        explanation:
          'Forbes sequence: ask → clear from right → crumb the table → reset. All four steps are mandatory.',
      },
      {
        label: 'Clear plates quickly from either side, then ask if they want dessert',
        quality: 'tricky',
        explanation:
          'No permission asked, clearing from any side, no crumbing, no cutlery reset — multiple Forbes violations.',
      },
      {
        label: 'Stack the plates at the table for efficiency',
        quality: 'wrong',
        explanation: 'Stacking plates tableside is strictly prohibited in Forbes fine dining.',
      },
    ],
    correctIndex: 0,
    sopReference: 'Forbes SOP 13.1 — Table Clearing Protocol',
  },

  // Scene 17 — Guest Audio
  {
    type: 'guest-audio',
    id: 17,
    title: 'Dessert & Bill Request',
    situation: 'Dessert has been served. The lady speaks after a few bites.',
    guestNationality: 'russian',
    guestGender: 'female',
    guestAudio:
      "This soufflé is divine. We are almost ready — could you bring the bill when you have a moment? No rush, but we have a theatre at nine.",
    rickTip:
      'Acknowledge the theatre — this gives you a time constraint to work with. Do not rush visibly, but move with purpose. Bring the bill in a branded folder, not handed loosely.',
    evaluationCriteria:
      'Acknowledgment of time constraint, professional bill delivery protocol, no rushing language, branded folder reference',
    sopReference: 'Forbes SOP 14.1 — Bill Presentation',
  },

  // Scene 18 — Inspector
  {
    type: 'inspector',
    id: 18,
    title: 'Farewell Protocol',
    situation: 'The couple is putting on their coats and preparing to leave.',
    inspectorMessage: 'Guests are departing. What is the Forbes 5-star farewell sequence?',
    options: [
      {
        label:
          'Assist with coats, escort to the exit, thank them by name, wish them well for the occasion, invite them to return',
        quality: 'excellent',
        explanation:
          'The Forbes farewell must be personal: coat assist → escort → name → occasion acknowledgment → return invitation. All five.',
      },
      {
        label: 'Say "thank you, have a good night" and begin resetting the table',
        quality: 'tricky',
        explanation:
          'Generic farewell and immediate table reset while guests are still present are both Forbes violations.',
      },
      {
        label: 'Wave and tell them to enjoy the rest of their evening',
        quality: 'wrong',
        explanation: 'Waving is not appropriate in Forbes fine dining. No personal touch, no escort.',
      },
    ],
    correctIndex: 0,
    sopReference: 'Forbes SOP 15.1 — Departure Protocol',
  },
]

export const TOTAL_SCENES = SCENES.length // 18
export const TIMER_SECONDS = 45
export const GUEST_AUDIO_SCENES = SCENES.filter((s) => s.type === 'guest-audio').length // 9
export const INSPECTOR_SCENES = SCENES.filter((s) => s.type === 'inspector').length // 9
