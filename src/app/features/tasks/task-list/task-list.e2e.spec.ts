import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { TaskListComponent } from './task-list.component';
import { By } from '@angular/platform-browser';

// Mock app component for E2E-style testing
@Component({
  template: '<router-outlet></router-outlet>'
})
class TestAppComponent { }

describe('TaskList E2E', () => {
  let fixture: ComponentFixture<TestAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestAppComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'tasks', component: TaskListComponent }
        ]),
        TaskListComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestAppComponent);
  });

  it('should navigate to tasks and perform full workflow', async () => {
    // Navigate to tasks route
    const router = TestBed.inject(Router);
    await router.navigate(['/tasks']);
    fixture.detectChanges();

    // Verify we're on the task page
    const taskComponent = fixture.debugElement.query(By.directive(TaskListComponent));
    expect(taskComponent).toBeTruthy();

    // Test the full workflow as a user would
    const input = fixture.debugElement.query(By.css('input[placeholder="New task title"]'));
    const addButton = fixture.debugElement.query(By.css('button'));

    // Add task
    input.nativeElement.value = 'E2E Test Task';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    addButton.nativeElement.click();
    fixture.detectChanges();

    // Verify task appears
    expect(fixture.debugElement.query(By.css('li')).nativeElement.textContent).toContain('E2E Test Task');
  });
});