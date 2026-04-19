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
  pax: number
  guestName: string
  narrative: string
  requiredItems: RequiredItem[]
  needsHold: boolean
  difficulty: 1 | 2 | 3
  timeSeconds: number
  basePoints: number
  tip: string
}

function calcTime(pax: number): number {
  if (pax === 1) return 60
  if (pax <= 3) return 90
  if (pax <= 5) return 120
  return 150
}

export const DEMO_MENU: Record<string, PosMenuItem[]> = {
  starter: [
    { id: 's1', name: 'Burrata',        short: 'BURRATA',  category: 'starter' },
    { id: 's2', name: 'Tuna Tartare',   short: 'TUNA TAR', category: 'starter' },
    { id: 's3', name: 'Caesar Salad',   short: 'CAESAR',   category: 'starter' },
    { id: 's4', name: 'Soup du Jour',   short: 'SOUP',     category: 'starter' },
  ],
  main: [
    { id: 'm1', name: 'Sea Bass',        short: 'SEA BASS', category: 'main' },
    { id: 'm2', name: 'Wagyu Fillet',    short: 'WAGYU',    category: 'main' },
    { id: 'm3', name: 'Roast Chicken',   short: 'CHICKEN',  category: 'main' },
    { id: 'm4', name: 'Rack of Lamb',    short: 'LAMB',     category: 'main' },
    { id: 'm5', name: 'Truffle Risotto', short: 'RISOTTO',  category: 'main' },
    { id: 'm6', name: 'Vegan Tart',      short: 'VGN TART', category: 'main' },
  ],
  dessert: [
    { id: 'd1', name: 'Choc Fondant',  short: 'FONDANT',  category: 'dessert' },
    { id: 'd2', name: 'Crème Brûlée', short: 'CR BRULEE', category: 'dessert' },
    { id: 'd3', name: 'Fruit Sorbet',  short: 'SORBET',   category: 'dessert' },
    { id: 'd4', name: 'Cheese Board',  short: 'CHEESE',   category: 'dessert' },
  ],
  drink: [
    { id: 'dr1', name: 'Chablis (glass)',  short: 'CHABLIS',   category: 'drink' },
    { id: 'dr2', name: 'Barolo (glass)',   short: 'BAROLO',    category: 'drink' },
    { id: 'dr3', name: 'Sparkling Water', short: 'SPARK H2O', category: 'drink' },
    { id: 'dr4', name: 'Still Water',     short: 'STILL H2O', category: 'drink' },
    { id: 'dr5', name: 'Rosé (glass)',    short: 'ROSÉ',      category: 'drink' },
    { id: 'dr6', name: 'Espresso',        short: 'ESPRESSO',  category: 'drink' },
  ],
}

export const ALL_ITEMS: PosMenuItem[] = Object.values(DEMO_MENU).flat()

