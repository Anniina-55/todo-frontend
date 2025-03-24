//const BACKEND_ROOT_URL = 'http://localhost:3002';
const BACKEND_ROOT_URL = 'https://todo-backend-yg1e.onrender.com'
import { Todos } from "./Class/Todos.js"


const todos = new Todos(BACKEND_ROOT_URL)

const input = document.querySelector('input'); 
const taskList = document.querySelector('ul');

input.disabled = false;


const getTasks = () => {
    todos.getTasks().then((tasks) => {
        console.log('Your current tasks:', tasks)
        input.disabled = false
        tasks.forEach(task => {
            renderTask(task)
        })
    }).catch((error) => {
        alert(error)
    })

}

const renderTask = (task) => {
    const li = document.createElement('li')
    li.setAttribute('class', 'list-group-item')
    li.setAttribute('data-key', task.getId().toString())
    //li.innerHTML = task.getText()
    renderSpan(li, task.getText())
    renderLink(li, task.getId())
    taskList.append(li)
}

const renderSpan = (taskList, text) => {
    const span = taskList.appendChild(document.createElement('span'))
    span.innerHTML = text
}

const renderLink = (taskList, id) => {
    const a = taskList.appendChild(document.createElement('a'))
    a.innerHTML = '<i class="bi bi-trash"></i>'
    a.setAttribute('style', 'float: right; cursor: pointer')
    
    a.addEventListener('click', (event) => {
        todos.removeTask(id).then((removed_id) => {
            const taskToRemove = document.querySelector(`[data-key='${removed_id}']`)
            console.log(taskToRemove)
            if (taskToRemove) {
                taskToRemove.remove()
                //this only removes after page refresh:
                // taskList.removeChild(taskToRemove)
            }
        }).catch((error) => {
            alert(error)
        })
    })
}

/*const saveTask = async (task) => {
    try {
        const json = JSON.stringify({description: task})
        const response = await fetch(BACKEND_ROOT_URL + '/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json
        })
        if (!response.ok) {
            return response.json()
        }    
    } catch (error) {
        alert("Error saving task " + error.message)
        }
}
*/

input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        console.log("enter pressed")
        event.preventDefault()
        const task = input.value.trim()
    
        if (task !== '') {
            todos.addTask(task).then((task) => {
                renderTask(task)
                input.value = ''
                input.focus()
            }).catch(error => console.log('error in addTask', error))
        }
    }
});

getTasks()

