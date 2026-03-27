import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { MdAdd, MdClose, MdBook } from 'react-icons/md';
import { useSubjects } from '../hooks/useSubjects';
import SubjectCard from '../components/SubjectCard';
import SearchBar from '../components/SearchBar';
import { useDebounce } from '../hooks/useDebounce';
import { SUBJECT_COLORS } from '../utils/helpers';
import './Subjects.css';
import '../components/SubjectCard.css';
import '../components/SearchBar.css';

const pageVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const subjectSchema = yup.object({
  name: yup.string().required('Subject name is required'),
  description: yup.string(),
  color: yup.string().required(),
});

const topicSchema = yup.object({
  name: yup.string().required('Topic name is required'),
  difficulty: yup.string().required('Select a difficulty'),
  status: yup.string().required('Select a status'),
  notes: yup.string(),
});

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const TOPIC_STATUSES = ['Not Started', 'In Progress', 'Completed', 'Needs Revision'];

export default function Subjects() {
  const { subjects, topics, addSubject, updateSubject, deleteSubject, addTopic, updateTopic, deleteTopic, getTopicsForSubject } = useSubjects();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [subjectModal, setSubjectModal] = useState(null); // null | 'add' | subject obj
  const [topicModal, setTopicModal] = useState(null);     // null | { subject, topic? }
  const [selectedColor, setSelectedColor] = useState(SUBJECT_COLORS[0]);

  const { register: rsub, handleSubmit: hsSub, reset: resetSub, setValue: setSubVal, formState: { errors: subErrs } } = useForm({
    resolver: yupResolver(subjectSchema),
    defaultValues: { color: SUBJECT_COLORS[0] },
  });

  const { register: rtop, handleSubmit: hsTop, reset: resetTop, formState: { errors: topErrs } } = useForm({
    resolver: yupResolver(topicSchema),
    defaultValues: { status: 'Not Started', difficulty: 'Medium' },
  });

  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // Subject modal
  const openAddSubject = () => {
    resetSub({ color: SUBJECT_COLORS[0] });
    setSelectedColor(SUBJECT_COLORS[0]);
    setSubjectModal('add');
  };
  const openEditSubject = (s) => {
    resetSub({ name: s.name, description: s.description, color: s.color });
    setSelectedColor(s.color);
    setSubjectModal(s);
  };
  const onSubjectSubmit = (data) => {
    if (subjectModal === 'add') {
      addSubject({ ...data, color: selectedColor });
      toast.success('Subject added!');
    } else {
      updateSubject(subjectModal.id, { ...data, color: selectedColor });
      toast.success('Subject updated!');
    }
    setSubjectModal(null);
  };
  const handleDeleteSubject = (id) => {
    deleteSubject(id);
    toast.success('Subject deleted');
  };

  // Topic modal
  const openAddTopic = (subject) => {
    resetTop({ status: 'Not Started', difficulty: 'Medium' });
    setTopicModal({ subject });
  };
  const openEditTopic = (topic) => {
    const subject = subjects.find(s => s.id === topic.subjectId);
    resetTop({ name: topic.name, difficulty: topic.difficulty, status: topic.status, notes: topic.notes });
    setTopicModal({ subject, topic });
  };
  const onTopicSubmit = (data) => {
    if (topicModal.topic) {
      updateTopic(topicModal.topic.id, data);
      toast.success('Topic updated!');
    } else {
      addTopic({ ...data, subjectId: topicModal.subject.id });
      toast.success('Topic added!');
    }
    setTopicModal(null);
  };
  const handleDeleteTopic = (id) => {
    deleteTopic(id);
    toast.success('Topic deleted');
  };

  return (
    <motion.div className="page-wrapper" variants={pageVariants} initial="hidden" animate="visible">
      <div className="page-header">
        <div>
          <h1 className="page-title">Subjects</h1>
          <p className="page-subtitle">{subjects.length} subject{subjects.length !== 1 ? 's' : ''} · {topics.length} topics total</p>
        </div>
        <button className="btn btn-primary" onClick={openAddSubject}><MdAdd /> Add Subject</button>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search subjects…" />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <MdBook className="empty-icon" />
          <p className="empty-title">{search ? 'No subjects found' : 'No subjects yet'}</p>
          <p className="empty-sub">{search ? 'Try a different search' : 'Click "Add Subject" to get started'}</p>
        </div>
      ) : (
        <motion.div className="subjects-grid" layout>
          <AnimatePresence>
            {filtered.map(subject => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                topics={getTopicsForSubject(subject.id)}
                onEdit={openEditSubject}
                onDelete={handleDeleteSubject}
                onAddTopic={openAddTopic}
                onEditTopic={openEditTopic}
                onDeleteTopic={handleDeleteTopic}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Subject Modal */}
      <AnimatePresence>
        {subjectModal !== null && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal" initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}>
              <div className="modal-header">
                <h2 className="modal-title">{subjectModal === 'add' ? 'Add Subject' : 'Edit Subject'}</h2>
                <button className="modal-close" onClick={() => setSubjectModal(null)}><MdClose /></button>
              </div>
              <form className="modal-form" onSubmit={hsSub(onSubjectSubmit)}>
                <div className="form-group">
                  <label className="form-label">Subject Name *</label>
                  <input className="form-input" placeholder="e.g. Data Structures" {...rsub('name')} />
                  {subErrs.name && <span className="form-error">{subErrs.name.message}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" placeholder="Brief description…" {...rsub('description')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Color Label</label>
                  <div className="color-picker-row">
                    {SUBJECT_COLORS.map(c => (
                      <div
                        key={c}
                        className={`color-swatch ${selectedColor === c ? 'selected' : ''}`}
                        style={{ background: c }}
                        onClick={() => { setSelectedColor(c); setSubVal('color', c); }}
                      />
                    ))}
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setSubjectModal(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{subjectModal === 'add' ? 'Add Subject' : 'Save Changes'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Topic Modal */}
      <AnimatePresence>
        {topicModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal" initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}>
              <div className="modal-header">
                <div>
                  <h2 className="modal-title">{topicModal.topic ? 'Edit Topic' : 'Add Topic'}</h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    in {topicModal.subject?.name}
                  </p>
                </div>
                <button className="modal-close" onClick={() => setTopicModal(null)}><MdClose /></button>
              </div>
              <form className="modal-form" onSubmit={hsTop(onTopicSubmit)}>
                <div className="form-group">
                  <label className="form-label">Topic Name *</label>
                  <input className="form-input" placeholder="e.g. Binary Trees" {...rtop('name')} />
                  {topErrs.name && <span className="form-error">{topErrs.name.message}</span>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Difficulty *</label>
                    <select className="form-select" {...rtop('difficulty')}>
                      {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
                    </select>
                    {topErrs.difficulty && <span className="form-error">{topErrs.difficulty.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status *</label>
                    <select className="form-select" {...rtop('status')}>
                      {TOPIC_STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                    {topErrs.status && <span className="form-error">{topErrs.status.message}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea className="form-textarea" placeholder="Any important notes…" {...rtop('notes')} />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setTopicModal(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{topicModal.topic ? 'Save Changes' : 'Add Topic'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
