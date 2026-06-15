const Footer = () => {
  const footerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '12px',
    color: 'white',
    backgroundColor:'#4A5468',
    fontStyle: 'bold',
    padding: '5px'
  }

  return (
    <div style={footerStyle}>
      <p>
        Full Stack Open 2026
      </p>
    </div>
  )
}

export default Footer