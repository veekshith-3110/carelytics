'use client'

import { Volume2 } from 'lucide-react'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'

interface TTSButtonProps {
  text: string
  className?: string
  ariaLabel?: string
  title?: string
}

export default function TTSButton({ text, className = '', ariaLabel = 'Listen to content', title = 'Listen to content' }: TTSButtonProps) {
  const { speak } = useTextToSpeech()

  return (
    <button
      onClick={() => speak(text)}
      className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
      aria-label={ariaLabel}
      title={title}
    >
      <Volume2 className="w-5 h-5 text-gray-600" />
    </button>
  )
}

