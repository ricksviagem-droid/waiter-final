export interface ProfileData {
  experience: 'none' | 'some' | 'experienced' | 'expert'
  hoursPerDay: number
  hasSkilledPartner: boolean
  totalCapital: number
}

export interface IdeaData {
  foodType: string
  model: 'physical' | 'delivery' | 'dark_kitchen' | 'hybrid'
  city: string
  neighborhood: string
  averageTicket: number
  seats?: number
}

export interface DataPoint {
  value: string
  source: string
  url: string
}

export interface Scenario {
  monthlyRevenue: string
  netMargin: string
  monthlyProfit: string
  breakEvenMonths: number
  description: string
}

export interface Risk {
  title: string
  description: string
  severity: 'high' | 'medium' | 'low'
}

export interface AnalysisResult {
  viabilityScore: number
  scoreExplanation: string
  recommendation: 'go' | 'no-go' | 'go-with-changes'
  recommendationText: string
  sectorMortality: DataPoint
  openingCost: DataPoint
  sectorMargin: DataPoint
  ifoodCommission: DataPoint
  licenseTime: DataPoint
  breakEvenPoint: DataPoint
  seasonality: DataPoint
  competition: DataPoint
  pessimistic: Scenario
  realistic: Scenario
  optimistic: Scenario
  topRisks: Risk[]
  improvements: string[]
  city: string
  neighborhood: string
  model: string
  foodType: string
}
