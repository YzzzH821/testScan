import { CheckInInput, CheckInResult } from './schemas/check-in';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';  

export async function checkIn(staffId: string): Promise<CheckInResult> {
  const response = await fetch(`${API_BASE_URL}/api/v1/attendance/check-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ staffId }),
  });

  const data = await response.json();
  if (!data.ok) {
    throw new Error(data.error?.message || '签到失败');
  }
  return data.data;
}
