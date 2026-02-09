import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, Notification, TaskStatus } from '../types/task';
import { TaskQueue, PriorityTaskQueue, shouldMoveToPriorityQueue } from '../utils/queueManager';

interface TaskContextType {
  tasks: Task[];
  normalQueue: Task[];
  priorityQueue: Task[];
  activeTask: Task | null;
  completedTasks: Task[];
  notifications: Notification[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void;
  startNextTask: () => void;
  completeTask: (taskId: string, executionTime: number) => void;
  postponeTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
  clearAllTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const normalTaskQueue = new TaskQueue();
const priorityTaskQueue = new PriorityTaskQueue();

// LocalStorage keys
const STORAGE_KEYS = {
  TASKS: 'smartTaskManager_tasks',
  ACTIVE_TASK: 'smartTaskManager_activeTask',
};

// Helper functions for serialization/deserialization
const serializeTask = (task: Task): string => {
  return JSON.stringify(task);
};

const deserializeTask = (json: string): Task => {
  const task = JSON.parse(json);
  // Convert date strings back to Date objects
  task.createdAt = new Date(task.createdAt);
  task.deadline = new Date(task.deadline);
  if (task.completedAt) task.completedAt = new Date(task.completedAt);
  return task;
};

const loadTasksFromStorage = (): Task[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!stored) return [];
    const tasks = JSON.parse(stored) as Task[];
    return tasks.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt),
      deadline: new Date(task.deadline),
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
    }));
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    return [];
  }
};

const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
};

const loadActiveTaskFromStorage = (): Task | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_TASK);
    if (!stored) return null;
    return deserializeTask(stored);
  } catch (error) {
    console.error('Failed to load active task from localStorage:', error);
    return null;
  }
};

const saveActiveTaskToStorage = (task: Task | null): void => {
  try {
    if (task) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TASK, serializeTask(task));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_TASK);
    }
  } catch (error) {
    console.error('Failed to save active task to localStorage:', error);
  }
};

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const loadedTasks = loadTasksFromStorage();
    const loadedActiveTask = loadActiveTaskFromStorage();
    
    setTasks(loadedTasks);
    setActiveTask(loadedActiveTask);
    
    // Rebuild queues from loaded tasks
    normalTaskQueue.clear?.();
    priorityTaskQueue.clear?.();
    
    loadedTasks.forEach(task => {
      if (task.status === 'pending') {
        if (task.queueType === 'priority') {
          priorityTaskQueue.enqueue(task);
        } else {
          normalTaskQueue.enqueue(task);
        }
      }
    });
    
    setIsInitialized(true);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      saveTasksToStorage(tasks);
    }
  }, [tasks, isInitialized]);

  // Save active task to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      saveActiveTaskToStorage(activeTask);
    }
  }, [activeTask, isInitialized]);

  const addNotification = useCallback((message: string, type: 'info' | 'warning' | 'success') => {
    const notification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [notification, ...prev]);
  }, []);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString() + Math.random(),
      createdAt: new Date(),
      status: 'pending',
    };

    setTasks(prev => [...prev, newTask]);

    if (newTask.queueType === 'priority' || shouldMoveToPriorityQueue(newTask)) {
      priorityTaskQueue.enqueue({ ...newTask, queueType: 'priority' });
      addNotification(`Task "${newTask.title}" added to Priority Queue`, 'success');
    } else {
      normalTaskQueue.enqueue(newTask);
      addNotification(`Task "${newTask.title}" added to Normal Queue`, 'info');
    }
  }, [addNotification]);

  const startNextTask = useCallback(() => {
    if (activeTask) return;

    let nextTask: Task | undefined;

    // Priority queue has precedence
    if (priorityTaskQueue.size() > 0) {
      nextTask = priorityTaskQueue.dequeue();
    } else if (normalTaskQueue.size() > 0) {
      nextTask = normalTaskQueue.dequeue();
    }

    if (nextTask) {
      const updatedTask = { ...nextTask, status: 'active' as TaskStatus };
      setActiveTask(updatedTask);
      setTasks(prev => prev.map(t => t.id === nextTask!.id ? updatedTask : t));
      addNotification(`Executing: "${nextTask.title}"`, 'info');
    }
  }, [activeTask, addNotification]);

  const completeTask = useCallback((taskId: string, executionTime: number) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { ...t, status: 'completed' as TaskStatus, completedAt: new Date(), executionTime }
        : t
    ));
    setActiveTask(null);
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      addNotification(`Task "${task.title}" completed!`, 'success');
    }
    
    // Auto-start next task
    setTimeout(() => {
      startNextTask();
    }, 500);
  }, [tasks, addNotification, startNextTask]);

  const postponeTask = useCallback((taskId: string) => {
    if (activeTask && activeTask.id === taskId) {
      const postponedTask = { ...activeTask, status: 'pending' as TaskStatus };
      
      if (postponedTask.queueType === 'priority' || shouldMoveToPriorityQueue(postponedTask)) {
        priorityTaskQueue.enqueue(postponedTask);
      } else {
        normalTaskQueue.enqueue(postponedTask);
      }
      
      setTasks(prev => prev.map(t => t.id === taskId ? postponedTask : t));
      setActiveTask(null);
      addNotification(`Task "${postponedTask.title}" postponed`, 'warning');
      
      // Auto-start next task
      setTimeout(() => {
        startNextTask();
      }, 500);
    }
  }, [activeTask, addNotification, startNextTask]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    normalTaskQueue.remove(taskId);
    priorityTaskQueue.remove(taskId);
    
    if (activeTask?.id === taskId) {
      setActiveTask(null);
    }
  }, [activeTask]);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const clearAllTasks = useCallback(() => {
    setTasks([]);
    setActiveTask(null);
    normalTaskQueue.clear?.();
    priorityTaskQueue.clear?.();
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_TASK);
    addNotification('All tasks cleared', 'info');
  }, [addNotification]);

  // Auto-reorder tasks: Check if normal queue tasks should move to priority queue
  useEffect(() => {
    const interval = setInterval(() => {
      const normalTasks = normalTaskQueue.getAll();
      normalTasks.forEach(task => {
        if (shouldMoveToPriorityQueue(task)) {
          normalTaskQueue.remove(task.id);
          priorityTaskQueue.enqueue({ ...task, queueType: 'priority' });
          setTasks(prev => prev.map(t => 
            t.id === task.id ? { ...t, queueType: 'priority' } : t
          ));
          addNotification(`Task "${task.title}" moved to Priority Queue (deadline approaching)`, 'warning');
        }
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [addNotification]);

  const normalQueue = normalTaskQueue.getAll().map((task, index) => ({
    ...task,
    positionInQueue: index + 1,
  }));

  const priorityQueue = priorityTaskQueue.getAll().map((task, index) => ({
    ...task,
    positionInQueue: index + 1,
  }));

  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <TaskContext.Provider
      value={{
        tasks,
        normalQueue,
        priorityQueue,
        activeTask,
        completedTasks,
        notifications,
        addTask,
        startNextTask,
        completeTask,
        postponeTask,
        deleteTask,
        markNotificationAsRead,
        clearAllNotifications,
        clearAllTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider');
  }
  return context;
}
