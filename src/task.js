import { publish, subscribe } from "./pubsub";


export class Task {
    constructor(id, title, description, due_date, priority) {
        this._id = id;
        this._title = title;
        this._description = description;
        this._due_date = due_date;
        this._priority = priority;
    }
    set id(value) {
        this._id = value;
    }
    get id() {
        return this._id;
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
        else {
            this._due_date = null;
        }
    }
    get priority() {
        return this._priority;
    }
    set priority(value) {
        if (value) {
            this._priority = value;
        }
    }
}

export function create_task(data) {
    const task = new Task(...data);
    publish("task_created", task);
    return task;
}

subscribe("add_form_submitted", create_task);