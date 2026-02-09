export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'active' | 'completed';
export type QueueType = 'normal' | 'priority';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  deadline: Date;
  queueType: QueueType;
  status: TaskStatus;
  createdAt: Date;
  completedAt?: Date;
  executionTime?: number; // in seconds
  positionInQueue?: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  timestamp: Date;
  read: boolean;
}
