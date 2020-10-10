// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React from 'react'

export function useLocalStorage({
  key,
  initialValue,
}, {
  serialize = JSON.stringify,
  deserialize = JSON.parse,
} = {}) {
  const [value, setValue] = React.useState(() => {
    console.log('GET LS', key)
    const valueFromLS = window.localStorage.getItem(key)
    if (valueFromLS) {
      return deserialize(valueFromLS)
    }
    return typeof initialValue === 'function'
      ? initialValue()
      : initialValue
  })

  // save key
  // if key changes, remove previous key and save
  // our stuff on the new key
  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key

    console.log('SET value', value)
    window.localStorage.setItem(key, serialize(value))
  }, [key, value, serialize])

  return [value, setValue]
}

function Greeting({initialName = ''}) {
  const [count, setCount] = React.useState(0)
  const [name, setName] = useLocalStorage({
    key: 'name',
    initialValue: initialName,
  })

  function handleChange(event) {
    setName(event.target.value)
  }

  function handleClick(event) {
    setCount(count+1)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      <button onClick={handleClick}>{count}</button>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="" />
}

export default App
