
// import { response } from "express";
import { Task } from './Task.js';

class Todos {
    #tasks = []
    #backend_url = ''

    constructor(url) {
        this.#backend_url = url
    }

    getTasks = () => {
        return new Promise(async (resolve, reject) => {
            fetch(this.#backend_url)
            .then((response) => response.json())
            .then((json) => {
                console.log('Tasks received from backend:', json)
                this.#readJson(json)
                resolve(this.#tasks)
            }, (error) => {
                console.log(error)
                reject(error)
            })
        })
    }

    addTask = (text) => {
        return new Promise(async(resolve, reject) => {
            const json = JSON.stringify({description: text})

            fetch(this.#backend_url + '/new', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: json
            })
            .then((response) => response.json())
            .then((json) => {
                resolve(this.#addToArray(json.id, text))}, 
                (error) => {
                reject(error)
            })
        })
           
    }

    removeTask = (id) => {
        return new Promise(async(resolve, reject) => {
            const cleanUrl = this.#backend_url.replace(/\/$/, '');
            console.log(`Deleting task at: ${cleanUrl}/delete/${id}`);
    
            fetch(`${cleanUrl}/delete/${id}`, {
                method: 'DELETE'
            })
            .then((response) => response.json())
            .then((json) => {
                this.#removeFromArray(id)
                resolve(json.id)
            }, (error) => {
                reject(error)
            })
        })
    }

    #readJson = (tasksAsJson) => {
        console.log('Data from backend:', tasksAsJson)

        if (!Array.isArray(tasksAsJson)) {
            throw new Error('Expected an array but got:' + JSON.stringify(tasksAsJson))
        }
        tasksAsJson.forEach(node => {
            const task = new Task(node.id, node.description)
            this.#tasks.push(task)  
        })
    }

    #addToArray = (id, text) => {
        const task = new Task(id, text)
        this.#tasks.push(task)
        return task
    }

    #removeFromArray = (id) => {
        const arrayTasksToDo = this.#tasks.filter(task => task.id !== id)
        this.#tasks = arrayTasksToDo
    }
}
    

export { Todos }






