// src/components/AdminTheatres.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import TheatreAdminCard from "../../components/theatreAdminCard";
import TheatreModal from "../../components/theatreModal";

const APIURL = import.meta.env.VITE_API_URL;

const AdminTheatres = () => {
    const [theatres, setTheatres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentTheatre, setCurrentTheatre] = useState(null);

    const GetAllTheatres = async () => {
        try {
            const response = await axios.get(`${APIURL}/theatres`);
            setTheatres(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetAllTheatres();
    }, []);

    const handleAddClick = () => {
        setCurrentTheatre(null);
        setModalOpen(true);
    };

    const handleEditClick = (theatre) => {
        setCurrentTheatre(theatre);
        setModalOpen(true);
    };

    const handleDeleteClick = async (theatreId) => {
        try {
            await axios.delete(`${APIURL}/theatres/${theatreId}`);
            GetAllTheatres();
        } catch (error) {
            console.error("Error deleting theatre:", error);
        }
    };

    const handleModalClose = () => {
        setModalOpen(false);
        GetAllTheatres();
    };

    if (loading) {
        return <div className="text-5xl">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
                Admin Theatre Management
            </h1>
            <button
                className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
                onClick={handleAddClick}>
                Add New Theatre
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {theatres.map((theatre) => (
                    <TheatreAdminCard
                        key={theatre._id}
                        theatre={theatre}
                        onEditClick={handleEditClick}
                        onDeleteClick={handleDeleteClick}
                    />
                ))}
            </div>
            {modalOpen && (
                <TheatreModal
                    theatre={currentTheatre}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
};

export default AdminTheatres;