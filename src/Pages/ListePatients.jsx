import React, { useState } from 'react';
import AjoutPatient from "./AjoutPatient";
import {Link} from "react-router-dom" 

function ListePatients(){

   const [patients, setPatients] = useState([
        { id: Date.now(), code_patient: 'P001', nom: 'Thomas Messi', sexe: 'M', age: 36, email: 'thomasmessi@example.com' },
        { id: Date.now() + 1, code_patient: 'P002', nom: 'Mbassi Atangana', sexe: 'M', age: 23, email: 'mbassiatangana@example.com' },
        { id: Date.now() + 2, code_patient: 'P003', nom: 'Fedim Piomo', sexe: 'M', age: 24, email: 'fedimpiomo@example.com' },
    ]);
    const [showForm, setShowForm] = useState(false);

    const handleAddPatient = (newPatient) => {
        setPatients([...patients, newPatient]);
        setShowForm(false); // Fermer le formulaire après l'ajout
    };

    const handleDeleteClick = (id) => {
        const updatedPatients = patients.filter(patient => patient.id !== id);
        setPatients(updatedPatients);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center text-success">Liste des Patients</h2>
            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Code Patient</th>
                        <th>Nom</th>
                        <th>Sexe</th>
                        <th>Âge</th>
                        <th>Email</th>
                        <th>Analyse</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map(patient => (
                        <tr key={patient.id}>
                            <td>{patient.id}</td>
                            <td>{patient.code_patient}</td>
                            <td>{patient.nom}</td>
                            <td>{patient.sexe}</td>
                            <td>{patient.age}</td>
                            <td>{patient.email}</td>
                            <td>
                                <Link to = '/analyse/{patient.id}'><button className="btn btn-success">Analyse</button></Link>
                            </td>
                            <td>
                                <button 
                                    className="btn btn-danger"
                                    onClick={() => handleDeleteClick(patient.id)}
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button 
                className="btn btn-success w-100 mt-4" 
                onClick={() => setShowForm(!showForm)}
            >
                {showForm ? 'Annuler' : 'Ajouter un Nouveau Patient'}
            </button>
            {showForm && <AjoutPatient onAdd={handleAddPatient} />}
        </div>
    );
};


export default ListePatients


