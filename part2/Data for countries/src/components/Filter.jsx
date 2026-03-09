const Filter = ({filter, handler}) => {
  return <div>find countries :<input value={filter} onChange={handler}/></div>
}

export default Filter