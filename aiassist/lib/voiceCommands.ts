export interface VoiceCommand {
  command: string
  action: () => void
  description: string
}

export class VoiceCommandHandler {
  private recognition: any = null
  private commands: Map<string, () => void> = new Map()
  private isListening = false

  constructor() {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = true
      this.recognition.interimResults = false
      this.recognition.lang = 'en-US'

      this.recognition.onresult = (event: any) => {
        const last = event.results.length - 1
        const command = event.results[last][0].transcript.toLowerCase().trim()
        this.processCommand(command)
      }

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        this.isListening = false
      }

      this.recognition.onend = () => {
        if (this.isListening) {
          // Restart if still listening
          try {
            this.recognition.start()
          } catch (e) {
            this.isListening = false
          }
        }
      }
    }
  }

  registerCommand(keyword: string, action: () => void) {
    this.commands.set(keyword.toLowerCase(), action)
  }

  unregisterCommand(keyword: string) {
    this.commands.delete(keyword.toLowerCase())
  }

  private processCommand(command: string) {
    const entries = Array.from(this.commands.entries())
    for (const [keyword, action] of entries) {
      if (command.includes(keyword)) {
        action()
        return true
      }
    }
    return false
  }

  start() {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start()
        this.isListening = true
      } catch (e) {
        console.error('Failed to start voice recognition:', e)
      }
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  isAvailable(): boolean {
    return this.recognition !== null
  }

  getIsListening(): boolean {
    return this.isListening
  }
}

export const voiceCommandHandler = typeof window !== 'undefined' ? new VoiceCommandHandler() : null

