import { redirect } from 'next/navigation';

export default async function LegacyEditRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/admin/records/${id}/edit`);
}
