import { Card, Col, Row } from "antd";
import { LogoutButton } from "@/components/logout-button";
import { RecordsTable } from "@/components/records-table";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [total, records] = await Promise.all([
    prisma.phoneRecord.count(),
    prisma.phoneRecord.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        customerPhoneNumber: true,
        whatsappNumber: true,
        voiceFilePath: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <main className="page-shell">
      <div className="page-container">
        <div className="app-header">
          <div>
            <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.2 }}>
              电话后台管理系统
            </h1>
          </div>
          <LogoutButton />
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card variant="borderless" className="hero-card">
              <div style={{ color: "rgba(15, 23, 42, 0.65)" }}>当前记录数</div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 36,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {total}
              </div>
            </Card>
          </Col>
          <Col xs={24} md={16}>
            <Card variant="borderless" className="hero-card">
              <h3 style={{ marginTop: 0, marginBottom: 12 }}>使用说明</h3>
              <p style={{ marginBottom: 0, color: "rgba(15, 23, 42, 0.65)" }}>
                在这里管理客户电话、接粉号和语音文件。首页仅展示只读表格。
              </p>
            </Card>
          </Col>
        </Row>

        <div style={{ marginTop: 20 }}>
          <RecordsTable
            initialRecords={records.map((record) => ({
              ...record,
              createdAt: record.createdAt.toISOString(),
            }))}
          />
        </div>
      </div>
    </main>
  );
}
