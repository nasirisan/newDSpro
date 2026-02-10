import { ArrowLeft, BarChart3, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useTaskContext } from '../contexts/TaskContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

interface AnalyticsDashboardProps {
  onNavigate: (screen: string) => void;
}

export function AnalyticsDashboard({ onNavigate }: AnalyticsDashboardProps) {
  const { tasks, normalQueue, priorityQueue, completedTasks } = useTaskContext();

  // Priority Distribution
  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#10b981' },
  ];

  // Queue Distribution
  const queueData = [
    { name: 'Normal Queue', value: normalQueue.length },
    { name: 'Priority Queue', value: priorityQueue.length },
    { name: 'Completed', value: completedTasks.length },
  ];

  // Task Status
  const statusData = [
    { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length, color: '#f59e0b' },
    { name: 'Active', value: tasks.filter(t => t.status === 'active').length, color: '#3b82f6' },
    { name: 'Completed', value: completedTasks.length, color: '#10b981' },
  ];

  // Average completion time
  const averageTime = completedTasks.length > 0
    ? completedTasks.reduce((acc, task) => acc + (task.executionTime || 0), 0) / completedTasks.length
    : 0;

  // Overdue tasks
  const now = new Date();
  const overdueTasks = tasks.filter(t => t.status !== 'completed' && t.deadline < now).length;

  // Performance data (simulated daily completion)
  const performanceData = completedTasks.length > 0
    ? [
        { day: 'Mon', completed: Math.floor(completedTasks.length * 0.1) },
        { day: 'Tue', completed: Math.floor(completedTasks.length * 0.15) },
        { day: 'Wed', completed: Math.floor(completedTasks.length * 0.2) },
        { day: 'Thu', completed: Math.floor(completedTasks.length * 0.25) },
        { day: 'Fri', completed: Math.floor(completedTasks.length * 0.15) },
        { day: 'Sat', completed: Math.floor(completedTasks.length * 0.1) },
        { day: 'Sun', completed: Math.floor(completedTasks.length * 0.05) },
      ]
    : [
        { day: 'Mon', completed: 0 },
        { day: 'Tue', completed: 0 },
        { day: 'Wed', completed: 0 },
        { day: 'Thu', completed: 0 },
        { day: 'Fri', completed: 0 },
        { day: 'Sat', completed: 0 },
        { day: 'Sun', completed: 0 },
      ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => onNavigate('dashboard')} className="hover-scale transition-smooth glass-effect">
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold gradient-text">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Task performance metrics and insights</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="size-4" />
              Queue Length
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{normalQueue.length + priorityQueue.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {normalQueue.length} normal, {priorityQueue.length} priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="size-4" />
              Avg. Completion Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatTime(Math.round(averageTime))}</p>
            <p className="text-xs text-muted-foreground mt-1">Per task</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="size-4" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {completedTasks.length} of {tasks.length} tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="size-4" />
              Overdue Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{overdueTasks}</p>
            <p className="text-xs text-muted-foreground mt-1">Past deadline</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Queue Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={queueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Task Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Data Structure Insights */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-5" />
            Data Structure Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold mb-2">Normal Queue (FIFO)</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Algorithm: First-In-First-Out</li>
                <li>• Time Complexity: O(1) enqueue/dequeue</li>
                <li>• Current Size: {normalQueue.length}</li>
                <li>• Use Case: Standard task processing</li>
              </ul>
            </div>
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold mb-2">Priority Queue</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Algorithm: Priority-based sorting</li>
                <li>• Time Complexity: O(log n) insert, O(1) peek</li>
                <li>• Current Size: {priorityQueue.length}</li>
                <li>• Use Case: Urgent task handling</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            This system demonstrates how Queue (FIFO) and Priority Queue data structures 
            efficiently manage task execution. Priority Queue ensures time-critical tasks 
            are handled first, while the Normal Queue maintains fair processing order for 
            standard tasks.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
