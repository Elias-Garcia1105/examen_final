import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UserForm = () => {
    const { id } = useParams(); // Obtiene el ID si estamos editando
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: ''
    });

    // Si es edición, cargar los datos del usuario
    useEffect(() => {
        if (id) {
            const fetchUser = async () => {
                try {
                    const response = await axios.get(`https://tu-api.com/api/users/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUserData({
                        name: response.data.name,
                        email: response.data.email,
                        password: '' // No mostramos la contraseña existente
                    });
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            };
            fetchUser();
        }
    }, [id, token]);

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                // Actualizar usuario existente
                await axios.put(`https://tu-api.com/api/users/${id}`, userData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // Crear nuevo usuario
                await axios.post('https://tu-api.com/api/users', userData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            navigate('/users'); // Redirigir al listado después de guardar
        } catch (error) {
            console.error('Error saving user:', error);
            alert(error.response?.data?.message || 'Error al guardar');
        }
    };

    return (
        <div className="user-form-container">
            <h2>{id ? 'Editar Usuario' : 'Crear Usuario'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        required
                        disabled={!!id} // Email no editable en actualización
                    />
                </div>

                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        required={!id} // Solo requerido para creación
                        placeholder={id ? 'Dejar en blanco para no cambiar' : ''}
                    />
                </div>

                <button type="submit">Guardar</button>
                <button type="button" onClick={() => navigate('/users')}>Cancelar</button>
            </form>
        </div>
    );
};

export default UserForm;