import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CategoryContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor for logging
axiosInstance.interceptors.request.use(
    config => {
        console.log(`Request made to ${config.url}`);
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

export const CategoryProvider = ({ children }) => {

    const [categories, setCategories] = useState([]);
    const [todos, setTodos] = useState([]);
    const [getAll, setGetALl] = useState([])
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeCategoryId, setActiveCategoryId] = useState(null);
    
    // console.log("idBoolean", isBoolean)
    const fetchCategories = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/todos/category'); // Corrected endpoint
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to fetch categories. Please try again later.');
            setCategories([]);
        } finally {
            setIsLoading(false);
        }
    };

    const getALlCateAndTodo = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/todos/all')
            setGetALl(response.data)
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to fetch categories. Please try again later.');
            setGetALl([])
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCategories();
        getALlCateAndTodo();
    }, []);

    const updateTodo = async (id, updatedTaskContent) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.put(`/todos/${id}`, {
                task: updatedTaskContent // Truyền nội dung nhiệm vụ đã cập nhật vào phần nội dung yêu cầu
            });
            console.log(response.data);
    
            // Cập nhật trạng thái cục bộ để phản ánh việc cần làm đã cập nhật (nếu cần)
            // setTodos((prevTodos) => {
            //     return prevTodos.map((todo) => 
            //         todo._id === id ? { ...todo, task: updatedTaskContent } : todo
            //     );
            // });
    
            return response.data;
        } catch (error) {
            console.error('Error updating todo:', error);
            setError('Failed to update todo. Please try again later.');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
    
    const addCategory = async (newCategoryName) => {
        try {
            setError(null);
            const response = await axiosInstance.post('/todos/category', { name: newCategoryName }); // Corrected endpoint
            setCategories(prevCategories => [...prevCategories, response.data]);
            console.log(response.data.message)
            return response.data;
        } catch (error) {
            console.error('Error adding category:', error);
            setError('Failed to add category. Please try again later.');
            throw error;
        }
    };
    const deleteCategory = async (id) => {
        try {
            setError(null);
            const response = await axiosInstance.delete(`/todos/category/${id}`); // Corrected endpoint
            setCategories(prevCategories => prevCategories.filter(category => category._id !== id));
            console.log(response.data.message)
            return response.data;
        } catch (error) {
            console.error('Error deleting category:', error);
            setError('Failed to delete category. Please try again later.');
            throw error;
        }
    };

    const deleteTodo = async (id) => {
        try {
            setError(null);
            const response = await axiosInstance.delete(`/todos/${id}`); // Corrected endpoint
            setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
            console.log(response.data.message)
            return response.data;
        } catch (error) {
            console.error('Error deleting category:', error);
            setError('Failed to delete category. Please try again later.');
            throw error;
        }
    };

    const addTodo = async (task, categoryId) => {
        try {
            setError(null);
            const response = await axiosInstance.post('/todos', {
                todoData: {
                    task: task,
                    complete: false
                },
                categoryId: categoryId
            });
            console.log('Todo created:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating todo:', error);
            setError('Failed to create todo. Please try again later.');
            throw error;
        }
    };

    const getTodoByIdCategory = async (categoryId) => {
        try {
            setError(null);
            const response = await axiosInstance.get(`/todos/category/${categoryId}`)
            return response.data;
        } catch (error) {
            console.error('Error fetching todos:', error);
            // setError('Failed to fetch todos. Please try again later.');
            // throw error;
        }
    }

    const setActiveCategory = (id) => {
        setActiveCategoryId(id);
    };

    const isComplete = async (id) => {
        try{
            setError(null);
            const response = await axiosInstance.patch(`/todos/${id}/toggle-complete`)
            console.log(response.data)
            return response.data;
        } catch(error) {
            console.error('Error fetching todos:', error);
        }
    }


    return (
        <CategoryContext.Provider value={{
            categories,
            addCategory,
            deleteCategory,
            addTodo,
            setActiveCategory,
            activeCategoryId,
            error,
            getAll,
            isLoading,
            deleteTodo,
            todos,
            updateTodo,
            getTodoByIdCategory,
            isComplete
        }}>
            {children}
        </CategoryContext.Provider>
    );
};

// Custom hook to use the CategoryContext
export const useCategories = () => useContext(CategoryContext);
