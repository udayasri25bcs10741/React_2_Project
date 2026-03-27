import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { MdAdd, MdClose, MdFilterList, MdSort, MdChecklist } from 'react-icons/md';
import { useTasks } from '../hooks/useTasks';
import { useSubjects } from '../hooks/useSubjects';
import { useDebounce } from '../hooks/useDebounce';
import TaskCard from '../components/TaskCard';
import SearchBar from '../components/SearchBar';
import { getPriorityOrder } from '../utils/helpers';
import '../components/TaskCard.css';
import '../components/SearchBar.css';
import './Tasks.css';

const pageVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const TABS = ['All', 'Pending', 'Completed', 'Overdue', 'Revision'];
const PRIORITIES = ['', 'High', 'Medium', 'Low'];
const STATUSES   = ['', 'Pending', 'Completed', 'Revision'];
const SORTS      = [
  { label: 'Due Date', value: 'deadline' },
  { label: 'Priority', value: 'priority' },
  { label: 'Subject',  value: 'subject' },
];

const taskSchema = yup.object({
  title:    yup.string().required('Title is required'),
  subject:  yup.string(),
  subjectId: yup.string(),
  topic:    yup.string(),
  deadline: yup.string().required('Deadline is required'),
  priority: yup.string().required(),
  status:   yup.string().required(),
});

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, getTasksByTab, markComplete, markRevision, markPending } = useTasks();
  const { subjects, topics } = useSubjects();

  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [filterSubject, setFilterSubject] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('deadline');
  const [showFilters, setShowFilters] = useState(false);
  const [taskModal, setTaskModal] = useState(null); // null | 'add' | task obj

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues: { priority: 'Medium', status: 'Pending' },
  });
  const watchedSubjectId = watch('subjectId');
  const availableTopics = topics.filter(t => t.subjectId === watchedSubjectId);

  const openAdd = () => { reset({ priority: 'Medium', status: 'Pending' }); setTaskModal('add'); };
  const openEdit = (t) => { reset({ ...t }); setTaskModal(t); };

  const onSubmit = (data) => {
    const subjectName = subjects.find(s => s.id === data.subjectId)?.name || data.subject || '';
    const topicName = topics.find(t => t.id === data.topicId)?.name || data.topic || '';
    const payload = { ...data, subject: subjectName, topic: topicName };
    if (taskModal === 'add') {
      addTask(payload);
      toast.success('Task created!');
    } else {
      updateTask(taskModal.id, payload);
      toast.success('Task updated!');
    }
    setTaskModal(null);
  };

  const handleDelete = (id) => { deleteTask(id); toast.success('Task deleted'); };

  const tabCounts = useMemo(() =>
    Object.fromEntries(TABS.map(t => [t, getTasksByTab(t).length]))
  , [tasks]);

  const displayed = useMemo(() => {
    let list = getTasksByTab(activeTab);

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.subject || '').toLowerCase().includes(q) ||
        (t.topic || '').toLowerCase().includes(q)
      );
    }
    if (filterSubject) list = list.filter(t => t.subject === filterSubject || t.subjectId === filterSubject);
    if (filterPriority) list = list.filter(t => t.priority === filterPriority);
    if (filterStatus)   list = list.filter(t => t.status === filterStatus);

    list = [...list].sort((a, b) => {
      if (sortBy === 'deadline') return new Date(a.deadline) - new Date(b.deadline);
      if (sortBy === 'priority') return getPriorityOrder(a.priority) - getPriorityOrder(b.priority);
      if (sortBy === 'subject')  return (a.subject || '').localeCompare(b.subject || '');
      return 0;
    });
    return list;
  }, [activeTab, debouncedSearch, filterSubject, filterPriority, filterStatus, sortBy, tasks]);

  return (
    <motion.div className="page-wrapper" variants={pageVariants} initial="hidden" animate="visible">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><MdAdd /> Add Task</button>
      </div>

      {/* Tabs */}
      <div className="tab-bar" style={{ marginBottom: '1rem' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            <span className="tasks-tab-count">{tabCounts[tab]}</span>
          </button>
        ))}
      </div>

      {/* Search + Filter bar */}
      <div className="tasks-toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search tasks…" />
        <button className={`btn btn-secondary btn-sm ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(f => !f)}>
          <MdFilterList /> Filters
        </button>
        <div className="tasks-sort">
          <MdSort />
          <select className="form-select" style={{ padding: '0.5rem 0.75rem', width: 'auto' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {showFilters && (
        <motion.div className="tasks-filters" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
          <select className="form-select" value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
          <select className="form-select" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
            <option value="">All Priorities</option>
            {PRIORITIES.filter(Boolean).map(p => <option key={p}>{p}</option>)}
          </select>
          <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {STATUSES.filter(Boolean).map(s => <option key={s}>{s}</option>)}
          </select>
          <button className="btn btn-ghost btn-sm" onClick={() => { setFilterSubject(''); setFilterPriority(''); setFilterStatus(''); }}>
            Clear
          </button>
        </motion.div>
      )}

      {/* Task list */}
      {displayed.length === 0 ? (
        <div className="empty-state">
          <MdChecklist className="empty-icon" />
          <p className="empty-title">No tasks found</p>
          <p className="empty-sub">{search ? 'Try a different search' : 'Add a task to get started'}</p>
        </div>
      ) : (
        <motion.div className="tasks-list" layout>
          <AnimatePresence>
            {displayed.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEdit}
                onDelete={handleDelete}
                onMarkComplete={markComplete}
                onMarkRevision={markRevision}
                onMarkPending={markPending}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Task Modal */}
      <AnimatePresence>
        {taskModal !== null && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal" initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}>
              <div className="modal-header">
                <h2 className="modal-title">{taskModal === 'add' ? 'Add Task' : 'Edit Task'}</h2>
                <button className="modal-close" onClick={() => setTaskModal(null)}><MdClose /></button>
              </div>
              <form className="modal-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label className="form-label">Task Title *</label>
                  <input className="form-input" placeholder="e.g. Solve 10 binary tree problems" {...register('title')} />
                  {errors.title && <span className="form-error">{errors.title.message}</span>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <select className="form-select" {...register('subjectId')}>
                      <option value="">Select subject</option>
                      {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Topic</label>
                    <select className="form-select" {...register('topicId')}>
                      <option value="">Select topic</option>
                      {availableTopics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Deadline *</label>
                    <input className="form-input" type="date" {...register('deadline')} />
                    {errors.deadline && <span className="form-error">{errors.deadline.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select className="form-select" {...register('priority')}>
                      <option>High</option><option>Medium</option><option>Low</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" {...register('status')}>
                      <option>Pending</option><option>Completed</option><option>Revision</option>
                    </select>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setTaskModal(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{taskModal === 'add' ? 'Add Task' : 'Save Changes'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
