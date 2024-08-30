import { useState } from 'react';
import { useCategories } from '../hooks/CategoryContext';
import { toast } from 'react-toastify';

const TodoItem = ({ tasks, setTasks }) => {
    const [isEditingIndex, setIsEditingIndex] = useState(null);
    const [editedTask, setEditedTask] = useState('');
    const { deleteTodo, updateTodo, isComplete } = useCategories();

    const handleEditToggle = (index) => {
        if (isEditingIndex === index) {
            setIsEditingIndex(null);
            setEditedTask('');
        } else {
            setIsEditingIndex(index);
            setEditedTask(tasks[index].task);
        }
    };

    const handleCheckboxChange = async (taskToUpdate) => {
        // Optimistic update
        setTasks(currentTasks => 
            currentTasks.map(task => 
                task._id === taskToUpdate._id 
                    ? { ...task, complete: !task.complete }
                    : task
            )
        );

        try {
            const updatedTask = await isComplete(taskToUpdate._id);
            return updatedTask
        } catch (error) {
        
            setTasks(currentTasks => 
                currentTasks.map(task => 
                    task._id === taskToUpdate._id 
                        ? { ...task, complete: !task.complete }
                        : task
                )
            );
            console.error("Error updating task completion status:", error);
            toast.error("Failed to update task status");
        }
    };

    const handleEditChange = (e) => {
        setEditedTask(e.target.value);
    };

    const handleEditSubmit = async (taskToUpdate) => {
  
        setTasks(currentTasks => 
            currentTasks.map(task => 
                task._id === taskToUpdate._id 
                    ? { ...task, task: editedTask }
                    : task
            )
        );

        try {
            await updateTodo(taskToUpdate._id, editedTask);
            setIsEditingIndex(null);
            toast.success("Task updated successfully");
        } catch (error) {
    
            setTasks(currentTasks => 
                currentTasks.map(task => 
                    task._id === taskToUpdate._id 
                        ? { ...task, task: taskToUpdate.task }
                        : task
                )
            );
            console.error("Cannot update task", error);
            toast.error("Failed to update task");
        }
    };

    const removeTask = async (id) => {

        setTasks(currentTasks => currentTasks.filter(task => task._id !== id));

        try {
            await deleteTodo(id);
            toast.success("Task deleted successfully");
        } catch (error) {
         
            const taskToRestore = tasks.find(task => task._id === id);
            setTasks(currentTasks => [...currentTasks, taskToRestore]);
            console.error("Cannot remove task", error);
            toast.error("Failed to delete task");
        }
    };

    return (
        <ul className="p-0 list-none">
            {tasks.map((task, index) => (
                <li key={task._id} className="flex items-center justify-between p-3 bg-gray-100 rounded-md mb-2">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            className="mr-2 rounded"
                            checked={task.complete}
                            onChange={() => handleCheckboxChange(task)}
                        />
                        {isEditingIndex === index ? (
                            <input
                                type="text"
                                value={editedTask}
                                onChange={handleEditChange}
                                onBlur={() => handleEditSubmit(task)}
                                onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit(task)}
                                className="border rounded p-1"
                            />
                        ) : (
                            <span
                                onDoubleClick={() => handleEditToggle(index)}
                                className={`${task.complete ? "line-through text-gray-400 ms-5" : "text-black font-bold mx-5 w-11/12"}`}
                            >
                                {task.task}
                            </span>
                        )}
                    </div>
                    <div className='w-20'>
                        <button
                            onClick={() => handleEditToggle(index)}
                            className="text-gray-500 hover:text-black mr-2"
                        >
                            <i className={`${isEditingIndex === index ? 'fas fa-check text-green-500' : 'fas fa-edit'}`}></i>
                        </button>
                        <span style={{ fontSize: '20px', marginRight: '6px' }}>|</span>
                        <button
                            onClick={() => removeTask(task._id)}
                            className="text-gray-500 hover:text-black"
                        >
                            <i className="fas fa-trash text-red-400"></i>
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default TodoItem;