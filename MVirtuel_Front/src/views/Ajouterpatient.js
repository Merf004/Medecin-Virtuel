import React, { useState } from "react";

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function Ajouterpatient() {
const [formData, setFormData] = useState({
    nom: '',
    sexe: '',
    age: '',
    email: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!isFormValid) return;
    
    setIsLoading(true);
    
    // Appel API
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
    fetch("http://localhost:8000/api/patients/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .catch(err => console.error("Erreur :", err));
      };

  const handleNewPatient = () => {
    setFormData({
      nom: '',
      sexe: '',
      age: '',
      email: ''
    });
    setIsSubmitted(false);
  };

  const handleExit = () => {
    // Ici vous pouvez rediriger vers une autre page ou fermer le modal
    console.log('Sortie du formulaire');
    // Exemple: navigate('/dashboard') ou onClose()
  };

  const isFormValid = formData.nom && formData.sexe && formData.age && formData.email;

  if (isSubmitted) {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body text-center">
                <div className="mb-4">
                  <div className="text-success mb-3">
                    <i className="fas fa-check-circle" style={{fontSize: '4rem'}}></i>
                  </div>
                  <h3 className="text-success">Patient enregistré avec succès !</h3>
                  <p className="text-muted">
                    Le patient <strong>{formData.nom}</strong> a été ajouté à la base de données.
                  </p>
                </div>
                
                <div className="d-flex gap-3 justify-content-center">
                  <button 
                    className="btn btn-success btn-lg px-4"
                    onClick={handleNewPatient}
                  >
                    <i className="fas fa-plus me-2 mr-1"></i>
                    Nouveau patient
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }



  return (
    <>
      <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-light text-white">
              <h4 className="card-title mb-0 text-center">
                <i className="fas fa-user-plus me-2 text-success mb-3"></i>
              </h4>
            </div>
            <div className="card-body p-4">
              <div>
                {/* Nom */}
                <div className="mb-4">
                  <label htmlFor="nom" className="form-label fw-bold">
                    <i className="fas fa-user me-2 text-secondary mr-2"></i>
                    Nom complet <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    placeholder="Entrez le nom complet"
                  />
                </div>
                
                {/* Sexe */}
                <div className="mb-4">
                  <label htmlFor="sexe" className="form-label fw-bold">
                    <i className="fas fa-venus-mars me-2 text-secondary mr-2"></i>
                    Sexe <span className="text-danger">*</span>
                  </label>
                  <p>
                    <select
                    className="form-select form-select-lg"
                    id="sexe"
                    name="sexe"
                    value={formData.sexe}
                    onChange={handleInputChange}
                  >
                    <option value="">Sélectionnez le sexe</option>
                    <option value="Masculin">Masculin</option>
                    <option value="Feminin">Féminin</option>
                  </select>
                  </p> 
                </div>

                {/* Age */}
                <div className="mb-4">
                  <label htmlFor="age" className="form-label fw-bold">
                    <i className="fas fa-calendar-alt me-2 text-secondary mr-2"></i>
                    Âge <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Entrez l'âge"
                    min="1"
                    max="120"
                  />
                </div>
                
                {/* Email */}
                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-bold">
                    <i className="fas fa-envelope me-2 text-secondary mr-2"></i>
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Entrez l'adresse email"
                  />
                </div>

                {/* Boutons */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-5">
                  <button 
                    type="button" 
                    className={`btn btn-lg px-5 ${isFormValid ? 'btn-success' : 'btn-outline-success'}`}
                    disabled={!isFormValid || isLoading}
                    onClick={handleSubmit}
                    style={{
                      minWidth: '200px',
                      position: 'relative',
                      opacity: isFormValid ? 1 : 0.6
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check-circle me-2"></i>
                        Confirmer l'enregistrement
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Ajouterpatient;
