const menuButton = document.querySelector('.header__menu')
const modalCloseButton = document.querySelector('.modal__close')
const modalWindow = document.querySelector('.modal')

const taskListContainer = document.querySelector('.todolist__tasks')
const taskInput = document.querySelector('.modal__input')
const addTaskButton = document.querySelector('.modal__button')
const clearListButton = document.querySelector('.footer__clearlist')
const modalForm = document.querySelector('.modal__form')
const clearCompleteTaskButton = document.querySelector('.footer__cleartasks')

const allTasksButton = document.querySelector('.item-all')
const activeTasksButton = document.querySelector('.item-active')
const completedTasksButton = document.querySelector('.item-complete')

const localStorageTaskKey = 'tasks.list'
const localStorageSelectedTaskIdKey = 'tasks.selectedListId'

let tasksList = JSON.parse(localStorage.getItem(localStorageTaskKey)) || []
let selectedTaskId = localStorage.getItem(localStorageSelectedTaskIdKey)


taskListContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedTask = tasksList.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
    }
})

modalForm.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = taskInput.value
    if (taskName == null || taskName.trim().length === 0 ) return
    const task = createTask(taskName)
    taskInput.value = ''
    tasksList.push(task)
    save()
    render(tasksList)
})

function createTask(name) {
    return {
        id: Date.now().toString(),
        name: name,
        complete: false
    }
}

function render(tasksList) {
    clearElement(taskListContainer)
    tasksList.forEach((task, index) => {
        const taskItem = document.createElement('li')
        taskItem.dataset.listId = task.id
        taskItem.classList.add('task')
        taskItem.innerHTML = `<div class="task__check">
        <input type="checkbox" class="task__checkbox" />
        <p class="task__text">${task.name}</p></div>
        <span class="task__delete" onclick="removeTask(${index})">&cross;</span>`
        const checkbox = taskItem.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        taskListContainer.appendChild(taskItem)
     })
}

function save() {
    localStorage.setItem(localStorageTaskKey, JSON.stringify(tasksList))
    localStorage.setItem(localStorageSelectedTaskIdKey, selectedTaskId)
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

render(tasksList)

function toggleComplete(element) {
    if (!element.checked) {
        element.parentElement.classList.remove('complete')
    } else {
        element.parentElement.classList.add('complete')
    }
}

taskListContainer.addEventListener('change', event => {
    if (event.target.tagName.toLowerCase() === 'input' && event.target.type === 'checkbox') {
        toggleComplete(event.target)
    }
})

menuButton.addEventListener('click', () => {
    modalWindow.classList.add('modal-active')
})

modalCloseButton.addEventListener('click', () => {
    modalWindow.classList.remove('modal-active')
})

clearCompleteTaskButton.addEventListener('click', e => {
    tasksList = tasksList.filter(task => !task.complete)
    save()
    render(tasksList)
})


clearListButton.addEventListener('click', e => {
    clearElement(taskListContainer)
    tasksList = []
    save()
    render(tasksList)
})

function removeTask(index) {
    tasksList.splice(index, 1)
    save()
    render(tasksList)
}


allTasksButton.addEventListener('click', () => {
    clearElement(taskListContainer)
    save()
    render(tasksList)
})

activeTasksButton.addEventListener('click', () => {
    clearElement(taskListContainer)
    const activeList = tasksList.filter(task => !task.complete)
    save()
    render(activeList)
})

completedTasksButton.addEventListener('click', () => {
    clearElement(taskListContainer)
    const completeList = tasksList.filter(task => task.complete)
    save()
    render(completeList)
})