export const SCENARIOS: PosScenario[] = [
  // ── 1 · Solo guest, simple main ──────────────────────────────────────────────
  {
    id: 'sc1', tableNumber: 3, seats: 1, pax: 1, guestName: 'Mr James',
    narrative: '"Good evening. Just the Sea Bass for me, please. And a glass of Chablis."',
    requiredItems: [
      { itemId: 'm1', seat: 1 },
      { itemId: 'dr1', seat: 1 },
    ],
    needsHold: false, difficulty: 1, timeSeconds: calcTime(1), basePoints: 100,
    tip: 'MAINS → SEA BASS · DRINKS → CHABLIS · SEND',
  },

  // ── 2 · Couple, mains only ───────────────────────────────────────────────────
  {
    id: 'sc2', tableNumber: 7, seats: 2, pax: 2, guestName: 'Mr & Mrs Williams',
    narrative: '"Two of us tonight. I\'ll have the Wagyu — medium-rare please — and my wife will have the Sea Bass."',
    requiredItems: [
      { itemId: 'm2', seat: 1, commentKeyword: 'medium', commentType: 'food' },
      { itemId: 'm1', seat: 2 },
    ],
    needsHold: false, difficulty: 1, timeSeconds: calcTime(2), basePoints: 150,
    tip: 'Seat 1 → WAGYU + FOOD CMT "MED RARE" · Seat 2 → SEA BASS',
  },

  // ── 3 · Solo, starter then main (HOLD) ──────────────────────────────────────
  {
    id: 'sc3', tableNumber: 11, seats: 1, pax: 1, guestName: 'Ms Elena',
    narrative: '"I\'d like the Tuna Tartare to start, and then the Rack of Lamb — medium-well. Send the starter first, please."',
    requiredItems: [
      { itemId: 's2', seat: 1 },
      { itemId: 'm4', seat: 1, held: true, commentKeyword: 'medium', commentType: 'food' },
    ],
    needsHold: true, difficulty: 2, timeSeconds: calcTime(1), basePoints: 200,
    tip: 'STARTERS → TUNA TAR · HOLD COURSE · MAINS → LAMB + FOOD CMT "MED WELL" · SEND',
  },

  // ── 4 · Solo, severe allergy ─────────────────────────────────────────────────
  {
    id: 'sc4', tableNumber: 5, seats: 1, pax: 1, guestName: 'Dr Nakamura',
    narrative: '"The Sea Bass please. I must mention — I have a severe nut allergy. Please make sure the kitchen is aware."',
    requiredItems: [
      { itemId: 'm1', seat: 1, commentKeyword: 'nut', commentType: 'food' },
    ],
    needsHold: false, difficulty: 1, timeSeconds: calcTime(1), basePoints: 150,
    tip: 'MAINS → SEA BASS → FOOD CMT → "NUT ALLERGY" → OK → SEND',
  },

  // ── 5 · 3 pax, mixed mains + drinks ─────────────────────────────────────────
  {
    id: 'sc5', tableNumber: 14, seats: 3, pax: 3, guestName: 'Rodriguez family',
    narrative: '"Three of us. Seat 1: Roast Chicken. Seat 2: Truffle Risotto — no truffle if possible. Seat 3: Vegan Tart. And a bottle of Sparkling Water for the table, please."',
    requiredItems: [
      { itemId: 'm3', seat: 1 },
      { itemId: 'm5', seat: 2, commentKeyword: 'truffle', commentType: 'food' },
      { itemId: 'm6', seat: 3 },
      { itemId: 'dr3', seat: 1 },
    ],
    needsHold: false, difficulty: 2, timeSeconds: calcTime(3), basePoints: 300,
    tip: 'S1→CHICKEN · S2→RISOTTO+FOOD CMT "NO TRUFFLE" · S3→VGN TART · DRINKS→SPARK H2O',
  },

  // ── 6 · 2 pax, starters + mains, hold + allergy ──────────────────────────────
  {
    id: 'sc6', tableNumber: 8, seats: 2, pax: 2, guestName: 'Mr & Mrs Chen',
    narrative: '"Seat 1: Burrata to start, then Sea Bass — she\'s completely dairy-free, no butter. Seat 2: Wagyu, medium-rare please. Could we have Barolo by the glass?"',
    requiredItems: [
      { itemId: 's1', seat: 1 },
      { itemId: 'm1', seat: 1, held: true, commentKeyword: 'dairy', commentType: 'food' },
      { itemId: 'm2', seat: 2, commentKeyword: 'medium', commentType: 'food' },
      { itemId: 'dr2', seat: 2 },
    ],
    needsHold: true, difficulty: 3, timeSeconds: calcTime(2), basePoints: 400,
    tip: 'BURRATA(S1) → HOLD → SEA BASS+FOOD CMT "NO DAIRY"(S1) · WAGYU+FOOD CMT "MED RARE"(S2) · DRINKS→BAROLO',
  },

  // ── 7 · Anniversary couple, complex two-course ───────────────────────────────
  {
    id: 'sc7', tableNumber: 19, seats: 2, pax: 2, guestName: 'Anniversary couple',
    narrative: '"It\'s our anniversary! Seat 1: Tuna Tartare then Rack of Lamb. Seat 2: Caesar Salad then Sea Bass — no dairy on the Sea Bass. Please note anniversary in the system. Two glasses of Rosé to start."',
    requiredItems: [
      { itemId: 's2', seat: 1 },
      { itemId: 'm4', seat: 1, held: true },
      { itemId: 's3', seat: 2 },
      { itemId: 'm1', seat: 2, held: true, commentKeyword: 'dairy', commentType: 'food' },
      { itemId: 'dr5', seat: 1 },
      { itemId: 'dr5', seat: 2 },
    ],
    needsHold: true, difficulty: 3, timeSeconds: calcTime(2), basePoints: 500,
    tip: 'DRINKS→ROSÉ(S1+S2) · STARTERS: TUNA TAR(S1)+CAESAR(S2) · HOLD · MAINS: LAMB(S1)+SEA BASS+FOOD CMT "NO DAIRY"(S2)',
  },

  // ── 8 · 4 pax, full table ────────────────────────────────────────────────────
  {
    id: 'sc8', tableNumber: 2, seats: 4, pax: 4, guestName: 'Thompson party',
    narrative: '"Four guests. Seat 1: Wagyu, well-done. Seat 2: Sea Bass — severe nut allergy. Seat 3: Risotto, no truffle. Seat 4: Vegan Tart. Chablis for Seat 1 and Sparkling Water for Seat 3."',
    requiredItems: [
      { itemId: 'm2', seat: 1, commentKeyword: 'well', commentType: 'food' },
      { itemId: 'm1', seat: 2, commentKeyword: 'nut', commentType: 'food' },
      { itemId: 'm5', seat: 3, commentKeyword: 'truffle', commentType: 'food' },
      { itemId: 'm6', seat: 4 },
      { itemId: 'dr1', seat: 1 },
      { itemId: 'dr3', seat: 3 },
    ],
    needsHold: false, difficulty: 3, timeSeconds: calcTime(4), basePoints: 600,
    tip: 'S1→WAGYU+FOOD CMT "WELL DONE" · S2→SEA BASS+FOOD CMT "NUT ALLERGY" · S3→RISOTTO+FOOD CMT "NO TRUFFLE" · S4→VGN TART · DRINKS',
  },

  // ── 9 · 2 pax, drinks first then mains ──────────────────────────────────────
  {
    id: 'sc9', tableNumber: 4, seats: 2, pax: 2, guestName: 'Mr Laurent',
    narrative: '"Good evening. Before anything, could we have a Chablis and a Still Water? Then: Seat 1 will have the Burrata to start then Roast Chicken. Seat 2 — the Caesar Salad then Wagyu, medium."',
    requiredItems: [
      { itemId: 'dr1', seat: 1 },
      { itemId: 'dr4', seat: 2 },
      { itemId: 's1', seat: 1 },
      { itemId: 'm3', seat: 1, held: true },
      { itemId: 's3', seat: 2 },
      { itemId: 'm2', seat: 2, held: true, commentKeyword: 'medium', commentType: 'food' },
    ],
    needsHold: true, difficulty: 3, timeSeconds: calcTime(2), basePoints: 450,
    tip: 'DRINKS first: CHABLIS(S1)+STILL H2O(S2) · STARTERS: BURRATA(S1)+CAESAR(S2) · HOLD · MAINS: CHICKEN(S1)+WAGYU+FOOD CMT "MEDIUM"(S2)',
  },

  // ── 10 · Solo, dessert after main ────────────────────────────────────────────
  {
    id: 'sc10', tableNumber: 16, seats: 1, pax: 1, guestName: 'Ms Harrison',
    narrative: '"Just me tonight. I\'ll have the Soup du Jour to start, then the Sea Bass — gluten-free please — and afterwards the Crème Brûlée. No rush on the dessert."',
    requiredItems: [
      { itemId: 's4', seat: 1 },
      { itemId: 'm1', seat: 1, held: true, commentKeyword: 'gluten', commentType: 'food' },
      { itemId: 'd2', seat: 1, held: true },
    ],
    needsHold: true, difficulty: 2, timeSeconds: calcTime(1), basePoints: 250,
    tip: 'STARTERS→SOUP · HOLD · MAINS→SEA BASS+FOOD CMT "NO GLUTEN" · DESSERTS→CR BRULEE (also held)',
  },

  // ── 11 · 5 pax, business dinner ─────────────────────────────────────────────
  {
    id: 'sc11', tableNumber: 22, seats: 5, pax: 5, guestName: 'Johnson & Co.',
    narrative: '"Five of us — business dinner. Seat 1+2: Tuna Tartare starters then Wagyu (S1 medium-rare, S2 well-done). Seat 3: Risotto, no truffle. Seat 4: Rack of Lamb. Seat 5: Sea Bass, no dairy. Barolo for Seats 1 and 2, Sparkling Water for the table."',
    requiredItems: [
      { itemId: 's2', seat: 1 },
      { itemId: 's2', seat: 2 },
      { itemId: 'm2', seat: 1, held: true, commentKeyword: 'medium', commentType: 'food' },
      { itemId: 'm2', seat: 2, held: true, commentKeyword: 'well', commentType: 'food' },
      { itemId: 'm5', seat: 3, commentKeyword: 'truffle', commentType: 'food' },
      { itemId: 'm4', seat: 4 },
      { itemId: 'm1', seat: 5, commentKeyword: 'dairy', commentType: 'food' },
      { itemId: 'dr2', seat: 1 },
      { itemId: 'dr2', seat: 2 },
      { itemId: 'dr3', seat: 3 },
    ],
    needsHold: true, difficulty: 3, timeSeconds: calcTime(5), basePoints: 700,
    tip: 'STARTERS: TUNA TAR(S1+S2) · HOLD · MAINS: WAGYU×2+comments · RISOTTO+NO TRUFFLE · LAMB · SEA BASS+NO DAIRY · DRINKS',
  },

  // ── 12 · Birthday table, 4 pax ───────────────────────────────────────────────
  {
    id: 'sc12', tableNumber: 9, seats: 4, pax: 4, guestName: 'Nakamura birthday',
    narrative: '"It\'s a birthday celebration! Seat 1 (birthday): Caesar Salad then Wagyu, medium. Seat 2: Tuna Tartare then Lamb. Seats 3+4: Chicken and Vegan Tart as mains. Please note birthday in system. Rosé all round — four glasses."',
    requiredItems: [
      { itemId: 's3', seat: 1 },
      { itemId: 'm2', seat: 1, held: true, commentKeyword: 'medium', commentType: 'food' },
      { itemId: 's2', seat: 2 },
      { itemId: 'm4', seat: 2, held: true },
      { itemId: 'm3', seat: 3 },
      { itemId: 'm6', seat: 4 },
      { itemId: 'dr5', seat: 1 },
      { itemId: 'dr5', seat: 2 },
      { itemId: 'dr5', seat: 3 },
      { itemId: 'dr5', seat: 4 },
    ],
    needsHold: true, difficulty: 3, timeSeconds: calcTime(4), basePoints: 650,
    tip: 'DRINKS: ROSÉ×4 · STARTERS: CAESAR(S1)+TUNA TAR(S2) · HOLD · MAINS: WAGYU+MED(S1) · LAMB(S2) · CHICKEN(S3) · VGN TART(S4) · Add BIRTHDAY comment',
  },
]

