import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import axios from "axios";
import DatePicker from "react-datepicker";

const HomeScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editedText, setEditedText] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isEditingModalVisible, setEditingModalVisible] = useState(false);
  const [editedDate, setEditedDate] = useState(new Date());
  const [email, setEmail] = useState(""); // New email state

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await axios.get(
        "https://ronk95gsei.execute-api.us-east-1.amazonaws.com/Dev/users"
      );

      if (response.status === 200) {
        setTasks(response.data);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const saveTasks = async () => {
    // You can implement saving tasks to your storage mechanism here
    console.log("Updated Tasks:", tasks);
  };

  const addTask = async () => {
    if (taskName.trim() === "" || email.trim() === "") {
      return;
    }

    const newTask = {
      id: new Date().getTime(),
      text: taskName,
      date: selectedDate,
      email: email, // Include email
    };

    setTasks([...tasks, newTask]);
    setTaskName(""); // Change to setTaskName
    setSelectedDate(new Date());

    try {
      const response = await axios.post(
        "https://ronk95gsei.execute-api.us-east-1.amazonaws.com/Dev/users",
        newTask
      );

      if (response.status === 200) {
        // Task added successfully
        loadTasks(); // Refresh the tasks list
      } else {
        // Handle error
        console.error("Error adding task:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);

    try {
      const response = await axios.delete(
        "https://ronk95gsei.execute-api.us-east-1.amazonaws.com/Dev/users",
        { data: { id: taskId } }
      );
      if (response.status === 200) {
        // Task deleted successfully
        loadTasks(); // Refresh the tasks list
      } else {
        // Handle error
        console.error("Error deleting task:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditTask = async () => {
    console.log(editingTaskId);
    if (editingTaskId !== null) {
      console.log(editingTaskId);
      const editedTaskIndex = tasks.findIndex(
        (task) => task.id === editingTaskId
      );

      if (editedTaskIndex !== -1) {
        const updatedTasks = [...tasks];
        updatedTasks[editedTaskIndex].text = editedText;
        updatedTasks[editedTaskIndex].date = editedDate;
        updatedTasks[editedTaskIndex].email = email; // Update email

        try {
          const response = await axios.put(
            `https://ronk95gsei.execute-api.us-east-1.amazonaws.com/Dev/users`,
            updatedTasks[editedTaskIndex]
          );

          if (response.status === 200) {
            // Task edited successfully
            await saveTasks(updatedTasks); // Save the updated tasks
            console.log(updatedTasks);
            loadTasks(); // Refresh the tasks list
          } else {
            // Handle error
            console.error("Error editing task:", response.statusText);
          }
        } catch (error) {
          console.error("Error editing task:", error);
        }

        setEditingTaskId(null);
        setEditedText("");
        setEditedDate(new Date());
        setEditingModalVisible(false);
      }
    }
  };

  /*const handleEditTask = async () => {
    if (editingTaskId !== null) {
      const editedTaskIndex = tasks.findIndex(
        (task) => task.id === editingTaskId
      );

      if (editedTaskIndex !== -1) {
        const updatedTasks = [...tasks];
        updatedTasks[editedTaskIndex].text = editedText;
        updatedTasks[editedTaskIndex].date = editedDate;
        updatedTasks[editedTaskIndex].email = email; // Update email

        setTasks(updatedTasks);

        try {
          const response = await axios.put(
            `https://ronk95gsei.execute-api.us-east-1.amazonaws.com/Dev/users`,
            updatedTasks[editedTaskIndex]
          );

          if (response.status === 200) {
            // Task edited successfully
            loadTasks(); // Refresh the tasks list
          } else {
            // Handle error
            console.error("Error editing task:", response.statusText);
          }
        } catch (error) {
          console.error("Error editing task:", error);
        }

        setEditingTaskId(null);
        setEditedText("");
        setEditedDate(new Date());
        setEditingModalVisible(false);
      }
    }
  };*/

  /*const handleEditTask = async () => {
    if (editingTaskId !== null) {
      const editedTaskIndex = tasks.findIndex(
        (task) => task.id === editingTaskId
      );

      if (editedTaskIndex !== -1) {
        const updatedTask = {
          id: editingTaskId,
          text: editedText,
          date: editedDate,
          email: email, // Update email
        };

        try {
          const response = await axios.put(
            `https://ronk95gsei.execute-api.us-east-1.amazonaws.com/Dev/users`,
            updatedTask
          );

          if (response.status === 200) {
            // Task edited successfully
            loadTasks(); // Refresh the tasks list
          } else {
            // Handle error
            console.error("Error editing task:", response.statusText);
          }
        } catch (error) {
          console.error("Error editing task:", error);
        }

        setEditingTaskId(null);
        setEditedText("");
        setEditedDate(new Date());
        setEditingModalVisible(false);
      }
    }
  };*/

  return (
    <div>
      <h3>Enter Task:</h3>
      <input
        type="task"
        placeholder="TaskText"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <br></br>
      <br></br>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br></br>
      <br></br>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="yyyy-MM-dd"
      />
      <br></br>
      <br></br>
      <button onClick={addTask}>Add Task</button>

      {tasks.map((task) => (
        <div key={task.id}>
          <p>{task.text}</p>

          <p>Email: {task.email}</p>

          <p>Date: {new Date(task.date).toDateString()}</p>
          <button
            onClick={() => {
              setEditingTaskId(task.id);
              setEditedText(task.text);
              setEditedDate(new Date(task.date));
              setEmail(task.email);
              setEditingModalVisible(true);
            }}
          >
            Edit
          </button>
          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </div>
      ))}

      <Modal
        isOpen={isEditingModalVisible}
        onRequestClose={() => {
          setEditingModalVisible(false);
          setEmail("");
          setEditedText("");
          // Clear email
        }}
      >
        <input
          type="text"
          placeholder="Edit Task Text"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
        />
        <br></br>
        <br></br>
        <input
          type="email"
          placeholder="Edit Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br></br>
        <br></br>
        <DatePicker
          selected={editedDate}
          onChange={(date) => setEditedDate(date)}
          dateFormat="yyyy-MM-dd"
        />
        <br></br>
        <br></br>
        <button onClick={handleEditTask}>Save</button>
      </Modal>
    </div>
  );
};

export default HomeScreen;
