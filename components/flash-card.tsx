"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react"

interface FlashCardProps {
  card: {
    id: number
    japanese: string
    romaji: string
    english: string
    known: boolean
  }
  onNext: () => void
  onPrev: () => void
  onKnown: () => void
}

export default function FlashCard({ card, onNext, onPrev, onKnown }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = () => {
    setIsFlipped(false)
    onNext()
  }

  const handlePrev = () => {
    setIsFlipped(false)
    onPrev()
  }

  return (
    <div className="relative w-full">
      <div
        className={`relative w-full transition-all duration-500 ${card.known ? "opacity-60" : "opacity-100"}`}
        style={{ perspective: "1000px" }}
      >
        <div
          className={`relative w-full transition-transform duration-500 ${isFlipped ? "rotate-y-180" : ""}`}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front of card (Japanese) */}
          <Card
            className={`w-full h-64 md:h-80 cursor-pointer ${isFlipped ? "invisible absolute" : "visible"}`}
            onClick={handleFlip}
          >
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <div className="text-4xl md:text-6xl font-bold mb-4">{card.japanese}</div>
              <div className="text-xl md:text-2xl text-muted-foreground">{card.romaji}</div>

              {card.known && (
                <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">
                  Known
                </div>
              )}

              <div className="absolute bottom-4 text-sm text-muted-foreground">Click to flip</div>
            </CardContent>
          </Card>

          {/* Back of card (English) */}
          <Card
            className={`w-full h-64 md:h-80 cursor-pointer absolute top-0 ${isFlipped ? "visible" : "invisible"}`}
            onClick={handleFlip}
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <div className="text-3xl md:text-5xl font-bold">{card.english}</div>

              {card.known && (
                <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">
                  Known
                </div>
              )}

              <div className="absolute bottom-4 text-sm text-muted-foreground">Click to flip back</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="outline" size="icon" onClick={handlePrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="icon" onClick={handleFlip}>
          <RotateCw className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="icon" onClick={handleNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

