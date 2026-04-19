export interface PosMenuItem {
  id: string
  name: string
  short: string
  category: 'starter' | 'main' | 'dessert' | 'drink'
}

export interface RequiredItem {
  itemId: string
  seat: number
  commentKeyword?: string
  commentType?: 'food' | 'drink'
  held?: boolean
}

export interface PosScenario {
  id: string
  tableNumber: number
  seats: number
  narrative: string
  requiredItems: RequiredItem[]
  needsHold: boolean
  difficulty: 1 | 2 | 3
  timeSeconds: number
  basePoints: number
  tip: string
}

export const DEMO_MENU: Record<string, PosMenuItem[]> = {
  starter: [
    { id: 's1', name: 'Burrata',       short: 'BURRATA',  category: 'starter' },
    { id: 's2', name: 'Tuna Tartare',  short: 'TUNA TAR', category: 'starter' },
    { id: 's3', name: 'Caesar Salad',  short: 'CAESAR',   category: 'starter' },
    { id: 's4', name: 'Soup du Jour',  short: 'SOUP',     category: 'starter' },
  ],
  main: [
    { id: 'm1', name: 'Sea Bass',       short: 'SEA BASS', category: 'main' },
    { id: 'm2', name: 'Wagyu Fillet',   short: 'WAGYU',    category: 'main' },
    { id: 'm3', name: 'Roast Chicken',  short: 'CHICKEN',  category: 'main' },
    { id: 'm4', name: 'Rack of Lamb',   short: 'LAMB',     category: 'main' },
    { id: 'm5', name: 'Truffle Risotto',short: 'RISOTTO',  category: 'main' },
    { id: 'm6', name: 'Vegan Tart',     short: 'VGN TART', category: 'main' },
  ],
  dessert: [
    { id: 'd1', name: 'Choc Fondant',  short: 'FONDANT',  category: 'dessert' },
    { id: 'd2', name: 'Crème Brûlée', short: 'CR BRULEE', category: 'dessert' },
    { id: 'd3', name: 'Fruit Sorbet',  short: 'SORBET',   category: 'dessert' },
    { id: 'd4', name: 'Cheese Board',  short: 'CHEESE',   category: 'dessert' },
  ],
  drink: [
    { id: 'dr1', name: 'Chablis (glass)',    short: 'CHABLIS',  category: 'drink' },
    { id: 'dr2', name: 'Barolo (glass)',     short: 'BAROLO',   category: 'drink' },
    { id: 'dr3', name: 'Sparkling Water',   short: 'SPARK H2O',category: 'drink' },
    { id: 'dr4', name: 'Still Water',       short: 'STILL H2O',category: 'drink' },
    { id: 'dr5', name: 'Rosé (glass)',      short: 'ROSÉ',     category: 'drink' },
    { id: 'dr6', name: 'Espresso',          short: 'ESPRESSO', category: 'drink' },
  ],
}

export const ALL_ITEMS: PosMenuItem[] = Object.values(DEMO_MENU).flat()

