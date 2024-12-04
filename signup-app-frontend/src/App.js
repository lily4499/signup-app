import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [users, setUsers] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/signup", formData);
            alert("User registered successfully!");
            setFormData({ name: "", email: "", password: "" });
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.error || "An error occurred.");
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="App">
            <h1>Sign-Up Form</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
            <h2>Registered Users</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} ({user.email}) - {new Date(user.created_at).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;

