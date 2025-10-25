import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskSignalStore } from '../state/task.signal-store';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  store = inject(TaskSignalStore);
  newTitle = '';

  add() {
    this.store.addTask(this.newTitle);
    this.newTitle = '';
  }
}
