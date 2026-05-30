import { Card, Descriptions, Space, Tag } from 'antd';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DeleteRecordButton } from '@/components/delete-record-button';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminRecordDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
          <Link href={`/admin/records/${record.id}/edit`} className="admin-action admin-action-primary">
            编辑
          </Link>
          <DeleteRecordButton id={record.id}>
            <button className="admin-action admin-action-danger" type="button">
              删除
            </button>
          </DeleteRecordButton>
        </Space>

        <Card variant="borderless" className="panel-card">
          <h3 style={{ marginTop: 0 }}>记录详情</h3>
          <Descriptions column={{ xs: 1, sm: 1, md: 2 }}>
            <Descriptions.Item label="客户电话">{record.customerPhoneNumber}</Descriptions.Item>
            <Descriptions.Item label="接粉号">{record.whatsappNumber}</Descriptions.Item>
            <Descriptions.Item label="语音文件">
              {record.voiceFilePath ? <Tag color="green">已上传</Tag> : <Tag>未上传</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{record.createdAt.toLocaleString('zh-CN')}</Descriptions.Item>
            <Descriptions.Item label="文件路径" span={2}>
              {record.voiceFilePath ? (
                <Space direction="vertical">
                  <Link href={record.voiceFilePath} target="_blank">
                    {record.voiceFilePath}
                  </Link>
                  <audio controls src={record.voiceFilePath} style={{ width: '100%' }} />
                </Space>
              ) : (
                '暂无语音文件'
              )}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </main>
  );
}
