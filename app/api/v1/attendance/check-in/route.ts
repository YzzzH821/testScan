import { NextResponse } from 'next/server';
import { checkInInputSchema } from '@/lib/schemas/check-in';
import * as attendanceService from '@/server/service/attendance.service';
import { envelope, failure, success } from '@/server/lib/envelope';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = checkInInputSchema.parse(body);
    const result = await attendanceService.checkIn(input);
    return envelope(success(result));
  } catch (error: any) {
    if (error instanceof Error) {
      return envelope(failure('CHECK_IN_ERROR', error.message));
    }
    return envelope(failure('UNKNOWN_ERROR', '未知错误，请重试'));
  }
}
