import { ArrowLeft, Trash2, Settings, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useTaskContext } from '../contexts/TaskContext';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface AdminQueueManagementProps {
  onNavigate: (screen: string) => void;
}

export function AdminQueueManagement({ onNavigate }: AdminQueueManagementProps) {
  const { normalQueue, priorityQueue, deleteTask } = useTaskContext();

  const handleDeleteTask = (taskId: string, taskTitle: string) => {
    if (confirm(`Are you sure you want to delete "${taskTitle}"?`)) {
      deleteTask(taskId);
      toast.success('Task deleted successfully');
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="size-8" />
            Queue Management Panel
          </h1>
          <p className="text-muted-foreground mt-1">Admin controls for queue management</p>
        </div>
      </div>

      {/* Warning Banner */}
      <Card className="bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900">
        <CardContent className="p-4">
          <p className="text-sm flex items-center gap-2">
            <Settings className="size-4" />
            <span className="font-semibold">Admin Mode:</span>
            You have full control to manage, reorder, and delete tasks in both queues.
          </p>
        </CardContent>
      </Card>

      {/* Queue Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Normal Queue Management */}
        <Card>
          <CardHeader className="bg-blue-50 dark:bg-blue-950/30">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-blue-500" />
                Normal Queue Management
              </div>
              <Badge variant="outline">{normalQueue.length} tasks</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {normalQueue.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No tasks in normal queue</p>
              </div>
            ) : (
              <div className="space-y-3">
                {normalQueue.map((task, index) => (
                  <Card key={task.id} className="border-blue-200 dark:border-blue-900">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Position */}
                        <div className="flex-shrink-0">
                          <div className="size-8 rounded bg-blue-100 dark:bg-blue-950 flex items-center justify-center font-bold text-sm text-blue-700 dark:text-blue-300">
                            #{index + 1}
                          </div>
                        </div>

                        {/* Task Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-semibold text-sm">{task.title}</h4>
                            <Badge className={getPriorityColor(task.priority)} variant="outline">
                              {task.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Deadline: {format(task.deadline, 'PPp')}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => handleDeleteTask(task.id, task.title)}
                          >
                            <Trash2 className="size-3 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Priority Queue Management */}
        <Card>
          <CardHeader className="bg-red-50 dark:bg-red-950/30">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-red-500" />
                Priority Queue Management
              </div>
              <Badge variant="destructive">{priorityQueue.length} tasks</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {priorityQueue.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No tasks in priority queue</p>
              </div>
            ) : (
              <div className="space-y-3">
                {priorityQueue.map((task, index) => (
                  <Card key={task.id} className="border-red-200 dark:border-red-900">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Position */}
                        <div className="flex-shrink-0">
                          <div className="size-8 rounded bg-red-100 dark:bg-red-950 flex items-center justify-center font-bold text-sm text-red-700 dark:text-red-300">
                            #{index + 1}
                          </div>
                        </div>

                        {/* Task Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-semibold text-sm">{task.title}</h4>
                            <Badge className={getPriorityColor(task.priority)} variant="outline">
                              {task.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Deadline: {format(task.deadline, 'PPp')}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => handleDeleteTask(task.id, task.title)}
                          >
                            <Trash2 className="size-3 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Queue Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Queue Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Queued Tasks</p>
              <p className="text-3xl font-bold">{normalQueue.length + priorityQueue.length}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Normal Queue</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {normalQueue.length}
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Priority Queue</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {priorityQueue.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
