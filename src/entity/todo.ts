export interface Todo {
  _id: string;
  user: string;
  task: string;
  completed: boolean;
  createdAt: Date;
  completedAt: Date;
}