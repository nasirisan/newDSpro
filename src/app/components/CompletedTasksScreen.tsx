import { ArrowLeft, CheckCircle2, Clock, Calendar, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useTaskContext } from '../contexts/TaskContext';
import { format } from 'date-fns';
import { motion } from 'motion/react';

interface CompletedTasksScreenProps {
  onNavigate: (screen: string) => void;
}

export function CompletedTasksScreen({ onNavigate }: CompletedTasksScreenProps) {
  const { completedTasks } = useTaskContext();

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

  const formatTime = (seconds: number | undefined) => {
    if (!seconds) return '0m 0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const averageTime = completedTasks.length > 0
    ? completedTasks.reduce((acc, task) => acc + (task.executionTime || 0), 0) / completedTasks.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Completed Tasks</h1>
          <p className="text-muted-foreground mt-1">View all finished tasks and performance metrics</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                <CheckCircle2 className="size-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-3xl font-bold">{completedTasks.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                <Clock className="size-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-3xl font-bold">{formatTime(Math.round(averageTime))}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950">
                <TrendingUp className="size-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-3xl font-bold">
                {completedTasks.length > 0 ? '100%' : '0%'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completed Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>Task History</CardTitle>
        </CardHeader>
        <CardContent>
          {completedTasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="size-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Completed Tasks</h3>
              <p className="text-muted-foreground mb-4">
                Complete tasks to see them here
              </p>
              <Button onClick={() => onNavigate('active-task')} variant="outline">
                Start Executing Tasks
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {completedTasks
                .sort((a, b) => {
                  const timeA = a.completedAt?.getTime() || 0;
                  const timeB = b.completedAt?.getTime() || 0;
                  return timeB - timeA;
                })
                .map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Checkmark Icon */}
                          <div className="flex-shrink-0 pt-1">
                            <div className="size-10 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                              <CheckCircle2 className="size-5 text-green-600 dark:text-green-400" />
                            </div>
                          </div>

                          {/* Task Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h4 className="font-semibold text-lg">{task.title}</h4>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority.toUpperCase()}
                              </Badge>
                            </div>

                            {task.description && (
                              <p className="text-sm text-muted-foreground mb-3">
                                {task.description}
                              </p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="size-3" />
                                <span>Time: {formatTime(task.executionTime)}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <CheckCircle2 className="size-3" />
                                <span>
                                  Completed: {task.completedAt ? format(task.completedAt, 'PPp') : 'N/A'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Calendar className="size-3" />
                                <span>Created: {format(task.createdAt, 'PP')}</span>
                              </div>
                              <div>
                                <Badge variant={task.queueType === 'priority' ? 'destructive' : 'default'} className="text-xs">
                                  {task.queueType === 'priority' ? 'Priority Queue' : 'Normal Queue'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      {completedTasks.length > 0 && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-900">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="size-5 text-green-600 dark:text-green-400" />
              Performance Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Fastest Task</p>
                <p className="font-semibold">
                  {formatTime(Math.min(...completedTasks.map(t => t.executionTime || Infinity)))}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Longest Task</p>
                <p className="font-semibold">
                  {formatTime(Math.max(...completedTasks.map(t => t.executionTime || 0)))}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Total Time Spent</p>
                <p className="font-semibold">
                  {formatTime(completedTasks.reduce((acc, t) => acc + (t.executionTime || 0), 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
