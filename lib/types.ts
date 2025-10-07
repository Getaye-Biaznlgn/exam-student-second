export type UserRole = "student" | "teacher" | "admin"
export type ExamField = "Natural" | "Social"
export type QuestionType = "multiple_choice" | "true_false"
export type ExamStatus = "not_started" | "in_progress" | "completed"

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  field?: ExamField
  batch?: string
  created_at: string
}

export interface Subject {
  id: string
  name: string
  field: ExamField
  description?: string
}

export interface Question {
  id: string
  subject_id: string
  question_text: string
  question_type: QuestionType
  difficulty_level: number
  explanation?: string
  created_at: string
  options: QuestionOption[]
}

export interface QuestionOption {
  id: string
  question_id: string
  option_text: string
  is_correct: boolean
  option_order: number
}

export interface Exam {
  id: string
  title: string
  description?: string
  field: ExamField
  subject_id?: string
  batch: number
  year?: number
  duration_minutes?: number
  total_marks: number
  passing_marks: number
  is_active: boolean
  created_at: string
  questions: Question[]
  correct_option_id?: string
}

export interface StudentExam {
  id: string
  student_id: string
  exam_id: string
  start_time: string
  end_time?: string
  score?: number
  status: ExamStatus
  is_practice_mode: boolean
}

export interface StudentAnswer {
  id: string
  student_exam_id: string
  question_id: string
  selected_option_id?: string
  is_correct?: boolean
  time_spent_seconds?: number
}

export interface StudentProgress {
  student_id: string
  subject_id: string
  total_questions_attempted: number
  correct_answers: number
  average_score: number
  last_practice_date?: string
}
