"use client";

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { Button, Card, Input, Space, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AudioPlayerWithTime from "@/components/myaudio";
import { DeleteRecordButton } from "@/components/delete-record-button";

type PhoneRecord = {
  id: string;
  customerPhoneNumber: string;
  whatsappNumber: string;
  voiceFilePath: string | null;
  createdAt: string;
};

type RecordsTableProps = {
  readonly?: boolean;
  initialRecords: PhoneRecord[];
};

export function RecordsTable({ readonly = false, initialRecords }: RecordsTableProps) {
  const [records, setRecords] = useState<PhoneRecord[]>(initialRecords);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const formatDateTime = (value: string) => new Date(value).toLocaleString("zh-CN");

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/records", { credentials: "include" });
      const data = (await response.json()) as {
        records?: PhoneRecord[];
        error?: string;
      };

      if (!response.ok) {
        message.error(data.error ?? "加载失败");
        return;
      }

      setRecords(data.records ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setRecords(initialRecords);
  }, [initialRecords]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword]);

  const filteredRecords = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    if (!text) {
      return records;
    }

    return records.filter((record) =>
      [record.customerPhoneNumber, record.whatsappNumber, record.voiceFilePath ?? "", record.createdAt]
        .join(" ")
        .toLowerCase()
        .includes(text)
    );
  }, [keyword, records]);

  const columns = useMemo<ColumnsType<PhoneRecord>>(() => {
    const baseColumns: ColumnsType<PhoneRecord> = [
      {
        title: "序号",
        width: 90,
        render: (_, __, index) => (currentPage - 1) * pageSize + index + 1
      },
      {
        title: "客户电话",
        dataIndex: "customerPhoneNumber"
      },
      {
        title: "接粉号",
        dataIndex: "whatsappNumber"
      },
      {
        title: "创建时间",
        dataIndex: "createdAt",
        width: 180,
        render: (value: string) => formatDateTime(value)
      },
      {
        title: "文件",
        dataIndex: "voiceFilePath",
        render: (value: string | null) =>
          value ? <Tag color="green">已上传</Tag> : <Tag>未上传</Tag>
      },
      {
        title: "语音播放",
        dataIndex: "voiceFilePath",
        width: 150,
        render: (value: string | null) =>
          value ? <AudioPlayerWithTime value={value} /> : "暂无"
      }
    ];

    if (readonly) {
      baseColumns.push({
        title: "查看详情",
        width: 120,
        render: (_, record) => (
          <Link href={`/records/${record.id}`} className="admin-action">
            <EyeOutlined />
            详情
          </Link>
        )
      });
    } else {
      baseColumns.push({
        title: "操作",
        width: 280,
        render: (_, record) => (
          <Space size={4} wrap>
            <Link href={`/admin/records/${record.id}`} className="admin-action">
              <EyeOutlined />
              详情
            </Link>
            <Link href={`/admin/records/${record.id}/edit`} className="admin-action">
              <EditOutlined />
              编辑
            </Link>
            <DeleteRecordButton id={record.id}>
              <button className="admin-action admin-action-danger" type="button">
                <DeleteOutlined />
                删除
              </button>
            </DeleteRecordButton>
          </Space>
        )
      });
    }

    return baseColumns;
  }, [currentPage, readonly]);

  return (
    <Card variant="borderless" className="panel-card">
      <Space style={{ width: "100%", justifyContent: "space-between" }} wrap>
        <Space wrap>
          {readonly ? (
            <div>查看电话数据</div>
          ) : (
            <>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => void fetchRecords()}
                loading={loading}
                className="admin-action"
              >
                刷新
              </Button>
              <Link href="/admin/records/new" className="admin-action admin-action-primary">
                <PlusOutlined />
                新增记录
              </Link>
            </>
          )}
        </Space>
      </Space>

      <Input.Search
        placeholder="搜索客户电话、接粉号或文件路径"
        allowClear
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        style={{ marginTop: 20, maxWidth: 420 }}
      />

      <Table
        style={{ marginTop: 20 }}
        columns={columns}
        dataSource={filteredRecords}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize,
          current: currentPage,
          onChange: (page) => setCurrentPage(page)
        }}
      />
    </Card>
  );
}
