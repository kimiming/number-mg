'use client';

import { Button, Card, Form, Input, Typography, message } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type AuthFormProps = {
  mode: 'login' | 'register';
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const submit = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string; message?: string };

      if (!response.ok) {
        message.error(data.error ?? '请求失败');
        return;
      }

      if (mode === 'login') {
        message.success('登录成功');
        window.location.assign('/admin');
      } else {
        message.success('管理员已创建，请登录');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="auth-card" variant="borderless">
      <div className="auth-card__header">
        <Typography.Title level={2} style={{ marginBottom: 8 }}>
          {mode === 'login' ? '管理员登录' : '管理员注册'}
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
          {mode === 'login' ? '登录后进入后台管理区。' : '首次使用时先创建一个管理员账号。'}
        </Typography.Paragraph>
      </div>

      <Form layout="vertical" onFinish={submit} requiredMark={false}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }, { min: 3, message: '至少 3 个字符' }]}
        >
          <Input size="large" placeholder="admin" autoComplete="username" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '至少 6 位' }]}
        >
          <Input.Password
            size="large"
            placeholder="请输入密码"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </Form.Item>

        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
          {mode === 'login' ? '登录' : '创建管理员'}
        </Button>
      </Form>

      <div className="auth-card__footer">
        {mode === 'login' ? (
          <Link href="/register">首次使用？创建管理员</Link>
        ) : (
          <Link href="/login">已有账户？去登录</Link>
        )}
      </div>
    </Card>
  );
}
