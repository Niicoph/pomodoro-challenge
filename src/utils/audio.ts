import { CycleType } from '../types/timer'

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

function playTone(ctx: AudioContext, frequency: number, startTime: number, duration: number) {
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(frequency, startTime)

  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.02)
  gainNode.gain.linearRampToValueAtTime(0, startTime + duration)

  oscillator.start(startTime)
  oscillator.stop(startTime + duration)
}

const TONE_SEQUENCES: Record<CycleType, number[]> = {
  work: [523.25, 659.25], // C5 → E5
  shortBreak: [659.25, 783.99], // E5 → G5
  longBreak: [523.25, 659.25, 783.99], // C5 → E5 → G5
}

export function playNotificationSound(cycleType: CycleType): void {
  try {
    const ctx = getAudioContext()

    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const tones = TONE_SEQUENCES[cycleType]
    const toneDuration = 0.15
    const gap = 0.05
    const now = ctx.currentTime

    tones.forEach((frequency, index) => {
      const startTime = now + index * (toneDuration + gap)
      playTone(ctx, frequency, startTime, toneDuration)
    })
  } catch {
    // Silently fail if Web Audio API is not available
  }
}
