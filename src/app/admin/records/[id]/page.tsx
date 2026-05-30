import { Card, Descriptions, Space, Tag } from "antd";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteRecordButton } from "@/components/delete-record-button";
import { VoiceTranscribe } from "@/components/voice-transcribe";
import { prisma } from "@/lib/prisma";
import { toPlayableAudioPath } from "@/lib/audio-path";

export const dynamic = "force-dynamic";

export default async function AdminRecordDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await prisma.phoneRecord.findUnique({ where: { id } });

  if (!record) {
    notFound();
  }

  const playableAudioPath = toPlayableAudioPath(record.voiceFilePath);
  const transcriptText = (record as { transcriptText?: string | null }).transcriptText ?? null;

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
              {playableAudioPath ? <Tag color="green">已上传</Tag> : <Tag>未上传</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {record.createdAt.toLocaleString("zh-CN")}
            </Descriptions.Item>
            <Descriptions.Item label="文件路径" span={2}>
              {playableAudioPath ? (
                <Space direction="vertical">
                  <Link href={playableAudioPath} target="_blank">
                    {playableAudioPath}
                  </Link>
                  <audio controls src={playableAudioPath} style={{ width: "100%" }} />
                  <VoiceTranscribe
                    recordId={record.id}
                    audioPath={playableAudioPath}
                    initialTranscript={transcriptText}
                  />
                </Space>
              ) : (
                "暂无语音文件"
              )}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </main>
  );
}
