import { useStudy } from '../context/StudyContext';

export function useSubjects() {
  const {
    subjects, topics,
    addSubject, updateSubject, deleteSubject,
    addTopic, updateTopic, deleteTopic,
  } = useStudy();

  const getTopicsForSubject = (subjectId) =>
    topics.filter(t => t.subjectId === subjectId);

  const getSubjectById = (id) =>
    subjects.find(s => s.id === id);

  const getTopicById = (id) =>
    topics.find(t => t.id === id);

  return {
    subjects, topics,
    addSubject, updateSubject, deleteSubject,
    addTopic, updateTopic, deleteTopic,
    getTopicsForSubject, getSubjectById, getTopicById,
  };
}
