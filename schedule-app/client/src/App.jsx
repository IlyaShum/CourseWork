import "./App.css";
import Login from "./Login";
import Schedule from "./Schedule";
import Header from "./Header";
import Controls from "./Controls";
import { useState, useEffect } from "react";

function App(){

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const [schedule,setSchedule] = useState([]);

const [subjects,setSubjects] = useState([]);
const [teachers,setTeachers] = useState([]);
const [groups,setGroups] = useState([]);
const [rooms,setRooms] = useState([]);

const [subjectId,setSubjectId] = useState("");
const [teacherId,setTeacherId] = useState("");
const [groupId,setGroupId] = useState("");
const [roomId,setRoomId] = useState("");

const [day,setDay] = useState("");
const [time,setTime] = useState("");

const [filterGroup,setFilterGroup] = useState("");

const [loggedIn,setLoggedIn] = useState(false);
const [role,setRole] = useState(null);

const [showCreate,setShowCreate] = useState(false);
const [showEdit,setShowEdit] = useState(false);
const [editingLesson,setEditingLesson] = useState(null);
const [editError,setEditError] = useState("");

const [deleteId, setDeleteId] = useState(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);

const [showRegister,setShowRegister] = useState(false);

const [firstName,setFirstName] = useState("");
const [lastName,setLastName] = useState("");
const [middleName,setMiddleName] = useState("");

const [registerError,setRegisterError] = useState("");
const [createError,setCreateError] = useState("");

// LOGIN

const handleLogin = async()=>{

const res = await fetch("http://localhost:5000/auth/login",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body: JSON.stringify({email,password})
});

const data = await res.json();

if(data.token){

const userRole = data.user?.role || "student";

localStorage.setItem("token",data.token);
localStorage.setItem("role",userRole);

setLoggedIn(true);
setRole(userRole);

loadSchedule();
loadDictionaries();
}
};

// REGISTER

const handleRegister = async()=>{

if(!email || !password || !firstName || !lastName || !middleName){
setRegisterError("Пожалуйста заполните все поля");
return;
}

setRegisterError("");

await fetch("http://localhost:5000/auth/register",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body: JSON.stringify({email,password})
});

alert("Пользователь успешно зарегистрирован");

setShowRegister(false);

};

// LOAD DATA

const loadSchedule = async()=>{

const token = localStorage.getItem("token");

const res = await fetch("http://localhost:5000/schedule",{
headers:{ Authorization:`Bearer ${token}` }
});

const data = await res.json();

setSchedule(Array.isArray(data) ? data : []);
};

const loadDictionaries = async()=>{

const s = await fetch("http://localhost:5000/dictionary/subjects");
const t = await fetch("http://localhost:5000/dictionary/teachers");
const g = await fetch("http://localhost:5000/dictionary/groups");
const r = await fetch("http://localhost:5000/dictionary/rooms");

setSubjects(await s.json());
setTeachers(await t.json());
setGroups(await g.json());
setRooms(await r.json());

};

// CREATE LESSON

const createLesson = async()=>{

if(!subjectId || !teacherId || !groupId || !roomId || !day || !time){
setCreateError("Все поля должны быть заполнены");
return;
}

const validDays = [
"Понедельник",
"Вторник",
"Пятница",
"Среда",
"Четверг",
"Суббота",
"понедельник",
"вторник",
"пятница",
"среда",
"четверг",
"суббота"
];

if(!validDays.includes(day)){
setCreateError("Неверно указан день");
return;
}

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

if(!timeRegex.test(time)){
setCreateError("Неверно указано время");
return;
}

const conflict = schedule.find(l =>
l.day === day &&
l.time === time &&
(
Number(l.teacher_id) === Number(teacherId) ||
Number(l.room_id) === Number(roomId) ||
Number(l.group_id) === Number(groupId)
)
);

if(conflict){

if(Number(conflict.teacher_id) === Number(teacherId)){
setCreateError("У преподавателя в это время уже проходит занятие");
return;
}

if(Number(conflict.room_id) === Number(roomId)){
setCreateError("В данный момент аудитория уже занято");
return;
}

if(Number(conflict.group_id) === Number(groupId)){
setCreateError("У группы уже запланирован урок на данный момент");
return;
}

}

setCreateError("");

const token = localStorage.getItem("token");

await fetch("http://localhost:5000/schedule",{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body: JSON.stringify({
subject_id:subjectId,
teacher_id:teacherId,
room_id:roomId,
group_id:groupId,
day,
time
})
});

setShowCreate(false);
loadSchedule();
};

// UPDATE LESSON

const updateLesson = async()=>{
setEditError("");
const newDay = day || editingLesson.day;
const newTime = time || editingLesson.time;

const validDays = [
"Понедельник",
"Вторник",
"Среда",
"Четверг",
"Пятница",
"Суббота",
"понедельник",
"вторник",
"среда",
"четверг",
"пятница",
"суббота"
];

if(!validDays.includes(newDay)){
setEditError("Неверно указан день недели");
return;
}

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

if(!timeRegex.test(newTime)){
setEditError("Время должно быть в формате HH:MM");
return;
}

const token = localStorage.getItem("token");

await fetch(`http://localhost:5000/schedule/${editingLesson.id}`,{
method:"PUT",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body: JSON.stringify({
subject_id:subjectId || editingLesson.subject_id,
teacher_id:teacherId || editingLesson.teacher_id,
room_id:roomId || editingLesson.room_id,
group_id:groupId || editingLesson.group_id,
day:newDay,
time:newTime
})
});

setShowEdit(false);
setEditingLesson(null);

loadSchedule();
};

