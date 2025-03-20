export interface CoursesInterface {
  id?: number;
  name: string;
  description: string;
  image: string;
  value: number;
  status: string;
  duration: string;
  lessons: CourseLessonsInterface[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CoursePaginatedInterface {
  rows: CoursesInterface[];
  count: number;
}

export interface CourseFilterInterface {
  name?: string;
}

export interface CourseLessonsInterface {
  id: number;
  type: string;
  order: number;
  title: string;
  pdfUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
