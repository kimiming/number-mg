import { z } from 'zod';

export const authSchema = z.object({
  username: z.string().trim().min(3, '用户名至少 3 个字符').max(50, '用户名过长'),
  password: z.string().min(6, '密码至少 6 位').max(100, '密码过长')
});

export const phoneRecordSchema = z.object({
  customerPhoneNumber: z.string().trim().min(1, '客户电话号码不能为空').max(50, '客户电话号码过长'),
  whatsappNumber: z.string().trim().min(1, '接粉号不能为空').max(50, '接粉号过长'),
  voiceFilePath: z.string().trim().max(500, '文件路径过长').optional().nullable()
});

export type AuthInput = z.infer<typeof authSchema>;
export type PhoneRecordInput = z.infer<typeof phoneRecordSchema>;
