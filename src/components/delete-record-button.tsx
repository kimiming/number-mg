'use client';

import { Popconfirm, message } from 'antd';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useState } from 'react';

type Props = {
  id: string;
  children: ReactNode;
};

export function DeleteRecordButton({ id, children }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const remove = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/records/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        message.error(data.error ?? '删除失败');
        return;
      }
      message.success('已删除');
      router.push('/admin');
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popconfirm
      title="确认删除这条记录？"
      okText="删除"
      okButtonProps={{ danger: true, loading }}
      cancelText="取消"
      onConfirm={remove}
    >
      <span>{children}</span>
    </Popconfirm>
  );
}
