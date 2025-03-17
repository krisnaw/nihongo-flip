"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Shuffle, RotateCcw, CheckCircle2 } from "lucide-react"
import FlashCard from "@/components/flash-card"

interface Card {
  id: number
  japanese: string
  romaji: string
  english: string
  known: boolean
}

interface FlashCardAppProps {
  initialCards: Card[]
}

export default function FlashCardApp({ initialCards }: FlashCardAppProps) {
  const [cards, setCards] = useState<Card[]>(initialCards)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [remainingCards, setRemainingCards] = useState(initialCards.length)

  // Calculate progress whenever cards change
  useEffect(() => {
    const knownCards = cards.filter((card) => card.known).length
    setProgress((knownCards / cards.length) * 100)
    setRemainingCards(cards.length - knownCards)
  }, [cards])

  const handleNextCard = () => {
    // Find the next unknown card
    const nextUnknownCardIndex = findNextUnknownCard(currentCardIndex)
    setCurrentCardIndex(nextUnknownCardIndex)
  }

  const handlePrevCard = () => {
    // Find the previous unknown card
    let prevIndex = currentCardIndex - 1
    if (prevIndex < 0) prevIndex = cards.length - 1

    while (cards[prevIndex].known && prevIndex !== currentCardIndex) {
      prevIndex = prevIndex - 1
      if (prevIndex < 0) prevIndex = cards.length - 1
    }

    setCurrentCardIndex(prevIndex)
  }

  const findNextUnknownCard = (startIndex: number) => {
    // If all cards are known, just go to the next card
    if (remainingCards === 0) {
      return (startIndex + 1) % cards.length
    }

    // Find the next unknown card
    let nextIndex = (startIndex + 1) % cards.length
    while (cards[nextIndex].known && nextIndex !== startIndex) {
      nextIndex = (nextIndex + 1) % cards.length
    }

    return nextIndex
  }

  const markAsKnown = () => {
    const updatedCards = [...cards]
    updatedCards[currentCardIndex].known = true
    setCards(updatedCards)

    if (remainingCards > 1) {
      handleNextCard()
    }
  }

  const resetCards = () => {
    setCards(cards.map((card) => ({ ...card, known: false })))
    setCurrentCardIndex(0)
  }

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setCurrentCardIndex(0)
  }

  return (
    <div className="w-full max-w-3xl flex flex-col items-center gap-6">
      <div className="w-full flex items-center justify-between mb-2">
        <div className="text-sm text-slate-500">Progress: {Math.round(progress)}%</div>
        <div className="text-sm text-slate-500">
          Cards remaining: {remainingCards} / {cards.length}
        </div>
      </div>

      <Progress value={progress} className="w-full h-2 bg-slate-200" />

      <div className="w-full">
        {cards.length > 0 && (
          <FlashCard
            card={cards[currentCardIndex]}
            onNext={handleNextCard}
            onPrev={handlePrevCard}
            onKnown={markAsKnown}
          />
        )}
      </div>

      <div className="flex flex-wrap gap-3 justify-center mt-4">
        <Button
          variant="outline"
          onClick={shuffleCards}
          className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
        >
          <Shuffle className="h-4 w-4" />
          Shuffle
        </Button>

        <Button
          variant="outline"
          onClick={resetCards}
          className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>

        <Button
          onClick={markAsKnown}
          className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white"
          disabled={cards[currentCardIndex]?.known}
        >
          <CheckCircle2 className="h-4 w-4" />
          Mark as Known
        </Button>
      </div>
    </div>
  )
}

