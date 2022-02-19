import { format } from "date-fns";
import { get_project } from "./storage";
import { current_project } from "./dom_handler";

export function create_element_with_class(element, classes) {
    const ele = document.createElement(element);
    ele.classList.add(...classes)
    return ele;
}
export function map_priority(priority) {
    const map = { 0: "red", 1: "yellow", 2: "green" };
    return map[priority]
}

export function format_date(date) {
    return format(new Date(date), "H:mm dd LLL. uuuu");
}
export function clear_content(){
    const tasks = document.getElementById("content");
    tasks.innerHTML = "";
}
export function serialize_task(task) {
    return {"_id":task.id, "_title": task.title, "_description": task.description, "_due_date": task.due_date, "_priority": task.priority };
}
export function deserialize_task(json) {
    return [json["_title"], json["_description"], json["_due_date"], json["_priority"]];
}
export function get_unique_id() {
    let max = 0;
    const tasks = get_project(current_project._id)._tasks;
    for (const task in tasks) {
        if (parseInt(tasks[task]._id) > max) {
            max = parseInt(tasks[task]._id);
        }
    }
    return max;
}