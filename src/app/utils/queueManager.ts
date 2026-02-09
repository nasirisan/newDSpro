import { Task, Priority } from '../types/task';

export class TaskQueue {
  private queue: Task[] = [];

  enqueue(task: Task): void {
    this.queue.push(task);
  }

  dequeue(): Task | undefined {
    return this.queue.shift();
  }

  peek(): Task | undefined {
    return this.queue[0];
  }

  size(): number {
    return this.queue.length;
  }

  getAll(): Task[] {
    return [...this.queue];
  }

  remove(taskId: string): void {
    this.queue = this.queue.filter(t => t.id !== taskId);
  }

  clear(): void {
    this.queue = [];
  }
}

export class PriorityTaskQueue {
  private queue: Task[] = [];
  private priorityWeights: Record<Priority, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  enqueue(task: Task): void {
    this.queue.push(task);
    this.sort();
  }

  private sort(): void {
    this.queue.sort((a, b) => {
      // First, sort by priority weight (higher priority first)
      const priorityDiff = this.priorityWeights[b.priority] - this.priorityWeights[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Then, sort by deadline (earlier deadline first)
      return a.deadline.getTime() - b.deadline.getTime();
    });
  }

  dequeue(): Task | undefined {
    return this.queue.shift();
  }

  peek(): Task | undefined {
    return this.queue[0];
  }

  size(): number {
    return this.queue.length;
  }

  getAll(): Task[] {
    return [...this.queue];
  }

  remove(taskId: string): void {
    this.queue = this.queue.filter(t => t.id !== taskId);
  }

  clear(): void {
    this.queue = [];
  }
}

export function shouldMoveToPriorityQueue(task: Task): boolean {
  const now = new Date();
  const timeUntilDeadline = task.deadline.getTime() - now.getTime();
  const hoursUntilDeadline = timeUntilDeadline / (1000 * 60 * 60);

  // Move to priority queue if:
  // 1. Task has high priority and deadline is within 48 hours
  // 2. Task has medium priority and deadline is within 24 hours
  // 3. Task has any priority and deadline is within 12 hours
  if (task.priority === 'high' && hoursUntilDeadline <= 48) return true;
  if (task.priority === 'medium' && hoursUntilDeadline <= 24) return true;
  if (hoursUntilDeadline <= 12) return true;

  return false;
}
