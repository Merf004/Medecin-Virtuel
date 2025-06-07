import React, { useState } from 'react';

const AjoutPatient = ({ onAdd }) => {
    const [codePatient, setCodePatient] = useState('');
    const [nom, setNom] = useState('');
    const [sexe, setSexe] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPatient = {
            id: Date.now(), // Utiliser un ID unique
            code_patient: codePatient,
            nom,
            sexe,
            age: parseInt(age, 10),
            email,
        };
        onAdd(newPatient);
        // Réinitialiser le formulaire
        setCodePatient('');
        setNom('');
        setSexe('');
        setAge('');
        setEmail('');
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Code Patient"
                    value={codePatient}
                    onChange={(e) => setCodePatient(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <select
                    className="form-control"
                    value={sexe}
                    onChange={(e) => setSexe(e.target.value)}
                    required
                >
                    <option value="">Sélectionnez le sexe</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                </select>
            </div>
            <div className="mb-3">
                <input
                    type="number"
                    className="form-control"
                    placeholder="Âge"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn btn-success w-100">Ajouter Patient</button>
        </form>
    );
};

export default AjoutPatient;