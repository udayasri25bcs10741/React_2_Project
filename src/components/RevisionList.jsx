import { motion } from 'framer-motion';
import { MdCalendarToday, MdCheck, MdDelete } from 'react-icons/md';
import { formatDate } from '../utils/helpers';
import { useStudy } from '../context/StudyContext';
import { useSubjects } from '../hooks/useSubjects';

export default function RevisionList({ revisions = [], limit }) {
  const { markRevisionDone, deleteRevision } = useStudy();
  const { subjects } = useSubjects();

  const sorted = [...revisions].sort((a, b) => new Date(a.revisionDate) - new Date(b.revisionDate));
  const displayed = limit ? sorted.slice(0, limit) : sorted;

  if (displayed.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '2rem' }}>
        <div className="empty-icon">📅</div>
        <p className="empty-title">No revisions scheduled</p>
        <p className="empty-sub">Complete a topic to auto-schedule a revision</p>
      </div>
    );
  }

  return (
    <div className="revision-list">
      {displayed.map(rev => {
        const subject = subjects.find(s => s.id === rev.subjectId);
        const isPast = new Date(rev.revisionDate) < new Date() && !rev.done;
        return (
          <motion.div
            key={rev.id}
            className={`revision-item ${rev.done ? 'done' : ''} ${isPast && !rev.done ? 'overdue' : ''}`}
            layout
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="revision-item-left">
              <div
                className="revision-dot"
                style={{ background: subject?.color || 'var(--accent)' }}
              />
            </div>
            <div className="revision-item-body">
              <span className="revision-topic">{rev.topicName}</span>
              {subject && <span className="revision-subject">{subject.name}</span>}
              <span className="revision-date">
                <MdCalendarToday style={{ fontSize: '0.8rem' }} />
                {formatDate(rev.revisionDate)}
              </span>
            </div>
            <div className="revision-item-actions">
              {!rev.done && (
                <button
                  className="btn btn-ghost btn-sm btn-icon"
                  onClick={() => markRevisionDone(rev.id)}
                  title="Mark revised"
                >
                  <MdCheck style={{ color: 'var(--green)' }} />
                </button>
              )}
              {rev.done && <span className="badge badge-green">Revised</span>}
              <button
                className="btn btn-ghost btn-sm btn-icon"
                onClick={() => deleteRevision(rev.id)}
                title="Remove"
              >
                <MdDelete style={{ color: 'var(--red)', fontSize: '1rem' }} />
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
