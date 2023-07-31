import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const TodoApp = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [characterLimitMessage, setCharacterLimitMessage] = useState('');

  useEffect(() => {
    // Reset the infoMessage after 2 seconds (2000 milliseconds)
    const timer = setTimeout(() => {
      setInfoMessage('');
    }, 2000);

    return () => clearTimeout(timer);
  }, [infoMessage]);

  const handleInputChange = (event) => {
    const inputTask = event.target.value;
    // Limit the input to 100 characters
    if (inputTask.length <= 100) {
      setTask(inputTask);
      setCharacterLimitMessage(''); // Reset character limit message
    } else {
      setCharacterLimitMessage('Character limit (100) exceeded.');
    }
  };

  const handleAddTask = () => {
    if (task.trim() === '' && tasks.length === 5) {
      setErrorMessage("Can't add empty task, you already reached the limit. Delate a task then add.")
      return;
    }
    if (task.trim() === '') {
      setErrorMessage('Please enter a task before adding.');
      return;
    }

    if (tasks.length >= 5) {
      setInfoMessage('You have reached the maximum limit of tasks.');
      return;
    }

    setTasks([...tasks, { text: task, completed: false }]);
    setTask('');
    setErrorMessage('');
    setCharacterLimitMessage(''); // Reset character limit message

    // Change body background to a random gradient color
    changeBodyBackground();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the form from submitting
      if (tasks.length < 5) {
        handleAddTask();
      } else {
        setInfoMessage('You have reached the maximum limit of tasks.');
      }
    }
  };

  const handleToggleComplete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const handleRemoveTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    setErrorMessage('');
    setInfoMessage('Task removed successfully.');
  };

  const remainingCharacters = 100 - task.length;

  // Calculate the counts of completed and open tasks
  const completedTasksCount = tasks.filter((task) => task.completed).length;
  const openTasksCount = tasks.filter((task) => !task.completed).length;
  const remainingTasks = 5 - tasks.length;

  useEffect(() => {
    // Set the body height dynamically to the viewport height
    document.body.style.height = `${window.innerHeight}px`;
  }, []);

  const changeBodyBackground = () => {
    const randomColor1 = getRandomColor();
    const randomColor2 = getRandomColor();
    document.body.style.background = `linear-gradient(45deg, ${randomColor1}, ${randomColor2})`;
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="todo-container">
      <h2>Todo App</h2>
      <div className="input-container">
        <input
          type="text"
          value={task}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // Call handleAddTask() when Enter key is pressed
          placeholder="Enter a task"
          maxLength={100} // Set maximum character length to 100
        />
        <button className="add-btn" onClick={handleAddTask}>Add</button>
      </div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {remainingCharacters === 100 ? '' : <p>Characters left: {remainingCharacters}/100</p>}
      {infoMessage && <p style={{ color: 'green' }}>{infoMessage}</p>}
      {characterLimitMessage && <p style={{ color: 'red' }}>{characterLimitMessage}</p>}
      {tasks.length > 0 && (
        <p>
          Completed: {completedTasksCount}, Pending: {openTasksCount}, Creatable: {remainingTasks}
        </p>
      )}
      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={index} className={task.completed ? 'completed' : ''}>
            <span onClick={() => handleToggleComplete(index)}>
              {index + 1}. {task.text} {/* Display serial number */}
            </span>
            <button className="remove-btn" onClick={() => handleRemoveTask(index)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
