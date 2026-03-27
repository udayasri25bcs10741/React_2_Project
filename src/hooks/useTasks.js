import { useCallback } from 'react';
import { useStudy } from '../context/StudyContext';
import { isOverdue } from '../utils/helpers';
import { isBefore, parseISO, startOfDay } from 'date-fns';

export function useTasks() {
  const { tasks, addTask, updateTask, deleteTask } = useStudy();

  const getTasksByTab = useCallback((tab) => {
    const now = startOfDay(new Date());
    switch (tab) {
      case 'Pending':
        return tasks.filter(t => t.status === 'Pending' && !isOverdue(t.deadline));
      case 'Completed':
        return tasks.filter(t => t.status === 'Completed');
      case 'Overdue':
        return tasks.filter(t => t.status !== 'Completed' && isOverdue(t.deadline));
      case 'Revision':
        return tasks.filter(t => t.status === 'Revision');
      default:
        return tasks;
    }
  }, [tasks]);

  const markComplete = useCallback((id) => {
    updateTask(id, { status: 'Completed', completedAt: new Date().toISOString() });
  }, [updateTask]);

  const markRevision = useCallback((id) => {
    updateTask(id, { status: 'Revision' });
  }, [updateTask]);

  const markPending = useCallback((id) => {
    updateTask(id, { status: 'Pending', completedAt: null });
  }, [updateTask]);

  return { tasks, addTask, updateTask, deleteTask, getTasksByTab, markComplete, markRevision, markPending };
}
