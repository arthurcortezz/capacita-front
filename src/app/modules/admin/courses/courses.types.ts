export interface CoursesInterface {
  id?: number;
  name: string;
  description: string;
  image: string;
  value: number;
  status: string;
  duration: string;
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
