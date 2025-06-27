import React, { useState, useEffect } from "react";
import {
  Badge,
  Button,
  Card,
  Form,
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Table
} from "react-bootstrap";

const Listepatients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editForm, setEditForm] = useState({
    nom: '',
    sexe: '',
    age: '',
    email: ''
  });
  const [idPatient, setIdPatient] = useState(null);

  // Fonction de recherche
  useEffect(() => {
    const filtered = patients.filter(patient =>
      patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.code_patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.sexe.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
    setCurrentPage(1); // Retour à la première page lors de la recherche
  }, [searchTerm, patients]);

  // Fonction de tri
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Appliquer le tri
  const sortedPatients = React.useMemo(() => {
    let sortablePatients = [...filteredPatients];
    if (sortConfig.key) {
      sortablePatients.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortablePatients;
  }, [filteredPatients, sortConfig]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = sortedPatients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedPatients.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fonction pour obtenir l'icône de tri
  const getSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  const handleDeleteClick = (patient) => {
    setSelectedPatient(patient);
    setShowDeleteModal(true);
    const id_patient = parseInt(patient.code_patient.slice(-5));
    setIdPatient(id_patient);
  };

  const handleEditClick = (patient) => {
    setSelectedPatient(patient);
    setEditForm({
      nom: patient.nom,
      sexe: patient.sexe,
      age: patient.age,
      email: patient.email
    });
    setShowEditModal(true);
    const id_patient = parseInt(patient.code_patient.slice(-5));
    setIdPatient(id_patient);
  };

  const confirmDelete = () => {
    setPatients(patients.filter(p => p.code_patient !== selectedPatient.code_patient));
    setShowDeleteModal(false);
    setSelectedPatient(null);
    fetch(`http://127.0.0.1:8000/api/patientdelete/${idPatient}/delete/`, {
        method: 'DELETE',
      })
      .then(res => {
        if (!res.ok) {
          throw new Error("La suppression a échoué");
        }
      })
      .catch(error => {
        console.error("Erreur de suppression :", error);
      });
  };

  const handleEditSubmit = () => {
    if (!editForm.nom || !editForm.sexe || !editForm.age || !editForm.email) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setPatients(patients.map(p => 
      p.code_patient === selectedPatient.code_patient 
        ? { ...p, ...editForm }
        : p
    ));
    setShowEditModal(false);
    setSelectedPatient(null);

    fetch(`http://127.0.0.1:8000/api/updatepatient/${idPatient}/update/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(editForm)
    })
    .then(res => {
      if (!res.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }
      return res.json();
    })
    .then(data => {
      console.log("Patient mis à jour avec succès :", data);
    })
    .catch(err => {
      console.error("Erreur :", err);
    });
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/showpatient/")
      .then(response => response.json())
      .then(data => {
        setPatients(data);
      })
      .catch(error => console.error("Erreur :", error));
  }, []);

  return (
    <Container fluid>
      <Card className="strpied-tabled-with-hover">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <p className="card-category mb-0">
              {sortedPatients.length} patients trouvés sur {patients.length} enregistrés
            </p>
            <div className="d-flex align-items-center gap-3">
              <div>
                <label className="me-2 mr-2">Afficher:</label>
                <select 
                  className="form-select form-select-sm d-inline-block w-auto mr-3"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="mr-3">entrées</span>
              </div>
              <div>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '200px' }}
                />
              </div>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="table-full-width table-responsive px-0">
          <Table className="table-hover table-striped">
            <thead>
              <tr>
                <th 
                  className="border-0 sortable" 
                  onClick={() => handleSort('code_patient')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Code Patient {getSortIcon('code_patient')}
                </th>
                <th 
                  className="border-0 sortable" 
                  onClick={() => handleSort('nom')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Nom {getSortIcon('nom')}
                </th>
                <th 
                  className="border-0 sortable" 
                  onClick={() => handleSort('sexe')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Sexe {getSortIcon('sexe')}
                </th>
                <th 
                  className="border-0 sortable" 
                  onClick={() => handleSort('age')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Âge {getSortIcon('age')}
                </th>
                <th 
                  className="border-0 sortable" 
                  onClick={() => handleSort('email')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Email {getSortIcon('email')}
                </th>
                <th className="border-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.length > 0 ? (
                currentPatients.map((patient) => (
                  <tr key={patient.code_patient}>
                    <td>{patient.code_patient}</td>
                    <td>{patient.nom}</td>
                    <td>{patient.sexe}</td>
                    <td>{patient.age} ans</td>
                    <td>{patient.email}</td>
                    <td>
                      <button 
                        className="btn btn-warning btn-sm me-2 mr-3"
                        onClick={() => handleEditClick(patient)}
                      >
                        <i className="fas fa-edit"></i> Modifier
                      </button>
                      <button 
                        className="btn btn-danger btn-sm ml-3"
                        onClick={() => handleDeleteClick(patient)}
                      >
                        <i className="fas fa-trash"></i> Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Aucun patient trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Card.Footer>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, sortedPatients.length)} sur {sortedPatients.length} entrées
              </div>
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </button>
                  </li>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Afficher seulement quelques pages autour de la page courante
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                    ) {
                      return (
                        <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                          <button 
                            className="page-link"
                            onClick={() => paginate(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        </li>
                      );
                    } else if (
                      pageNumber === currentPage - 3 ||
                      pageNumber === currentPage + 3
                    ) {
                      return (
                        <li key={pageNumber} className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      );
                    }
                    return null;
                  })}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </Card.Footer>
        )}
      </Card>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmer la suppression</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Êtes-vous sûr de vouloir supprimer le patient <strong>{selectedPatient?.nom}</strong> ?</p>
                <p className="text-muted">Code: {selectedPatient?.code_patient}</p>
                <p className="text-danger"><small>Cette action est irréversible.</small></p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Annuler
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de modification */}
      {showEditModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modifier le patient</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Code Patient</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={selectedPatient?.code_patient || ''} 
                      disabled 
                    />
                    <small className="text-muted">Le code patient ne peut pas être modifié</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nom *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="nom"
                      value={editForm.nom}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Sexe *</label>
                    <select 
                      className="form-control" 
                      name="sexe"
                      value={editForm.sexe}
                      onChange={handleInputChange}
                      disabled
                    >
                      <option value="">{editForm.sexe}</option>
                      <option value="Masculin">Masculin</option>
                      <option value="Féminin">Féminin</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Âge *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="age"
                      value={editForm.age}
                      onChange={handleInputChange}
                      min="0"
                      max="120"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email *</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Annuler
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleEditSubmit}
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Listepatients;