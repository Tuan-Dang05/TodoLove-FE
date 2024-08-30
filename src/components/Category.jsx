import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import { useCategories } from '../hooks/CategoryContext';
import { ToastContainer, toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveCategoryId } from '../redux/categorySlice'; // Adjust the path as needed
import { PacmanLoader } from 'react-spinners';

const Category = () => {
    const { categories, addCategory, deleteCategory } = useCategories();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading

    const dispatch = useDispatch();
    
    // Get activeCategoryId from Redux, or set it from sessionStorage if present
    const activeCategoryId = useSelector((state) => state.category.activeCategoryId) || sessionStorage.getItem("activeCategoryId");
    
    useEffect(() => {
        // Khi component được tải, đọc từ sessionStorage
        const savedActiveCategoryId = sessionStorage.getItem("activeCategoryId");
        if (savedActiveCategoryId) {
            dispatch(setActiveCategoryId(savedActiveCategoryId));
        }

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

    }, [dispatch]);

    const handleAddCategory = async () => {
        if (newCategory.trim() !== '') {
            setIsLoading(true); // Bắt đầu tải dữ liệu
            try {
                await addCategory(newCategory);
                setNewCategory('');
                setIsModalOpen(false);
                sessionStorage.setItem('toastMessage', 'Thêm thành công!');
                sessionStorage.setItem('toastType', 'success');
                window.location.reload();
            } catch (err) {
                console.error('Error adding category:', err);
                sessionStorage.setItem('toastMessage', 'Failed to add category. Please try again later.');
                sessionStorage.setItem('toastType', 'error');
            } finally {
                setIsLoading(false); // Kết thúc tải dữ liệu
            }
        }
    };

    const handleDeleteCategory = async (id) => {
        setIsLoading(true); // Bắt đầu tải dữ liệu
        try {
            await deleteCategory(id);
            toast.success('Xoá thành công!');
        } catch (err) {
            console.error('Error deleting category:', err);
        } finally {
            setIsLoading(false); // Kết thúc tải dữ liệu
        }
    };

    const handleCloseModal = (e) => {
        if (e.target === e.currentTarget) {
            setIsModalOpen(false);
        }
    };

    // Update the setActiveCategory function to use Redux and save to sessionStorage
    const handleSetActiveCategory = (id) => {
        dispatch(setActiveCategoryId(id));
        sessionStorage.setItem("activeCategoryId", id); // Save to sessionStorage
    };

    return (
        <div>
            <div className='flex items-center justify-between mb-4'>
                <p className="text-xl font-bold">Categories</p>
                <button
                    type='button'
                    className='bg-gray-300 py-1 px-3 rounded-md'
                    onClick={() => setIsModalOpen(true)}
                >
                    +
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
                    onClick={handleCloseModal}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold mb-4">Thêm Mục Mới</h3>
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="border py-2 px-4 rounded-md w-full mb-4"
                            placeholder="Nhập tên mục mới"
                        />
                        <div className="flex justify-end">
                            <button
                                type='button'
                                onClick={() => setIsModalOpen(false)}
                                className='bg-gray-300 text-gray-700 py-2 px-4 rounded-md mr-2'
                            >
                                Hủy
                            </button>
                            <button
                                type='button'
                                onClick={handleAddCategory}
                                className='bg-blue-500 text-white py-2 px-4 rounded-md'
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-2 mt-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <PacmanLoader
                            color="#ff23b5"
                            cssOverride={{}}
                            loading
                            size={15}
                            speedMultiplier={1}
                        />
                    </div>
                ) : (
                    categories.map((category, index) => (
                        <div key={index} className="relative">
                            <button
                                onClick={() => handleSetActiveCategory(category._id)}
                                className={`block w-full py-2 text-pretty pl-2 pr-7 text-center font-bold rounded-md ${activeCategoryId === category._id ? 'bg-pink-500 text-white' : ''}`}
                            >
                                {category.name}
                            </button>
                            <button
                                onClick={() => handleDeleteCategory(category._id)}
                                className="absolute top-1 right-1 text-red-500"
                            >
                                <i className={`fas fa-trash ${activeCategoryId === category._id ? 'text-white pt-2 pr-1' : ' pr-1'}`}></i>
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default Category;
