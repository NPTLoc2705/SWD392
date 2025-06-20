import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';

const Admin = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (user && user.role === 'Student') {
      navigate('/gioi-thieu');
    }
  }, [user, navigate]);

  return (
    <div>
      <h1>Welcome to My Page</h1>
      <p>This is a template for a ReactJS page.</p>
    </div>
  );
};

export default Admin;