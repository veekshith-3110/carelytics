// Lightweight Text-to-Speech utility using the Web Speech API
// Guards for SSR (Next.js) and exposes simple speak/stop helpers

export function isTtsAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

let currentUtterance: SpeechSynthesisUtterance | null = null

export interface SpeakOptions {
  lang?: string
  rate?: number
  pitch?: number
  voiceName?: string
  onEnd?: () => void
}

export function speak(text: string, opts: SpeakOptions = {}): boolean {
  if (!isTtsAvailable() || !text) return false

  stop()

  const utter = new SpeechSynthesisUtterance(text)
  if (opts.lang) utter.lang = opts.lang
  if (typeof opts.rate === 'number') utter.rate = opts.rate
  if (typeof opts.pitch === 'number') utter.pitch = opts.pitch

  if (opts.voiceName && typeof window !== 'undefined') {
    const voices = window.speechSynthesis.getVoices()
    const match = voices.find(v => v.name === opts.voiceName)
    if (match) utter.voice = match
  }

  utter.onend = () => {
    currentUtterance = null
    opts.onEnd && opts.onEnd()
  }

  utter.onerror = () => {
    currentUtterance = null
    opts.onEnd && opts.onEnd()
  }

  currentUtterance = utter
  window.speechSynthesis.speak(utter)
  return true
}

export function stop(): void {
  if (!isTtsAvailable()) return
  try {
    window.speechSynthesis.cancel()
  } catch (e) {
    // ignore
  }
  currentUtterance = null
}

export function getVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise(resolve => {
    if (!isTtsAvailable()) return resolve([])
    const voices = window.speechSynthesis.getVoices()
    if (voices.length) return resolve(voices)
    // some browsers populate voices asynchronously
    const handler = () => {
      const v = window.speechSynthesis.getVoices()
      window.speechSynthesis.removeEventListener('voiceschanged', handler)
      resolve(v)
    }
    window.speechSynthesis.addEventListener('voiceschanged', handler)
    // fallback timeout
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 500)
  })
}
