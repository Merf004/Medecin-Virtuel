import React, { useState, useEffect } from "react";
import {
  Badge,
  Button,
  Card,
  Form,
  InputGroup,
  Container,
  Row,
  Col,
  Pagination
} from "react-bootstrap";

function Listeanalyses() {
  const [analyses, setAnalyses] = useState([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/getresults/")
      .then(response => response.json())
      .then(data => {   
        const getresults = data.map(entry => {
          let finalStatus = 'Inconnu'; // Valeur par défaut
          
          try {
            // Vérifier si entry.status existe et n'est pas vide
            if (entry.status && entry.status.trim() !== '') {
              const parsedStatus = JSON.parse(entry.status.replace(/'/g, '"'));
              
              // Vérifier que les propriétés existent
              if (parsedStatus && 
                  typeof parsedStatus.Parasitized === 'number' && 
                  typeof parsedStatus.Uninfected === 'number') {
                finalStatus = parsedStatus.Parasitized > parsedStatus.Uninfected ? 'Positif' : 'Négatif';
              }
            }
          } catch (error) {
            console.warn('Erreur lors du parsing du statut pour l\'entrée:', entry, 'Erreur:', error);
            // finalStatus reste 'Inconnu'
          }
          
          return {
            ...entry,
            status: finalStatus
          };
        });
        setAnalyses(getresults);
        setFilteredAnalyses(getresults);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur :", error);
        setLoading(false);
      });
  }, []);

  // Fonction de filtrage
  useEffect(() => {
    let filtered = analyses;

    // Filtre par terme de recherche (nom ou code patient)
    if (searchTerm) {
      filtered = filtered.filter(analyse => 
        analyse.nom_patient && analyse.nom_patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analyse.code_patient && analyse.code_patient.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter) {
      filtered = filtered.filter(analyse => analyse.status === statusFilter);
    }

    // Filtre par date
    if (dateFilter) {
      filtered = filtered.filter(analyse => analyse.date && analyse.date.includes(dateFilter));
    }

    setFilteredAnalyses(filtered);
    setCurrentPage(1); // Retour à la première page après filtrage
  }, [searchTerm, statusFilter, dateFilter, analyses]);

  // Calculs pour la pagination
  const totalPages = Math.ceil(filteredAnalyses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnalyses = filteredAnalyses.slice(startIndex, endIndex);

  // Fonction pour changer de page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setDateFilter("");
  };

  // Génération des éléments de pagination
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    // Première page
    if (currentPage > maxVisiblePages) {
      items.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      if (currentPage > maxVisiblePages + 1) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" />);
      }
    }

    // Pages visibles autour de la page courante
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    // Dernière page
    if (currentPage < totalPages - maxVisiblePages + 1) {
      if (currentPage < totalPages - maxVisiblePages) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" />);
      }
      items.push(
        <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  // Fonction pour obtenir la couleur du badge selon le statut
  const getBadgeVariant = (status) => {
    switch(status) {
      case 'Négatif': return 'success';
      case 'Positif': return 'danger';
      default: return 'secondary';
    }
  };

  // Fonction pour obtenir l'icône selon le statut
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Négatif': return 'fa-check';
      case 'Positif': return 'fa-exclamation-triangle';
      default: return 'fa-question-circle';
    }
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="d-flex justify-content-center align-items-center" style={{height: '400px'}}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header bg-light text-gray">
                {/* Statistiques */}
      <div className="mt-4">
        <Row>
          <Col md={3}>
            <div className="card bg-secondary text-white">
              <div className="card-body text-center">
                <i className="fas fa-chart-bar fa-2x mb-2"></i>
                <h4>{analyses.length}</h4>
                <small>Total Analyses</small>
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div className="card bg-success text-white">
              <div className="card-body text-center">
                <i className="fas fa-check-circle fa-2x mb-2"></i>
                <h4>{analyses.filter(a => a.status === 'Négatif').length}</h4>
                <small>Résultats Négatifs</small>
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div className="card bg-danger text-white">
              <div className="card-body text-center">
                <i className="fas fa-exclamation-triangle fa-2x mb-2"></i>
                <h4>{analyses.filter(a => a.status === 'Positif').length}</h4>
                <small>Résultats Positifs</small>
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div className="card bg-info text-white">
              <div className="card-body text-center">
                <i className="fas fa-filter fa-2x mb-2"></i>
                <h4>{filteredAnalyses.length}</h4>
                <small>Résultats Filtrés</small>
              </div>
            </div>
          </Col>
        </Row>
      </div>
        </div>
        
        {/* Filtres */}
        <div className="card-body border-bottom">
          <Row className="g-3">
            <Col md={4}>
              <Form.Label>Rechercher</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Nom ou code patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            
            <Col md={3}>
              <Form.Label>Filtrer par statut</Form.Label>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="Positif">Positif</option>
                <option value="Négatif">Négatif</option>
                <option value="Inconnu">Inconnu</option>
              </Form.Select>
            </Col>
            
            <Col md={3}>
              <Form.Label>Filtrer par date</Form.Label>
              <Form.Control
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </Col>
            
            <Col md={2} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={resetFilters} className="w-100">
                <i className="fas fa-undo me-1 mr-2"></i>
                Réinitialiser
              </Button>
            </Col>
          </Row>
        </div>

        {/* Informations et contrôles */}
        <div className="card-body border-bottom">
          <Row className="align-items-center">
            <Col md={6}>
              <div className="d-flex align-items-center gap-3">
                <span className="text-muted">
                  Affichage de {startIndex + 1} à {Math.min(endIndex, filteredAnalyses.length)} sur {filteredAnalyses.length} résultats
                </span>
                {filteredAnalyses.length !== analyses.length && (
                  <Badge bg="info">
                    Filtré sur {analyses.length} total
                  </Badge>
                )}
              </div>
            </Col>
            <Col md={6} className="text-end">
              <Form.Select
                style={{ width: '200px', display: 'inline-block' }}
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10 par page</option>
                <option value={25}>25 par page</option>
                <option value={50}>50 par page</option>
                <option value={100}>100 par page</option>
              </Form.Select>
            </Col>
          </Row>
        </div>

        {/* Tableau */}
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-light">
                <tr>
                  <th className="border-0">
                    <i className="fas fa-calendar me-1"></i>
                    Date
                  </th>
                  <th className="border-0">
                    <i className="fas fa-id-card me-1"></i>
                    Code Patient
                  </th>
                  <th className="border-0">
                    <i className="fas fa-user me-1"></i>
                    Nom Patient
                  </th>
                  <th className="border-0 text-center">
                    <i className="fas fa-heartbeat me-1"></i>
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentAnalyses.length > 0 ? (
                  currentAnalyses.map((analyse, index) => (
                    <tr key={startIndex + index}>
                      <td className="align-middle">{analyse.date || 'N/A'}</td>
                      <td className="align-middle">
                        <code className="bg-light p-1 rounded">{analyse.code_patient || 'N/A'}</code>
                      </td>
                      <td className="align-middle font-weight-bold">{analyse.nom_patient || 'N/A'}</td>
                      <td className="align-middle text-center">
                        <Badge
                          bg={getBadgeVariant(analyse.status)}
                          className="px-3 py-2"
                          style={{ minWidth: '80px' }}
                        >
                          <i className={`fas ${getStatusIcon(analyse.status)} me-1`}></i>
                          {analyse.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">
                      <i className="fas fa-search fa-2x mb-2"></i>
                      <br />
                      Aucun résultat trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="card-footer">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted">
                Page {currentPage} sur {totalPages}
              </div>
              <Pagination className="mb-0">
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                {renderPaginationItems()}
                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </Pagination>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Listeanalyses;