import axios from 'axios'
import { UserContext } from '../context/userContext'
import { useContext, useEffect, useState } from 'react'
const Home = () => {
  const [todos, setTodos] = useState([])
  const [inputVal, setInputVal] = useState([])
  const user = useContext(UserContext)

  useEffect(() => {
    axios
      .get('http://localhost:4000/todos', { withCredentials: true })
      .then((res) => {
        setTodos(res.data)
      })
  }, [])

  const addTodo = (e) => {
    e.preventDefault()
    axios
      .put(
        'http://localhost:4000/todos',
        { text: inputVal, done: false },
        { withCredentials: true }
      )
      .then(() => {
        setTodos([...todos, { text: inputVal, done: false }])
        setInputVal('')
      })
  }

  const updateTodo = (todo) => {
    axios
      .post(
        'http://localhost:4000/todos',
        { id: todo._id, done: !todo.done },
        { withCredentials: true }
      )
      .then(() => {
        const newTodos = todos.map((i) => {
          if (i._id === todo._id) {
            i.done = !i.done
          }
          return i
        })
        setTodos([...newTodos])
      })
  }

  if (!user.email) {
    return <div>You need to logged in to see this page</div>
  }

  return (
    <div>
      <form onSubmit={addTodo}>
        <input
          type='text'
          value={inputVal}
          placeholder='What do you want to do?'
          onChange={(e) => setInputVal(e.target.value)}
        />
      </form>
      <ul>
        {todos.map((todo) => {
          return (
            // eslint-disable-next-line react/jsx-key
            <li key={todo._id}>
              <input
                type='checkbox'
                checked={todo.done}
                onClick={() => {
                  updateTodo(todo)
                }}
              />
              {todo.done ? <del>{todo.text}</del> : todo.text}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Home
