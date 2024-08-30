import { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import { useCategories } from '../hooks/CategoryContext';
import { useSelector } from 'react-redux';
import { BarLoader } from 'react-spinners';
import {  toast } from 'react-toastify';

const TodoList = () => {
    const { getTodoByIdCategory, addTodo } = useCategories();
    const [newTask, setNewTask] = useState("");
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false); // Added loading state
    const [error, setError] = useState(null); // Added error state
    const categoryId = useSelector((state) => state.category.activeCategoryId);
    // const itemComplete = useSelector((state) => state.category.isComplete)
    // console.log("itemDispatch", itemComplete)


    useEffect(() => {
        const fetchTasks = async () => {
            if (categoryId) {
                setLoading(true); // Set loading to true before fetching
                setError(null); // Reset any existing errors
                try {
                    const fetchedTasks = await getTodoByIdCategory(categoryId);
                    setTasks(fetchedTasks || []); // Set fetched tasks or an empty array
                } catch (error) {
                    console.error("Error fetching tasks:", error);
                    setError("Failed to load tasks. Please try again."); // Set error message
                    setTasks([]); // Clear tasks if there's an error
                } finally {
                    setLoading(false); // Set loading to false after fetching
                }
            } else {
                setTasks([]); // Clear tasks if no category is selected
            }
        };
        // Hiển thị thông báo nếu có
        const toastMessage = sessionStorage.getItem('toastMessage');
        const toastType = sessionStorage.getItem('toastType');
        if (toastMessage && toastType) {
            if (toastType === 'success') {
                toast.success(toastMessage);
            } else if (toastType === 'error') {
                toast.error(toastMessage);
            }

            // Xóa thông báo khỏi sessionStorage
            sessionStorage.removeItem('toastMessage');
            sessionStorage.removeItem('toastType');
        }

        fetchTasks();
    }, [getTodoByIdCategory, categoryId]);

    const handleAddTask = async () => {
        // console.log(newTask)
        if (newTask.trim() !== '') {
            setLoading(true)
            try {
                await addTodo(newTask, categoryId)
                sessionStorage.setItem('toastMessage', 'Thêm thành công!');
                sessionStorage.setItem('toastType', 'success');
                window.location.reload();
            } catch (err) {
                console.error('Error adding category:', err);
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <div>
            <p className="text-xl font-bold mb-4">Tasks</p>
            {categoryId ? (
                <>
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
                        <p className="text-red-500">{error}</p> // Error message
                    ) : tasks.length > 0 ? (
                        <ul className="space-y-2">
                            {/* {tasks.map((task) => ( */}
                            <TodoItem key={tasks._id} tasks={tasks}  setTasks={setTasks} />
                            {/* ))} */}
                        </ul>
                    ) : (
                        <p className='text-center'>Không tìm thấy tasks rùi :(( Tạo thêm đi nha ^^</p> // Message for no tasks
                    )}
                </>
            ) : (
                <p className='text-center'>Chọn 1 mục để xem <span className='font-medium text-pink-600'>TodoLove</span> nào ^^</p>
            )}
            {/* <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            /> */}
        </div>
    );
};

export default TodoList;
