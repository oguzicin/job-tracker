// src/types/Job.ts
export interface Job {
  id: number;
  company: string;
  position: string;
  status: string;
  jobType: string;
  jobLocation: string;
  dateApplied: string;
  description?: string;
}
