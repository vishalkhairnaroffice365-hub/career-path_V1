import { api } from './api';

export interface SubmissionPayload {
  nodeId: string;
  careerId?: string;
  type: 'coding-challenge' | 'practical-task';
  githubUrl: string;
  liveUrl?: string;
  notes?: string;
  fileName?: string;
  fileData?: string;
  fileSize?: number;
  score?: number;
}

export interface SubmissionRecord {
  id: string;
  nodeId: string;
  careerId?: string;
  type: 'coding-challenge' | 'practical-task';
  githubUrl: string;
  liveUrl?: string;
  notes?: string;
  fileName?: string;
  score?: number;
  status: 'submitted' | 'under-review' | 'passed' | 'failed';
  submittedAt: string;
}

export const submissionApi = {
  async submit(data: SubmissionPayload): Promise<{ submission: SubmissionRecord }> {
    const res = await api.post<{ submission: SubmissionRecord }>('/submissions', data);
    return res.data!;
  },

  async getMySubmissions(): Promise<SubmissionRecord[]> {
    const res = await api.get<{ submissions: SubmissionRecord[] }>('/submissions/my');
    return res.data?.submissions || [];
  },

  async getSubmissionByNodeId(nodeId: string): Promise<SubmissionRecord | null> {
    const res = await api.get<{ submission: SubmissionRecord | null }>(`/submissions/${nodeId}`);
    return res.data?.submission || null;
  },
};
