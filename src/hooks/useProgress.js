import { useMemo } from 'react';
import { useStudy } from '../context/StudyContext';
import { isOverdue, getWeeklyData } from '../utils/helpers';

export function useProgress() {
  const { tasks, subjects, topics } = useStudy();

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = tasks.filter(t => t.status === 'Pending' && !isOverdue(t.deadline)).length;
    const overdue = tasks.filter(t => t.status !== 'Completed' && isOverdue(t.deadline)).length;
    const revision = tasks.filter(t => t.status === 'Revision').length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, overdue, revision, pct };
  }, [tasks]);

  const subjectProgress = useMemo(() =>
    subjects.map(s => {
      const subjectTasks = tasks.filter(t => t.subjectId === s.id || t.subject === s.name);
      const done = subjectTasks.filter(t => t.status === 'Completed').length;
      const total = subjectTasks.length;
      const subTopics = topics.filter(t => t.subjectId === s.id);
      const topicsDone = subTopics.filter(t => t.status === 'Completed').length;
      return {
        id: s.id,
        name: s.name,
        color: s.color,
        tasks: total,
        completed: done,
        pct: total > 0 ? Math.round((done / total) * 100) : 0,
        topics: subTopics.length,
        topicsDone,
      };
    })
  , [subjects, topics, tasks]);

  const weeklyData = useMemo(() => getWeeklyData(tasks), [tasks]);

  return { stats, subjectProgress, weeklyData };
}
