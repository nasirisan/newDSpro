import { useState } from 'react';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useTaskContext } from '../contexts/TaskContext';
import { Priority, QueueType } from '../types/task';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface AddTaskScreenProps {
  onNavigate: (screen: string) => void;
}

export function AddTaskScreen({ onNavigate }: AddTaskScreenProps) {
  const { addTask } = useTaskContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [queueType, setQueueType] = useState<QueueType>('normal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    if (!deadline) {
      toast.error('Please select a deadline');
      return;
    }

    addTask({
      title,
      description,
      priority,
      deadline,
      queueType,
    });

    toast.success('Task added successfully!');
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDeadline(undefined);
    setQueueType('normal');

    // Navigate back to dashboard
    setTimeout(() => {
      onNavigate('dashboard');
    }, 500);
  };

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', color: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300' },
    { value: 'high', label: 'High Priority', color: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Task</h1>
          <p className="text-muted-foreground mt-1">Create a new task for queue management</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                placeholder="Enter task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Task Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Task Description</Label>
              <Textarea
                id="description"
                placeholder="Enter task description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* Priority Selector */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level *</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${option.color}`}>
                          {option.label}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Deadline Picker */}
            <div className="space-y-3">
              <Label htmlFor="deadline">Deadline *</Label>
              <div className="flex gap-2">
                <Input
                  id="deadline"
                  type="date"
                  value={deadline ? format(deadline, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      const date = new Date(e.target.value + 'T00:00:00');
                      setDeadline(date);
                    } else {
                      setDeadline(undefined);
                    }
                  }}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Queue Type */}
            <div className="space-y-2">
              <Label htmlFor="queueType">Queue Type *</Label>
              <Select value={queueType} onValueChange={(value) => setQueueType(value as QueueType)}>
                <SelectTrigger id="queueType">
                  <SelectValue placeholder="Select queue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-blue-500" />
                      Normal Queue (FIFO)
                    </div>
                  </SelectItem>
                  <SelectItem value="priority">
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-red-500" />
                      Priority Queue
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {queueType === 'normal' 
                  ? 'Tasks will be executed in First-In-First-Out order'
                  : 'Tasks will be sorted by priority and deadline'}
              </p>
            </div>

            {/* Current Selection Summary */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-3">Task Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Priority:</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      priorityOptions.find(p => p.value === priority)?.color
                    }`}>
                      {priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Queue Type:</span>
                    <span className="font-medium">
                      {queueType === 'normal' ? 'Normal Queue' : 'Priority Queue'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deadline:</span>
                    <span className="font-medium">
                      {deadline ? format(deadline, 'PPP') : 'Not set'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => onNavigate('dashboard')}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add Task
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
