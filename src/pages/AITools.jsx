import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import {
  MdAutoAwesome, MdSummarize, MdQuiz, MdFlashOn, MdContentCopy,
} from 'react-icons/md';
import { useSubjects } from '../hooks/useSubjects';
import { generateSummary, generateQuestions, generateFlashcards } from '../services/aiService';
import './AITools.css';

const pageVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const ACTIONS = [
  { id: 'summary',    label: 'Generate Summary',     icon: <MdSummarize />,  fn: generateSummary,    color: 'var(--accent)' },
  { id: 'questions',  label: 'Practice Questions',   icon: <MdQuiz />,       fn: generateQuestions,  color: 'var(--blue)' },
  { id: 'flashcards', label: 'Generate Flashcards',  icon: <MdFlashOn />,    fn: generateFlashcards, color: 'var(--yellow)' },
];

export default function AITools() {
  const { subjects, topics, getTopicsForSubject } = useSubjects();
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedTopicId, setSelectedTopicId]   = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [loading, setLoading] = useState(null);
  const [result, setResult] = useState(null);
  const [activeAction, setActiveAction] = useState(null);
  const [history, setHistory] = useState([]);

  const subjectTopics = selectedSubjectId ? getTopicsForSubject(selectedSubjectId) : [];
  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);
  const selectedTopic   = topics.find(t => t.id === selectedTopicId);

  const topicLabel = selectedTopic?.name || customTopic;
  const subjectLabel = selectedSubject?.name || '';

  const run = async (action) => {
    if (!topicLabel.trim()) {
      toast.error('Please select or enter a topic first');
      return;
    }
    setLoading(action.id);
    setResult(null);
    setActiveAction(action.id);
    try {
      const text = await action.fn(topicLabel, subjectLabel);
      setResult(text);
      setHistory(h => [{ id: Date.now(), action: action.label, topic: topicLabel, result: text }, ...h.slice(0, 4)]);
      toast.success(`${action.label} generated!`);
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message || 'AI request failed';
      toast.error(msg, { autoClose: 6000 });
      setResult(null);
    } finally {
      setLoading(null);
    }
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast.success('Copied to clipboard!');
    }
  };

  return (
    <motion.div className="page-wrapper" variants={pageVariants} initial="hidden" animate="visible">
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Study Assistant</h1>
          <p className="page-subtitle">Generate summaries, practice questions, and flashcards with AI</p>
        </div>
        <div className="ai-model-badge">
          <MdAutoAwesome /> GPT-3.5 Turbo
        </div>
      </div>

      <div className="ai-layout">
        {/* Left — Controls */}
        <div className="ai-controls">
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Select Topic</h3>

            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Subject (optional)</label>
              <select className="form-select" value={selectedSubjectId} onChange={e => { setSelectedSubjectId(e.target.value); setSelectedTopicId(''); }}>
                <option value="">All Subjects</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            {subjectTopics.length > 0 && (
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label className="form-label">Topic from subject</label>
                <select className="form-select" value={selectedTopicId} onChange={e => { setSelectedTopicId(e.target.value); setCustomTopic(''); }}>
                  <option value="">Select a topic</option>
                  {subjectTopics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Or type a custom topic</label>
              <input
                className="form-input"
                placeholder="e.g. Binary Search Trees"
                value={customTopic}
                onChange={e => { setCustomTopic(e.target.value); setSelectedTopicId(''); }}
              />
            </div>

            {topicLabel && (
              <div className="ai-selected-topic">
                <MdAutoAwesome />
                <span>Topic: <strong>{topicLabel}</strong></span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="card" style={{ marginTop: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>AI Actions</h3>
            <div className="ai-actions">
              {ACTIONS.map(action => (
                <button
                  key={action.id}
                  className={`btn ai-action-btn ${activeAction === action.id ? 'active' : ''}`}
                  onClick={() => run(action)}
                  disabled={!!loading}
                  style={{ '--action-color': action.color }}
                >
                  <span className="ai-action-icon" style={{ color: action.color }}>{action.icon}</span>
                  <span>{action.label}</span>
                  {loading === action.id && <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />}
                </button>
              ))}
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="card" style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>Recent</h3>
              {history.map(h => (
                <div key={h.id} className="ai-history-item" onClick={() => { setResult(h.result); setActiveAction(null); }}>
                  <span className="ai-history-action">{h.action}</span>
                  <span className="ai-history-topic">{h.topic}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — Output */}
        <div className="ai-output-col">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" className="card ai-loading-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="ai-loading-inner">
                  <div className="ai-pulse-ring" />
                  <MdAutoAwesome className="ai-loading-icon" />
                  <p className="ai-loading-text">Generating with AI…</p>
                  <p className="ai-loading-sub">This may take a few seconds</p>
                </div>
              </motion.div>
            ) : result ? (
              <motion.div key="result" className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <div className="ai-result-header">
                  <div className="ai-result-badge">
                    <MdAutoAwesome /> AI Generated
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={copyResult}><MdContentCopy /> Copy</button>
                </div>
                <div className="ai-result-body">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="card ai-empty-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="ai-empty-inner">
                  <div className="ai-empty-icon">🤖</div>
                  <h3>Ready to assist</h3>
                  <p>Select a topic and click an action button to generate AI study content</p>
                  <div className="ai-example-chips">
                    {['Binary Trees', 'Merge Sort', 'Dynamic Programming', 'Newton\'s Laws'].map(t => (
                      <button key={t} className="ai-chip" onClick={() => setCustomTopic(t)}>{t}</button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
