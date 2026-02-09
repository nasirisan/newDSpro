import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from './components/ui/sonner';
import { TaskProvider } from './contexts/TaskContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { AddTaskScreen } from './components/AddTaskScreen';
import { QueueView } from './components/QueueView';
import { ActiveTaskScreen } from './components/ActiveTaskScreen';
import { CompletedTasksScreen } from './components/CompletedTasksScreen';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AdminQueueManagement } from './components/AdminQueueManagement';
import { NotificationPanel } from './components/NotificationPanel';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'add-task':
        return <AddTaskScreen onNavigate={handleNavigate} />;
      case 'queue-view':
        return <QueueView onNavigate={handleNavigate} />;
      case 'active-task':
        return <ActiveTaskScreen onNavigate={handleNavigate} />;
      case 'completed':
        return <CompletedTasksScreen onNavigate={handleNavigate} />;
      case 'analytics':
        return <AnalyticsDashboard onNavigate={handleNavigate} />;
      case 'admin-queue':
        return <AdminQueueManagement onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TaskProvider>
        <div className="min-h-screen bg-background">
          <Navbar
            currentScreen={currentScreen}
            onNavigate={handleNavigate}
            onNotificationsClick={() => setShowNotifications(true)}
          />
          
          <main className="container mx-auto px-4 py-8 relative overflow-visible">
            {renderScreen()}
          </main>

          <NotificationPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />

          <Toaster position="bottom-right" />
        </div>
      </TaskProvider>
    </ThemeProvider>
  );
}