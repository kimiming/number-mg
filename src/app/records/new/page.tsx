import { redirect } from 'next/navigation';

export default function LegacyNewRecordPage() {
  redirect('/admin/records/new');
}