export const SCENARIOS: PosScenario[] = [
  {
    id: 'sc1', tableNumber: 3, seats: 1,
    narrative: '"Good evening. Just the Sea Bass for me, thank you."',
    requiredItems: [{ itemId: 'm1', seat: 1 }],
    needsHold: false, difficulty: 1, timeSeconds: 120, basePoints: 100,
    tip: 'Open Table 3 → MAINS → SEA BASS → SEND',
  },
  {
    id: 'sc2', tableNumber: 7, seats: 2,
    narrative: '"Two of us tonight. I\'ll have the Wagyu and my partner will have the Sea Bass."',
    requiredItems: [{ itemId: 'm2', seat: 1 }, { itemId: 'm1', seat: 2 }],
    needsHold: false, difficulty: 1, timeSeconds: 120, basePoints: 150,
    tip: 'Seat 1 → WAGYU · Seat 2 → SEA BASS',
  },
  {
    id: 'sc3', tableNumber: 11, seats: 1,
    narrative: '"I\'d like the Tuna Tartare to start, and then the Lamb Rack. Send the starter first please."',
    requiredItems: [
      { itemId: 's2', seat: 1 },
      { itemId: 'm4', seat: 1, held: true },
    ],
    needsHold: true, difficulty: 2, timeSeconds: 110, basePoints: 200,
    tip: 'TUNA TARTARE → HOLD COURSE → LAMB RACK → SEND',
  },
  {
    id: 'sc4', tableNumber: 5, seats: 1,
    narrative: '"The Sea Bass please — I must tell you I\'m severely allergic to dairy. No butter at all."',
    requiredItems: [{ itemId: 'm1', seat: 1, commentKeyword: 'dairy', commentType: 'food' }],
    needsHold: false, difficulty: 2, timeSeconds: 100, basePoints: 200,
    tip: 'SEA BASS → FOOD COMMENT → "NO DAIRY" → OK → SEND',
  },
  {
    id: 'sc5', tableNumber: 14, seats: 3,
    narrative: '"Three of us. Seat 1: Caesar then Chicken. Seat 2: Wagyu. Seat 3: Risotto."',
    requiredItems: [
      { itemId: 's3', seat: 1 },
      { itemId: 'm3', seat: 1, held: true },
      { itemId: 'm2', seat: 2 },
      { itemId: 'm5', seat: 3 },
    ],
    needsHold: true, difficulty: 2, timeSeconds: 100, basePoints: 300,
    tip: 'Seat 1: CAESAR → HOLD → CHICKEN. Seat 2: WAGYU. Seat 3: RISOTTO',
  },
  {
    id: 'sc6', tableNumber: 8, seats: 2,
    narrative: '"Seat 1: Burrata then Sea Bass — she\'s dairy-free, no butter. Seat 2: Wagyu, medium-rare."',
    requiredItems: [
      { itemId: 's1', seat: 1 },
      { itemId: 'm1', seat: 1, held: true, commentKeyword: 'dairy', commentType: 'food' },
      { itemId: 'm2', seat: 2, commentKeyword: 'medium', commentType: 'food' },
    ],
    needsHold: true, difficulty: 3, timeSeconds: 90, basePoints: 400,
    tip: 'BURRATA (S1) → HOLD → SEA BASS + FOOD CMT "NO DAIRY" (S1) → WAGYU + FOOD CMT "MEDIUM RARE" (S2)',
  },
  {
    id: 'sc7', tableNumber: 19, seats: 2,
    narrative: '"It\'s our anniversary! Seat 1: Tuna Tartare then Lamb. Seat 2: Burrata then Sea Bass, no dairy. Note anniversary in system."',
    requiredItems: [
      { itemId: 's2', seat: 1 },
      { itemId: 'm4', seat: 1, held: true },
      { itemId: 's1', seat: 2 },
      { itemId: 'm1', seat: 2, held: true, commentKeyword: 'dairy', commentType: 'food' },
    ],
    needsHold: true, difficulty: 3, timeSeconds: 80, basePoints: 500,
    tip: '2 starters → HOLD → 2 mains. Sea Bass needs FOOD CMT "NO DAIRY". Add FOOD CMT "ANNIVERSARY".',
  },
  {
    id: 'sc8', tableNumber: 2, seats: 4,
    narrative: '"Four guests. S1: Wagyu. S2: Sea Bass — nut allergy. S3: Risotto, no truffle. S4: Vegan Tart. Plus Chablis and Sparkling Water."',
    requiredItems: [
      { itemId: 'm2', seat: 1 },
      { itemId: 'm1', seat: 2, commentKeyword: 'nut', commentType: 'food' },
      { itemId: 'm5', seat: 3, commentKeyword: 'truffle', commentType: 'food' },
      { itemId: 'm6', seat: 4 },
      { itemId: 'dr1', seat: 1 },
      { itemId: 'dr3', seat: 2 },
    ],
    needsHold: false, difficulty: 3, timeSeconds: 80, basePoints: 600,
    tip: '4 mains with comments → DRINKS tab → CHABLIS + SPARKLING WATER',
  },
]
