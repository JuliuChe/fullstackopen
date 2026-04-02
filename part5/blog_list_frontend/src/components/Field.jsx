
const Field = ({ name, value, onChange }) => {
  if (name === null) {
    return null
  }

  return (
      <div>
        <label>
        {name}
          <input
          type={name}
          value={value}
          onChange={onChange}
          />
        </label>
      </div>
  )
}

export default Field