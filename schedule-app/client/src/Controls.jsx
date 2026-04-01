function Controls({
  filterGroup,
  setFilterGroup,
  role,
  setShowCreate
}) {
  return (
    <div className="controls">

      <input
        placeholder="Фильтр по группе"
        value={filterGroup}
        onChange={e=>setFilterGroup(e.target.value)}
      />

      {role==="admin" && (
        <button onClick={()=>setShowCreate(true)}>
          Создать занятие
        </button>
      )}

    </div>
  );
}

export default Controls;