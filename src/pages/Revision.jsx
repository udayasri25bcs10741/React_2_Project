import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { MdAdd, MdClose, MdCalendarMonth } from 'react-icons/md';
import { useStudy } from '../context/StudyContext';
import { useSubjects } from '../hooks/useSubjects';
import RevisionList from '../components/RevisionList';
import { formatDate } from '../utils/helpers';
import '../components/RevisionList.css';
import './Revision.css';

const pageVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const schema = yup.object({
  topicName: yup.string().required('Topic name is required'),
  subjectId: yup.string(),
  revisionDate: yup.string().required('Date is required'),
});

export default function Revision() {
  const { revisions, addRevision } = useStudy();
  const { subjects } = useSubjects();
  const [calDate, setCalDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const revisionDates = revisions
    .filter(r => !r.done)
    .map(r => new Date(r.revisionDate).toDateString());

  const tileClassName = ({ date }) =>
    revisionDates.includes(date.toDateString()) ? 'has-revision' : null;

  const selectedDateRevisions = revisions.filter(r => {
    const d = new Date(r.revisionDate);
    return d.toDateString() === calDate.toDateString();
  });

  const onSubmit = (data) => {
    addRevision({ ...data, topicName: data.topicName });
    toast.success('Revision scheduled!');
    setShowModal(false);
    reset();
  };

  const pending = revisions.filter(r => !r.done);
  const done    = revisions.filter(r => r.done);

  return (
    <motion.div className="page-wrapper" variants={pageVariants} initial="hidden" animate="visible">
      <div className="page-header">
        <div>
          <h1 className="page-title">Revision Planner</h1>
          <p className="page-subtitle">{pending.length} pending · {done.length} revised</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><MdAdd /> Schedule Revision</button>
      </div>

      <div className="revision-layout">
        {/* Calendar */}
        <div className="card revision-calendar-card">
          <h3 style={{ marginBottom: '1rem' }}><MdCalendarMonth style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />Calendar</h3>
          <Calendar
            onChange={setCalDate}
            value={calDate}
            tileClassName={tileClassName}
            className="study-calendar"
          />
          <div className="revision-legend">
            <span className="revision-legend-dot" />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Revision scheduled</span>
          </div>
          {selectedDateRevisions.length > 0 && (
            <div className="revision-date-preview">
              <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                {formatDate(calDate)}
              </h4>
              <RevisionList revisions={selectedDateRevisions} />
            </div>
          )}
        </div>

        {/* Lists */}
        <div className="revision-lists-col">
          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Upcoming Revisions</h3>
            <RevisionList revisions={pending} />
          </div>
          {done.length > 0 && (
            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Completed Revisions</h3>
              <RevisionList revisions={done} />
            </div>
          )}
        </div>
      </div>

      {/* Add Revision Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal" initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}>
              <div className="modal-header">
                <h2 className="modal-title">Schedule Revision</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}><MdClose /></button>
              </div>
              <form className="modal-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label className="form-label">Topic Name *</label>
                  <input className="form-input" placeholder="e.g. Binary Trees" {...register('topicName')} />
                  {errors.topicName && <span className="form-error">{errors.topicName.message}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select className="form-select" {...register('subjectId')}>
                    <option value="">Select subject</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Revision Date *</label>
                  <input className="form-input" type="date" {...register('revisionDate')} />
                  {errors.revisionDate && <span className="form-error">{errors.revisionDate.message}</span>}
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Schedule</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
