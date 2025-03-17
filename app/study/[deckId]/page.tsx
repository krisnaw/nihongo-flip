import StudyPageContainer from "@/app/study/[deckId]/study-page-container";

export default async function StudyPage({ params } : { params: Promise<{ deckId: string }> }) {
  const {deckId} = await params;

  return <StudyPageContainer deckId={deckId} />
}