// 统一API响应格式
import { NextResponse } from 'next/server';

export type ApiResponse<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

// 成功响应
export function success<T>(data: T): ApiResponse<T> {
  return { ok: true, data };
}

// 失败响应
export function failure(code: string, message: string): ApiResponse {
  return { ok: false, error: { code, message } };
}

// 封装Next.js响应
export function envelope<T>(response: ApiResponse<T>) {
  return NextResponse.json(response);
}