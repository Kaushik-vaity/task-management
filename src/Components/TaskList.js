import React, { useEffect, useState } from 'react';

export default function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({});
    const [editTask, setEditTask] = useState(null);
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Low');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (savedTasks) {
            setTasks(savedTasks);
        }
    }, []);

    useEffect(() => {
        if (tasks.length > 0) {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }, [tasks]);

    const validate = () => {
        const errors = {};
        if (!title.trim()) {
            errors.title = 'Title is required';
        }
        else if (tasks.some(task => task.title.toLowerCase() === title.toLowerCase())) {
            errors.title = 'Title must be unique';
        }

        if (!description.trim()) {
            errors.description = 'Description is required';
        }

        if (!dueDate) {
            errors.dueDate = 'Due date is required';
        }
        else {
            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
            if (dueDate < today) {
                errors.dueDate = 'Due date must be today or in the future';
            }
        }

        return errors;
    };

    const addTask = () => {
        const errors = validate();
        if (Object.keys(errors).length === 0) {
            const task = { id: Date.now(), title, description, dueDate, priority, completed: false };
            setTasks([...tasks, task]);
            setTitle('');
            setDescription('');
            setDueDate('');
            setPriority('Low');
            setErrors({});
        } else {
            setErrors(errors);
        }
    };

    const deleteTask = (id) => {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
    };

    const handleTaskClick = (task) => {
        setEditTask(task);
    };

    const editClose = () => {
        setEditTask(null);
    };



    const toggleCompleteTask = (id) => {
        const updatedTasks = tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
    };

    const handleEditTask = () => {
        if (editTask) {
            const updatedTasks = tasks.map((task) =>
                task.id === editTask.id ? editTask : task
            );
            setTasks(updatedTasks);
            editClose();
        }
    };

    const searchTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='container'>
            <h1>Task List</h1>
            <div>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && <p style={{ color: 'red' }}>{errors.title}</p>}
                <br />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {errors.description && <p style={{ color: 'red' }}>{errors.description}</p>}
                <br />
                <input
                    type="date"
                    placeholder="Due Date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
                {errors.dueDate && <p style={{ color: 'red' }}>{errors.dueDate}</p>}
                <br />
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <br />
                <button onClick={addTask} className='btn-add'>Add Task</button>
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <hr />
            <ul className='task-list'>
                {searchTasks.map((task) => (
                    <li key={task.id} className='task' onClick={() => handleTaskClick(task)}>
                        <h4>Title: {task.title}</h4>
                        <p>Description: {task.description}</p>
                        <p>Due Date: {task.dueDate}</p>
                        <p>Priority:
                            {task.priority === 'Low' && <b style={{ color: 'green' }}>{task.priority}</b>}
                            {task.priority === 'Medium' && <b style={{ color: 'blue' }}>{task.priority}</b>}
                            {task.priority === 'High' && <b style={{ color: 'red' }}>{task.priority}</b>}
                        </p>
                        <p>Status: {task.completed ? 'Completed' : 'Pending'}</p>
                        <button onClick={(e) => { e.stopPropagation(); toggleCompleteTask(task.id); }}>
                            {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} className='btn-delete'>Delete</button>
                    </li>
                ))}
            </ul>

            {editTask && (
                <div className='edit-task-container'>
                    <div className='edit-task-container-1'>
                        <h2>Edit Task</h2>
                        <input
                            type="text"
                            placeholder="Title"
                            value={editTask.title}
                            onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                        />

                        <input
                            type="text"
                            placeholder="Description"
                            value={editTask.description}
                            onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                        />
                        <input
                            type="date"
                            value={editTask.dueDate}
                            onChange={(e) =>
                                setEditTask({ ...editTask, dueDate: e.target.value })
                            }
                        />
                        <select
                            value={editTask.priority}
                            onChange={(e) =>
                                setEditTask({ ...editTask, priority: e.target.value })
                            }
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                        <button onClick={handleEditTask} className='btn-edit'>Edit Task</button>
                        <button onClick={editClose} className='btn-delete'>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}
