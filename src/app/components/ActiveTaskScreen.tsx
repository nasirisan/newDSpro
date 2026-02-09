import { useState, useEffect } from 'react';
import { ArrowLeft, Play, CheckCircle2, SkipForward, Clock, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useTaskContext } from '../contexts/TaskContext';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface ActiveTaskScreenProps {
  onNavigate: (screen: string) => void;
}

export function ActiveTaskScreen({ onNavigate }: ActiveTaskScreenProps) {
  const { activeTask, normalQueue, priorityQueue, startNextTask, completeTask, postponeTask } = useTaskContext();
  const [executionTime, setExecutionTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (activeTask) {
      setIsRunning(true);
      setExecutionTime(0);
    } else {
      setIsRunning(false);
    }
  }, [activeTask]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setExecutionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    if (normalQueue.length === 0 && priorityQueue.length === 0) {
      toast.error('No tasks in queue');
      return;
    }
    startNextTask();
  };

  const handleComplete = () => {
    if (activeTask) {
      completeTask(activeTask.id, executionTime);
      setExecutionTime(0);
      toast.success('Task completed!');
    }
  };

  const handlePostpone = () => {
    if (activeTask) {
      postponeTask(activeTask.id);
      setExecutionTime(0);
      toast.info('Task postponed');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300';
    }
  };

  const totalPendingTasks = normalQueue.length + priorityQueue.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Task Execution</h1>
          <p className="text-muted-foreground mt-1">Execute tasks from the queue</p>
        </div>
      </div>

      {/* Queue Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                <Clock className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
                <p className="text-2xl font-bold">{totalPendingTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950">
                <AlertCircle className="size-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Priority Queue</p>
                <p className="text-2xl font-bold">{priorityQueue.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                <CheckCircle2 className="size-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Normal Queue</p>
                <p className="text-2xl font-bold">{normalQueue.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Task Display */}
      {activeTask ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 border-blue-500 shadow-lg">
            <CardHeader className="bg-blue-50 dark:bg-blue-950/30">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Play className="size-6 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                  Currently Executing Task
                </CardTitle>
                <Badge variant={activeTask.queueType === 'priority' ? 'destructive' : 'default'}>
                  {activeTask.queueType === 'priority' ? 'Priority Queue' : 'Normal Queue'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Task Info */}
              <div>
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-2xl font-bold">{activeTask.title}</h2>
                  <Badge className={getPriorityColor(activeTask.priority)}>
                    {activeTask.priority.toUpperCase()}
                  </Badge>
                </div>
                {activeTask.description && (
                  <p className="text-muted-foreground">{activeTask.description}</p>
                )}
              </div>

              {/* Task Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Deadline</p>
                  <p className="font-medium">{format(activeTask.deadline, 'PPp')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Created</p>
                  <p className="font-medium">{format(activeTask.createdAt, 'PPp')}</p>
                </div>
              </div>

              {/* Timer */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Execution Time</span>
                  <span className="text-3xl font-bold font-mono">{formatTime(executionTime)}</span>
                </div>
                <Progress value={(executionTime % 60) * (100 / 60)} className="h-2" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button onClick={handleComplete} className="flex-1 gap-2" size="lg">
                  <CheckCircle2 className="size-5" />
                  Mark as Completed
                </Button>
                <Button onClick={handlePostpone} variant="outline" className="gap-2" size="lg">
                  <SkipForward className="size-5" />
                  Postpone Task
                </Button>
              </div>

              {/* Info */}
              <div className="text-xs text-muted-foreground text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded">
                Task dequeued from {activeTask.queueType === 'priority' ? 'Priority Queue' : 'Normal Queue (FIFO)'}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="size-20 rounded-full bg-muted mx-auto flex items-center justify-center">
                <Play className="size-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">No Active Task</h3>
                <p className="text-muted-foreground">
                  {totalPendingTasks > 0 
                    ? 'Click the button below to start executing the next task from the queue'
                    : 'No tasks in queue. Add a task to get started.'}
                </p>
              </div>
              {totalPendingTasks > 0 ? (
                <Button onClick={handleStart} size="lg" className="gap-2">
                  <Play className="size-5" />
                  Start Next Task
                </Button>
              ) : (
                <Button onClick={() => onNavigate('add-task')} size="lg" variant="outline">
                  Add New Task
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next in Queue Preview */}
      {!activeTask && totalPendingTasks > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Next in Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {priorityQueue.length > 0 ? (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{priorityQueue[0].title}</h4>
                    <Badge variant="destructive">Priority Queue</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {priorityQueue[0].description || 'No description'}
                  </p>
                </div>
              ) : normalQueue.length > 0 ? (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{normalQueue[0].title}</h4>
                    <Badge>Normal Queue</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {normalQueue[0].description || 'No description'}
                  </p>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
