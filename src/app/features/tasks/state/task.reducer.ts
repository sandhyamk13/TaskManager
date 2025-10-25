// features/tasks/state/task.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as TaskActions from './task.actions';
import { Task } from '../models/task.model';

export const initialState: Task[] = [];

export const taskReducer = createReducer(
  initialState,
  on(TaskActions.addTask, (state, { task }) => [...state, task]),
  on(TaskActions.toggleTask, (state, { id }) =>
    state.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    )
  )
);