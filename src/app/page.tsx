import { RecordsTable } from "@/components/records-table";
import { prisma } from '@/lib/prisma';

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const records = await prisma.phoneRecord.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      customerPhoneNumber: true,
      whatsappNumber: true,
      voiceFilePath: true,
      createdAt: true
    }
  });

  return (
    <main className="page-shell">
      <div className="page-container">
        <div className="app-header">
          <div>
            <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.2 }}>
              电话数据查看
            </h1>
          </div>
        </div>

        <RecordsTable
          readonly
          initialRecords={records.map((record) => ({
            ...record,
            createdAt: record.createdAt.toISOString()
          }))}
        />
      </div>
    </main>
  );
}
