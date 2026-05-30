import { PhoneRecordForm } from '@/components/phone-record-form';

export default function AdminNewRecordPage() {
  return (
    <main className="page-shell">
      <div className="page-container">
        <PhoneRecordForm title="新增电话记录" submitText="创建记录" submitUrl="/api/records" submitMethod="POST" />
      </div>
    </main>
  );
}
