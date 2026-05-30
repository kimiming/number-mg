import { Space } from 'antd';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DeleteRecordButton } from '@/components/delete-record-button';
import { PhoneRecordForm } from '@/components/phone-record-form';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminEditRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await prisma.phoneRecord.findUnique({ where: { id } });

  if (!record) {
    notFound();
  }

  return (
    <main className="page-shell">
      <div className="page-container">
        <Space className="admin-toolbar" wrap>
          <Link href="/admin" className="admin-action">
            返回列表
          </Link>
          <Link href={`/admin/records/${record.id}`} className="admin-action admin-action-primary">
            查看详情
          </Link>
          <DeleteRecordButton id={record.id}>
            <button className="admin-action admin-action-danger" type="button">
              删除
            </button>
          </DeleteRecordButton>
        </Space>

        <PhoneRecordForm
          title="编辑电话记录"
          submitText="保存修改"
          submitUrl={`/api/records/${record.id}`}
          submitMethod="PUT"
          initialValues={{
            customerPhoneNumber: record.customerPhoneNumber,
            whatsappNumber: record.whatsappNumber,
            voiceFilePath: record.voiceFilePath
          }}
        />
      </div>
    </main>
  );
}
