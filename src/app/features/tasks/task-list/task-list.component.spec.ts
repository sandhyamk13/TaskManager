import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TaskListComponent } from './task-list.component';
import { TaskSignalStore } from '../state/task.signal-store';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let mockStore: jasmine.SpyObj<TaskSignalStore>;

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('TaskSignalStore', ['addTask', 'removeTask', 'toggleTask'], {
      tasks: jasmine.createSpy().and.returnValue([
        { id: 1, title: 'Test Task 1', completed: false },
        { id: 2, title: 'Test Task 2', completed: true }
      ]),
      completedCount: jasmine.createSpy().and.returnValue(1)
    });

    await TestBed.configureTestingModule({
      imports: [TaskListComponent, FormsModule],
      providers: [
        { provide: TaskSignalStore, useValue: storeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(TaskSignalStore) as jasmine.SpyObj<TaskSignalStore>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Template Rendering', () => {
    it('should display completed count', () => {
      const heading = fixture.debugElement.query(By.css('h2'));
      expect(heading.nativeElement.textContent).toContain('Tasks (1 completed)');
    });

    it('should render task list', () => {
      const taskItems = fixture.debugElement.queryAll(By.css('li'));
      expect(taskItems).toHaveSize(2);
      
      expect(taskItems[0].nativeElement.textContent).toContain('Test Task 1');
      expect(taskItems[1].nativeElement.textContent).toContain('Test Task 2');
    });

    it('should render input and add button', () => {
      const input = fixture.debugElement.query(By.css('input[placeholder="New task title"]'));
      const addButton = fixture.debugElement.query(By.css('button'));
      
      expect(input).toBeTruthy();
      expect(addButton.nativeElement.textContent.trim()).toBe('Add');
    });

    it('should disable add button when input is empty', () => {
      component.newTitle = '';
      fixture.detectChanges();
      
      const addButton = fixture.debugElement.query(By.css('button'));
      expect(addButton.nativeElement.disabled).toBeTrue();
    });
  });

  describe('User Interactions', () => {
    it('should call store.addTask when add button is clicked', () => {
      component.newTitle = 'New test task';
      
      const addButton = fixture.debugElement.query(By.css('button'));
      addButton.nativeElement.click();
      
      expect(mockStore.addTask).toHaveBeenCalledWith('New test task');
    });

    it('should clear input after adding task', () => {
      component.newTitle = 'Task to clear';
      component.add();
      
      expect(component.newTitle).toBe('');
    });

    it('should call store.toggleTask when checkbox is clicked', () => {
      const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      checkbox.nativeElement.dispatchEvent(new Event('change'));
      
      expect(mockStore.toggleTask).toHaveBeenCalledWith(1);
    });
  });
});
