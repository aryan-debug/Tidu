import { publish, subscribe } from "./pubsub";

let current_tab = "today";

export function close_overlay() {
    const form = document.querySelector(".modal-content.inactive.active");
    form.classList.add("inactive");
    form.classList.remove("active");
    overlay.className = "";
}
function handle_add_btn() {
    display_form(tab_to_form[current_tab]);
}
function display_form(form) {
    form.style.display = "flex";
    form.parentNode.classList.add("active");
    overlay.className = "active";
}

function change_tab(data) {
    const btn_clicked = data[0];
    const tab = data[1];
    const active_tab = document.querySelector(".tab-active");
    const heading = document.getElementById("heading");
    active_tab.classList.remove("tab-active");
    btn_clicked.target.classList.add("tab-active");
    heading.textContent = tab_to_heading[tab];
    current_tab = tab;
    publish(`${tab}_btn_clicked`);
}
const add_task_form = document.getElementById("add-task-form");
const add_project_form = document.getElementById("add-project-form");
const edit_task_form = document.getElementById("edit-task-form");
const add_btn = document.getElementById("add-btn");
const overlay = document.getElementById("overlay");
const project_btn = document.getElementById("project-btn");
const today_btn = document.getElementById("today-btn");
const week_btn = document.getElementById("week-btn");
const month_btn = document.getElementById("month-btn");
project_btn.addEventListener("click", (evt) => { publish("sidebar_btn_clicked", [evt, "project"]) });
today_btn.addEventListener("click", (evt) => { publish("sidebar_btn_clicked", [evt, "today"]) });
week_btn.addEventListener("click", (evt) => { publish("sidebar_btn_clicked", [evt, "week"]) });
month_btn.addEventListener("click", (evt) => { publish("sidebar_btn_clicked", [evt, "month"]) });
add_btn.addEventListener("click", handle_add_btn);
overlay.addEventListener("click",() => close_overlay(tab_to_form[current_tab]));
const tab_to_form = {
    "today": add_task_form,
    "project": add_project_form,
    "week": add_task_form,
    "month":add_task_form,
    "tasks_in_project": add_task_form,
    "edit":edit_task_form
}
const tab_to_heading = {
    "today": "Today",
    "week": "Week",
    "month":"Month",
    "project": "Projects",
};
subscribe("show_project_tasks", () => { current_tab = "tasks_in_project" })
subscribe("sidebar_btn_clicked", change_tab);
subscribe("edit_task_btn_clicked", () => { display_form(tab_to_form["edit"])});