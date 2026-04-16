
const Field = ({ name, value, type='text', onChange }) => {
  if (name === null) {
    return null
  }

  return (
    <div>
      <label>
        {name}
        <input
          type={type}
          value={value}
          onChange={onChange}
        />
      </label>
    </div>
  )
}

export default Field