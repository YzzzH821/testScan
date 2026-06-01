import prisma from '@/lib/prisma';
import { AttendanceRecord } from '@prisma/client';

// 按工号查询考勤记录
export async function findAttendanceRecordByStaffId(staffId: string): Promise<AttendanceRecord | null> {
  return prisma.attendanceRecord.findUnique({
    where: { staffId },
  });
}

// 更新签到状态（事务：仅当未签到时更新）
export async function updateAttendanceCheckIn(staffId: string): Promise<boolean> {
  const result = await prisma.attendanceRecord.updateMany({
    where: {
      staffId,
      attended: false,
    },
    data: {
      attended: true,
      lastCheckInAt: new Date(),
    },
  });
  // 返回是否更新成功（影响行数>0）
  return result.count > 0;
}