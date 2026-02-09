import { ArrowLeft, ArrowRight, Clock, AlertTriangle, Layers } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useTaskContext } from '../contexts/TaskContext';
import { Task } from '../types/task';
import { format } from 'date-fns';
import { motion } from 'motion/react';

interface QueueViewProps {
  onNavigate: (screen: string) => void;
}

export function QueueView({ onNavigate }: QueueViewProps) {
  const { normalQueue, priorityQueue } = useTaskContext();

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

  const TaskCard = ({ task, index, queueType }: { task: Task; index: number; queueType: 'normal' | 'priority' }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`relative ${queueType === 'priority' ? 'border-red-500' : 'border-blue-500'}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Position Badge */}
            <div className="flex-shrink-0">
              <div className={`size-12 rounded-full flex items-center justify-center font-bold text-lg ${
                queueType === 'priority' 
                  ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' 
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
              }`}>
                #{task.positionInQueue}
              </div>
            </div>

            {/* Task Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-semibold text-lg truncate">{task.title}</h4>
                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                  {task.priority.toUpperCase()}
                </Badge>
              </div>
              
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {format(task.deadline, 'PPp')}
                </div>
                <div className="flex items-center gap-1">
                  <Layers className="size-3" />
                  Position #{task.positionInQueue} in Queue
                </div>
              </div>
            </div>
          </div>

          {/* Queue Type Badge */}
          <div className="absolute top-4 right-4">
            <Badge variant={queueType === 'priority' ? 'destructive' : 'default'}>
              {queueType === 'priority' ? 'Priority Queue' : 'Normal Queue'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Task Queue Visualization</h1>
          <p className="text-muted-foreground mt-1">
            Visual representation of FIFO and Priority Queue data structures
          </p>
        </div>
      </div>

      {/* Queue Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-blue-500" />
              Normal Queue Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Tasks:</span>
                <span className="font-bold text-2xl">{normalQueue.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Algorithm:</span>
                <span className="font-medium">FIFO (First-In-First-Out)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next Task:</span>
                <span className="font-medium">
                  {normalQueue.length > 0 ? `#${normalQueue[0].positionInQueue}` : 'None'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-red-500" />
              Priority Queue Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Tasks:</span>
                <span className="font-bold text-2xl">{priorityQueue.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Algorithm:</span>
                <span className="font-medium">Priority-based Sorting</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next Task:</span>
                <span className="font-medium">
                  {priorityQueue.length > 0 ? `#${priorityQueue[0].positionInQueue}` : 'None'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Queue Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Normal Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <div className="size-4 rounded-full bg-blue-500" />
              Normal Queue (FIFO)
            </h2>
            <Badge variant="outline">{normalQueue.length} tasks</Badge>
          </div>

          {normalQueue.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-muted-foreground">
                  <Layers className="size-12 mx-auto mb-3 opacity-50" />
                  <p>No tasks in normal queue</p>
                  <p className="text-sm mt-1">Add a task to see it here</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {/* FIFO Indicator */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                <ArrowRight className="size-4" />
                <span>Tasks executed in order: First In, First Out</span>
              </div>

              {normalQueue.map((task, index) => (
                <div key={task.id} className="relative">
                  <TaskCard task={task} index={index} queueType="normal" />
                  {index < normalQueue.length - 1 && (
                    <div className="flex justify-center my-2">
                      <div className="h-6 w-0.5 bg-blue-300 dark:bg-blue-700" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Priority Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <div className="size-4 rounded-full bg-red-500" />
              Priority Queue
            </h2>
            <Badge variant="destructive">{priorityQueue.length} tasks</Badge>
          </div>

          {priorityQueue.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-muted-foreground">
                  <AlertTriangle className="size-12 mx-auto mb-3 opacity-50" />
                  <p>No urgent tasks</p>
                  <p className="text-sm mt-1">High priority tasks appear here</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {/* Priority Indicator */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-red-50 dark:bg-red-950/30 p-3 rounded-lg border border-red-200 dark:border-red-900">
                <AlertTriangle className="size-4 text-red-600 dark:text-red-400" />
                <span>Tasks sorted by priority & deadline</span>
              </div>

              {priorityQueue.map((task, index) => (
                <div key={task.id} className="relative">
                  <TaskCard task={task} index={index} queueType="priority" />
                  {index < priorityQueue.length - 1 && (
                    <div className="flex justify-center my-2">
                      <div className="h-6 w-0.5 bg-red-300 dark:bg-red-700" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Execution Order Info */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <AlertTriangle className="size-5 text-blue-600 dark:text-blue-400" />
            Execution Order Logic
          </h3>
          <p className="text-sm text-muted-foreground">
            Priority Queue tasks are always executed first before Normal Queue tasks. 
            Within each queue, tasks follow their respective ordering rules: 
            Priority Queue uses priority-based sorting, while Normal Queue follows strict FIFO order.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
