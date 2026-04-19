export interface PosMenuItem {
  id: string
  name: string
  short: string
  category: 'starter' | 'main' | 'dessert' | 'drink' | 'side'
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

// ── Casa Blanca Menu ──────────────────────────────────────────────────────────
export const DEMO_MENU: Record<string, PosMenuItem[]> = {
  starter: [
    // SPREADS
    { id:'s1',  name:'Zaalouk',                             short:'ZAALOUK',   category:'starter' },
    { id:'s2',  name:'Taramasalata',                        short:'TARAMA',    category:'starter' },
    { id:'s3',  name:'Tzatziki',                            short:'TZATZIKI',  category:'starter' },
    // RAW
    { id:'s4',  name:'Gillardeau Oyster N°2',               short:'OYSTER N2', category:'starter' },
    { id:'s5',  name:'Tuna Tartare',                        short:'TUNA TAR',  category:'starter' },
    { id:'s6',  name:'Salmon Crudo',                        short:'SALM CRDO', category:'starter' },
    { id:'s7',  name:'Wagyu Beef Carpaccio',                short:'CARPACCIO', category:'starter' },
    // SALADS
    { id:'s8',  name:'Moroccan Moghrabieh Salad',           short:'MOGHRABIE', category:'starter' },
    { id:'s9',  name:'Watermelon & Feta Salad',             short:'WML FETA',  category:'starter' },
    { id:'s10', name:'Local Burrata Salad',                 short:'BURRATA',   category:'starter' },
    { id:'s11', name:'Classic Caesar Salad',                short:'CAESAR',    category:'starter' },
    { id:'s12', name:'Tomato and Feta Salad',               short:'TOM FETA',  category:'starter' },
    // APPETIZERS
    { id:'s13', name:'Spiced Eggplant & Grilled Halloumi',  short:'EGG HALL',  category:'starter' },
    { id:'s14', name:'Grilled Sardines',                    short:'SARDINES',  category:'starter' },
    { id:'s15', name:'Spanakopita',                         short:'SPANAKOPI', category:'starter' },
    { id:'s16', name:'Sauteed Gambas',                      short:'GAMBAS',    category:'starter' },
    { id:'s17', name:'Moroccan Lamb Kebabs',                short:'LAMB KEB',  category:'starter' },
    { id:'s18', name:'Wagyu Beef Flatbread',                short:'WGYU FLAT', category:'starter' },
    { id:'s19', name:'Avocado and Burrata Pizzetta',        short:'AVO PIZZA', category:'starter' },
    { id:'s20', name:'Crispy Calamari',                     short:'CALAMARI',  category:'starter' },
    // SIGNATURE MAKI
    { id:'s21', name:'White Beach Ocean Roll',              short:'WB OCEAN',  category:'starter' },
    { id:'s22', name:'Samurai Crunch Maki',                 short:'SAMURAI',   category:'starter' },
    { id:'s23', name:'Fiery Sakura Maki',                   short:'FIERY MAK', category:'starter' },
    { id:'s24', name:'Aurora Maki',                         short:'AURORA',    category:'starter' },
    { id:'s25', name:'White Breeze Maki',                   short:'WH BREEZE', category:'starter' },
    { id:'s26', name:'Velvet Sake Maki',                    short:'VELVET',    category:'starter' },
    // TO SHARE
    { id:'s27', name:'Sushi and Seafood Tower',             short:'SUSHI TWR', category:'starter' },
    { id:'s28', name:"Chef's Sushi Selection (36 pcs)",     short:'CHEF SUSH', category:'starter' },
    { id:'s29', name:'Casa Blanca Signature Maki (12 pcs)', short:'CB MAKI',   category:'starter' },
    // TACOS
    { id:'s30', name:'Moroccan Citrus & Herbs Salad Taco',  short:'MRCC TACO', category:'starter' },
    { id:'s31', name:'Lobster Tacos',                       short:'LOBSTR TC', category:'starter' },
    { id:'s32', name:'Salmon Tacos',                        short:'SALM TACO', category:'starter' },
  ],
  main: [
    // FROM THE SEA
    { id:'m1',  name:'Salt Crusted / Grilled Seabass',      short:'SEA BASS',  category:'main' },
    { id:'m2',  name:'Grilled Calamar 1kg',                 short:'CALAMAR 1', category:'main' },
    { id:'m3',  name:'Grilled Jumbo Carabineros',           short:'CARABINER', category:'main' },
    // MAINS
    { id:'m4',  name:'Char-grilled Baby Chicken',           short:'BABY CHKN', category:'main' },
    { id:'m5',  name:'Seafood Tagine',                      short:'SEAFD TAG', category:'main' },
    { id:'m6',  name:'Moroccan Octopus',                    short:'MRCC OCTP', category:'main' },
    { id:'m7',  name:'Caramelized Scottish Salmon',         short:'SCOT SALM', category:'main' },
    { id:'m8',  name:'Lobster Linguine',                    short:'LOBSTR LN', category:'main' },
    { id:'m9',  name:'Mushroom and Truffle Pasta',          short:'TRFL PAST', category:'main' },
    { id:'m10', name:'Aubergine Parmigiana',                short:'AUBR PARM', category:'main' },
    { id:'m11', name:'Pure Black Angus Rib Eye',            short:'RIB EYE',   category:'main' },
    { id:'m12', name:'Australian Wagyu Tenderloin MB 5+',   short:'WAGYU MB5', category:'main' },
    { id:'m13', name:'Lamb Chop',                           short:'LAMB CHOP', category:'main' },
    { id:'m14', name:'Australian Wagyu Tomahawk MB 7+',     short:'TOMAHAWK',  category:'main' },
    // KIDS
    { id:'k1',  name:'Margherita Pizzetta',                 short:'MARGHRT',   category:'main' },
    { id:'k2',  name:'Chicken Tenders',                     short:'CHKN TEND', category:'main' },
    { id:'k3',  name:'Rigatoni Pasta',                      short:'RIGATONI',  category:'main' },
    { id:'k4',  name:'Cheeseburger Sliders',                short:'CHSE SLDR', category:'main' },
    { id:'k5',  name:'Roasted Salmon (Kids)',               short:'RSTD SALM', category:'main' },
    { id:'k6',  name:'Chicken Breast (Kids)',               short:'CHKN BRST', category:'main' },
  ],
  dessert: [
    { id:'d1',  name:'Baghrir',                             short:'BAGHRIR',   category:'dessert' },
    { id:'d2',  name:'Moroccan Flavours Choux',             short:'MRCC CHOX', category:'dessert' },
    { id:'d3',  name:'Milk Bastilla (Jawhara)',             short:'BASTILLA',  category:'dessert' },
    { id:'d4',  name:'Assorted Mochi Ice Cream',            short:'MOCHI',     category:'dessert' },
    { id:'d5',  name:'Lemon Yoghurt Ice Cream',             short:'LEM YOGRT', category:'dessert' },
    { id:'d6',  name:'68% Light Chocolate Mousse',          short:'CHOC MSSE', category:'dessert' },
    { id:'d7',  name:'Exotic Fruit Platter',                short:'EX FRUIT',  category:'dessert' },
    { id:'d8',  name:'Mini White Beach Sundae',             short:'WBCH SNDA', category:'dessert' },
  ],
  side: [
    { id:'si1', name:'Moroccan Spiced Rice',                short:'MRCC RICE', category:'side' },
    { id:'si2', name:'Truffle Fries',                       short:'TRFL FRIE', category:'side' },
    { id:'si3', name:'Sweet Potato Fries',                  short:'SWPT FRIE', category:'side' },
    { id:'si4', name:'Mashed Potato',                       short:'MASH POTA', category:'side' },
    { id:'si5', name:'Green Leaves Salad',                  short:'GRN SALAD', category:'side' },
    { id:'si6', name:'Sauteed Mix Green Vegetables',        short:'MIX VEG',   category:'side' },
  ],
  drink: [],
}

export const ALL_ITEMS: PosMenuItem[] = Object.values(DEMO_MENU).flat()

// ── Scenarios (Casa Blanca) ───────────────────────────────────────────────────
export const SCENARIOS: PosScenario[] = [
  // 1 — Solo, simple main
  {
    id:'sc1', tableNumber:5, seats:1, pax:1, guestName:'Ms Amira',
    narrative:'"Good evening. Just the Rib Eye for me please — medium-rare."',
    requiredItems:[{ itemId:'m11', seat:1, commentKeyword:'medium', commentType:'food' }],
    needsHold:false, difficulty:1, timeSeconds:calcTime(1), basePoints:100,
    tip:'MAINS → RIB EYE → FOOD CMT "MED RARE" → SEND',
  },
  // 2 — Couple, two mains
  {
    id:'sc2', tableNumber:12, seats:2, pax:2, guestName:'Mr & Mrs Nakamura',
    narrative:'"Two of us. Seat 1: Wagyu Tenderloin MB 5+ — medium please. Seat 2: Sea Bass."',
    requiredItems:[
      { itemId:'m12', seat:1, commentKeyword:'medium', commentType:'food' },
      { itemId:'m1',  seat:2 },
    ],
    needsHold:false, difficulty:1, timeSeconds:calcTime(2), basePoints:150,
    tip:'S1→WAGYU MB5+FOOD CMT "MEDIUM" · S2→SEA BASS · SEND',
  },
  // 3 — Solo, starter then main with HOLD
  {
    id:'sc3', tableNumber:3, seats:1, pax:1, guestName:'Mr James',
    narrative:'"Tuna Tartare to start, then the Lamb Chop — medium-well please. Starter first."',
    requiredItems:[
      { itemId:'s5',  seat:1 },
      { itemId:'m13', seat:1, held:true, commentKeyword:'medium', commentType:'food' },
    ],
    needsHold:true, difficulty:2, timeSeconds:calcTime(1), basePoints:200,
    tip:'STARTERS→TUNA TAR · HOLD · MAINS→LAMB CHOP+FOOD CMT "MED WELL" · SEND',
  },
  // 4 — Solo, allergy
  {
    id:'sc4', tableNumber:7, seats:1, pax:1, guestName:'Dr Dubois',
    narrative:'"The Lobster Linguine please. I have a severe nut allergy — please inform the kitchen."',
    requiredItems:[{ itemId:'m8', seat:1, commentKeyword:'nut', commentType:'food' }],
    needsHold:false, difficulty:1, timeSeconds:calcTime(1), basePoints:150,
    tip:'MAINS→LOBSTR LN → FOOD CMT "NUT ALLERGY" → SEND',
  },
  // 5 — 3 pax, mains + side dishes
  {
    id:'sc5', tableNumber:14, seats:3, pax:3, guestName:'Rodriguez family',
    narrative:'"Three of us. Seat 1: Sea Bass. Seat 2: Wagyu Tenderloin, rare. Seat 3: Truffle Pasta — no truffle if possible. And Truffle Fries for the table."',
    requiredItems:[
      { itemId:'m1',  seat:1 },
      { itemId:'m12', seat:2, commentKeyword:'rare',    commentType:'food' },
      { itemId:'m9',  seat:3, commentKeyword:'truffle', commentType:'food' },
      { itemId:'si2', seat:1 },
    ],
    needsHold:false, difficulty:2, timeSeconds:calcTime(3), basePoints:300,
    tip:'S1→SEA BASS · S2→WAGYU MB5+RARE · S3→TRFL PAST+NO TRUFFLE · SIDES→TRFL FRIE',
  },
  // 6 — 2 pax, starters + mains with HOLD
  {
    id:'sc6', tableNumber:8, seats:2, pax:2, guestName:'Dubois couple',
    narrative:'"Seat 1: Crispy Calamari to start, then Wagyu Tenderloin MB 5+ — medium-rare. Seat 2: Caesar Salad then Lamb Chop. Starters first please."',
    requiredItems:[
      { itemId:'s20', seat:1 },
      { itemId:'m12', seat:1, held:true, commentKeyword:'medium', commentType:'food' },
      { itemId:'s11', seat:2 },
      { itemId:'m13', seat:2, held:true },
    ],
    needsHold:true, difficulty:3, timeSeconds:calcTime(2), basePoints:400,
    tip:'CALAMARI(S1)+CAESAR(S2) → HOLD → WAGYU MB5+MED RARE(S1) · LAMB CHOP(S2)',
  },
  // 7 — Anniversary 2 pax, complex HOLD + allergy
  {
    id:'sc7', tableNumber:19, seats:2, pax:2, guestName:'Anniversary couple',
    narrative:'"It\'s our anniversary! Seat 1: Wagyu Carpaccio then Rib Eye — rare. Seat 2: Burrata Salad then Sea Bass, she\'s dairy-free. Please note anniversary in system."',
    requiredItems:[
      { itemId:'s7',  seat:1 },
      { itemId:'m11', seat:1, held:true, commentKeyword:'rare',  commentType:'food' },
      { itemId:'s10', seat:2 },
      { itemId:'m1',  seat:2, held:true, commentKeyword:'dairy', commentType:'food' },
    ],
    needsHold:true, difficulty:3, timeSeconds:calcTime(2), basePoints:500,
    tip:'CARPACCIO(S1)+BURRATA(S2) → HOLD → RIB EYE+RARE(S1) · SEA BASS+NO DAIRY(S2) · Add ANNIVERSARY comment',
  },
  // 8 — 4 pax, full table with allergies + side
  {
    id:'sc8', tableNumber:2, seats:4, pax:4, guestName:'Al-Hassan party',
    narrative:'"S1: Wagyu Tomahawk — medium-rare. S2: Sea Bass, she has a dairy allergy. S3: Lobster Linguine — nut allergy. S4: Aubergine Parmigiana. Truffle Fries for the table."',
    requiredItems:[
      { itemId:'m14', seat:1, commentKeyword:'medium', commentType:'food' },
      { itemId:'m1',  seat:2, commentKeyword:'dairy',  commentType:'food' },
      { itemId:'m8',  seat:3, commentKeyword:'nut',    commentType:'food' },
      { itemId:'m10', seat:4 },
      { itemId:'si2', seat:1 },
    ],
    needsHold:false, difficulty:3, timeSeconds:calcTime(4), basePoints:600,
    tip:'TOMAHAWK+MED RARE · SEA BASS+NO DAIRY · LOBSTR LN+NUT ALLERGY · AUBR PARM · SIDES→TRFL FRIE',
  },
  // 9 — 2 pax, allergy + sides
  {
    id:'sc9', tableNumber:4, seats:2, pax:2, guestName:'Mr & Mrs Laurent',
    narrative:'"Seat 1: Scottish Salmon — strictly gluten-free please. Seat 2: Aubergine Parmigiana. Mashed Potato and Sweet Potato Fries on the side."',
    requiredItems:[
      { itemId:'m7',  seat:1, commentKeyword:'gluten', commentType:'food' },
      { itemId:'m10', seat:2 },
      { itemId:'si4', seat:1 },
      { itemId:'si3', seat:2 },
    ],
    needsHold:false, difficulty:2, timeSeconds:calcTime(2), basePoints:250,
    tip:'S1→SCOT SALM+NO GLUTEN · S2→AUBR PARM · SIDES: MASH POTA(S1)+SWPT FRIE(S2)',
  },
  // 10 — Solo, starter then main HOLD
  {
    id:'sc10', tableNumber:16, seats:1, pax:1, guestName:'Ms Williams',
    narrative:'"Crispy Calamari to start please, then the Moroccan Octopus. Send the starter first."',
    requiredItems:[
      { itemId:'s20', seat:1 },
      { itemId:'m6',  seat:1, held:true },
    ],
    needsHold:true, difficulty:2, timeSeconds:calcTime(1), basePoints:200,
    tip:'STARTERS→CALAMARI · HOLD · MAINS→MRCC OCTP · SEND',
  },
  // 11 — 5 pax business dinner, complex HOLD
  {
    id:'sc11', tableNumber:22, seats:5, pax:5, guestName:'Johnson & Co.',
    narrative:'"S1: Wagyu Carpaccio then Wagyu Tenderloin, rare. S2: Tuna Tartare then Rib Eye, medium. S3: Sea Bass. S4: Lobster Linguine, nut allergy. S5: Truffle Pasta. Truffle Fries and Moroccan Rice for the table."',
    requiredItems:[
      { itemId:'s7',  seat:1 },
      { itemId:'m12', seat:1, held:true, commentKeyword:'rare',   commentType:'food' },
      { itemId:'s5',  seat:2 },
      { itemId:'m11', seat:2, held:true, commentKeyword:'medium', commentType:'food' },
      { itemId:'m1',  seat:3 },
      { itemId:'m8',  seat:4, commentKeyword:'nut', commentType:'food' },
      { itemId:'m9',  seat:5 },
      { itemId:'si2', seat:1 },
      { itemId:'si1', seat:2 },
    ],
    needsHold:true, difficulty:3, timeSeconds:calcTime(5), basePoints:700,
    tip:'STARTERS: CARPACCIO(S1)+TUNA TAR(S2) → HOLD → MAINS+comments · SEA BASS(S3) · LOBSTR LN+NUT(S4) · TRFL PAST(S5) · SIDES: TRFL FRIE+MRCC RICE',
  },
  // 12 — Birthday 4 pax, full HOLD
  {
    id:'sc12', tableNumber:9, seats:4, pax:4, guestName:'Nakamura birthday',
    narrative:'"Birthday celebration! Seat 1 (birthday): Crispy Calamari then Wagyu Tomahawk, medium. Seat 2: Tuna Tartare then Lamb Chop. Seat 3: Baby Chicken. Seat 4: Scottish Salmon, gluten-free. Please note birthday in system."',
    requiredItems:[
      { itemId:'s20', seat:1 },
      { itemId:'m14', seat:1, held:true, commentKeyword:'medium', commentType:'food' },
      { itemId:'s5',  seat:2 },
      { itemId:'m13', seat:2, held:true },
      { itemId:'m4',  seat:3 },
      { itemId:'m7',  seat:4, commentKeyword:'gluten', commentType:'food' },
    ],
    needsHold:true, difficulty:3, timeSeconds:calcTime(4), basePoints:650,
    tip:'CALAMARI(S1)+TUNA TAR(S2) → HOLD → TOMAHAWK+MED(S1) · LAMB CHOP(S2) · BABY CHKN(S3) · SCOT SALM+NO GLUTEN(S4) · Add BIRTHDAY comment',
  },
]

// ── Dynamic scenario generator (for custom uploaded menus) ────────────────────
const GUEST_NAMES = [
  'Ms Amira', 'Mr & Mrs Nakamura', 'Mr James', 'Dr Dubois', 'Rodriguez family',
  'Mr & Mrs Laurent', 'Ms Williams', 'Anniversary couple', 'Al-Hassan party', 'Johnson & Co.',
]

export function generateScenarios(menu: Record<string, PosMenuItem[]>): PosScenario[] {
  const s  = (menu.starter || []).slice(0, 6)
  const m  = (menu.main    || []).slice(0, 8)
  const d  = (menu.dessert || []).slice(0, 4)
  const si = (menu.side    || []).slice(0, 4)
  const dr = (menu.drink   || []).slice(0, 6)

  const pick  = (arr: PosMenuItem[], i = 0) => arr[i % Math.max(arr.length, 1)]
  const name  = (i: number) => GUEST_NAMES[i % GUEST_NAMES.length]
  const tables = [5, 12, 3, 7, 14, 8, 19, 2, 4, 16, 22, 9]
  const scenarios: PosScenario[] = []

  if (m.length) scenarios.push({
    id:'g1', tableNumber:tables[0], seats:1, pax:1, guestName:name(0),
    narrative:`"Good evening. Just the ${pick(m,0).name} for me please."`,
    requiredItems:[{ itemId:pick(m,0).id, seat:1 }],
    needsHold:false, difficulty:1, timeSeconds:calcTime(1), basePoints:100,
    tip:`MAINS → ${pick(m,0).short} → SEND`,
  })

  if (m.length >= 2) scenarios.push({
    id:'g2', tableNumber:tables[1], seats:2, pax:2, guestName:name(1),
    narrative:`"Two of us. Seat 1: ${pick(m,1).name}. Seat 2: ${pick(m,0).name}."`,
    requiredItems:[{ itemId:pick(m,1).id, seat:1 }, { itemId:pick(m,0).id, seat:2 }],
    needsHold:false, difficulty:1, timeSeconds:calcTime(2), basePoints:150,
    tip:`S1→${pick(m,1).short} · S2→${pick(m,0).short}`,
  })

  if (s.length && m.length) scenarios.push({
    id:'g3', tableNumber:tables[2], seats:1, pax:1, guestName:name(2),
    narrative:`"${pick(s,0).name} to start, then ${pick(m,2<m.length?2:0).name}. Starter first please."`,
    requiredItems:[
      { itemId:pick(s,0).id, seat:1 },
      { itemId:pick(m,2<m.length?2:0).id, seat:1, held:true },
    ],
    needsHold:true, difficulty:2, timeSeconds:calcTime(1), basePoints:200,
    tip:`${pick(s,0).short} → HOLD → ${pick(m,2<m.length?2:0).short} → SEND`,
  })

  if (m.length) scenarios.push({
    id:'g4', tableNumber:tables[3], seats:1, pax:1, guestName:name(3),
    narrative:`"The ${pick(m,0).name} please — I have a severe nut allergy."`,
    requiredItems:[{ itemId:pick(m,0).id, seat:1, commentKeyword:'nut', commentType:'food' }],
    needsHold:false, difficulty:2, timeSeconds:calcTime(1), basePoints:200,
    tip:`${pick(m,0).short} → FOOD CMT "NUT ALLERGY" → SEND`,
  })

  if (m.length >= 3 && si.length) scenarios.push({
    id:'g5', tableNumber:tables[4], seats:3, pax:3, guestName:name(4),
    narrative:`"S1: ${pick(m,0).name}. S2: ${pick(m,1).name}. S3: ${pick(m,2).name}. And ${pick(si,0).name} on the side."`,
    requiredItems:[
      { itemId:pick(m,0).id, seat:1 },
      { itemId:pick(m,1).id, seat:2 },
      { itemId:pick(m,2).id, seat:3 },
      { itemId:pick(si,0).id, seat:1 },
    ],
    needsHold:false, difficulty:2, timeSeconds:calcTime(3), basePoints:280,
    tip:`S1→${pick(m,0).short} · S2→${pick(m,1).short} · S3→${pick(m,2).short} · SIDES→${pick(si,0).short}`,
  })

  if (s.length && m.length >= 2) scenarios.push({
    id:'g6', tableNumber:tables[5], seats:2, pax:2, guestName:name(5),
    narrative:`"S1: ${pick(s,0).name} then ${pick(m,0).name} — no dairy. S2: ${pick(m,1).name}. Starter first."`,
    requiredItems:[
      { itemId:pick(s,0).id, seat:1 },
      { itemId:pick(m,0).id, seat:1, held:true, commentKeyword:'dairy', commentType:'food' },
      { itemId:pick(m,1).id, seat:2 },
    ],
    needsHold:true, difficulty:3, timeSeconds:calcTime(2), basePoints:350,
    tip:`${pick(s,0).short}(S1) → HOLD → ${pick(m,0).short}+NO DAIRY(S1) · ${pick(m,1).short}(S2)`,
  })

  if (m.length >= 4 && si.length) scenarios.push({
    id:'g7', tableNumber:tables[6], seats:4, pax:4, guestName:name(6),
    narrative:`"S1: ${pick(m,0).name}. S2: ${pick(m,1).name} — nut allergy. S3: ${pick(m,2).name}. S4: ${pick(m,3).name}. ${pick(si,0).name} for the table."`,
    requiredItems:[
      { itemId:pick(m,0).id, seat:1 },
      { itemId:pick(m,1).id, seat:2, commentKeyword:'nut', commentType:'food' },
      { itemId:pick(m,2).id, seat:3 },
      { itemId:pick(m,3).id, seat:4 },
      { itemId:pick(si,0).id, seat:1 },
    ],
    needsHold:false, difficulty:3, timeSeconds:calcTime(4), basePoints:500,
    tip:`4 mains (S2 NUT ALLERGY) + SIDES→${pick(si,0).short}`,
  })

  if (m.length && d.length && dr.length) scenarios.push({
    id:'g8', tableNumber:tables[7], seats:2, pax:2, guestName:name(7),
    narrative:`"S1: ${pick(m,0).name} then ${pick(d,0).name}. S2: ${pick(m,1<m.length?1:0).name} — no gluten. Two ${pick(dr,0).name} to start."`,
    requiredItems:[
      { itemId:pick(dr,0).id, seat:1 },
      { itemId:pick(dr,0).id, seat:2 },
      { itemId:pick(m,0).id, seat:1 },
      { itemId:pick(d,0).id, seat:1, held:true },
      { itemId:pick(m,1<m.length?1:0).id, seat:2, commentKeyword:'gluten', commentType:'food' },
    ],
    needsHold:true, difficulty:3, timeSeconds:calcTime(2), basePoints:550,
    tip:`DRINKS first → S1: main+HOLD+dessert · S2: main+NO GLUTEN`,
  })

  return scenarios.length > 0 ? scenarios : SCENARIOS
}
