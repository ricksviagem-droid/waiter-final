export type QuestionBlock = 'personal' | 'service' | 'knowledge' | 'situational' | 'values'

export interface InterviewQuestion {
  id: number
  block: QuestionBlock
  blockLabel: string
  question: string
  timeSeconds: number
}

export interface QuestionResult {
  questionId: number
  question: string
  videoUrl: string | null
  transcript: string
  timeUsed: number
  skipped: boolean
  score?: number
  verdict?: 'strong' | 'good' | 'weak' | 'skipped'
  rickFeedback?: string
  betterAnswer?: string
}

export interface ReportData {
  grade: string
  overallScore: number
  overallVerdict: string
  categories: Record<string, { score: number; comment: string }>
  strengths: string[]
  improvements: string[]
  hrSummary: string
  rickScript: string
  questionScores?: Array<{
    questionId: number
    score: number
    verdict: 'strong' | 'good' | 'weak' | 'skipped'
    rickFeedback: string
    betterAnswer: string
  }>
}

export const QUESTIONS: InterviewQuestion[] = [
  { id: 1, block: 'personal',    blockLabel: 'Personal',    timeSeconds: 120, question: "Tell me about yourself — who are you and what brought you to hospitality?" },
  { id: 2, block: 'personal',    blockLabel: 'Personal',    timeSeconds: 120, question: "Walk me through your most relevant experience in a restaurant or hotel setting." },
  { id: 3, block: 'service',     blockLabel: 'Service',     timeSeconds: 120, question: "Walk me through the Forbes 5-Star sequence — from the moment a guest arrives to the moment they leave." },
  { id: 4, block: 'service',     blockLabel: 'Service',     timeSeconds: 120, question: "A guest sends a dish back to the kitchen. How do you handle it, step by step?" },
  { id: 5, block: 'service',     blockLabel: 'Service',     timeSeconds: 120, question: "How would you upsell a premium dish or wine without the guest feeling pressured?" },
  { id: 6, block: 'knowledge',   blockLabel: 'Knowledge',   timeSeconds: 120, question: "Describe the proper way to present, open, and pour a bottle of wine at the table." },
  { id: 7, block: 'knowledge',   blockLabel: 'Knowledge',   timeSeconds: 120, question: "Suggest a wine pairing for a pan-seared duck breast with cherry reduction and explain your reasoning." },
  { id: 8, block: 'situational', blockLabel: 'Situational', timeSeconds: 120, question: "A VIP guest arrives without a reservation and the restaurant is fully booked. What do you do?" },
  { id: 9, block: 'situational', blockLabel: 'Situational', timeSeconds: 120, question: "A guest becomes visibly upset and raises their voice at you during service. How do you respond?" },
  { id: 10, block: 'values',     blockLabel: 'Values',      timeSeconds: 120, question: "What does exceptional guest experience mean to you — in your own words?" },
]

export const TOTAL_QUESTIONS = QUESTIONS.length
