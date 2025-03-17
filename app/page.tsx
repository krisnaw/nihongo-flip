import DeckSelection from "@/components/deck-selection"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-slate-50 to-slate-100">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-indigo-900">日本語 Flash Cards</h1>
      <p className="text-center text-slate-600 mb-8 max-w-md">
        Enhance your Japanese learning journey with customizable flashcards
      </p>
      <DeckSelection />
    </main>
  )
}

