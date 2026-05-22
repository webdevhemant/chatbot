export interface Model {
  id: string
  name: string
  description: string
}

export const models: Model[] = [
  { id: 'zen', name: 'Zen', description: 'Calm and mindful' },
  { id: 'sage', name: 'Sage', description: 'Wise and philosophical' },
  { id: 'spark', name: 'Spark', description: 'Energetic and practical' },
  { id: 'oracle', name: 'Oracle', description: 'Mysterious and poetic' },
  { id: 'nova', name: 'Nova', description: 'Warm and encouraging' },
]

export const DEFAULT_MODEL_NAME = 'zen'
