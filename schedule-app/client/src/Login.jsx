function Login({
  setEmail,
  setPassword,
  handleLogin,
  showRegister,
  setShowRegister,
  handleRegister,
  setFirstName,
  setLastName,
  setMiddleName,
  registerError
}) {
  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">📚</div>

        <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />

        <div className="login-buttons">
          <button onClick={handleLogin}>Вход</button>
          <button onClick={()=>setShowRegister(true)}>Регистрация</button>
        </div>

        {showRegister && (
          <div className="modal">
            <div className="modal-content">

              <h3>Регистрация</h3>

              <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
              <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />

              <input placeholder="Имя" onChange={e=>setFirstName(e.target.value)} />
              <input placeholder="Фамилия" onChange={e=>setLastName(e.target.value)} />
              <input placeholder="Отчество" onChange={e=>setMiddleName(e.target.value)} />

              {registerError && <p style={{color:"red"}}>{registerError}</p>}

              <div className="modal-buttons">
                <button onClick={handleRegister}>Зарегистрироваться</button>
                <button onClick={()=>setShowRegister(false)}>Назад</button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Login;