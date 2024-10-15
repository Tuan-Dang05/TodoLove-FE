import React, { useState, useEffect, useCallback, useMemo } from 'react';
import io from 'socket.io-client';
import TodoItem from './TodoItem';
import { useCategories } from '../hooks/CategoryContext';
import { useSelector } from 'react-redux';
import { BarLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const ENDPOINT =  import.meta.env.VITE_API_BASE_URL;

const TodoList = () => {
    const { getTodoByIdCategory, addTodo } = useCategories();
    const [newTask, setNewTask] = useState("");
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const categoryId = useSelector((state) => state.category.activeCategoryId);

    const fetchTasks = useCallback(async () => {
        if (!categoryId) {
            setTasks([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const fetchedTasks = await getTodoByIdCategory(categoryId);
            setTasks(fetchedTasks || []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setError("Failed to load tasks. Please try again.");
            setTasks([]);
        } finally {
            setLoading(false);
        }
    }, [getTodoByIdCategory, categoryId]);

    useEffect(() => {
        fetchTasks();

        const socket = io(ENDPOINT);

        socket.on('newTodo', (data) => {
            if (data.todo.categoryId === categoryId) {
                setTasks(prevTasks => [...prevTasks, data.todo]);
                toast.success(`Bạn có thông báo mới! : ${data.todo.task}`);
            }
        });

        return () => socket.disconnect();
    }, [categoryId, fetchTasks]);

    const handleAddTask = useCallback(async () => {
        if (newTask.trim() === '') return;

        setLoading(true);
        try {
            const newTodo = await addTodo(newTask, categoryId);
            setTasks(prevTasks => [...prevTasks, newTodo]);
            setNewTask('');
            toast.success('Thêm thành công!');
        } catch (err) {
            console.error('Error adding todo:', err);
            toast.success('Thêm thành công!');
        } finally {
            setLoading(false);
        }
    }, [newTask, categoryId, addTodo]);

    const memoizedTodoItem = useMemo(() => (
        <TodoItem tasks={tasks} setTasks={setTasks} />
    ), [tasks]);

    if (!categoryId) {
        return <p className='text-center'>Chọn 1 mục để xem <span className='font-medium text-pink-600'>TodoLove</span> nào ^^</p>;
    }

    return (
        <div>
            <p className="text-xl font-bold mb-4">Tasks</p>
            <div className="flex mb-4">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-l-md"
                    placeholder="Viết nội dung vào đây nè!!"
                />
                <button
                    onClick={handleAddTask}
                    className="p-2 bg-black text-white rounded-r-md"
                >
                    Thêm
                </button>
            </div>
            {loading ? (
                <div className="flex items-center justify-center">
                    <BarLoader color="#b53eef" />
                </div>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : tasks.length > 0 ? (
                memoizedTodoItem
            ) : (
                <p className='text-center'>Không tìm thấy tasks rùi :(( Tạo thêm đi nha ^^</p>
            )}
        </div>
    );
};

export default React.memo(TodoList);