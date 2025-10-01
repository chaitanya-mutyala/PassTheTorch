import React from 'react';
import { Container, PostForm } from '../components'; // Assuming PostForm is imported from components
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function AddPost() {
    const authStatus = useSelector((state) => state.auth.status); // Assuming auth status is tracked in Redux
    const navigate = useNavigate();

    // 🛑 SOLUTION: Redirect immediately if the user is not authenticated.
    // This prevents the PostForm from loading until the session is confirmed.
    if (!authStatus) {
        navigate("/login"); 
        return null; // Return null to prevent rendering
    }

    return (
        <div className='py-8'>
            <Container>
                {/* PostForm is only rendered if authStatus is true */}
                <PostForm />
            </Container>
        </div>
    );
}
