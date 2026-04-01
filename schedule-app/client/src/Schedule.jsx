function Schedule({
  schedule,
  role,
  filterGroup,
  setEditingLesson,
  setShowEdit,
  setDeleteId,
  setShowDeleteModal
}) {
  return (
    <table className="schedule-table">

      <thead>
        <tr>
          <th>Дисциплина</th>
          <th>Преподаватель</th>
          <th>Аудитория</th>
          <th>Группа</th>
          <th>День</th>
          <th>Время</th>
          {role==="admin" && <th>Действие</th>}
        </tr>
      </thead>

      <tbody>
        {schedule
          .filter(l=> !filterGroup || l.group_name === filterGroup)
          .map(l=>(
            <tr key={l.id}>
              <td>{l.subject}</td>
              <td>{l.teacher}</td>
              <td>{l.room}</td>
              <td>{l.group_name}</td>
              <td>{l.day}</td>
              <td>{l.time}</td>

              {role==="admin" && (
                <td>

                  <button
                    className="edit-btn"
                    onClick={()=>{
                      setEditingLesson(l);
                      setShowEdit(true);
                    }}
                  >
                    Редактировать
                  </button>

                  <button
                    className="delete-btn"
                    onClick={()=>{
                      setDeleteId(l.id);
                      setShowDeleteModal(true);
                    }}
                  >
                    Удалить
                  </button>

                </td>
              )}

            </tr>
        ))}
      </tbody>

    </table>
  );
}

export default Schedule;