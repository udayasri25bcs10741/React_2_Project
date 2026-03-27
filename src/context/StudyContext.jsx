import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { addDays } from 'date-fns';

const StudyContext = createContext(null);

const STORAGE_KEYS = {
  subjects: 'study_subjects_v2',
  topics: 'study_topics_v2',
  tasks: 'study_tasks_v2',
  revisions: 'study_revisions_v2',
  seeded: 'study_seeded_v2',
};

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export { uuidv4 as v4 };

function load(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

// ── Default seed data ─────────────────────────
function buildSeedData() {
  const s1 = uuidv4(), s2 = uuidv4(), s3 = uuidv4(), s4 = uuidv4();
  const t1 = uuidv4(), t2 = uuidv4(), t3 = uuidv4(), t4 = uuidv4(),
        t5 = uuidv4(), t6 = uuidv4(), t7 = uuidv4(), t8 = uuidv4(),
        t9 = uuidv4(), t10 = uuidv4();

  const subjects = [
    { id: s1, name: 'Data Structures', description: 'Core DSA concepts, trees, graphs, heaps and dynamic programming', color: '#7c5cfc' },
    { id: s2, name: 'Algorithms',      description: 'Sorting, searching, greedy, divide and conquer algorithms',      color: '#3b82f6' },
    { id: s3, name: 'Computer Networks', description: 'OSI model, TCP/IP, protocols, routing and switching',          color: '#22c55e' },
    { id: s4, name: 'DBMS',            description: 'Relational databases, SQL, normalization, transactions',         color: '#f59e0b' },
  ];

  const topics = [
    { id: t1,  subjectId: s1, name: 'Binary Trees',         difficulty: 'Medium', status: 'Completed',      notes: 'In-order, pre-order, post-order traversals. Height, diameter, LCA.' },
    { id: t2,  subjectId: s1, name: 'Graph Algorithms',     difficulty: 'Hard',   status: 'In Progress',    notes: 'BFS, DFS, Dijkstra, Bellman-Ford, Floyd-Warshall.' },
    { id: t3,  subjectId: s1, name: 'Dynamic Programming',  difficulty: 'Hard',   status: 'Not Started',    notes: 'Memoization vs Tabulation, Knapsack, LCS, LIS.' },
    { id: t4,  subjectId: s1, name: 'Heaps & Priority Queue', difficulty: 'Medium', status: 'Needs Revision', notes: 'Min-heap, max-heap, heap sort.' },
    { id: t5,  subjectId: s2, name: 'Merge Sort',           difficulty: 'Easy',   status: 'Completed',      notes: 'Divide and conquer. O(n log n). Stable sort.' },
    { id: t6,  subjectId: s2, name: 'Quick Sort',           difficulty: 'Medium', status: 'Completed',      notes: 'Partition scheme, pivot selection, worst case O(n²).' },
    { id: t7,  subjectId: s2, name: 'Greedy Algorithms',    difficulty: 'Medium', status: 'In Progress',    notes: 'Activity selection, Huffman encoding, Kruskal MST.' },
    { id: t8,  subjectId: s3, name: 'OSI Model',            difficulty: 'Easy',   status: 'Completed',      notes: 'All 7 layers and their protocols.' },
    { id: t9,  subjectId: s3, name: 'TCP vs UDP',           difficulty: 'Easy',   status: 'In Progress',    notes: 'Connection-oriented vs connectionless, use cases.' },
    { id: t10, subjectId: s4, name: 'SQL Joins',            difficulty: 'Medium', status: 'Not Started',    notes: 'INNER, LEFT, RIGHT, FULL, CROSS joins with examples.' },
  ];

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = addDays(new Date(), 1).toISOString().split('T')[0];
  const nextWeek = addDays(new Date(), 7).toISOString().split('T')[0];
  const yesterday = addDays(new Date(), -1).toISOString().split('T')[0];
  const past3 = addDays(new Date(), -3).toISOString().split('T')[0];

  const tasks = [
    { id: uuidv4(), title: 'Solve 10 Binary Tree problems on LeetCode',  subjectId: s1, subject: 'Data Structures', topic: 'Binary Trees',       deadline: nextWeek,  priority: 'High',   status: 'Completed',  createdAt: past3, completedAt: past3 },
    { id: uuidv4(), title: 'Implement Dijkstra\'s from scratch',          subjectId: s1, subject: 'Data Structures', topic: 'Graph Algorithms',   deadline: tomorrow,  priority: 'High',   status: 'Pending',    createdAt: past3 },
    { id: uuidv4(), title: 'Watch DP series on YouTube',                  subjectId: s1, subject: 'Data Structures', topic: 'Dynamic Programming', deadline: nextWeek, priority: 'Medium', status: 'Pending',    createdAt: today },
    { id: uuidv4(), title: 'Revise Heap Sort implementation',             subjectId: s1, subject: 'Data Structures', topic: 'Heaps & Priority Queue', deadline: today, priority: 'Medium', status: 'Revision',   createdAt: past3 },
    { id: uuidv4(), title: 'Complete Merge Sort assignment',              subjectId: s2, subject: 'Algorithms',      topic: 'Merge Sort',          deadline: nextWeek,  priority: 'Low',    status: 'Completed',  createdAt: past3, completedAt: yesterday },
    { id: uuidv4(), title: 'Practice Quick Sort variants',                subjectId: s2, subject: 'Algorithms',      topic: 'Quick Sort',          deadline: nextWeek,  priority: 'Medium', status: 'Pending',    createdAt: today },
    { id: uuidv4(), title: 'Read chapter on Greedy Algorithms',           subjectId: s2, subject: 'Algorithms',      topic: 'Greedy Algorithms',   deadline: yesterday, priority: 'High',   status: 'Pending',    createdAt: past3 },
    { id: uuidv4(), title: 'Make OSI Model cheat sheet',                  subjectId: s3, subject: 'Computer Networks', topic: 'OSI Model',        deadline: nextWeek,  priority: 'Low',    status: 'Completed',  createdAt: past3, completedAt: yesterday },
    { id: uuidv4(), title: 'Compare TCP and UDP protocols',               subjectId: s3, subject: 'Computer Networks', topic: 'TCP vs UDP',       deadline: tomorrow,  priority: 'Medium', status: 'Pending',    createdAt: today },
    { id: uuidv4(), title: 'Practice SQL JOIN queries',                   subjectId: s4, subject: 'DBMS',            topic: 'SQL Joins',           deadline: nextWeek,  priority: 'High',   status: 'Pending',    createdAt: today },
  ];

  const revisions = [
    { id: uuidv4(), topicId: t1, topicName: 'Binary Trees',  subjectId: s1, revisionDate: addDays(new Date(), 2).toISOString(), done: false },
    { id: uuidv4(), topicId: t5, topicName: 'Merge Sort',    subjectId: s2, revisionDate: addDays(new Date(), 1).toISOString(), done: false },
    { id: uuidv4(), topicId: t8, topicName: 'OSI Model',     subjectId: s3, revisionDate: addDays(new Date(), 4).toISOString(), done: false },
    { id: uuidv4(), topicId: t6, topicName: 'Quick Sort',    subjectId: s2, revisionDate: addDays(new Date(), -1).toISOString(), done: false },
  ];

  return { subjects, topics, tasks, revisions };
}

function getInitialState() {
  const alreadySeeded = localStorage.getItem(STORAGE_KEYS.seeded);
  if (!alreadySeeded) {
    const seed = buildSeedData();
    localStorage.setItem(STORAGE_KEYS.subjects, JSON.stringify(seed.subjects));
    localStorage.setItem(STORAGE_KEYS.topics,   JSON.stringify(seed.topics));
    localStorage.setItem(STORAGE_KEYS.tasks,    JSON.stringify(seed.tasks));
    localStorage.setItem(STORAGE_KEYS.revisions, JSON.stringify(seed.revisions));
    localStorage.setItem(STORAGE_KEYS.seeded,   '1');
    return seed;
  }
  return {
    subjects:  load(STORAGE_KEYS.subjects),
    topics:    load(STORAGE_KEYS.topics),
    tasks:     load(STORAGE_KEYS.tasks),
    revisions: load(STORAGE_KEYS.revisions),
  };
}

export function StudyProvider({ children }) {
  const initial = getInitialState();
  const [subjects,  setSubjects]  = useState(initial.subjects);
  const [topics,    setTopics]    = useState(initial.topics);
  const [tasks,     setTasks]     = useState(initial.tasks);
  const [revisions, setRevisions] = useState(initial.revisions);

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.subjects,  JSON.stringify(subjects));  }, [subjects]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.topics,    JSON.stringify(topics));    }, [topics]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.tasks,     JSON.stringify(tasks));     }, [tasks]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.revisions, JSON.stringify(revisions)); }, [revisions]);

  // Subjects
  const addSubject    = useCallback((d)    => { const s = { id: uuidv4(), ...d }; setSubjects(p => [...p, s]); return s; }, []);
  const updateSubject = useCallback((id,d) => setSubjects(p => p.map(s => s.id === id ? { ...s, ...d } : s)), []);
  const deleteSubject = useCallback((id)   => {
    setSubjects(p => p.filter(s => s.id !== id));
    setTopics(p   => p.filter(t => t.subjectId !== id));
    setTasks(p    => p.filter(t => t.subjectId !== id));
    setRevisions(p=> p.filter(r => r.subjectId !== id));
  }, []);

  // Topics
  const addTopic    = useCallback((d) => { const t = { id: uuidv4(), status: 'Not Started', ...d }; setTopics(p => [...p, t]); return t; }, []);
  const updateTopic = useCallback((id, d) => {
    setTopics(prev => prev.map(t => {
      if (t.id !== id) return t;
      const updated = { ...t, ...d };
      if (d.status === 'Completed' && t.status !== 'Completed') {
        setRevisions(r => {
          if (r.find(rv => rv.topicId === id)) return r;
          return [...r, { id: uuidv4(), topicId: id, topicName: updated.name, subjectId: updated.subjectId, revisionDate: addDays(new Date(), 3).toISOString(), done: false }];
        });
      }
      return updated;
    }));
  }, []);
  const deleteTopic = useCallback((id) => { setTopics(p => p.filter(t => t.id !== id)); setRevisions(p => p.filter(r => r.topicId !== id)); }, []);

  // Tasks
  const addTask    = useCallback((d) => { const t = { id: uuidv4(), status: 'Pending', createdAt: new Date().toISOString(), ...d }; setTasks(p => [...p, t]); return t; }, []);
  const updateTask = useCallback((id, d) => setTasks(p => p.map(t => t.id === id ? { ...t, ...d } : t)), []);
  const deleteTask = useCallback((id) => setTasks(p => p.filter(t => t.id !== id)), []);

  // Revisions
  const addRevision     = useCallback((d)  => { const r = { id: uuidv4(), done: false, ...d }; setRevisions(p => [...p, r]); return r; }, []);
  const markRevisionDone= useCallback((id) => setRevisions(p => p.map(r => r.id === id ? { ...r, done: true } : r)), []);
  const deleteRevision  = useCallback((id) => setRevisions(p => p.filter(r => r.id !== id)), []);

  return (
    <StudyContext.Provider value={{
      subjects, topics, tasks, revisions,
      addSubject, updateSubject, deleteSubject,
      addTopic, updateTopic, deleteTopic,
      addTask, updateTask, deleteTask,
      addRevision, markRevisionDone, deleteRevision,
    }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error('useStudy must be inside StudyProvider');
  return ctx;
}
