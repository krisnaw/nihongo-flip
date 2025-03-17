import FlashCardApp from "@/components/flash-card-app"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-gray-50">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Japanese Flash Cards</h1>
      <FlashCardApp />
    </main>
  )
}

