"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Plus, Bookmark, Clock, BookMarked } from "lucide-react"
import { getAllDecks } from "@/lib/deck-service"

// Category icons mapping
const categoryIcons = {
  hiragana: "あ",
  katakana: "ア",
  kanji: "漢",
  vocabulary: "単",
  phrases: "会",
  grammar: "文",
}

export default function DeckSelection() {
  const router = useRouter()
  const [decks, setDecks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDecks = async () => {
      try {
        const allDecks = await getAllDecks()
        setDecks(allDecks)
      } catch (error) {
        console.error("Failed to load decks:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDecks()
  }, [])

  // Sample decks for initial UI if no decks exist
  const sampleDecks = [
    {
      id: "basic-greetings",
      name: "Basic Greetings",
      description: "Essential Japanese greetings for everyday conversations",
      category: "phrases",
      cardCount: 10,
      lastStudied: null,
    },
    {
      id: "hiragana-basics",
      name: "Hiragana Basics",
      description: "Learn the fundamental Japanese hiragana characters",
      category: "hiragana",
      cardCount: 46,
      lastStudied: null,
    },
    {
      id: "katakana-basics",
      name: "Katakana Basics",
      description: "Master the katakana character set used for foreign words",
      category: "katakana",
      cardCount: 46,
      lastStudied: null,
    },
    {
      id: "jlpt-n5-kanji",
      name: "JLPT N5 Kanji",
      description: "Essential kanji characters for the JLPT N5 exam",
      category: "kanji",
      cardCount: 103,
      lastStudied: null,
    },
  ]

  const displayDecks = decks.length > 0 ? decks : sampleDecks

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category as keyof typeof categoryIcons] || "日"
  }

  const formatLastStudied = (date: string | null) => {
    if (!date) return "Never studied"

    const lastStudied = new Date(date)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - lastStudied.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  if (loading) {
    return (
      <div className="w-full max-w-4xl flex items-center justify-center py-12">
        <div className="animate-pulse text-indigo-700">Loading decks...</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-indigo-900">Your Flashcard Decks</h2>
        <Button onClick={() => router.push("/create")} className="bg-indigo-700 hover:bg-indigo-800 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Create Deck
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 bg-slate-100 text-indigo-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-white">
            All Decks
          </TabsTrigger>
          <TabsTrigger value="recent" className="data-[state=active]:bg-white">
            Recently Studied
          </TabsTrigger>
          <TabsTrigger value="bookmarked" className="data-[state=active]:bg-white">
            Bookmarked
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayDecks.map((deck) => (
              <Card
                key={deck.id}
                className="border-indigo-100 hover:border-indigo-300 transition-colors shadow-sm hover:shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 mr-2 font-semibold">
                        {getCategoryIcon(deck.category)}
                      </div>
                      <CardTitle className="text-lg text-indigo-900">{deck.name}</CardTitle>
                    </div>
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                      {deck.category.charAt(0).toUpperCase() + deck.category.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm mb-2">{deck.description}</p>
                  <div className="flex items-center text-xs text-slate-500">
                    <BookOpen className="h-3 w-3 mr-1" />
                    <span>{deck.cardCount} cards</span>
                    {deck.lastStudied && (
                      <>
                        <span className="mx-2">•</span>
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatLastStudied(deck.lastStudied)}</span>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => router.push(`/study/${deck.id}`)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <BookMarked className="mr-2 h-4 w-4" />
                    Study
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-0">
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Clock className="h-12 w-12 mb-4 text-slate-300" />
            <p>No recently studied decks</p>
          </div>
        </TabsContent>

        <TabsContent value="bookmarked" className="mt-0">
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Bookmark className="h-12 w-12 mb-4 text-slate-300" />
            <p>No bookmarked decks</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

