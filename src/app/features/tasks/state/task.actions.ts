// features/tasks/state/task.actions.ts
import { createAction, props } from '@ngrx/store';
import { Task } from '../models/task.model';

export const loadTasks = createAction('[Task] Load');
export const addTask = createAction('[Task] Add', props<{ task: Task }>());
export const toggleTask = createAction('[Task] Toggle', props<{ id: number }>());