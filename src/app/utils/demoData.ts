import { Task, Priority, QueueType } from '../types/task';

export const generateDemoTasks = (): Omit<Task, 'id' | 'createdAt' | 'status'>[] => {
  const now = new Date();
  
  return [
    {
      title: 'Review project proposal',
      description: 'Review and approve the Q1 project proposal from the development team',
      priority: 'high' as Priority,
      deadline: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
      queueType: 'priority' as QueueType,
    },
    {
      title: 'Update documentation',
      description: 'Update the API documentation with new endpoints and examples',
      priority: 'medium' as Priority,
      deadline: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 1 day from now
      queueType: 'normal' as QueueType,
    },
    {
      title: 'Fix critical bug in login',
      description: 'Users are unable to login with social authentication',
      priority: 'high' as Priority,
      deadline: new Date(now.getTime() + 4 * 60 * 60 * 1000), // 4 hours from now
      queueType: 'priority' as QueueType,
    },
    {
      title: 'Prepare presentation slides',
      description: 'Create slides for the upcoming stakeholder meeting',
      priority: 'medium' as Priority,
      deadline: new Date(now.getTime() + 48 * 60 * 60 * 1000), // 2 days from now
      queueType: 'normal' as QueueType,
    },
    {
      title: 'Code review for PR #234',
      description: 'Review and merge the pull request for the new feature',
      priority: 'low' as Priority,
      deadline: new Date(now.getTime() + 72 * 60 * 60 * 1000), // 3 days from now
      queueType: 'normal' as QueueType,
    },
    {
      title: 'Deploy to production',
      description: 'Deploy the latest release to production environment',
      priority: 'high' as Priority,
      deadline: new Date(now.getTime() + 6 * 60 * 60 * 1000), // 6 hours from now
      queueType: 'priority' as QueueType,
    },
  ];
};
