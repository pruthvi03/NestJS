import { CreateTaskDto } from './dto/create-task.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto) {
    const { status, search } = filterDto;
    // define themporary array to hold the result
    let tasks: Task[] = this.getAllTasks();
    // do something with status
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    // do something with search
    if (search) {
      // Method One
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });

      // Method Two
      // tasks = tasks.filter((task) => Object.values(task).includes(search));
    }
    // return final result
    return tasks;
  }

  getTaskById(id: string) {
    // try to get task
    const found: Task = this.tasks.find((task) => task.id == id);
    // if not found, throw new error (404 not found)
    if (!found) {
      throw new NotFoundException(`Task with id: ${id} not found.`);
    }
    // otherwise, return the found task
    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: uuid(),
      ...createTaskDto,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  deleteTaskById(id: string): void {
    const found: Task = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id != found.id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task: Task = this.getTaskById(id);
    task.status = status;
    console.log(status);
    return task;
  }
}
