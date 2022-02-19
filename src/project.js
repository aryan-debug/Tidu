
import { publish, subscribe } from "./pubsub";
import { get_smallest_id } from "./storage";

let unique_id = get_smallest_id()

export class Project{
    constructor(title, description, due_date) {
        this._id = unique_id;
        this._title = title;
        this._description = description;
        this._due_date = due_date;
        this._tasks = [];
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get title() {
        return this._title;
    }
    set title(value) {
        if (value) {
            this._title = value;
        }
    }
    get description() {
        return this._description;
    }
    set description(value) {
        if (value) {
            this._description = value;
        }
    }    
    get due_date() {
        return this._due_date;
    }
    set due_date(value) {
        if (value) {
            this._due_date = value;
        }
    }
    get tasks() {
        return this._tasks[0]
    }
    add_task(task) {
        this._tasks.push(task);
        publish("task_added_to_project", task)
    }
}
export function create_project(data) {
    const project = new Project(...data);
    publish("project_created",project);
    unique_id--;
    return project;
}
subscribe("add_project_form_submitted", create_project);