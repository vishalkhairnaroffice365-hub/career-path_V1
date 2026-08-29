import { api } from './api';
import type { Domain } from '../data/domains';

export const domainApi = {
  async getDomains(): Promise<Domain[]> {
    const res = await api.get<{ success: boolean; data: Domain[] }>('/domains');
    return res.data.data;
  },

  async getDomainById(id: string): Promise<Domain> {
    const res = await api.get<{ success: boolean; data: Domain }>(`/domains/${id}`);
    return res.data.data;
  },
};
