import React, { useState } from 'react';
import { useParams, Link} from 'react-router-dom';

const Analyse = () => {
    const { id } = useParams(); // Récupérer l'ID du patient depuis l'URL
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Simuler une analyse
        const isInfected = Math.random() < 0.5; // Juste pour simuler un résultat aléatoire
        const analysisResult = {
            id,
            infected: isInfected,
        };

        setResult(analysisResult);
        const patient = patients.find((p) => p.id === id);
    };  

    return (
        <div className="container mt-5">
            <h2 className="text-center">Analyse Patient (ID: {})</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success w-100">Soumettre l'analyse</button>
            </form>
            <Link to = '/listepatients'><button type="button" className="btn btn-success w-100 mt-1">Analyser un autre patient</button></Link>
            
            {result && (
                <div className="mt-3">
                    <h5 style={{ color: result.infected ? 'red' : 'green' }}>
                        Patient ID: {result.id} est {result.infected ? 'Infecté' : 'Non Infecté'}
                    </h5>
                </div>
            )}
        </div>
    );
};

export default Analyse;
