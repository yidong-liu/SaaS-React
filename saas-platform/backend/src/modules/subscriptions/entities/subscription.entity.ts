export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: string;
  quantity?: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}
