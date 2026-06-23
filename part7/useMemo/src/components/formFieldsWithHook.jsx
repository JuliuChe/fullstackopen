import { useField } from '../hooks/useField'

const FormFieldsWithHook  = () => {
  const nameField = useField('text')
  const bornField = useField('date')
  const heightField = useField('number')
  
  

  return (
    <div>
      <form>
        name: 
        <input {...nameField} /> 
        <br/> 
        birthdate:
        <input {...bornField}/> 
        <br /> 
        height:
        <input
          type={heightField.type}
          value={heightField.value}
          onChange={heightField.onChange} 
        />
      </form>
      <div>
        {nameField.value} {bornField.value} {heightField.value} 
      </div>
    </div>
  )
}

export default FormFieldsWithHook