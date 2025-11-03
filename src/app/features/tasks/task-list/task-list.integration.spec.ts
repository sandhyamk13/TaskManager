import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TaskListComponent } from './task-list.component';
import { TaskSignalStore } from '../state/task.signal-store';

describe('TaskListComponent Integration', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let store: TaskSignalStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent, FormsModule],
      providers: [TaskSignalStore]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(TaskSignalStore);
    
    // Clear the initial sample task for clean tests
    store.tasks.set([]);
    fixture.detectChanges();
  });

  describe('Full User Workflow', () => {
    it('should add, toggle, and remove tasks through the UI', async () => {
      // Start with no tasks
      expect(fixture.debugElement.queryAll(By.css('li'))).toHaveSize(0);
      expect(fixture.debugElement.query(By.css('h2')).nativeElement.textContent).toContain('(0 completed)');

      // Add a task through the UI
      const input = fixture.debugElement.query(By.css('input[placeholder="New task title"]'));
      const addButton = fixture.debugElement.query(By.css('button'));
      
      input.nativeElement.value = 'Integration test task';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      addButton.nativeElement.click();
      fixture.detectChanges();
      
      // Verify task appears in DOM and store
      let taskItems = fixture.debugElement.queryAll(By.css('li'));
      expect(taskItems).toHaveSize(1);
      expect(taskItems[0].nativeElement.textContent).toContain('Integration test task');
      expect(store.tasks()).toHaveSize(1);
      expect(input.nativeElement.value).toBe(''); // Input should be cleared

      // Toggle the task through the UI
      const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      checkbox.nativeElement.click();
      fixture.detectChanges();
      
      // Verify completion status updated
      expect(checkbox.nativeElement.checked).toBeTrue();
      expect(fixture.debugElement.query(By.css('h2')).nativeElement.textContent).toContain('(1 completed)');
      expect(store.completedCount()).toBe(1);
      
      // Remove the task through the UI
      const removeButton = fixture.debugElement.query(By.css('button:not(:first-child)'));
      removeButton.nativeElement.click();
      fixture.detectChanges();
      
      // Verify task is removed
      taskItems = fixture.debugElement.queryAll(By.css('li'));
      expect(taskItems).toHaveSize(0);
      expect(store.tasks()).toHaveSize(0);
      expect(fixture.debugElement.query(By.css('h2')).nativeElement.textContent).toContain('(0 completed)');
    });

    it('should handle multiple tasks correctly', async () => {
      // Add multiple tasks
      const tasks = ['Task 1', 'Task 2', 'Task 3'];
      const input = fixture.debugElement.query(By.css('input[placeholder="New task title"]'));
      const addButton = fixture.debugElement.query(By.css('button'));
      
      for (const taskTitle of tasks) {
        input.nativeElement.value = taskTitle;
        input.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        addButton.nativeElement.click();
        fixture.detectChanges();
      }
      
      // Verify all tasks appear
      let taskItems = fixture.debugElement.queryAll(By.css('li'));
      expect(taskItems).toHaveSize(3);
      
      // Complete the middle task
      const secondCheckbox = taskItems[1].query(By.css('input[type="checkbox"]'));
      secondCheckbox.nativeElement.click();
      fixture.detectChanges();
      
      // Verify only one task is completed
      expect(fixture.debugElement.query(By.css('h2')).nativeElement.textContent).toContain('(1 completed)');
      
      // Remove the first task
      const firstRemoveButton = taskItems[0].query(By.css('button'));
      firstRemoveButton.nativeElement.click();
      fixture.detectChanges();
      
      // Verify correct task was removed and count updated
      taskItems = fixture.debugElement.queryAll(By.css('li'));
      expect(taskItems).toHaveSize(2);
      expect(taskItems[0].nativeElement.textContent).toContain('Task 2'); // Task 2 is now first
      expect(fixture.debugElement.query(By.css('h2')).nativeElement.textContent).toContain('(1 completed)');
    });

    it('should not add empty or whitespace-only tasks', async () => {
      const input = fixture.debugElement.query(By.css('input[placeholder="New task title"]'));
      const addButton = fixture.debugElement.query(By.css('button'));
      
      // Try to add empty task
      input.nativeElement.value = '';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      // Button should be disabled
      expect(addButton.nativeElement.disabled).toBeTrue();
      
      // Try to add whitespace-only task
      input.nativeElement.value = '   ';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      addButton.nativeElement.click(); // Even if clicked, nothing should happen
      fixture.detectChanges();
      
      expect(fixture.debugElement.queryAll(By.css('li'))).toHaveSize(0);
      expect(store.tasks()).toHaveSize(0);
    });
  });
});