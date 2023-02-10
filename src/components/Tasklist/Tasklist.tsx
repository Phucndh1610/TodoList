import React from 'react'
import { Todo } from '../@types/todo.types'
import style from './tasklist.module.scss'

interface taskListProps {
  doneTaskList?: boolean
  todos: Todo[]
  handleDoneTodo: (id: string, done: boolean) => void
  findIndexTodo: (id: string) => void
  deleteTodo: (id: string) => void
}

export default function TaskList(props: taskListProps) {
  const { doneTaskList, todos, handleDoneTodo, findIndexTodo, deleteTodo } = props
  // currying
  const onChangeCheckbox = (idTodo: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    handleDoneTodo(idTodo, event.target.checked)
  }
  return (
    <div>
      <h2 className={style.title}>{doneTaskList ? `Done` : `Not Done`}</h2>
      <div className={style.tasks}>
        {todos.map((todo) => (
          <div className={style.task} key={todo.id}>
            <input
              type='checkbox'
              className={style.taskCheckBox}
              checked={todo.done}
              onChange={onChangeCheckbox(todo.id)}
            />
            <span className={`${style.taskName} ${todo.done ? style.taskNameDone : ''}`}>{todo.name}</span>
            <div className={style.taskActions}>
              <button className={style.taskBtn} onClick={() => findIndexTodo(todo.id)}>
                ✏
              </button>
              <button className={style.taskBtn} onClick={() => deleteTodo(todo.id)}>
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
