import React, { useState, useRef, useEffect } from 'react';
import { Upload, User, FileImage, Activity, AlertCircle, CheckCircle } from 'lucide-react';

const Analyse = () => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePath, setImagePath] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null); // Changé en null au lieu d'un objet par défaut
  const [isAnalyzing, setIsAnalyzing] = useState(false); // Nouvel état pour gérer le chargement
   const [rapportpdf, setrapportpdf] = useState(false);
  
  const fileInputRef = useRef(null);

  // Données des patients
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/showpatient/")
      .then(response => response.json())
      .then(data => {
        setPatients(data)
      })
      .catch(error => console.error("Erreur :", error));
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setImagePath(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalysis = () => {
    if (!selectedPatient || !selectedImage) {
      alert('Veuillez sélectionner un patient et une image');
      return;
    }

    // Démarrer l'état de chargement
    setIsAnalyzing(true);
    setAnalysisResults(null); // Réinitialiser les résultats précédents

    const formData = new FormData();
    formData.append("id_patient", parseInt(selectedPatient.slice(-5)));
    formData.append("image", selectedImage);

    fetch("http://localhost:8000/api/analyse/", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Échec de l'envoi");
        return res.json();
      })
      .then((data) => {
        setAnalysisResults(data); // Les résultats ne s'afficheront qu'ici
        setIsAnalyzing(false);
      })
      .catch((error) => {
        console.error("Erreur :", error);
        setIsAnalyzing(false);
        alert("Erreur lors de l'analyse. Veuillez réessayer.");
      });
  };


