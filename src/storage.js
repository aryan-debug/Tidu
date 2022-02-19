
import { serialize_task } from "./helpers";
import { subscribe } from "./pubsub";
import { current_project } from "./dom_handler";
import { publish } from "./pubsub";
import { Task } from "./task";

export function add_project_to_storage(project) {
    if (!get_project(project._id)) {
        localStorage.setItem(project._id.toString(), JSON.stringify({"_id":project.id, "_title": project.title, "_description": project.description, "_due_date": project.due_date, "_tasks": project._tasks }))
    }
}
export function add_task_to_storage(task) {
    const project = get_project(current_project._id);
    project._tasks.push(serialize_task(task));
    localStorage.setItem(current_project._id, JSON.stringify(project));
    publish("added_task_to_storage");
}
export function get_project(project_id){
    const project = JSON.parse(localStorage.getItem(project_id));
    return project
}
export function get_projects_from_storage() {
    const projects = []
    for (let i = 0; i < localStorage.length; i++){
        if (-i < 0) {
            const project = JSON.parse(localStorage.getItem(-i));
            project["id"] = -i;
            projects.push(project);
        }
    }
    return projects
}
export function get_tasks_from_project(project_id) {
    const tasks = []
    const project_tasks = get_project(project_id)._tasks;
    if (project_tasks) {
        for (let i = 0; i < project_tasks.length; i++) {
            tasks.push(project_tasks[i]);
        }
    }
    return tasks
}
export function get_smallest_id() {
    let min = 0;
    for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            if (parseInt(key) < min) {
                min = parseInt(key);
            }
        }
    }
    return min;
}
export function get_task_from_current_project(task_id) {
    const tasks = get_project(current_project._id)._tasks;
    for (const task in tasks) {
        if (parseInt(tasks[task]._id) === task_id) {
            return tasks[task];
        }
    }
    return false;
}
export function get_largest_task_id() {
    let max = 0;
    const tasks = get_project(current_project._id)._tasks;
    for (const task in tasks) {
        if (parseInt(tasks[task]._id) > max) {
            max = parseInt(tasks[task]._id);
        }
    }
    return max;
}
export function remove_task_from_storage(id) {
    const project = get_project(current_project._id);
    const project_tasks = project._tasks;
    for (let i = 0; i < project_tasks.length; i++){
        if (project_tasks[i]._id == id) {
            project_tasks.splice(i, 1);
        }
    }
    localStorage[current_project._id] = JSON.stringify(project);
    publish("task_removed");

}
function save_editted_task(editted_task) {
    const project = get_project(current_project._id);
    const tasks = project._tasks;
    const serialized_task = serialize_task(new Task(...editted_task));
    for (let i = 0; i < tasks.length; i++){
        if (tasks[i]._id == serialized_task._id) {
            tasks[i] = serialized_task;
        }
    }
    project._tasks = tasks;
    localStorage.setItem(current_project._id.toString(), JSON.stringify(project));
    publish("task_editted");
}
subscribe("edit_form_submitted", save_editted_task);
subscribe("task_added_to_project", add_task_to_storage);
subscribe("task_created", add_task_to_storage);
subscribe("project_created", add_project_to_storage);