// DELETE

const deleteLesson = async ()=>{

const token = localStorage.getItem("token");

await fetch(`http://localhost:5000/schedule/${deleteId}`,{
method:"DELETE",
headers:{ Authorization:`Bearer ${token}` }
});

setShowDeleteModal(false);
setDeleteId(null);

loadSchedule();

};

const logout = ()=>{
localStorage.clear();
setLoggedIn(false);
};

useEffect(()=>{

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if(token){
setLoggedIn(true);
setRole(role);
loadSchedule();
loadDictionaries();
}

},[]);


// LOGIN PAGE

if(!loggedIn){
  return (
    <Login
      setEmail={setEmail}
      setPassword={setPassword}
      handleLogin={handleLogin}
      showRegister={showRegister}
      setShowRegister={setShowRegister}
      handleRegister={handleRegister}
      setFirstName={setFirstName}
      setLastName={setLastName}
      setMiddleName={setMiddleName}
      registerError={registerError}
    />
  );
}


// MAIN PAGE

return(

<div className="container">

<Header role={role} logout={logout} />


<Controls
  filterGroup={filterGroup}
  setFilterGroup={setFilterGroup}
  role={role}
  setShowCreate={setShowCreate}
/>


<Schedule
  schedule={schedule}
  role={role}
  filterGroup={filterGroup}
  setEditingLesson={setEditingLesson}
  setShowEdit={setShowEdit}
  setDeleteId={setDeleteId}
  setShowDeleteModal={setShowDeleteModal}
/>


{/* CREATE MODAL */}

{showCreate && (

<div className="modal">

<div className="modal-content">

<h3>Создание занятия</h3>

<select onChange={e=>setSubjectId(e.target.value)}>
<option>Выберите дисциплину</option>
{subjects.map(s=>(
<option key={s.id} value={s.id}>{s.name}</option>
))}
</select>

<select onChange={e=>setTeacherId(e.target.value)}>
<option>Выберите преподавателя</option>
{teachers.map(t=>(
<option key={t.id} value={t.id}>{t.name}</option>
))}
</select>

<select onChange={e=>setGroupId(e.target.value)}>
<option>Выберите группу</option>
{groups.map(g=>(
<option key={g.id} value={g.id}>{g.name}</option>
))}
</select>

<select onChange={e=>setRoomId(e.target.value)}>
<option>Выберите аудиторию</option>
{rooms.map(r=>(
<option key={r.id} value={r.id}>{r.number}</option>
))}
</select>

<input placeholder="День" onChange={e=>setDay(e.target.value)} />
<input placeholder="Время" onChange={e=>setTime(e.target.value)} />

{createError && <p style={{color:"red"}}>{createError}</p>}

<div className="modal-buttons">

<button onClick={createLesson}>
Создать
</button>

<button onClick={()=>setShowCreate(false)}>
Назад
</button>

</div>

</div>

</div>

)}


{/* EDIT MODAL */}

{showEdit && editingLesson && (

<div className="modal">

<div className="modal-content">

<h3>Редактирование занятия</h3>

<select defaultValue={editingLesson.subject_id} onChange={e=>setSubjectId(e.target.value)}>
{subjects.map(s=>(
<option key={s.id} value={s.id}>{s.name}</option>
))}
</select>

<select defaultValue={editingLesson.teacher_id} onChange={e=>setTeacherId(e.target.value)}>
{teachers.map(t=>(
<option key={t.id} value={t.id}>{t.name}</option>
))}
</select>

<select defaultValue={editingLesson.group_id} onChange={e=>setGroupId(e.target.value)}>
{groups.map(g=>(
<option key={g.id} value={g.id}>{g.name}</option>
))}
</select>

<select defaultValue={editingLesson.room_id} onChange={e=>setRoomId(e.target.value)}>
{rooms.map(r=>(
<option key={r.id} value={r.id}>{r.number}</option>
))}
</select>

<input defaultValue={editingLesson.day} onChange={e=>setDay(e.target.value)} />
<input defaultValue={editingLesson.time} onChange={e=>setTime(e.target.value)} />

{editError && <p className="error-text">{editError}</p>}

<div className="modal-buttons">

<button onClick={updateLesson}>
Сохранить
</button>

<button onClick={()=>{
setShowEdit(false);
setEditingLesson(null);
}}>
Назад
</button>

</div>

</div>

</div>

)}

{showDeleteModal && (

<div className="modalOverlay">

<div className="modalBox">

<h3>Удаление</h3>

<p>Вы действительно хотите удалить занятие?</p>

<div className="modalButtons">

<button
className="cancelBtn"
onClick={()=>setShowDeleteModal(false)}
>
Назад
</button>

<button
className="deleteBtn"
onClick={deleteLesson}
>
Удалить
</button>

</div>

</div>

</div>

)}

</div>

);

}

export default App;