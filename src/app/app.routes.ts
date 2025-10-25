// ...existing code...
import { Routes } from '@angular/router';
//import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [
    {
        path: 'tasks',
        loadComponent: () =>
            import('./features/tasks/task-list/task-list.component').then((m) => m.TaskListComponent),
        //canActivate: [AuthGuard],
    },
    { path: '', redirectTo: '/tasks', pathMatch: 'full' },
];
// ...existing code...