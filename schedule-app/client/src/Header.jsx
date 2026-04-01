function Header({ role, logout }) {
  return (
    <div className="header">

      <div className="header-left">
        📚 Расписание
      </div>

      <div className="header-right">

        <div className="role-badge">
          {role}
        </div>

        <button onClick={logout}>
          Выйти
        </button>

      </div>

    </div>
  );
}

export default Header;