import { AIPositionDetailPage } from "@/components/ai/AIPositionDetailPage";

type PageProps = {
  params: Promise<{ positionId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { positionId } = await params;
  return <AIPositionDetailPage positionId={positionId} />;
}
