
import { FormData } from '@/components/audit-request/form';
import { apiRequest } from './apiRequest';

interface SendEmailResponse {
  id: string
}

export async function submitAuditRequestEmail(formData: FormData): Promise<SendEmailResponse> {
  return apiRequest<SendEmailResponse>('/api/audit-request', 'POST', { data: formData }, false);
}
