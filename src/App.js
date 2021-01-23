import './App.css';
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import {useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Footer from "./components/Footer";
import About from "./components/About";

// rsc

const App = () => {

    const [showAddTask, setShowAddTask] = useState(false);

    const [tasks, setTasks] = useState([])

    useEffect(() => {
        const getTasks = async () => {
            const tasksFromServer = await fetchTasks()
            setTasks(tasksFromServer)

        }
        getTasks()
    }, [])

    //fetch tasks
    const fetchTasks = async () => {
        const res = await fetch('http://localhost:5000/tasks')
        const data = await res.json()
        console.log(data)
        return data
    }

    //fetch task
    const fetchTask = async (id) => {
        const res = await fetch(`http://localhost:5000/tasks/${id}`)
        const data = await res.json()
        console.log(data)
        return data
    }

    const addTask = async (task) => {

        const res = await fetch('http://localhost:5000/tasks', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(task)
        })

        const data = await res.json();
        console.log('data:');
        data.key = data.id
        console.log(data);
        setTasks([...tasks, data]);

        // const key = Math.floor(Math.random() * 1000) + 1
        // const id = key
        // const newTask = {id, key, ...task}
        // setTasks([...tasks, newTask])

    }

    //Delete task
    const deleteTask = async (id) => {
        console.log(id)
        await fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'DELETE'
        })
        setTasks(await fetchTasks())
    }

    // Toggle reminder
    const toggleReminder = async (id) => {
        const taskToToggle = await fetchTask(id)
        const updTask = {...taskToToggle, reminder: !taskToToggle.reminder }


        const res = await fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(updTask)
        })

        const data = await res.json();

        setTasks(
            tasks.map((task) => task.id === id ?
            { ...task, reminder: data.reminder }
            :
            task))
    }

  return (
      <Router>
              <div className="container">
                  {/*<Header title = {'Hello'} />*/}
                  <Header onAdd={() => setShowAddTask(!showAddTask)} showAddTask={showAddTask} />

                    <Route path={'/'} exact render={(props) => (
                        <>
                            { showAddTask && <AddTask onAdd={addTask}/>}
                            {tasks.length > 0 ? (<Tasks tasks={tasks}
                                                        onDelete={deleteTask}
                                                        onToggle={toggleReminder}
                                />)
                                :
                                ('No Data')
                            }
                        </>

                    )} />
                    <Route path={'/about'} component={About} />
                    <Footer />
              </div>
      </Router>
  );
}

export default App;


// rsc