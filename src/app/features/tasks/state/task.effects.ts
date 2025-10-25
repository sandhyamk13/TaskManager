// features/tasks/state/task.effects.ts
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TaskService } from '../services/task.service';
import { loadTasks } from './task.actions';
import { map, mergeMap } from 'rxjs/operators';

export const loadTasksEffect = createEffect(
  (actions$ = inject(Actions), taskService = inject(TaskService)) =>
    actions$.pipe(
      ofType(loadTasks),
      mergeMap(() => taskService.getTasks().pipe(map((tasks) => ({ type: '[Task] Load Success', tasks }))))
    ),
  { functional: true }
);