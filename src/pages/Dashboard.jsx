import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MdChecklist, MdCheckCircle, MdPending, MdWarning, MdAutorenew,
  MdFormatQuote, MdTrendingUp, MdCalendarToday, MdBolt,
} from 'react-icons/md';
import { useProgress } from '../hooks/useProgress';
import { useStudy } from '../context/StudyContext';
import { WeeklyBarChart, SubjectRadialChart } from '../components/ProgressChart';
import RevisionList from '../components/RevisionList';
import { fetchMotivationalQuote } from '../services/aiService';
import './Dashboard.css';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } } };

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) { setDisplay(0); return; }
    const step = Math.ceil(end / 25);
    const timer = setInterval(() => {
      start = Math.min(start + step, end);
      setDisplay(start);
      if (start >= end) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}</span>;
}

export default function Dashboard() {
  const { stats, subjectProgress, weeklyData } = useProgress();
  const { revisions } = useStudy();
  const [quote, setQuote] = useState(null);
  useEffect(() => { fetchMotivationalQuote().then(setQuote); }, []);

  const upcomingRevisions = revisions.filter(r => !r.done);

  const statCards = [
    { label: 'Total Tasks',  value: stats.total,     icon: <MdChecklist />,   grad: 'var(--grad-purple)', glow: 'rgba(124,92,252,0.3)', bg: '#7c5cfc' },
    { label: 'Completed',    value: stats.completed,  icon: <MdCheckCircle />, grad: 'var(--grad-green)',  glow: 'rgba(34,197,94,0.3)',  bg: '#22c55e' },
    { label: 'Pending',      value: stats.pending,    icon: <MdPending />,     grad: 'var(--grad-yellow)', glow: 'rgba(245,158,11,0.3)', bg: '#f59e0b' },
    { label: 'Overdue',      value: stats.overdue,    icon: <MdWarning />,     grad: 'var(--grad-red)',    glow: 'rgba(239,68,68,0.3)',  bg: '#ef4444' },
    { label: 'In Revision',  value: stats.revision,   icon: <MdAutorenew />,   grad: 'var(--grad-blue)',   glow: 'rgba(59,130,246,0.3)', bg: '#3b82f6' },
  ];

  return (
    <motion.div className="page-wrapper" variants={container} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div className="page-header" variants={item}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Track your progress, plan revisions, and stay on top of your studies</p>
        </div>
        <div className="dash-completion-hero">
          <div className="dash-completion-ring" style={{ '--pct': stats.pct }}>
            <svg viewBox="0 0 56 56" className="dash-ring-svg">
              <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(124,92,252,0.15)" strokeWidth="5" />
              <circle
                cx="28" cy="28" r="22" fill="none"
                stroke="url(#ringGrad)" strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 22}`}
                strokeDashoffset={`${2 * Math.PI * 22 * (1 - stats.pct / 100)}`}
                transform="rotate(-90 28 28)"
              />
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c5cfc" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="dash-ring-label">
              <span className="dash-ring-pct">{stats.pct}%</span>
              <span className="dash-ring-sub">done</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Motivational quote */}
      {quote && (
        <motion.div className="dash-quote" variants={item}>
          <div className="dash-quote-glow" />
          <MdFormatQuote className="dash-quote-icon" />
          <div className="dash-quote-content">
            <p className="dash-quote-text">"{quote.content}"</p>
            <p className="dash-quote-author">— {quote.author}</p>
          </div>
          <MdBolt className="dash-quote-bolt" />
        </motion.div>
      )}

      {/* Stat cards */}
      <motion.div className="stat-grid" variants={item}>
        {statCards.map(s => (
          <motion.div
            key={s.label}
            className="stat-card-premium"
            whileHover={{ scale: 1.03, y: -4 }}
            style={{ '--card-glow': s.glow, '--card-bg': s.bg }}
          >
            <div className="stat-card-bg-circle" />
            <div className="stat-card-icon-wrap" style={{ background: `${s.bg}22`, border: `1px solid ${s.bg}44` }}>
              <span style={{ background: s.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: '1.3rem', display: 'flex' }}>
                {s.icon}
              </span>
            </div>
            <div className="stat-card-value" style={{ background: s.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              <AnimatedNumber value={s.value} />
            </div>
            <div className="stat-card-label">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div className="dash-charts-row" variants={item}>
        <div className="card dash-chart-card">
          <div className="dash-chart-header">
            <div>
              <h3 className="dash-chart-title"><MdTrendingUp /> Weekly Productivity</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Tasks completed per day</p>
            </div>
          </div>
          <WeeklyBarChart data={weeklyData} />
        </div>
        <div className="card dash-chart-card">
          <div className="dash-chart-header">
            <div>
              <h3 className="dash-chart-title">Subject Progress</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Completion by subject</p>
            </div>
          </div>
          <SubjectRadialChart data={subjectProgress} />
        </div>
      </motion.div>

      {/* Subject breakdown */}
      {subjectProgress.length > 0 && (
        <motion.div className="card" style={{ marginBottom: '1.5rem' }} variants={item}>
          <h3 style={{ marginBottom: '0.25rem' }}>Subject Breakdown</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Topic completion across all subjects</p>
          <div className="dash-subject-breakdown">
            {subjectProgress.map(s => (
              <div key={s.id} className="dash-subject-row">
                <div className="dash-subject-dot" style={{ background: s.color || 'var(--accent)', boxShadow: `0 0 8px ${s.color || 'var(--accent)'}66` }} />
                <span className="dash-subject-name">{s.name}</span>
                <div className="dash-subject-bar-wrap">
                  <div className="progress-bar-track">
                    <motion.div
                      className="progress-bar-fill"
                      style={{ background: `linear-gradient(90deg, ${s.color || 'var(--accent)'}, ${s.color || 'var(--accent)'}cc)` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
                <span className="dash-subject-stat">{s.topicsDone}/{s.topics} topics</span>
                <span className="dash-subject-pct" style={{ color: s.color || 'var(--accent)' }}>{s.pct}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Upcoming revisions */}
      <motion.div className="card" variants={item}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3><MdCalendarToday style={{ marginRight: '0.5rem', verticalAlign: 'middle', color: 'var(--accent)' }} />Upcoming Revisions</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{upcomingRevisions.length} revision{upcomingRevisions.length !== 1 ? 's' : ''} pending</p>
          </div>
        </div>
        <RevisionList revisions={upcomingRevisions} limit={6} />
      </motion.div>
    </motion.div>
  );
}
