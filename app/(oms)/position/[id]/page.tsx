import { redirect } from "next/navigation";

export default async function PositionAliasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/organization/positions/${id}`);
}
