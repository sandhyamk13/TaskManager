// features/tasks/state/task.signal-store.ts
import { Injectable, signal, computed } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskSignalStore {
  // seed one example task so UI isn't empty during manual testing
  tasks = signal<Task[]>([{ id: 1, title: 'Sample task', completed: false }]);

  completedCount = computed(() => this.tasks().filter((t) => t.completed).length);

  // accept a title (convenience for UI). Keeps API simple for components.
  addTask(title: string) {
    const trimmed = (title || '').trim();
    if (!trimmed) return;
    const newTask: Task = { id: Date.now(), title: trimmed, completed: false };
    this.tasks.set([...this.tasks(), newTask]);
  }

  removeTask(id: number) {
    this.tasks.set(this.tasks().filter((t) => t.id !== id));
  }

  toggleTask(id: number) {
    this.tasks.set(
      this.tasks().map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  }
}