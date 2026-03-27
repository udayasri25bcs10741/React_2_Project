import { format, isPast, isToday, addDays, parseISO } from 'date-fns';

// ── UUID ──────────────────────────────────────
export function v4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ── Date helpers ──────────────────────────────
export function formatDate(date) {
  if (!date) return '—';
  try { return format(typeof date === 'string' ? parseISO(date) : date, 'dd MMM yyyy'); }
  catch { return '—'; }
}

export function formatDateShort(date) {
  if (!date) return '—';
  try { return format(typeof date === 'string' ? parseISO(date) : date, 'MMM dd'); }
  catch { return '—'; }
}

export function isOverdue(deadline) {
  if (!deadline) return false;
  try {
    const d = typeof deadline === 'string' ? parseISO(deadline) : deadline;
    return isPast(d) && !isToday(d);
  } catch { return false; }
}

export function isDueToday(deadline) {
  if (!deadline) return false;
  try {
    const d = typeof deadline === 'string' ? parseISO(deadline) : deadline;
    return isToday(d);
  } catch { return false; }
}

export function getRevisionDate(completedAt, days = 3) {
  const base = completedAt ? (typeof completedAt === 'string' ? parseISO(completedAt) : completedAt) : new Date();
  return addDays(base, days);
}

// ── Priority ──────────────────────────────────
export function getPriorityBadge(priority) {
  switch (priority?.toLowerCase()) {
    case 'high':   return 'badge-red';
    case 'medium': return 'badge-yellow';
    case 'low':    return 'badge-green';
    default:       return 'badge-gray';
  }
}

export function getPriorityOrder(priority) {
  switch (priority?.toLowerCase()) {
    case 'high':   return 0;
    case 'medium': return 1;
    case 'low':    return 2;
    default:       return 3;
  }
}

// ── Status ────────────────────────────────────
export function getStatusBadge(status) {
  switch (status) {
    case 'Completed':      return 'badge-green';
    case 'In Progress':    return 'badge-blue';
    case 'Needs Revision': return 'badge-yellow';
    case 'Not Started':    return 'badge-gray';
    case 'Pending':        return 'badge-yellow';
    case 'Overdue':        return 'badge-red';
    case 'Revision':       return 'badge-purple';
    default:               return 'badge-gray';
  }
}

// ── Difficulty ────────────────────────────────
export function getDifficultyBadge(difficulty) {
  switch (difficulty?.toLowerCase()) {
    case 'easy':   return 'badge-green';
    case 'medium': return 'badge-yellow';
    case 'hard':   return 'badge-red';
    default:       return 'badge-gray';
  }
}

// ── Subject colors ────────────────────────────
export const SUBJECT_COLORS = [
  '#7c5cfc', '#3b82f6', '#22c55e', '#f59e0b',
  '#ef4444', '#ec4899', '#06b6d4', '#f97316',
  '#8b5cf6', '#14b8a6',
];

// ── Truncate ──────────────────────────────────
export function truncate(str, len = 60) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '…' : str;
}

// ── Weekly data for charts ─────────────────────
export function getWeeklyData(tasks) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  return days.map((day, i) => {
    const target = new Date(now);
    target.setDate(now.getDate() - (6 - i));
    const dateStr = target.toISOString().split('T')[0];
    const completed = tasks.filter(t => {
      if (t.status !== 'Completed') return false;
      const d = t.completedAt || t.deadline;
      return d && d.startsWith(dateStr);
    }).length;
    return { day, completed };
  });
}
