// necessary selection for date and time and phrases
const dateContainer = document.querySelector(".date-container");
const timeContainer = document.querySelector(".time-container");
const motivationPhraseContainer = document.querySelector(".motivational-phrases");
const content1 = document.createElement("div");
const content2 = document.createElement("div");
const content3 = document.createElement("div");
dateContainer.appendChild(content1);
timeContainer.appendChild(content2);
motivationPhraseContainer.appendChild(content3);

// necessary selection for ToDo
const form = document.querySelector("#new-todo-form");
const inputTodo = document.querySelector("#todo-input");
const list = document.querySelector("#list");
const template = document.querySelector("#list-item-template");

// for local storage
// using the Prefix so that the local storage does not conflict, in order to avoid identical names
const LOCAL_STORAGE_PREFIX = "TODO_LIST";
const TODOS_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-todos`;
let todos = loadTodos();
todos.forEach(renderTodo);

// array of phrases for generator
const motivationPhraseArray = [
    "Don't count the days, take advantage of them.",
    "Don't wait. The timing will never be right.",
    "I didn't fail. I just found 10,000 ways that don't work.",
    "Hard work defeats talent when talent does not work.",
    "Do the hard work first. Easy work will take care of itself.",
    "The new strength and new thoughts come with a new day.",
    "Don't give up. The beginning is always the most difficult.",
    "Do one thing every day that you are afraid of.",
    "If the wind does not help, take up the oars.",
    "To be the best, you need to be able to cope with the worst.",
    "The bad news is that time flies. The good news is you're a pilot.",
    "Worrying is like paying a debt you don't owe.",
    "Plans are nothing, planning is everything.",
    "There is no word 'impossible' in my dictionary.",
    "It's always worth starting with something that sows doubts.",
    "Either you control your day, or the day controls you.",
    "We become what we think about."
] 
function showRandomPhrase() {
    let randomIndex = Math.floor(Math.random() * motivationPhraseArray.length);
    let randomPhrase = motivationPhraseArray[randomIndex];
    content3.innerText = randomPhrase;
    setTimeout(function(){
        showRandomPhrase()
    }, 30000);
}
showRandomPhrase();

// function for date in real time
function date() {
    let today = new Date();
    let day = addNull(today.getDate());
    let month = addNull(today.getMonth() + 1);
    let year = today.getFullYear();
    let currentDate = `${day}/${month}/${year}`;
    content1.innerHTML = currentDate;
}
date();

// function for time in real time
function time() {
    let today = new Date();
    let hours = addNull(today.getHours());
    let minutes = addNull(today.getMinutes());
    let seconds = addNull(today.getSeconds());
    let currentTime = `${hours}:${minutes}:${seconds}`;
    content2.innerHTML = currentTime;
    setTimeout(function(){
        time()
    }, 1000);
}
time();

// function for adding 0 to date and time
function addNull(number) {
    return number < 10 ? `0${number}` : number;
}

// checkboxes 
list.addEventListener("change", e => {
    // check if it checkbox
    if (!e.target.matches("[data-list-item-checkbox]")) return;
    // get the todo that is clicked on
    const parent = e.target.closest(".list-item");
    const todoId = parent.dataset.todoId;
    const todo = todos.find(t => t.id === todoId);
    todo.complete = e.target.checked;
    saveTodos();
})

// delete todo
list.addEventListener("click", e => {
    if (!e.target.matches("[data-button-delete]")) return;
    const parent = e.target.closest(".list-item");
    const todoId = parent.dataset.todoId;
    // remove todo from screen
    parent.remove();
    // remove todo from list
    todos = todos.filter(todo => todo.id !== todoId);
    // save the new todos
    saveTodos(); 
})

// add ToDos
form.addEventListener("submit", e => {
    e.preventDefault();

    const todoName = inputTodo.value;
    if (inputTodo.value === "") return; // edge case
    // for checkbox - complete or not
    const newTodo = {
        name: todoName,
        complete: false,
        //unique ID for each todo
        id: new Date().valueOf().toString()
    }
    todos.push(newTodo);
    renderTodo(newTodo);
    saveTodos();
    inputTodo.value = "";
})

// function for rendering Todos
function renderTodo(todo) {
    // copy all content inside template to "templateClone"
    const templateClone = template.content.cloneNode(true);
    // to have an ID of each one from Todos being saved
    const listItem = templateClone.querySelector(".list-item");
    listItem.dataset.todoId = todo.id;
    // getting span from clone
    const textElement = templateClone.querySelector("[data-list-item-text]");
    // adding the entered text in span
    textElement.innerText = todo.name;
    // for checkbox to render it completed or not
    const checkbox = templateClone.querySelector("[data-list-item-checkbox]");
    checkbox.checked = todo.complete;
    // adding to list
    list.appendChild(templateClone);
}

// function for saving todos
function saveTodos() {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
}

// function for loading todos
function loadTodos() {
    const stringTodos = localStorage.getItem(TODOS_STORAGE_KEY); // todos in string format
    // converting string into array
    return JSON.parse(stringTodos) || [];
}