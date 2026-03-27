// ─── Estrutura do JSON de entrada ────────────────────────────────────────────

export interface CurriculumInput {
  code: string;
  name: string;
  availableSince: string;
  description: string;
  levels: number;
}

export interface CourseInput {
  code: string;
  name: string;
  hours: number;
  credits: number;
  level: number;
  syllabus: string;
  tags: string[];
}

export type RequirementType = 'prerequisite' | 'special' | 'corequisite' | 'credit_requirement';

export interface RequirementInput {
  type: RequirementType;
  from?: string;
  to: string;
  description?: string;
  min_credits?: number;
}

export interface CurriculumFile {
  curriculum: CurriculumInput;
  courses: CourseInput[];
  requirements: RequirementInput[];
}

// ─── Estruturas internas de layout ───────────────────────────────────────────

export interface CardRect {
  courseCode: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ColumnLayout {
  level: number;
  x: number;
  totalCredits: number;
  cards: CardRect[];
}

export interface LayoutData {
  canvasWidth: number;
  canvasHeight: number;
  columns: ColumnLayout[];
}

// ─── Estruturas de roteamento de setas ───────────────────────────────────────

export interface Point {
  x: number;
  y: number;
}

export interface ArrowRoute {
  requirementIndex: number;
  type: RequirementType;
  points: Point[];
  label?: string;
}

export interface RouteData {
  arrows: ArrowRoute[];
}
