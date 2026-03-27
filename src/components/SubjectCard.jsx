import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdEdit, MdDelete, MdExpandMore, MdExpandLess, MdAdd } from 'react-icons/md';
import { getStatusBadge, getDifficultyBadge, truncate } from '../utils/helpers';

export default function SubjectCard({ subject, topics = [], onEdit, onDelete, onAddTopic, onEditTopic, onDeleteTopic }) {
  const [expanded, setExpanded] = useState(false);
  const completedTopics = topics.filter(t => t.status === 'Completed').length;

  return (
    <motion.div
      className="subject-card"
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
    >
      {/* Color stripe */}
      <div className="subject-stripe" style={{ background: subject.color }} />

      <div className="subject-card-body">
        <div className="subject-header">
          <div className="subject-info">
            <div className="subject-color-dot" style={{ background: subject.color }} />
            <div>
              <h3 className="subject-name">{subject.name}</h3>
              {subject.description && (
                <p className="subject-desc">{truncate(subject.description, 70)}</p>
              )}
            </div>
          </div>
          <div className="subject-actions">
            <button className="btn btn-ghost btn-sm btn-icon" onClick={() => onEdit(subject)} title="Edit">
              <MdEdit />
            </button>
            <button className="btn btn-ghost btn-sm btn-icon" onClick={() => onDelete(subject.id)} title="Delete">
              <MdDelete style={{ color: 'var(--red)' }} />
            </button>
          </div>
        </div>

        <div className="subject-stats">
          <span className="subject-stat">{topics.length} topics</span>
          <span className="subject-divider">·</span>
          <span className="subject-stat">{completedTopics} completed</span>
        </div>

        {topics.length > 0 && (
          <div className="progress-bar-track" style={{ marginTop: '0.75rem' }}>
            <div
              className="progress-bar-fill"
              style={{
                width: `${topics.length > 0 ? (completedTopics / topics.length) * 100 : 0}%`,
                background: subject.color,
              }}
            />
          </div>
        )}

        <div className="subject-footer">
          <button className="btn btn-ghost btn-sm" onClick={() => setExpanded(e => !e)}>
            {expanded ? <MdExpandLess /> : <MdExpandMore />}
            {expanded ? 'Hide Topics' : `Show Topics (${topics.length})`}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => onAddTopic(subject)}>
            <MdAdd /> Add Topic
          </button>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              className="topic-list"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              {topics.length === 0 ? (
                <p className="topic-empty">No topics yet. Add one above.</p>
              ) : (
                topics.map(topic => (
                  <div key={topic.id} className="topic-row">
                    <div className="topic-row-info">
                      <span className="topic-row-name">{topic.name}</span>
                      <div className="topic-row-badges">
                        <span className={`badge ${getStatusBadge(topic.status)}`}>{topic.status}</span>
                        {topic.difficulty && (
                          <span className={`badge ${getDifficultyBadge(topic.difficulty)}`}>{topic.difficulty}</span>
                        )}
                      </div>
                    </div>
                    <div className="topic-row-actions">
                      <button className="btn btn-ghost btn-sm btn-icon" onClick={() => onEditTopic(topic)} title="Edit topic">
                        <MdEdit />
                      </button>
                      <button className="btn btn-ghost btn-sm btn-icon" onClick={() => onDeleteTopic(topic.id)} title="Delete topic">
                        <MdDelete style={{ color: 'var(--red)' }} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
