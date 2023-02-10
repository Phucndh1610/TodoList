import { useEffect, useState } from 'react'
import TaskInput from '../TaskInput'
import TaskList from '../Tasklist'
import style from './todoList.module.scss'
import { Todo } from '../@types/todo.types'

interface HandleNewTodos {
  (todos: Todo[]): Todo[]
}

const syncReactLocal = (handleNewTodos: HandleNewTodos) => {
  const todosString = localStorage.getItem('todos')
  const todosObj: Todo[] = JSON.parse(todosString || '[]')
  const newTodosObj = handleNewTodos(todosObj)
  localStorage.setItem('todos', JSON.stringify(newTodosObj))
}

export default function TodoList() {
  const [toDos, setToDos] = useState<Todo[]>([])
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null)
  const doneTodos = toDos.filter((todo) => todo.done)
  const notDoneTodos = toDos.filter((todo) => !todo.done)

  useEffect(() => {
    const todosString = localStorage.getItem('todos')
    const todosObj: Todo[] = JSON.parse(todosString || '[]')
    setToDos(todosObj)
  }, [])

  const addTodo = (name: string) => {
    const todo: Todo = {
      name,
      done: false,
      id: new Date().toISOString()
    }
    setToDos((prev) => [...prev, todo])
    syncReactLocal((todosObj: Todo[]) => [...todosObj, todo])
  }

  const handleDoneTodo = (id: string, done: boolean) => {
    setToDos((prev) => {
      return prev.map((todo) => {
        if (todo.id === id) {
          return { ...todo, done }
        }
        return todo
      })
    })
  }

  const findIndexTodo = (id: string) => {
    const findIndex = toDos.find((todo) => todo.id === id)
    if (findIndex) {
      setCurrentTodo(findIndex)
    }
  }

  const editTodo = (name: string) => {
    setCurrentTodo((prev) => {
      if (prev) return { ...prev, name }
      return null
    })
  }

  const finishEditTodo = () => {
    const handler = (todoObj: Todo[]) => {
      return todoObj.map((todo) => {
        if (todo.id === (currentTodo as Todo).id) {
          return currentTodo as Todo
        }
        return todo
      })
    }
    setToDos(handler)
    setCurrentTodo(null)
    syncReactLocal(handler)
  }

  const deleteTodo = (id: string) => {
    if (currentTodo) {
      setCurrentTodo(null)
    }
    const handle = (todoObj: Todo[]) => {
      const findIndexTodo = todoObj.findIndex((todo) => todo.id === id)
      if (findIndexTodo > -1) {
        const result = [...todoObj]
        result.splice(findIndexTodo, 1)
        return result
      }
      return todoObj
    }
    setToDos(handle)
    syncReactLocal(handle)
  }

  return (
    <div className={style.todoList}>
      <div className={style.container}>
        <TaskInput addTodo={addTodo} currentTodo={currentTodo} editTodo={editTodo} finishEditTodo={finishEditTodo} />
        <TaskList
          doneTaskList={false}
          todos={notDoneTodos}
          handleDoneTodo={handleDoneTodo}
          findIndexTodo={findIndexTodo}
          deleteTodo={deleteTodo}
        />
        <TaskList
          doneTaskList={true}
          todos={doneTodos}
          handleDoneTodo={handleDoneTodo}
          findIndexTodo={findIndexTodo}
          deleteTodo={deleteTodo}
        />
      </div>
    </div>
  )
}
