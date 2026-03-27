import { motion } from 'framer-motion';
import { MdEdit, MdDelete, MdCheckCircle, MdRadioButtonUnchecked, MdLoop, MdAlarm } from 'react-icons/md';
import { getPriorityBadge, getStatusBadge, formatDate, isOverdue, isDueToday } from '../utils/helpers';
import './TaskCard.css';

export default function TaskCard({ task, onEdit, onDelete, onMarkComplete, onMarkRevision, onMarkPending }) {
  const overdue = isOverdue(task.deadline) && task.status !== 'Completed';
  const dueToday = isDueToday(task.deadline) && task.status !== 'Completed';
  const isCompleted = task.status === 'Completed';

  return (
    <motion.div
      className={`task-card ${isCompleted ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="task-card-left">
        <button
          className="task-check-btn"
          onClick={() => isCompleted ? onMarkPending(task.id) : onMarkComplete(task.id)}
          title={isCompleted ? 'Mark pending' : 'Mark complete'}
        >
          {isCompleted
            ? <MdCheckCircle style={{ color: 'var(--green)', fontSize: '1.5rem' }} />
            : <MdRadioButtonUnchecked style={{ color: 'var(--text-muted)', fontSize: '1.5rem' }} />
          }
        </button>
      </div>

      <div className="task-card-body">
        <div className="task-header">
          <span className={`task-title ${isCompleted ? 'done-strikethrough' : ''}`}>{task.title}</span>
          <div className="task-badges">
            <span className={`badge ${getPriorityBadge(task.priority)}`}>{task.priority}</span>
            <span className={`badge ${getStatusBadge(overdue ? 'Overdue' : task.status)}`}>
              {overdue ? 'Overdue' : task.status}
            </span>
          </div>
        </div>

        <div className="task-meta">
          {task.subject && <span className="task-meta-item">{task.subject}</span>}
          {task.topic && <span className="task-meta-item">{task.topic}</span>}
          <span className={`task-deadline ${overdue ? 'red' : dueToday ? 'yellow' : ''}`}>
            <MdAlarm style={{ fontSize: '0.9rem' }} />
            {formatDate(task.deadline)}
          </span>
        </div>
      </div>

      <div className="task-card-actions">
        {!isCompleted && (
          <button className="btn btn-ghost btn-sm btn-icon" onClick={() => onMarkRevision(task.id)} title="Mark as revision">
            <MdLoop style={{ color: 'var(--accent-light)' }} />
          </button>
        )}
        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => onEdit(task)} title="Edit">
          <MdEdit />
        </button>
        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => onDelete(task.id)} title="Delete">
          <MdDelete style={{ color: 'var(--red)' }} />
        </button>
      </div>
    </motion.div>
  );
}
