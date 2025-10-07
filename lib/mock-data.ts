import type { User, Subject, Question, Exam, ExamField } from "./types"

export const mockUser: User = {
  id: "1",
  email: "student@example.com",
  full_name: "Abebe Kebede",
  role: "student",
  field: "Natural",
  batch: "2024-A",
  created_at: new Date().toISOString(),
}

export const mockSubjects: Subject[] = [
  { id: "math", name: "Mathematics", field: "natural", description: "Advanced mathematics for natural sciences" },
  { id: "physics", name: "Physics", field: "natural", description: "Fundamental physics concepts" },
  { id: "chemistry", name: "Chemistry", field: "natural", description: "General and organic chemistry" },
  { id: "biology", name: "Biology", field: "natural", description: "Life sciences and biology" },
  { id: "history", name: "History", field: "social", description: "Ethiopian and world history" },
  { id: "geography", name: "Geography", field: "social", description: "Physical and human geography" },
  { id: "economics", name: "Economics", field: "social", description: "Basic economic principles" },
  { id: "civics", name: "Civics", field: "social", description: "Civics and ethical education" },
]

export const mockQuestions: Question[] = [
  {
    id: "1",
    subject_id: "math",
    question_text: "What is the derivative of x² + 3x + 2?",
    question_type: "multiple_choice",
    difficulty_level: 2,
    explanation: "Using the power rule: d/dx(x²) = 2x, d/dx(3x) = 3, d/dx(2) = 0. Therefore, the derivative is 2x + 3.",
    created_at: new Date().toISOString(),
    options: [
      { id: "1a", question_id: "1", option_text: "2x + 3", is_correct: true, option_order: 1 },
      { id: "1b", question_id: "1", option_text: "x² + 3", is_correct: false, option_order: 2 },
      { id: "1c", question_id: "1", option_text: "2x + 2", is_correct: false, option_order: 3 },
      { id: "1d", question_id: "1", option_text: "x + 3", is_correct: false, option_order: 4 },
    ],
  },
  {
    id: "2",
    subject_id: "math",
    question_text: "Solve for x: 2x + 5 = 13",
    question_type: "multiple_choice",
    difficulty_level: 1,
    explanation: "Subtract 5 from both sides: 2x = 8. Then divide both sides by 2: x = 4.",
    created_at: new Date().toISOString(),
    options: [
      { id: "2a", question_id: "2", option_text: "4", is_correct: true, option_order: 1 },
      { id: "2b", question_id: "2", option_text: "8", is_correct: false, option_order: 2 },
      { id: "2c", question_id: "2", option_text: "3", is_correct: false, option_order: 3 },
      { id: "2d", question_id: "2", option_text: "9", is_correct: false, option_order: 4 },
    ],
  },
  {
    id: "3",
    subject_id: "physics",
    question_text: "What is Newton's Second Law of Motion?",
    question_type: "multiple_choice",
    difficulty_level: 2,
    explanation:
      "Newton's Second Law states that Force equals mass times acceleration (F = ma). This fundamental law describes how the motion of an object changes when forces are applied.",
    created_at: new Date().toISOString(),
    options: [
      { id: "3a", question_id: "3", option_text: "F = ma", is_correct: true, option_order: 1 },
      { id: "3b", question_id: "3", option_text: "E = mc²", is_correct: false, option_order: 2 },
      { id: "3c", question_id: "3", option_text: "F = G(m₁m₂)/r²", is_correct: false, option_order: 3 },
      { id: "3d", question_id: "3", option_text: "v = u + at", is_correct: false, option_order: 4 },
    ],
  },
  {
    id: "4",
    subject_id: "chemistry",
    question_text: "What is the chemical formula for water?",
    question_type: "multiple_choice",
    difficulty_level: 1,
    explanation: "Water consists of two hydrogen atoms bonded to one oxygen atom, giving it the chemical formula H₂O.",
    created_at: new Date().toISOString(),
    options: [
      { id: "4a", question_id: "4", option_text: "H₂O", is_correct: true, option_order: 1 },
      { id: "4b", question_id: "4", option_text: "CO₂", is_correct: false, option_order: 2 },
      { id: "4c", question_id: "4", option_text: "O₂", is_correct: false, option_order: 3 },
      { id: "4d", question_id: "4", option_text: "H₂O₂", is_correct: false, option_order: 4 },
    ],
  },
  {
    id: "5",
    subject_id: "biology",
    question_text: "What is the powerhouse of the cell?",
    question_type: "multiple_choice",
    difficulty_level: 1,
    explanation:
      "Mitochondria are known as the powerhouse of the cell because they generate most of the cell's supply of ATP (adenosine triphosphate), which is used as a source of chemical energy.",
    created_at: new Date().toISOString(),
    options: [
      { id: "5a", question_id: "5", option_text: "Mitochondria", is_correct: true, option_order: 1 },
      { id: "5b", question_id: "5", option_text: "Nucleus", is_correct: false, option_order: 2 },
      { id: "5c", question_id: "5", option_text: "Ribosome", is_correct: false, option_order: 3 },
      { id: "5d", question_id: "5", option_text: "Chloroplast", is_correct: false, option_order: 4 },
    ],
  },
  {
    id: "6",
    subject_id: "history",
    question_text: "In which year did Ethiopia defeat Italy at the Battle of Adwa?",
    question_type: "multiple_choice",
    difficulty_level: 2,
    explanation:
      "The Battle of Adwa took place on March 1, 1896, where Ethiopian forces decisively defeated the Italian army, securing Ethiopia's sovereignty.",
    created_at: new Date().toISOString(),
    options: [
      { id: "6a", question_id: "6", option_text: "1896", is_correct: true, option_order: 1 },
      { id: "6b", question_id: "6", option_text: "1889", is_correct: false, option_order: 2 },
      { id: "6c", question_id: "6", option_text: "1906", is_correct: false, option_order: 3 },
      { id: "6d", question_id: "6", option_text: "1882", is_correct: false, option_order: 4 },
    ],
  },
]

