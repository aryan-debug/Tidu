import { publish, subscribe } from "./pubsub";
import { create_element_with_class, map_priority, format_date, clear_content } from "./helpers";
import { Task } from "./task";
import { Project } from "./project";
import { add_project_to_storage, get_project, get_projects_from_storage, get_tasks_from_project, remove_task_from_storage } from "./storage";

const moment = require('moment');
export let current_project = null;
export class Task_handler {
    display_task(data) {
        const task_card = create_element_with_class("div", ["card", map_priority(data._priority)]);
        const card_top = create_element_with_class("div", ["card-top"]);
        const card_body = create_element_with_class("div", ["card-body"]);
        const description = create_element_with_class("div", ["description"]);
        const due_time = create_element_with_class("div", ["due-time"]);
        const done_btn = create_element_with_class("div", ["done-btn"]);
        const setting_icon = create_element_with_class("i", ["fas", "fa-cog", "setting-icon"]);
        const pen_icon = create_element_with_class("i", ["fas", "fa-pen"]);
        const clock_icon = create_element_with_class("i", ["fas", "fa-clock"]);
        const title = document.createElement("h2");
        const desc_text = document.createTextNode(data._description);
        const time_text = document.createTextNode(format_date(data._due_date));
        done_btn.addEventListener("click", () => publish("done_btn_clicked", data._id));
        setting_icon.addEventListener("click", () => { publish("edit_task_btn_clicked", data._id); });
        due_time.append(clock_icon)
        due_time.append(time_text);
        task_card.setAttribute("data-id", data._id);
        title.textContent = data._title;
        description.append(pen_icon);
        description.append(desc_text);
        done_btn.textContent = "Done";
        card_top.append(title, setting_icon);
        card_body.append(description, due_time);
        task_card.append(card_top, card_body, done_btn);
        content_container.append(task_card);
    }
    handle_done_btn(id) {
        remove_task_from_storage(id);
    }
}
export class Project_handler {
    show_project() {
        clear_content();
        const projects = get_projects_from_storage();
        for (let i = 0; i < projects.length; i++){
            project_handler.create_project_dom(projects[i])
        }
    }
    create_project_dom(data) {
        const project_card = create_element_with_class("div", ["card", "blue"]);
        const card_top = create_element_with_class("div", ["card-top"]);
        const card_body = create_element_with_class("div", ["card-body"]);
        const description = create_element_with_class("div", ["description"]);
        const due_time = create_element_with_class("div", ["due-time"]);
        const open_btn = create_element_with_class("div", ["done-btn"]);
        const setting_icon = create_element_with_class("i", ["fas", "fa-cog", "setting-icon"]);
        const pen_icon = create_element_with_class("i", ["fas", "fa-pen"]);
        const clock_icon = create_element_with_class("i", ["fas", "fa-clock"]);
        const title = document.createElement("h2");
        const desc_text = document.createTextNode(data._description);
        const time_text = document.createTextNode(format_date(data._due_date));
        open_btn.addEventListener("click", () => { current_project = get_project(data._id); publish("show_project_tasks") });
        project_card.setAttribute("data-id", data._id);
        title.textContent = data._title;
        open_btn.textContent = "Open"
        due_time.append(clock_icon)
        due_time.append(time_text)
        description.append(pen_icon);
        description.append(desc_text);;
        card_top.append(title, setting_icon);
        card_body.append(description, due_time);
        project_card.append(card_top, card_body, open_btn);
        content_container.append(project_card);
    }
    show_tasks() {
        //
        clear_content();
        const tasks = get_tasks_from_project(current_project._id);
        if (tasks) {
            for (let i = 0; i < tasks.length; i++) {
                task_handler.display_task(tasks[i])
            }
        }   

    }
    show_week_tasks() {
        clear_content();
        const tasks = get_tasks_from_project(current_project._id);
        if (tasks) {
            for (let i = 0; i < tasks.length; i++) {
                if (moment(new Date(tasks[i]._due_date)) < moment().add(7, "d")) {
                    task_handler.display_task(tasks[i]);
                }
            }
        }
    }
    show_month_tasks() {
        clear_content();
        const tasks = get_tasks_from_project(current_project._id);
        if (tasks) {
            for (let i = 0; i < tasks.length; i++) {
                if (moment(new Date(tasks[i]._due_date)) < moment().add(1, "M")) {
                    task_handler.display_task(tasks[i]);
                }
            }
        }
    }

}
const task_handler = new Task_handler();
const project_handler = new Project_handler();
const content_container = document.getElementById("content");
subscribe("added_task_to_storage", project_handler.show_tasks);
subscribe("today_btn_clicked", () => { current_project = get_project(0); project_handler.show_tasks() });
subscribe("week_btn_clicked", () => { current_project = get_project(0); project_handler.show_week_tasks() });
subscribe("month_btn_clicked", () => { current_project = get_project(0); project_handler.show_month_tasks() })
subscribe("project_btn_clicked", project_handler.show_project);
subscribe("project_created", project_handler.create_project_dom);
subscribe("show_project_tasks", project_handler.show_tasks);
subscribe("done_btn_clicked", task_handler.handle_done_btn)
subscribe("task_removed", project_handler.show_tasks);
subscribe("task_editted", project_handler.show_tasks);

function create_default_project() {
    const default_project = new Project("default", null, null);
    default_project._id = 0;
    current_project = default_project;
    if (!get_project(0)) {
        const study_task = new Task (1, "Study", "prepare for chemistry test", "17:10 22 Feb. 2022", 0);
        const play_task = new Task(2, "Play", "Go outside and play Volleyball.", "20:30 22 Feb. 2022", 1);
        const program_task = new Task(3, "Program", "Work on TOP", "22:40 22 Feb. 2022", 2);
        default_project.add_task(study_task);
        default_project.add_task(play_task);
        default_project.add_task(program_task);
        add_project_to_storage(default_project);
    }
    project_handler.show_tasks();
}
create_default_project();