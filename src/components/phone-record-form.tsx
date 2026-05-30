'use client';

import { InboxOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Space, Typography, Upload, message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

type RecordShape = {
  id?: string;
  customerPhoneNumber?: string;
  whatsappNumber?: string;
  voiceFilePath?: string | null;
};

type Props = {
  title: string;
  submitText: string;
  initialValues?: RecordShape;
  submitUrl: string;
  submitMethod: 'POST' | 'PUT';
};

async function uploadVoiceFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    credentials: 'include',
    body: formData
  });

  const payload = (await response.json().catch(() => ({}))) as { path?: string; error?: string };
  if (!response.ok) {
    throw new Error(payload.error ?? '文件上传失败');
  }

  return payload.path as string;
}

export function PhoneRecordForm({
  title,
  submitText,
  initialValues,
  submitUrl,
  submitMethod
}: Props) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const existingFile = initialValues?.voiceFilePath ?? null;

  const fileList = useMemo<UploadFile[]>(() => {
    if (!selectedFile) {
      return [];
    }
    return [
      {
        uid: 'selected-file',
        name: selectedFile.name,
        status: 'done'
      }
    ];
  }, [selectedFile]);

  const onFinish = async (values: {
    customerPhoneNumber: string;
    whatsappNumber: string;
  }) => {
    setSubmitting(true);
    try {
      let voiceFilePath = existingFile;

      if (selectedFile) {
        voiceFilePath = await uploadVoiceFile(selectedFile);
      }

      const response = await fetch(submitUrl, {
        method: submitMethod,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          voiceFilePath
        })
      });

      const payload = (await response.json().catch(() => ({}))) as { error?: string; id?: string };

      if (!response.ok) {
        message.error(payload.error ?? '保存失败');
        return;
      }

      message.success('保存成功');
      router.push('/admin');
      router.refresh();
    } catch (error) {
      message.error(error instanceof Error ? error.message : '保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card variant="borderless" className="panel-card">
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Typography.Title level={3} style={{ marginBottom: 0 }}>
          {title}
        </Typography.Title>
        <Typography.Text type="secondary">
          可录入客户电话、接粉号，并上传语音文件。
        </Typography.Text>
      </Space>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        style={{ marginTop: 24 }}
        initialValues={{
          customerPhoneNumber: initialValues?.customerPhoneNumber,
          whatsappNumber: initialValues?.whatsappNumber
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="客户电话号码"
          name="customerPhoneNumber"
          rules={[{ required: true, message: '请输入客户电话号码' }]}
        >
          <Input size="large" placeholder="+86 138 0000 0000" />
        </Form.Item>

        <Form.Item
          label="接粉号"
          name="whatsappNumber"
          rules={[{ required: true, message: '请输入接粉号' }]}
        >
          <Input size="large" placeholder="+1 202 555 0100" />
        </Form.Item>

        <Form.Item label="语音文件">
          <Upload.Dragger
            multiple={false}
            beforeUpload={(file) => {
              setSelectedFile(file);
              return false;
            }}
            fileList={fileList}
            onRemove={() => {
              setSelectedFile(null);
            }}
            accept="audio/*"
            maxCount={1}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽上传语音文件</p>
            <p className="ant-upload-hint">文件会保存在本地 `public/uploads`，并记录到数据库。</p>
          </Upload.Dragger>
          {existingFile && !selectedFile ? (
            <Typography.Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
              当前已关联文件：{existingFile}
            </Typography.Text>
          ) : null}
        </Form.Item>

        <Space>
          <Button type="primary" htmlType="submit" size="large" loading={submitting}>
            {submitText}
          </Button>
          <Button size="large" onClick={() => router.push('/admin')}>
            取消
          </Button>
        </Space>
      </Form>
    </Card>
  );
}
