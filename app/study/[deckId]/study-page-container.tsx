'use client'

import {useEffect, useState} from "react";
import {Deck, getDeck} from "@/lib/deck-service";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import FlashCardApp from "@/components/flash-card-app";

export default function StudyPageContainer({deckId}: { deckId: string }) {
    const router = useRouter()
    const [deck, setDeck] = useState<Deck | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadDeck = async () => {
            try {
                const deckData: Deck | null = await getDeck(deckId)
                setDeck(deckData)
            } catch (error) {
                console.error("Failed to load deck:", error)
            } finally {
                setLoading(false)
            }
        }

        loadDeck()
    }, [deckId])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
                <div className="animate-pulse text-indigo-700">Loading...</div>
            </div>
        )
    }

    if (!deck) {
        return (
            <div
                className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
                <p className="text-red-500 mb-4">Deck not found</p>
                <Button onClick={() => router.push("/")} variant="outline">
                    Return to Home
                </Button>
            </div>
        )
    }

    return (
        <main
            className="min-h-screen flex flex-col items-center p-4 md:p-8 bg-gradient-to-b from-slate-50 to-slate-100">
            <div className="w-full max-w-3xl">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/")}
                    className="mb-4 text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50"
                >
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Back to Decks
                </Button>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-indigo-900">{deck.name}</h1>
            <p className="text-center text-slate-600 mb-8">{deck.description}</p>

            <FlashCardApp initialCards={deck.cards}/>
        </main>
    )
}