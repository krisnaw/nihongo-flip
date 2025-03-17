"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import FlashCard from "@/components/flash-card"
import { Shuffle, RotateCcw, CheckCircle2 } from "lucide-react"

// Sample flash card data
const initialCards = [
    { id: 1, japanese: "こんにちは", romaji: "Konnichiwa", english: "Hello", known: false },
    { id: 2, japanese: "ありがとう", romaji: "Arigatou", english: "Thank you", known: false },
    { id: 3, japanese: "さようなら", romaji: "Sayounara", english: "Goodbye", known: false },
    { id: 4, japanese: "おはよう", romaji: "Ohayou", english: "Good morning", known: false },
    { id: 5, japanese: "すみません", romaji: "Sumimasen", english: "Excuse me / Sorry", known: false },
    { id: 6, japanese: "はい", romaji: "Hai", english: "Yes", known: false },
    { id: 7, japanese: "いいえ", romaji: "Iie", english: "No", known: false },
    { id: 8, japanese: "お願いします", romaji: "Onegaishimasu", english: "Please", known: false },
    { id: 9, japanese: "わかりました", romaji: "Wakarimashita", english: "I understand", known: false },
    { id: 10, japanese: "水", romaji: "Mizu", english: "Water", known: false },
]

export default function FlashCardApp() {
    const [cards, setCards] = useState(initialCards)
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
        setCards(initialCards.map((card) => ({ ...card, known: false })))
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
                <div className="text-sm text-muted-foreground">Progress: {Math.round(progress)}%</div>
                <div className="text-sm text-muted-foreground">
                    Cards remaining: {remainingCards} / {cards.length}
                </div>
            </div>

            <Progress value={progress} className="w-full h-2" />

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
                <Button variant="outline" onClick={shuffleCards} className="flex items-center gap-2">
                    <Shuffle className="h-4 w-4" />
                    Shuffle
                </Button>

                <Button variant="outline" onClick={resetCards} className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Reset
                </Button>

                <Button onClick={markAsKnown} className="flex items-center gap-2" disabled={cards[currentCardIndex]?.known}>
                    <CheckCircle2 className="h-4 w-4" />
                    Mark as Known
                </Button>
            </div>
        </div>
    )
}

