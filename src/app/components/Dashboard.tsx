import { ListTodo, Clock, AlertCircle, CheckCircle2, Plus, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useTaskContext } from '../contexts/TaskContext';
import { generateDemoTasks } from '../utils/demoData';
import { toast } from 'sonner';

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { tasks, normalQueue, priorityQueue, completedTasks, addTask } = useTaskContext();

  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const urgentTasks = priorityQueue.length;
  const totalTasks = tasks.length;
  const completedCount = completedTasks.length;

  const handleLoadDemoData = () => {
    const demoTasks = generateDemoTasks();
    demoTasks.forEach(task => addTask(task));
    toast.success('Demo tasks loaded successfully!');
  };

  const stats = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: ListTodo,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-950',
    },
    {
      title: 'Pending Tasks',
      value: pendingTasks,
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-950',
    },
    {
      title: 'Urgent Tasks',
      value: urgentTasks,
      icon: AlertCircle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-950',
    },
    {
      title: 'Completed Tasks',
      value: completedCount,
      icon: CheckCircle2,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-950',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your tasks with Queue and Priority Queue data structures
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          {totalTasks === 0 && (
            <Button onClick={handleLoadDemoData} size="lg" variant="outline" className="gap-2 flex-1 sm:flex-initial">
              <Download className="size-5" />
              <span className="hidden sm:inline">Load Demo Data</span>
              <span className="sm:hidden">Demo Data</span>
            </Button>
          )}
          <Button onClick={() => onNavigate('add-task')} size="lg" className="gap-2 flex-1 sm:flex-initial">
            <Plus className="size-5" />
            <span className="hidden sm:inline">Add New Task</span>
            <span className="sm:hidden">Add Task</span>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`size-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate('queue-view')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="size-5" />
              View Task Queues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Visualize Normal Queue (FIFO) and Priority Queue with {normalQueue.length + priorityQueue.length} pending tasks
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate('active-task')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5" />
              Execute Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Start executing tasks from the queues and track progress
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate('analytics')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5" />
              View Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track performance metrics and task completion statistics
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Queue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-blue-500" />
              Normal Queue (FIFO)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-2">{normalQueue.length} tasks</p>
            <p className="text-sm text-muted-foreground">
              Tasks are processed in First-In-First-Out order
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-red-500" />
              Priority Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-2">{priorityQueue.length} tasks</p>
            <p className="text-sm text-muted-foreground">
              Urgent tasks sorted by priority and deadline
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Presentation Guide */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 Presentation Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="font-semibold text-sm">
            What to say during your presentation:
          </p>
          <blockquote className="border-l-4 border-purple-500 pl-4 italic text-sm">
            "This system uses a <strong>Queue data structure</strong> to manage normal tasks in <strong>FIFO (First-In-First-Out) order</strong>, 
            while urgent tasks are handled using a <strong>Priority Queue</strong> to ensure time-critical execution based on priority levels and deadlines."
          </blockquote>
          <div className="text-xs text-muted-foreground space-y-1 mt-3">
            <p>• <strong>Normal Queue:</strong> O(1) time complexity for enqueue/dequeue operations</p>
            <p>• <strong>Priority Queue:</strong> O(log n) insert, O(1) peek for highest priority task</p>
            <p>• <strong>Auto-reordering:</strong> Tasks automatically move to priority queue as deadlines approach</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}