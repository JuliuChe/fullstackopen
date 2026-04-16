import { useState, useImperativeHandle  } from 'react'

const Toggable = ({ buttonLabel, children, ref }) => {
  const [visible, setLoginVisible] = useState(false)

  const hideWhenVisible = { display:visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setLoginVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{ buttonLabel }</button>
      </div>
      <div style={showWhenVisible}>
        { children }
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

export default Toggable