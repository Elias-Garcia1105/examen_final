import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Obtener lista de usuarios
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://tu-api.com/api/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                // Si hay error de autenticación, redirigir a login
                if (error.response?.status === 401) {
                    navigate('/');
                }
            }
        };
        fetchUsers();
    }, [navigate, token]);

    // Eliminar usuario
    const handleDelete = async (userId) => {
        try {
            await axios.delete(`https://tu-api.com/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="user-list-container">
            <h2>Lista de Usuarios</h2>
            <button onClick={() => navigate('/users/create')}>Crear Nuevo Usuario</button>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => navigate(`/users/edit/${user.id}`)}>Editar</button>
                                <button onClick={() => handleDelete(user.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;