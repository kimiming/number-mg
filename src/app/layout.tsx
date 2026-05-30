import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { AntdProviders } from '@/components/antd-providers';
import type { ReactNode } from 'react';
import 'antd/dist/reset.css';
import './globals.css';

export const metadata: Metadata = {
  title: '电话后台管理系统',
  description: '电话后台管理系统'
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>
          <AntdProviders>{children}</AntdProviders>
        </AntdRegistry>
      </body>
    </html>
  );
}
