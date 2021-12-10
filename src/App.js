import Header from './components/Header'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import About from './components/About'
import TaskDetails from './components/TaskDetails'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'

function App() {

   const [tasks, setTasks] = useState([])
   const [showAddTask, setShowAddTask] = useState(false)

   //fetch tasks from json server
   const fetchTasks = async () => {
      let res = await fetch('http://localhost:5000/tasks')
      let data = await res.json()

      return data
   }

   //fetch single task from json server
   const fetchTask = async (id) => {
      let res = await fetch(`http://localhost:5000/tasks/${id}`)
      let data = await res.json()

      return data
   }

   // add single task
   const addTask = async (task) => {
      let res = await fetch(`http://localhost:5000/tasks`, {
         method: 'POST',
         headers: {
            'Content-type': 'application/json'
         },
         body: JSON.stringify(task)
      })

      const data = await res.json()

      setTasks([...tasks, data])
   }

   // delete single task
   const deleteTask = async (id) => {
      await fetch(`http://localhost:5000/tasks/${id}`, {
         method: 'DELETE'
      })

      setTasks(tasks.filter((task) => task.id !== id))
   }

   // toggle task reminder
   const toggleReminder = async (id) => {
      let taskToToggle = await fetchTask(id)
      let updateTask = { ...taskToToggle, reminder: !taskToToggle.reminder }

      let res = await fetch(`http://localhost:5000/tasks/${id}`, {
         method: 'PUT',
         headers: {
            'Content-type': 'application/json'
         },
         body: JSON.stringify(updateTask)
      })

      const data = await res.json()

      setTasks(tasks.map((task) => task.id === id ? { ...task, reminder: data.reminder } : task))
   }

   useEffect(() => {
      let getTasks = async () => {
         let dataFromServer = await fetchTasks()
         setTasks(dataFromServer)
      }

      getTasks();
   }, [])

   return (
      <Router>
         <div className='container'>
            <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
            <Routes>
               <Route
                  path="/"
                  element={
                     <>
                        {showAddTask && <AddTask onAdd={addTask} />}
                        {tasks.length > 0 ?
                           (
                              <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />
                           ) : (
                              'No Task To Show'
                           )
                        }
                     </>
                  }
               />
               <Route path="/about" element={<About />} />
               <Route path="/task/:id" element={<TaskDetails />} />
            </Routes>
            <Footer />
         </div>
      </Router>
   );
}

export default App;
