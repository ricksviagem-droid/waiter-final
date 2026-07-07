import { Howl } from 'howler'

let muted = false

const sounds = {
  danger: new Howl({
    src: ['/sounds/danger.mp3'],
    volume: 0.6,
    onloaderror: () => {},
  }),
  salary: new Howl({
    src: ['/sounds/salary.mp3'],
    volume: 0.7,
    onloaderror: () => {},
  }),
  goalReached: new Howl({
    src: ['/sounds/goal.mp3'],
    volume: 0.8,
    onloaderror: () => {},
  }),
  transaction: new Howl({
    src: ['/sounds/transaction.mp3'],
    volume: 0.4,
    onloaderror: () => {},
  }),
  success: new Howl({
    src: ['/sounds/success.mp3'],
    volume: 0.5,
    onloaderror: () => {},
  }),
}

export function setMuted(value: boolean) {
  muted = value
}

export function playSound(name: keyof typeof sounds) {
  if (muted) return
  try {
    sounds[name]?.play()
  } catch {}
}

export function playDanger()      { playSound('danger') }
export function playSalary()      { playSound('salary') }
export function playGoalReached() { playSound('goalReached') }
export function playTransaction() { playSound('transaction') }
export function playSuccess()     { playSound('success') }
