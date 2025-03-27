import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '../../storage/storage.service';
import { AddComponent } from './add.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Router } from '@angular/router';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing'
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { HarnessLoader } from '@angular/cdk/testing';

class MockStorageService {
  updateTaskItem(): void {
    return;
  }
}

describe('AddComponent', () => {
  let fixture: ComponentFixture<AddComponent>;
  let loader: HarnessLoader;
  let component: AddComponent;
  let storageService: StorageService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
      ],
      declarations: [AddComponent],
      providers: [{ provide: StorageService, useClass: MockStorageService }],
    }).compileComponents();
  });

  beforeEach(() => {
    const mockDate = new Date("2025-3-1");
    
    jest.useFakeTimers({ advanceTimers: true });
    jest.setSystemTime(mockDate);
    
    router = TestBed.inject(Router);
    storageService = TestBed.inject(StorageService);
    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeDefined();
  });

  it('should display the title', () => {
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.textContent).toEqual('Add Task');
  });

  it(`should navigate to home when cancel button is clicked`, async () => {
    jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    jest.spyOn(component, 'onCancel');
    const cancelButton = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid="cancel"]' }),
    );
    await cancelButton.click();
    fixture.detectChanges();
    expect(component.onCancel).toHaveBeenCalledTimes(1);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it(`should prevent adding task without a valid title`, async () => {
    const addButton = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid="add-task"]' }),
    );
    const datePicker = await loader.getHarness(
      MatDatepickerInputHarness.with({ selector: '[data-testid="date-picker"]'}));
    datePicker.setValue('3/1/2025');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(await addButton.isDisabled()).toBeTruthy();
    component['addTaskForm'].controls['title'].setValue('Invalid');
    fixture.detectChanges();
    expect(await addButton.isDisabled()).toBeTruthy();
    component['addTaskForm'].controls['title'].setValue(
      'This is a valid title',
    );
    fixture.detectChanges();
    expect(await addButton.isDisabled()).toBeFalsy();
  });

  it(`should display appropriate title errors`, async () => {
    const titleTextField = await loader.getHarness(
      MatFormFieldHarness.with({ selector: '[data-testid="title-field"]'})
    );
    component['addTaskForm'].controls['title'].setValue('');
    fixture.detectChanges();
    expect(await titleTextField.getErrors({text: 'Title is required.'}));
    component['addTaskForm'].controls['title'].setValue('Invalid');
    fixture.detectChanges();
    expect(await titleTextField.getErrors({text: 
      'Title must be at least 10 characters long.'}));
    component['addTaskForm'].controls['title'].setValue(
      'This is a valid title',
    );
    fixture.detectChanges();
    expect(await titleTextField.hasErrors()).toBeFalsy();
  });

  it(`should prevent adding task with a date that is not within the next 7 days`, async () => {
    const datePicker = await loader.getHarness(
      MatDatepickerInputHarness.with({ selector: '[data-testid="date-picker"]'}));
    const addButton = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid="add-task"]' }),
    );
    component['addTaskForm'].controls['title'].setValue('Valid Title');
    fixture.detectChanges();
    expect(await addButton.isDisabled()).toBeTruthy();
    datePicker.setValue('3/9/2025');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(await addButton.isDisabled()).toBeTruthy();
    datePicker.setValue('2/28/2025');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(await addButton.isDisabled()).toBeTruthy();
    datePicker.setValue('3/8/2025');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(await addButton.isDisabled()).toBeFalsy();
  });

  it(`should display appropriate date errors`, async () => {
    const dateTextField = await loader.getHarness(
      MatFormFieldHarness.with({ selector: '[data-testid="date-field"]'})
    );
    const datePicker = await loader.getHarness(
      MatDatepickerInputHarness.with({ selector: '[data-testid="date-picker"]'}));
    datePicker.setValue('');
    fixture.detectChanges();
    expect(await dateTextField.getErrors({text: 'Pick a date.'}));
    datePicker.setValue('2/28/25');
    fixture.detectChanges();
    expect(await dateTextField.getErrors({text: 'Task date cannot be before today.'}));
    datePicker.setValue('3/9/25');
    fixture.detectChanges();
    expect(await dateTextField.getErrors({
      text: 'Task date cannot be more than</strong> 7 days away.'}));
    datePicker.setValue('3/8/25');
    fixture.detectChanges();
    expect(await dateTextField.hasErrors()).toBeFalsy();
  });

  it(`should create a new task for a valid submission and navigate home`, async () => {
    jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    jest.spyOn(component, 'onSubmit');
    jest.spyOn(storageService, 'updateTaskItem').mockResolvedValue();
    const datePicker = await loader.getHarness(
      MatDatepickerInputHarness.with({ selector: '[formControlName="scheduledDate"]'}));
    component['addTaskForm'].controls['title'].setValue('Adding a test task');
    component['addTaskForm'].controls['description'].setValue(
      'This task should be added to the list',
    );
    datePicker.setValue('3/1/2025');
    await fixture.whenStable();
    fixture.detectChanges();
    const addButton = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid="add-task"]' }),
    );
    await addButton.click();
    fixture.detectChanges();
    expect(component.onSubmit).toBeCalledTimes(1);
    expect(storageService.updateTaskItem).toBeCalledTimes(1);
    expect(storageService.updateTaskItem).toBeCalledWith(
      expect.objectContaining({
        isArchived: false,
        title: 'Adding a test task',
        description: 'This task should be added to the list',
      }),
    );
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });
});
