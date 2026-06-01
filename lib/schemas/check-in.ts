import { z } from 'zod';

export const checkInInputSchema = z.object({
  staffId: z.string().min(1, '工号不能为空'),
});

export type CheckInInput = z.infer<typeof checkInInputSchema>;

export type CheckInResult =
  | { status: 'success'; staff: { name: string; staffId: string; lastCheckInAt?: string } }
  | { status: 'not_found'; staffId: string }
  | { status: 'already_checked_in'; staff: { name: string; staffId: string; lastCheckInAt: string } };