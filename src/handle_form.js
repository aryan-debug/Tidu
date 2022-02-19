import { publish, subscribe } from "./pubsub";
import { close_overlay } from "./events";
import { get_unique_id } from "./helpers";
import { get_tasks_from_project, get_task_from_current_project } from "./storage";

function handle_add_form(e) {
    e.preventDefault();
    const elements = add_form.elements;
    const title = elements[0].value;
    const desc = elements[1].value;
    const due_date = elements[2].value;
    let priority = -1;
    for (let i = 3; i < 6; i++) {
        if (elements[i].checked) {
            priority = i - 3;
        }
    }
    close_overlay();
    publish("add_form_submitted", [get_unique_id() + 1, title, desc, due_date, priority]);
}
function handle_create_new_project_form(e) {
    e.preventDefault();
    const elements = add_project_form.elements;
    const title = elements[0].value;
    const desc = elements[1].value;
    const due_date = elements[2].value;
    close_overlay();
    publish("add_project_form_submitted", [title, desc, due_date]);
}
function fill_placeholder(data) {
    const form_data = Object.values(get_task_from_current_project(data)).splice(1);
    const form_elements = edit_task_form.elements;
    for (let i = 0; i < form_elements.length; i++){
        form_elements[i].placeholder = form_data[i];
    };
    form_elements[3 + form_data[form_data.length - 1]].checked = true;
}
function handle_edit_task_form(evt, task_id) {
    evt.preventDefault();
    let old_data = Object.values(get_task_from_current_project(task_id));
    const form_elements = edit_task_form.elements;
    for (let i = 1; i < old_data.length - 1; i++){
        if (form_elements[i - 1].value) {
            old_data[i] = form_elements[i - 1].value;
        }
    }
    let priority = -1;
    for (let i = 3; i < 6; i++) {
        if (form_elements[i].checked) {
            priority = i - 3;
        }
    }
    old_data[old_data.length - 1] = priority;
    publish("edit_form_submitted", old_data);
    close_overlay();
}
const add_form = document.getElementById("add-task-form")
const add_project_form = document.getElementById("add-project-form")
const edit_task_form = document.getElementById("edit-task-form");
add_form.addEventListener("submit", handle_add_form);
add_project_form.addEventListener("submit", handle_create_new_project_form);
subscribe("edit_task_btn_clicked", (data) => {
    fill_placeholder(data);
    edit_task_form.addEventListener("submit", (evt) => { handle_edit_task_form(evt, data) })
});