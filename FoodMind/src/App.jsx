import { useState } from 'react'
import './App.css'
import Body from './components/Body'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Body></Body>
    </>
  )
}

export default App
