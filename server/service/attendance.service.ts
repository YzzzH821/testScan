import * as attendanceRepo from '../repository/attendance.repository';
import { CheckInInput, CheckInResult } from '@/lib/schemas/check-in';
import { failure, success } from '../lib/envelope';

// 签到核心逻辑
export async function checkIn(input: CheckInInput): Promise<CheckInResult> {
  const { staffId } = input;

  // 1. 查询员工记录
  const record = await attendanceRepo.findAttendanceRecordByStaffId(staffId);
  if (!record) {
    return { status: 'not_found', staffId };
  }

  // 2. 已签到则返回提示
  if (record.attended) {
    return {
      status: 'already_checked_in',
      staff: {
        name: record.name,
        staffId: record.staffId,
        lastCheckInAt: record.lastCheckInAt?.toISOString() || '',
      },
    };
  }

  // 3. 未签到则更新状态
  const updated = await attendanceRepo.updateAttendanceCheckIn(staffId);
  if (!updated) {
    // 并发场景下可能已被更新，重新查询确认
    const refreshedRecord = await attendanceRepo.findAttendanceRecordByStaffId(staffId);
    if (refreshedRecord?.attended) {
      return {
        status: 'already_checked_in',
        staff: {
          name: refreshedRecord.name,
          staffId: refreshedRecord.staffId,
          lastCheckInAt: refreshedRecord.lastCheckInAt?.toISOString() || '',
        },
      };
    }
    throw new Error('签到更新失败，请重试');
  }

  // 4. 返回成功结果
  return {
    status: 'success',
    staff: {
      name: record.name,
      staffId: record.staffId,
      lastCheckInAt: new Date().toISOString(),
    },
  };
}