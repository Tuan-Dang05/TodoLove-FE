// import { useState, useEffect } from 'react';
import Category from '../components/Category';
import TodoList from '../components/TodoList';
import { CategoryProvider } from '../hooks/CategoryContext'

const TodoLayout = () => {



    return (
        <div className="container mx-auto relative top-32 flex flex-col md:flex-row gap-6 p-6">

            <>
                <div className="md:w-1/4 w-full bg-white p-4 rounded-lg shadow-md flex-shrink-0 h-full">
                    <CategoryProvider>
                        <Category />
                    </CategoryProvider>
                </div>
                <div className="md:w-3/4 w-full bg-white p-4 rounded-lg shadow-md flex-1 overflow-auto h-full">
                    <CategoryProvider>
                        <TodoList />
                    </CategoryProvider>
                </div>
            </>

        </div>
    );
};

export default TodoLayout;
