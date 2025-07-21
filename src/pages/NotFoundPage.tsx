import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    const handleBackToWelcome = () => {
        navigate('/welcome');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-red-600 mb-4">
                404 - Page Not Found
            </h1>
            <p className="text-base text-gray-700 mb-2">
                Sorry, the page you are looking for does not exist.
            </p>
            <button
                onClick={handleBackToWelcome}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Back to Welcome
            </button>
        </div>
    );
};

export default NotFoundPage;
