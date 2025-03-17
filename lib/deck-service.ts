export interface Card {
  id: number
  japanese: string
  romaji: string
  english: string
  known: boolean
}

export interface Deck {
  id: string
  name: string
  description: string
  category: string
  cards: Card[]
  createdAt: string
  lastStudied?: string
}

// Sample decks for initial state
const sampleDecks: Deck[] = [
  {
    id: "basic-greetings",
    name: "Basic Greetings",
    description: "Essential Japanese greetings for everyday conversations",
    category: "phrases",
    createdAt: new Date().toISOString(),
    cards: [
      { id: 1, japanese: "こんにちは", romaji: "Konnichiwa", english: "Hello", known: false },
      { id: 2, japanese: "おはようございます", romaji: "Ohayou gozaimasu", english: "Good morning", known: false },
      { id: 3, japanese: "こんばんは", romaji: "Konbanwa", english: "Good evening", known: false },
      { id: 4, japanese: "さようなら", romaji: "Sayounara", english: "Goodbye", known: false },
      { id: 5, japanese: "ありがとう", romaji: "Arigatou", english: "Thank you", known: false },
      { id: 6, japanese: "すみません", romaji: "Sumimasen", english: "Excuse me / Sorry", known: false },
      { id: 7, japanese: "はじめまして", romaji: "Hajimemashite", english: "Nice to meet you", known: false },
      { id: 8, japanese: "お元気ですか", romaji: "O-genki desu ka", english: "How are you?", known: false },
      { id: 9, japanese: "元気です", romaji: "Genki desu", english: "I'm fine", known: false },
      { id: 10, japanese: "またね", romaji: "Mata ne", english: "See you later", known: false },
    ],
  },
  {
    id: "hiragana-basics",
    name: "Hiragana Basics",
    description: "Learn the fundamental Japanese hiragana characters",
    category: "hiragana",
    createdAt: new Date().toISOString(),
    cards: [
      { id: 1, japanese: "あ", romaji: "a", english: "a as in father", known: false },
      { id: 2, japanese: "い", romaji: "i", english: "i as in machine", known: false },
      { id: 3, japanese: "う", romaji: "u", english: "u as in rule", known: false },
      { id: 4, japanese: "え", romaji: "e", english: "e as in pet", known: false },
      { id: 5, japanese: "お", romaji: "o", english: "o as in note", known: false },
      // More hiragana would be added here
    ],
  },
]

// Helper to initialize localStorage with sample data if empty
const initializeStorage = () => {
  if (typeof window === "undefined") return

  const storedDecks = localStorage.getItem("japaneseFlashcardDecks")
  if (!storedDecks) {
    localStorage.setItem("japaneseFlashcardDecks", JSON.stringify(sampleDecks))
  }
}

// Get all decks
export const getAllDecks = async (): Promise<Deck[]> => {
  if (typeof window === "undefined") return []

  initializeStorage()
  const storedDecks = localStorage.getItem("japaneseFlashcardDecks")
  return storedDecks ? JSON.parse(storedDecks) : []
}

// Get a specific deck by ID
export const getDeck = async (id: string): Promise<Deck | null> => {
  if (typeof window === "undefined") return null

  initializeStorage()
  const decks = await getAllDecks()
  return decks.find((deck) => deck.id === id) || null
}

// Create a new deck
export const createDeck = async (deckData: Omit<Deck, "id">): Promise<string> => {
  if (typeof window === "undefined") return ""

  const decks = await getAllDecks()

  // Generate a URL-friendly ID from the name
  const id =
    deckData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Date.now().toString().slice(-4)

  const newDeck: Deck = {
    ...deckData,
    id,
  }

  localStorage.setItem("japaneseFlashcardDecks", JSON.stringify([...decks, newDeck]))
  return id
}

// Update a deck
export const updateDeck = async (id: string, updates: Partial<Deck>): Promise<boolean> => {
  if (typeof window === "undefined") return false

  const decks = await getAllDecks()
  const deckIndex = decks.findIndex((deck) => deck.id === id)

  if (deckIndex === -1) return false

  decks[deckIndex] = { ...decks[deckIndex], ...updates }
  localStorage.setItem("japaneseFlashcardDecks", JSON.stringify(decks))
  return true
}

// Delete a deck
export const deleteDeck = async (id: string): Promise<boolean> => {
  if (typeof window === "undefined") return false

  const decks = await getAllDecks()
  const updatedDecks = decks.filter((deck) => deck.id !== id)

  if (updatedDecks.length === decks.length) return false

  localStorage.setItem("japaneseFlashcardDecks", JSON.stringify(updatedDecks))
  return true
}

