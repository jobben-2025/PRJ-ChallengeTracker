import type { Member } from "./members";
import z from "zod";

export const CreateChallengeSchema = z.object({
  title: z.string().min(3, "Title must min 3 char long"),
  description: z.string().min(10, "Expalin Challenge"),
  goalDays: z.number().min(1, "Min 1 day").max(365, "Maximal one year"),
});

export interface Challenge {
  id: number;
  title: string;
  visibility: ChallengeVisibility;
  status: ChallengeStatus;
  description: string;
  isCompleted: boolean;
  startDate?: string;
  endDate?: string;
  daysActive: number;
  targetAmount: number;
  members: Member[];
  progressEntries: ProgressEntry[];
  newTotal?: number;
  goal?: number;
  isFinished?: boolean;
}

export interface ProgressEntry {
  id: number;
  amount: number;
  loggedAt: string;
}

export enum ChallengeVisibility {
  Public = 0,
  Private = 1,
}

export enum ChallengeStatus {
  Open = 0,
  Running = 1,
  Completed = 2,
}
export type CreateChallengeInput = z.infer<typeof CreateChallengeSchema>;