export const mockExams: Exam[] = [
  {
    id: "1",
    title: "Mathematics Practice Test",
    description: "Comprehensive mathematics practice covering algebra, calculus, and geometry",
    field: "natural",
    subject_id: "math",
    batch: 2024,
    year: 2024,
    duration_minutes: 60,
    total_marks: 100,
    passing_marks: 50,
    is_active: true,
    created_at: new Date().toISOString(),
    questions: mockQuestions.filter((q) => q.subject_id === "math"),
  },
  {
    id: "2",
    title: "Physics Practice Test",
    description: "Physics practice focusing on mechanics and thermodynamics",
    field: "natural",
    subject_id: "physics",
    batch: 2024,
    year: 2024,
    duration_minutes: 45,
    total_marks: 50,
    passing_marks: 25,
    is_active: true,
    created_at: new Date().toISOString(),
    questions: mockQuestions.filter((q) => q.subject_id === "physics"),
  },
  {
    id: "3",
    title: "Chemistry Practice Test",
    description: "General and organic chemistry practice questions",
    field: "natural",
    subject_id: "chemistry",
    batch: 2023,
    year: 2023,
    duration_minutes: 45,
    total_marks: 50,
    passing_marks: 25,
    is_active: true,
    created_at: new Date().toISOString(),
    questions: mockQuestions.filter((q) => q.subject_id === "chemistry"),
  },
  {
    id: "4",
    title: "Biology Practice Test",
    description: "Life sciences and biology fundamentals",
    field: "natural",
    subject_id: "biology",
    batch: 2023,
    year: 2023,
    duration_minutes: 45,
    total_marks: 50,
    passing_marks: 25,
    is_active: true,
    created_at: new Date().toISOString(),
    questions: mockQuestions.filter((q) => q.subject_id === "biology"),
  },
  {
    id: "5",
    title: "History Practice Test",
    description: "Ethiopian and world history comprehensive review",
    field: "social",
    subject_id: "history",
    batch: 2024,
    year: 2024,
    duration_minutes: 60,
    total_marks: 100,
    passing_marks: 50,
    is_active: true,
    created_at: new Date().toISOString(),
    questions: mockQuestions.filter((q) => q.subject_id === "history"),
  },
]

export function getExamsByField(field: ExamField): Exam[] {
  return mockExams.filter((exam) => exam.field === field)
}

export function getSubjectsByField(field: ExamField): Subject[] {
  return mockSubjects.filter((subject) => subject.field === field)
}
