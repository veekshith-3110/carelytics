'use client'

import { useHealthStore } from '@/lib/store'
import { getTranslation, Translations } from '@/lib/translations'

export function useTranslation() {
  const language = useHealthStore((state) => state.language)
  const translations = getTranslation(language)

  return translations
}

