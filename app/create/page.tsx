"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react"
import { createDeck } from "@/lib/deck-service"

const CATEGORIES = [
  { value: "hiragana", label: "Hiragana" },
  { value: "katakana", label: "Katakana" },
  { value: "kanji", label: "Kanji" },
  { value: "vocabulary", label: "Vocabulary" },
  { value: "phrases", label: "Common Phrases" },
  { value: "grammar", label: "Grammar" },
]

export default function CreateDeckPage() {
  const router = useRouter()
  const [deckName, setDeckName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("vocabulary")
  const [cards, setCards] = useState([
    { id: 1, japanese: "", romaji: "", english: "" },
    { id: 2, japanese: "", romaji: "", english: "" },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleAddCard = () => {
    const newId = Math.max(0, ...cards.map((c) => c.id)) + 1
    setCards([...cards, { id: newId, japanese: "", romaji: "", english: "" }])
  }

  const handleRemoveCard = (id: number) => {
    if (cards.length <= 1) {
      setError("You need at least one card in the deck")
      return
    }
    setCards(cards.filter((card) => card.id !== id))
    setError("")
  }

  const handleCardChange = (id: number, field: string, value: string) => {
    setCards(cards.map((card) => (card.id === id ? { ...card, [field]: value } : card)))
  }

  const handleSubmit = async () => {
    // Validation
    if (!deckName.trim()) {
      setError("Deck name is required")
      return
    }

    if (cards.some((card) => !card.japanese.trim() || !card.english.trim())) {
      setError("All cards must have Japanese and English content")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Add known: false to each card
      const cardsWithKnownStatus = cards.map((card) => ({
        ...card,
        known: false,
      }))

      const newDeck = {
        name: deckName,
        description,
        category,
        cards: cardsWithKnownStatus,
        createdAt: new Date().toISOString(),
      }

      const deckId = await createDeck(newDeck)
      router.push(`/study/${deckId}`)
    } catch (err) {
      console.error("Failed to create deck:", err)
      setError("Failed to create deck. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-4 text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Decks
        </Button>

        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-indigo-900">Create New Deck</h1>

        <Card className="mb-8 border-indigo-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-indigo-800">Deck Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deck-name">Deck Name</Label>
              <Input
                id="deck-name"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                placeholder="e.g., Basic Greetings"
                className="border-indigo-200 focus-visible:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will you learn from this deck?"
                className="border-indigo-200 focus-visible:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="border-indigo-200 focus:ring-indigo-500">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-xl font-semibold mb-4 text-indigo-800">Flashcards</h2>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">{error}</div>}

        {cards.map((card, index) => (
          <Card key={card.id} className="mb-4 border-indigo-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-indigo-700 flex justify-between items-center">
                <span>Card {index + 1}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveCard(card.id)}
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`japanese-${card.id}`}>Japanese</Label>
                <Input
                  id={`japanese-${card.id}`}
                  value={card.japanese}
                  onChange={(e) => handleCardChange(card.id, "japanese", e.target.value)}
                  placeholder="e.g., こんにちは"
                  className="border-indigo-200 focus-visible:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`romaji-${card.id}`}>Romaji (optional)</Label>
                <Input
                  id={`romaji-${card.id}`}
                  value={card.romaji}
                  onChange={(e) => handleCardChange(card.id, "romaji", e.target.value)}
                  placeholder="e.g., Konnichiwa"
                  className="border-indigo-200 focus-visible:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`english-${card.id}`}>English</Label>
                <Input
                  id={`english-${card.id}`}
                  value={card.english}
                  onChange={(e) => handleCardChange(card.id, "english", e.target.value)}
                  placeholder="e.g., Hello"
                  className="border-indigo-200 focus-visible:ring-indigo-500"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-between items-center mt-6 mb-16">
          <Button
            variant="outline"
            onClick={handleAddCard}
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-900"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Card
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-indigo-700 hover:bg-indigo-800 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Creating..." : "Create Deck"}
          </Button>
        </div>
      </div>
    </main>
  )
}

