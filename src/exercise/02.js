// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js
 
import * as React from 'react'


function useCustomHook(key, initialVal = '') {
  key = JSON.stringify(key);
  const [state, setState] = React.useState( () => window.localStorage.getItem(key) || initialVal );

  React.useEffect(() => {
    console.log('useEffect!')
    window.localStorage.setItem(key, state)
  }, [key, state])

  function handleChange(event) {
    console.log(typeof JSON.parse(event.target.value))
    setState()
  }

  return {state, handleChange};

}

function Greeting({initialName}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') ?? initialName
  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)
  const [count, setCount] = React.useState(0);
  const obj = useCustomHook(initialName);
  // const [name, setName] = React.useState( () => window.localStorage.getItem('name') || initialName );

  // React.useEffect(() => {
  //   console.log('useEffect!')
  //   window.localStorage.setItem('name', name)
  // }, [name])
  // function handleChange(event) {
  //   setName(event.target.value)
  // }

  
  return (
    <div>
      <button
        onClick={() => { setCount(count => count + 1) }}>
        {count}
      </button>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={obj.name} onChange={obj.handleChange} id="name" />
      </form>
      {obj.name ? <strong>Hello {obj.name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
