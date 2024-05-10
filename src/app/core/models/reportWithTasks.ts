export interface ReportData {
  reportID: number;
  workWeek: number;
  totalWorkHour: number;
  tasks: Task[];
  submissionDateTime: string;
}

export interface Task {
  reportID?: number;
  taskID?: number;
  workHour: number;
  categoryID: number;
  taskDescription: string;
  categoryName?: string;
}

export interface Category {
  categoryID: number;
  categoryName: string;
}
