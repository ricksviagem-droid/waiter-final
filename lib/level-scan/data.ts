export interface ListeningQ {
  id: string; audioText: string; question: string
  options: string[]; correct: number; xp: number
}

export interface SpeakingQ {
  id: string; prompt: string; hint: string; timeSeconds: number; xp: number
}

export interface ReadingQ {
  id: string; passage: string; question: string
  options: string[]; correct: number; xp: number
}

export interface WritingQ {
  id: string; prompt: string; placeholder: string; xp: number
}

export interface ScanAnswer {
  type: 'listening' | 'reading'
  questionId: string
  selected: number
  correct: number
  correct_bool: boolean
}

export interface SpeakingAnswer {
  questionId: string; transcript: string
}

export interface WritingAnswer {
  questionId: string; text: string
}

export interface ScanResult {
  cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  levelName: string
  overallScore: number
  listeningScore: number
  speakingScore: number
  readingScore: number
  writingScore: number
  verdict: string
  strengths: string[]
  improvements: string[]
  studyPlan: string
}

export const CEFR_LEVELS = {
  A1: { name: 'ROOKIE',    color: '#94a3b8', desc: 'You are just getting started. Every expert was once a beginner.' },
  A2: { name: 'EXPLORER',  color: '#34d399', desc: 'You can handle basic situations. Keep building your foundations.' },
  B1: { name: 'CONNECTOR', color: '#60a5fa', desc: 'You can communicate effectively in familiar contexts.' },
  B2: { name: 'NAVIGATOR', color: '#818cf8', desc: 'You handle complex topics with confidence. Almost there.' },
  C1: { name: 'MAVERICK',  color: '#f59e0b', desc: 'You operate at a high level. Near-native fluency.' },
  C2: { name: 'LEGEND',    color: '#00dc82', desc: 'Complete mastery. You are fit for any professional environment.' },
}

export const LISTENING_QUESTIONS: ListeningQ[] = [
  {
    id: 'l1', xp: 120,
    audioText: "Good evening, welcome to The Grand. Do you have a reservation with us tonight?",
    question: "What does the speaker ask?",
    options: ["If you are hungry", "If you have a reservation", "What you would like to eat", "How many people are in your group"],
    correct: 1,
  },
  {
    id: 'l2', xp: 150,
    audioText: "I'm sorry to inform you that the sea bass you ordered is no longer available this evening. Our chef strongly recommends the pan-seared salmon — it comes with a lemon butter sauce and seasonal vegetables.",
    question: "Why is the staff member speaking to the guest?",
    options: ["To recommend the sea bass", "To explain a dish is unavailable and suggest an alternative", "To describe the vegetable side", "To take the initial order"],
    correct: 1,
  },
  {
    id: 'l3', xp: 180,
    audioText: "Following last month's guest feedback, we've identified that wait times between courses are inconsistent during peak service. I'd like us to coordinate more closely with the kitchen to ensure all tables receive their dishes within a similar timeframe.",
    question: "What problem is being discussed?",
    options: ["Food quality complaints", "Inconsistent timing between courses", "Staff shortages during peak hours", "Guest feedback scores dropping"],
    correct: 1,
  },
  {
    id: 'l4', xp: 220,
    audioText: "What distinguishes truly world-class hospitality isn't the physical environment — it's the almost imperceptible ability of staff to anticipate a guest's unexpressed needs. When you notice someone reaching for their glass before they've consciously registered thirst, that's the art of anticipatory service.",
    question: "What is the speaker's main point?",
    options: ["Great food is most important", "The décor defines the experience", "The best service anticipates needs before they are expressed", "Staff should constantly watch guests"],
    correct: 2,
  },
]

export const SPEAKING_QUESTIONS: SpeakingQ[] = [
  {
    id: 's1', timeSeconds: 60, xp: 200,
    prompt: "Introduce yourself in English. Tell me your name, where you're from, and why you want to work in hospitality.",
    hint: "Speak naturally. Mention your background and motivation.",
  },
  {
    id: 's2', timeSeconds: 60, xp: 200,
    prompt: "A guest at your table says their steak is overcooked and they look unhappy. What do you say to them?",
    hint: "Stay calm, apologise, and offer a solution.",
  },
]

export const READING_QUESTIONS: ReadingQ[] = [
  {
    id: 'r1', xp: 120,
    passage: "At The Grand Hotel, team members are expected to greet guests within 30 seconds of arrival, maintain eye contact during all interactions, and use the guest's name at least twice during conversations. Any complaints must be escalated to a supervisor immediately — staff should not attempt to resolve serious issues independently.",
    question: "What should a staff member do when a guest makes a serious complaint?",
    options: ["Apologise and offer a discount immediately", "Resolve it independently to save time", "Escalate it to a supervisor right away", "Ask the guest to return tomorrow"],
    correct: 2,
  },
  {
    id: 'r2', xp: 160,
    passage: "The hospitality industry has shifted significantly toward personalisation. Guests no longer expect merely adequate service — they anticipate experiences tailored to their individual preferences. Properties that leverage guest data effectively, while respecting privacy, consistently report higher satisfaction scores and repeat visit rates. This demands both technological investment and a cultural shift in how frontline staff are trained.",
    question: "According to the text, what is key to modern hospitality success?",
    options: ["Reducing operational costs", "Personalised experiences supported by data and trained staff", "Building larger and more luxurious hotels", "Improving the quality of food served"],
    correct: 1,
  },
  {
    id: 'r3', xp: 200,
    passage: "The paradox of luxury service lies in its invisibility. At its apex, service should feel effortless — not because effort was absent, but because it was so expertly concealed. The guest who notices their water glass has been silently refilled, or that the room temperature adjusted imperceptibly, is experiencing service at its finest. The moment service becomes visible is the moment its magic is diminished.",
    question: "What does 'the paradox of luxury service' mean in this context?",
    options: ["Luxury hotels are unnecessarily expensive", "The best service is invisible despite requiring great skill and effort", "Guests rarely appreciate good service", "Service is difficult to deliver consistently at scale"],
    correct: 1,
  },
]

export const WRITING_QUESTIONS: WritingQ[] = [
  {
    id: 'w1', xp: 150,
    prompt: "Correct and rewrite this message properly:\n\n\"Dear Mr Smith, I write to you about your reservation on thursday. We look forward to you visit and hope that we can accommodating all you request. Please dont hesitate to contact we if you have questions.\"",
    placeholder: "Write the corrected version here…",
  },
  {
    id: 'w2', xp: 150,
    prompt: "Write a short message (2–3 sentences) to apologise to a guest because their room is not ready yet. Let them know it will be ready in 20 minutes and offer something while they wait.",
    placeholder: "Write your message here…",
  },
]

export const TOTAL_XP =
  LISTENING_QUESTIONS.reduce((s, q) => s + q.xp, 0) +
  SPEAKING_QUESTIONS.reduce((s, q) => s + q.xp, 0) +
  READING_QUESTIONS.reduce((s, q) => s + q.xp, 0) +
  WRITING_QUESTIONS.reduce((s, q) => s + q.xp, 0)