const rapportPDF = () => {
  const id = parseInt(selectedPatient.slice(-5))
  fetch("http://127.0.0.1:8000/api/rapportpdf/", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id_patient: id })
  })
    .then((res) => {
      if (!res.ok) throw new Error("Échec de l'envoi");
      return res.blob(); // Changé de res.json() à res.blob()
    })
    .then((blob) => {

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rapport_patient.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Erreur :", error);
    });
};


  const getPatientInfo = () => {
    return patients.find(p => p.code_patient === selectedPatient);
  };

  // Vérifier si les résultats existent avant d'accéder aux propriétés
  const isInfected = analysisResults && analysisResults.resultats 
    ? analysisResults.resultats.Parasitized > analysisResults.resultats.Uninfected 
    : false;

  const isFormValid = selectedPatient && selectedImage;

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* PARTIE 1: SAISIE DES INFORMATIONS */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-light text-white">
              <h3 className="card-title mb-0">
                Informations Patient et Image
              </h3>
            </div>
            <div className="card-body">
              <div className="row">
                {/* Sélection du patient */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="patientSelect" className="form-label fw-bold">
                    Sélectionner un patient :
                  </label>
                  <select
                    id="patientSelect"
                    className="form-select"
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    disabled={isAnalyzing}
                  >
                    <option value="">-- Choisir un patient --</option>
                    {patients.map((patient) => (
                      <option key={patient.code_patient} value={patient.code_patient}>
                        {patient.nom} ({patient.code_patient})
                      </option>
                    ))}
                  </select>
                  
                  {selectedPatient && (
                    <div className="mt-2 p-2 bg-light rounded">
                      <small className="text-muted">
                        <strong>Détails:</strong> {getPatientInfo()?.sexe}, {getPatientInfo()?.age} ans
                        <br />
                        <strong>Email:</strong> {getPatientInfo()?.email}
                      </small>
                    </div>
                  )}
                </div>

                {/* Upload d'image */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="imageUpload" className="form-label fw-bold">
                    Image du frotis sanguin :
                  </label>
                  <div className="input-group">
                    <input
                      type="file"
                      id="imageUpload"
                      ref={fileInputRef}
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isAnalyzing}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isAnalyzing}
                    >
                      <Upload size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Prévisualisation de l'image */}
              {imagePreview && (
                <div className="row mt-3">
                  <div className="col-12">
                    <div className="text-center">
                      <h5>
                        <FileImage className="me-2 mr-2" size={20} />
                        Prévisualisation de l'image
                      </h5>
                      <img
                        src={imagePreview}
                        alt="Frotis sanguin"
                        className="img-fluid rounded shadow"
                        style={{ maxHeight: '300px', maxWidth: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bouton d'analyse */}
              <div className="row mt-4">
                <div className="col-12 text-center">
                  <button
                    className={`btn btn-lg px-5 ${isFormValid && !isAnalyzing ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={handleAnalysis}
                    disabled={!selectedPatient || !selectedImage || isAnalyzing}
                    style={{
                      minWidth: '200px',
                      position: 'relative',
                      opacity: isFormValid && !isAnalyzing ? 1 : 0.6
                    }}
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2 mr-2" role="status" aria-hidden="true"></div>
                        Analyse en cours...
                      </>
                    ) : (
                      <>
                        <Activity className="me-2 mr-2" size={20} />
                        Lancer l'analyse
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PARTIE 2: RÉSULTATS D'ANALYSE - Affiché uniquement si analysisResults existe */}
      {analysisResults && analysisResults.resultats && (
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-light text-white">
                <h3 className="card-title mb-0">
                  Résultats d'Analyse
                </h3>
              </div>
              <div className="card-body">

                {/* Résultats détaillés */}
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="card">
                      <div className="card-header bg-light">
                        <h5 className="card-title mb-0">Résultats de Classification</h5>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-bold text-danger">Infecté:</span>
                            <span className="badge bg-danger fs-6">
                              {(analysisResults.resultats.Parasitized * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="progress mb-3" style={{ height: '25px' }}>
                            <div
                              className="progress-bar bg-danger"
                              role="progressbar"
                              style={{ width: `${analysisResults.resultats.Parasitized * 100}%` }}
                            >
                              {(analysisResults.resultats.Parasitized * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-bold text-success">Non infecté:</span>
                            <span className="badge bg-success fs-6">
                              {(analysisResults.resultats.Uninfected * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="progress mb-3" style={{ height: '25px' }}>
                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              style={{ width: `${analysisResults.resultats.Uninfected * 100}%` }}
                            >
                              {(analysisResults.resultats.Uninfected * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-4">
                    <div className="card">
                      <div className="card-header bg-light">
                        <h5 className="card-title mb-0">Informations Patient</h5>
                      </div>
                      <div className="card-body">
                        <table className="table table-borderless">
                          <tbody>
                            <tr>
                              <td><strong>ID Patient:</strong></td>
                              <td><code>{analysisResults.id_patient}</code></td>
                            </tr>
                            <tr>
                              <td><strong>Nom Patient:</strong></td>
                              <td>{analysisResults.nom_patient}</td>
                            </tr>
                           
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Résumé final */}
                <div className="row">
                  <div className="col-9">
                    <div className="bg-light p-4 rounded">
                      <h6 className="mb-3">Résumé de l'analyse:</h6>
                      <p className="mb-2">
                        <strong>Patient :</strong> {analysisResults.nom_patient} ({analysisResults.id_patient})
                      </p>
                      <p className="mb-2">
                        <strong>Résultat principal : </strong> 
                        <span className={`ms-2 fw-bold ${isInfected ? 'text-danger' : 'text-success'}`}>
                          {isInfected ? 'PARASITÉ' : 'NON INFECTÉ'}
                        </span>
                      </p>
                      <p className="mb-0">
                        <strong>Probabilité d'infection : </strong> {(analysisResults.resultats.Parasitized * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className='col-3'>
                    <div className="align-items-center" style={{ height: '100vh' }}>
                      <button 
                        className={`btn btn-lg ${isInfected ? 'btn-danger' : 'btn-success'} shadow rounded-pill px-4 mt-5`}
                        onClick={rapportPDF} 
                      >
                        Télécharger Resultat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyse;