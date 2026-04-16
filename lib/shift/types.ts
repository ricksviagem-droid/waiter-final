export type SceneType = 'guest-audio' | 'inspector'

export type GuestNationality =
  | 'american'
  | 'british'
  | 'french'
  | 'italian'
  | 'japanese'
  | 'arabic'
  | 'brazilian'
  | 'german'
  | 'russian'

export interface GuestAudioScene {
  type: 'guest-audio'
  id: number
  title: string
  situation: string
  guestNationality: GuestNationality
  guestGender: 'male' | 'female'
  guestAudio: string // text for TTS
  rickTip: string
  evaluationCriteria: string
  sopReference: string
}

export interface InspectorOption {
  label: string
  quality: 'excellent' | 'tricky' | 'wrong'
  explanation: string
}

export interface InspectorScene {
  type: 'inspector'
  id: number
  title: string
  situation: string
  inspectorMessage: string
  options: [InspectorOption, InspectorOption, InspectorOption]
  correctIndex: 0 | 1 | 2
  sopReference: string
}

export type Scene = GuestAudioScene | InspectorScene

export interface GuestAudioResult {
  sceneId: number
  type: 'guest-audio'
  transcript: string
  score: number // 0-10
  sopScore: number // 0-10
  feedback: string
  betterPhrase: string
  passed: boolean
}

export interface InspectorResult {
  sceneId: number
  type: 'inspector'
  selectedIndex: number
  correctIndex: number
  score: number // 10 | 5 | 0
  passed: boolean
  explanation: string
}

export type SceneResult = GuestAudioResult | InspectorResult

export interface ShiftSession {
  results: SceneResult[]
  totalScore: number
  maxScore: number
  startedAt: number
  completedAt?: number
}
