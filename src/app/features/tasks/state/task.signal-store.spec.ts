import { TaskSignalStore } from './task.signal-store';

describe('TaskSignalStore', () => {
  let store: TaskSignalStore;

  beforeEach(() => {
    store = new TaskSignalStore();
  });

  describe('Initial State', () => {
    it('should initialize with a sample task', () => {
      const tasks = store.tasks();
      expect(tasks).toHaveSize(1);
      expect(tasks[0]).toEqual({ id: 1, title: 'Sample task', completed: false });
    });

    it('should have correct initial completed count', () => {
      expect(store.completedCount()).toBe(0);
    });
  });

  describe('Adding Tasks', () => {
    it('should add a new task with valid title', () => {
      const initialCount = store.tasks().length;
      store.addTask('New test task');
      
      const tasks = store.tasks();
      expect(tasks).toHaveSize(initialCount + 1);
      
      const newTask = tasks.find(t => t.title === 'New test task');
      expect(newTask).toBeDefined();
      expect(newTask?.completed).toBeFalse();
      expect(newTask?.id).toBeGreaterThan(1);
    });

    it('should not add task with empty title', () => {
      const initialCount = store.tasks().length;
      store.addTask('');
      expect(store.tasks()).toHaveSize(initialCount);
    });

    it('should not add task with whitespace-only title', () => {
      const initialCount = store.tasks().length;
      store.addTask('   ');
      expect(store.tasks()).toHaveSize(initialCount);
    });

    it('should trim whitespace from task title', () => {
      store.addTask('  Trimmed Task  ');
      const newTask = store.tasks().find(t => t.title === 'Trimmed Task');
      expect(newTask).toBeDefined();
    });
  });

  describe('Toggling Tasks', () => {
    it('should toggle task completion status', () => {
      store.addTask('Toggle test');
      const task = store.tasks().find(t => t.title === 'Toggle test')!;
      
      expect(task.completed).toBeFalse();
      
      store.toggleTask(task.id);
      const updatedTask = store.tasks().find(t => t.id === task.id)!;
      expect(updatedTask.completed).toBeTrue();
      
      store.toggleTask(task.id);
      const retoggled = store.tasks().find(t => t.id === task.id)!;
      expect(retoggled.completed).toBeFalse();
    });

    it('should update completed count when toggling', () => {
      store.addTask('Count test');
      const task = store.tasks().find(t => t.title === 'Count test')!;
      
      expect(store.completedCount()).toBe(0);
      
      store.toggleTask(task.id);
      expect(store.completedCount()).toBe(1);
      
      store.toggleTask(task.id);
      expect(store.completedCount()).toBe(0);
    });

    it('should not affect other tasks when toggling', () => {
      store.addTask('Task 1');
      store.addTask('Task 2');
      const task1 = store.tasks().find(t => t.title === 'Task 1')!;
      const task2 = store.tasks().find(t => t.title === 'Task 2')!;
      
      store.toggleTask(task1.id);
      
      expect(store.tasks().find(t => t.id === task1.id)?.completed).toBeTrue();
      expect(store.tasks().find(t => t.id === task2.id)?.completed).toBeFalse();
    });
  });

  describe('Removing Tasks', () => {
    it('should remove a task by id', () => {
      store.addTask('To remove');
      const task = store.tasks().find(t => t.title === 'To remove')!;
      const initialCount = store.tasks().length;
      
      store.removeTask(task.id);
      
      expect(store.tasks()).toHaveSize(initialCount - 1);
      expect(store.tasks().find(t => t.id === task.id)).toBeUndefined();
    });

    it('should update completed count when removing completed task', () => {
      store.addTask('Completed task');
      const task = store.tasks().find(t => t.title === 'Completed task')!;
      
      store.toggleTask(task.id); // mark as completed
      expect(store.completedCount()).toBe(1);
      
      store.removeTask(task.id);
      expect(store.completedCount()).toBe(0);
    });

    it('should not error when removing non-existent task', () => {
      expect(() => store.removeTask(99999)).not.toThrow();
    });
  });
});