// ── Dynamic scenario generator ───────────────────────────────────────────────
const GUEST_NAMES = [
  'Mr James', 'Ms Elena', 'Mr & Mrs Williams', 'Dr Nakamura', 'Rodriguez family',
  'Mr Laurent', 'Ms Harrison', 'Mr & Mrs Chen', 'Anniversary couple', 'Thompson party',
]

export function generateScenarios(menu: Record<string, PosMenuItem[]>): PosScenario[] {
  const s  = (menu.starter || []).slice(0, 4)
  const m  = (menu.main    || []).slice(0, 6)
  const d  = (menu.dessert || []).slice(0, 4)
  const dr = (menu.drink   || []).slice(0, 6)

  const pick  = (arr: PosMenuItem[], i = 0) => arr[i % Math.max(arr.length, 1)]
  const name  = (i: number) => GUEST_NAMES[i % GUEST_NAMES.length]
  const tables = [3, 7, 11, 5, 14, 8, 19, 2, 4, 16, 22, 9]
  const scenarios: PosScenario[] = []

  if (m.length) scenarios.push({
    id:'g1', tableNumber:tables[0], seats:1, pax:1, guestName:name(0),
    narrative:`"Good evening. Just the ${pick(m,0).name} for me, please."`,
    requiredItems:[{itemId:pick(m,0).id, seat:1}],
    needsHold:false, difficulty:1, timeSeconds:calcTime(1), basePoints:100,
    tip:`MAINS → ${pick(m,0).short} → SEND`,
  })

  if (m.length >= 2) scenarios.push({
    id:'g2', tableNumber:tables[1], seats:2, pax:2, guestName:name(1),
    narrative:`"Two of us. Seat 1: ${pick(m,1).name}. Seat 2: ${pick(m,0).name}."`,
    requiredItems:[{itemId:pick(m,1).id,seat:1},{itemId:pick(m,0).id,seat:2}],
    needsHold:false, difficulty:1, timeSeconds:calcTime(2), basePoints:150,
    tip:`Seat 1 → ${pick(m,1).short} · Seat 2 → ${pick(m,0).short}`,
  })

  if (s.length && m.length) scenarios.push({
    id:'g3', tableNumber:tables[2], seats:1, pax:1, guestName:name(2),
    narrative:`"${pick(s,0).name} to start, then ${pick(m,2<m.length?2:0).name}. Send starter first."`,
    requiredItems:[
      {itemId:pick(s,0).id, seat:1},
      {itemId:pick(m,2<m.length?2:0).id, seat:1, held:true},
    ],
    needsHold:true, difficulty:2, timeSeconds:calcTime(1), basePoints:200,
    tip:`${pick(s,0).short} → HOLD → ${pick(m,2<m.length?2:0).short} → SEND`,
  })

  if (m.length) scenarios.push({
    id:'g4', tableNumber:tables[3], seats:1, pax:1, guestName:name(3),
    narrative:`"The ${pick(m,0).name} please — severe nut allergy. Please alert the kitchen."`,
    requiredItems:[{itemId:pick(m,0).id, seat:1, commentKeyword:'nut', commentType:'food'}],
    needsHold:false, difficulty:2, timeSeconds:calcTime(1), basePoints:200,
    tip:`${pick(m,0).short} → FOOD CMT → "NUT ALLERGY" → SEND`,
  })

  if (m.length >= 3) scenarios.push({
    id:'g5', tableNumber:tables[4], seats:3, pax:3, guestName:name(4),
    narrative:`"Three of us. S1: ${pick(m,0).name}. S2: ${pick(m,1).name}. S3: ${pick(m,2).name}."`,
    requiredItems:[
      {itemId:pick(m,0).id,seat:1},
      {itemId:pick(m,1).id,seat:2},
      {itemId:pick(m,2).id,seat:3},
    ],
    needsHold:false, difficulty:2, timeSeconds:calcTime(3), basePoints:250,
    tip:`S1→${pick(m,0).short} · S2→${pick(m,1).short} · S3→${pick(m,2).short}`,
  })

  if (s.length && m.length >= 2) scenarios.push({
    id:'g6', tableNumber:tables[5], seats:2, pax:2, guestName:name(5),
    narrative:`"S1: ${pick(s,0).name} then ${pick(m,0).name} — no dairy. S2: ${pick(m,1).name}."`,
    requiredItems:[
      {itemId:pick(s,0).id, seat:1},
      {itemId:pick(m,0).id, seat:1, held:true, commentKeyword:'dairy', commentType:'food'},
      {itemId:pick(m,1).id, seat:2},
    ],
    needsHold:true, difficulty:3, timeSeconds:calcTime(2), basePoints:350,
    tip:`S1: ${pick(s,0).short} → HOLD → ${pick(m,0).short}+FOOD CMT "NO DAIRY" · S2: ${pick(m,1).short}`,
  })

  if (m.length >= 4 && dr.length >= 2) scenarios.push({
    id:'g7', tableNumber:tables[6], seats:4, pax:4, guestName:name(6),
    narrative:`"S1: ${pick(m,0).name}. S2: ${pick(m,1).name} — nut allergy. S3: ${pick(m,2).name}. S4: ${pick(m,3).name}. Plus ${pick(dr,0).name} ×2."`,
    requiredItems:[
      {itemId:pick(m,0).id,seat:1},
      {itemId:pick(m,1).id,seat:2,commentKeyword:'nut',commentType:'food'},
      {itemId:pick(m,2).id,seat:3},
      {itemId:pick(m,3).id,seat:4},
      {itemId:pick(dr,0).id,seat:1},
      {itemId:pick(dr,0).id,seat:2},
    ],
    needsHold:false, difficulty:3, timeSeconds:calcTime(4), basePoints:500,
    tip:`4 mains (S2 FOOD CMT "NUT ALLERGY") then DRINKS tab`,
  })

  if (m.length && d.length && dr.length) scenarios.push({
    id:'g8', tableNumber:tables[7], seats:2, pax:2, guestName:name(7),
    narrative:`"S1: ${pick(m,0).name} then ${pick(d,0).name}. S2: ${pick(m,1<m.length?1:0).name} — no gluten. Two ${pick(dr,0).name} to start."`,
    requiredItems:[
      {itemId:pick(dr,0).id,seat:1},
      {itemId:pick(dr,0).id,seat:2},
      {itemId:pick(m,0).id,seat:1},
      {itemId:pick(d,0).id,seat:1,held:true},
      {itemId:pick(m,1<m.length?1:0).id,seat:2,commentKeyword:'gluten',commentType:'food'},
    ],
    needsHold:true, difficulty:3, timeSeconds:calcTime(2), basePoints:550,
    tip:`DRINKS first → S1: main+HOLD+dessert · S2: main+FOOD CMT "NO GLUTEN"`,
  })

  return scenarios.length > 0 ? scenarios : SCENARIOS
}
