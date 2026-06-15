const Navbar = () => {
  const footerStyle = {
    color: 'white',
    backgroundColor: '#4A5468',
    marginTop: '2px',
    paddingLeft:'24px',
    paddingTop: '8px',
    paddingBottom: '8px'
  }

    const titleStyle = {
    margin: 0   // ← supprime la marge par défaut du navigateur
  }

  return (
    <div style={footerStyle}>
      <h2 style={titleStyle}>
        counter app
      </h2>
    </div>
  )
}

export default Navbar