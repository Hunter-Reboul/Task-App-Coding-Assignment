import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '@take-home/shared';
import { StorageService } from '../storage/storage.service';
import { isToday} from '../utils/isToday';

@Injectable({ providedIn: 'root' })
export class TasksService {
  tasks: Task[] = [];

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {}

  getTasksFromApi(): Observable<Task[]> {
    const endpointUrl = '/api/tasks';
    return this.http.get<Task[]>(endpointUrl);
  }

  async getTasksFromStorage(): Promise<void> {
    this.tasks = await this.storageService.getTasks();
    this.filterTask('isArchived');
  }

  filterTask(key: keyof Task): void {
    switch (key) {
      case 'isArchived':
        this.tasks = this.tasks.filter((task) => !task.isArchived);
        break;
      case 'priority':
        this.tasks = this.tasks.filter((task) => task.priority === 'HIGH');
        break;
      case 'scheduledDate':
        this.tasks = this.tasks.filter((task) => (isToday(task.scheduledDate.toString())));
        break;
      case 'completed':
        this.tasks = this.tasks.filter((task) => !task.completed);
    }
  }

  searchTask(search: string): void {
    if (search) {
      this.tasks = this.tasks.filter((task) => task.title.includes(search));
    } else {
      this.getTasksFromStorage();
    }
  }
}
