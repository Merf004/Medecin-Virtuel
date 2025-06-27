import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Brain, Smartphone, Users, AlertCircle, Target, Database, Settings, Layers } from 'lucide-react';
import BonhommeM from '../assets/img/icon1.png';

const Apropos = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const Section = ({ id, title, icon: Icon, children, bgColor = "bg-secondary" }) => (
    <div className="card shadow-lg mb-4 border-0">
      <div 
        className={`card-header ${bgColor} text-black`}
        style={{ cursor: 'pointer' }}
        onClick={() => toggleSection(id)}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Icon className="me-3 mb-2" size={24} />
            <h3 className="h5 mb-2">{title}</h3>
          </div>
          {expandedSection === id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      {expandedSection === id && (
        <div className="card-body bg-light">
          {children}
        </div>
      )}
    </div>
  );

  const StatCard = ({ value, label, color = "text-primary" }) => (
    <div className="card h-100 shadow-sm border-start border-4 border-light">
      <div className="card-body">
        <div className={`display-6 fw-bold ${color} mb-2`}>{value}</div>
        <div className="text-muted">{label}</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Inclusion de Bootstrap CSS */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        <div className="container py-5">
          {/* En-tête */}
          <div className="text-center mb-5">
            <div className="d-flex justify-content-center mb-4">
                <img src = {BonhommeM} style={{ width: '200px', height: '200' }}/>
            </div>
            <h1 className="display-4 fw-bold text-dark mb-4">
              Médecin Virtuel - Détection du Paludisme
            </h1>
            <p className="lead text-muted mb-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
              Un système intelligent basé sur l'IA pour détecter le paludisme à partir d'images de frottis sanguins
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <span className="badge bg-light text-dark p-2">MBASSI ATANAGNA Yannick Serge</span>
              <span className="badge bg-light text-dark p-2">FEDIM PIOMO Merlin Brice</span>
              <span className="badge bg-light text-dark p-2">Université de Yaoundé 1 - Juin 2025</span>
            </div>
          </div>

          {/* Statistiques clés */}
          <div className="row mb-5">
            <div className="col-md-4 mb-3">
              <StatCard value="95.08%" label="Précision du modèle" color="text-secondary" />
            </div>
            <div className="col-md-4 mb-3">
              <StatCard value="27 558" label="Images analysées" color="text-secondary" />
            </div>
            <div className="col-md-4 mb-3">
              <StatCard value="0.15" label="Perte de validation" color="text-secondary" />
            </div>
          </div>

          {/* Sections principales */}
          <div>
            {/* Problématique */}
            <Section 
              id="problematique" 
              title="Problématique et Contexte" 
              icon={AlertCircle}
              bgColor="bg-light"
            >
              <div className="mb-4">
                <p className="text-muted">
                  Le paludisme reste l'un des plus grands défis sanitaires en Afrique. Transmis par les moustiques Anophèles, 
                  ce parasite continue de tuer malgré les moustiquaires, les traitements et même l'arrivée du vaccin RTS,S.
                </p>
                <p className="text-muted">
                  Au Cameroun, et notamment à Yaoundé, la situation reste critique. Face à un système de santé souvent débordé, 
                  il devient urgent de diagnostiquer rapidement et massivement pour sauver des vies.
                </p>
                <div className="alert alert-primary">
                  <strong>Chaque année, des millions de cas sont enregistrés en Afrique</strong>
                </div>
              </div>
            </Section>

            {/* Objectifs */}
            <Section 
              id="objectifs" 
              title="Objectifs du Projet" 
              icon={Target}
              bgColor="bg-light"
            >
              <div className="row">
                <div className="col-md-4 text-center mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '80px', height: '80px' }}>
                    <Brain size={32} className="text-primary" />
                  </div>
                  <h5 className="fw-bold">Objectif Principal</h5>
                  <p className="text-muted small">Créer un système automatique pour détecter le paludisme à partir d'images de frottis sanguin</p>
                </div>
                <div className="col-md-4 text-center mb-4">
                  <div className="bg-secondary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '80px', height: '80px' }}>
                    <Layers size={32} className="text-secondary" />
                  </div>
                  <h5 className="fw-bold">Développement Technique</h5>
                  <p className="text-muted small">Développer un modèle CNN performant pour l'analyse des images médicales</p>
                </div>
                <div className="col-md-4 text-center mb-4">
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '80px', height: '80px' }}>
                    <Users size={32} className="text-success" />
                  </div>
                  <h5 className="fw-bold">Accessibilité</h5>
                  <p className="text-muted small">Intégrer le modèle dans une application conviviale pour cliniciens et patients</p>
                </div>
              </div>
            </Section>

            {/* Méthodologie */}
            <Section 
              id="methodologie" 
              title="Méthodologie et Données" 
              icon={Database}
              bgColor="bg-light"
            >
              <div className="mb-4">
                <div className="card bg-primary bg-opacity-10 border-0 mb-4">
                  <div className="card-body">
                    <h5 className="text-secondary fw-bold mb-3">Dataset Utilisé</h5>
                    <p className="text-muted mb-4">
                      "Malaria Cell Images Dataset" du National Institutes of Health (NIH)
                    </p>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="card border">
                          <div className="card-body text-center">
                            <div className="h3 fw-bold text-danger">Parasitized</div>
                            <div className="text-muted small">Globules rouges infectés</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="card border">
                          <div className="card-body text-center">
                            <div className="h3 fw-bold text-success">Uninfected</div>
                            <div className="text-muted small">Cellules saines</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card bg-light border-0">
                  <div className="card-body">
                    <h5 className="fw-bold mb-3">Prétraitements</h5>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <span className="badge bg-dark rounded-pill me-2">•</span>
                        Redimensionnement à 128x128 pixels
                      </li>
                      <li className="mb-2">
                        <span className="badge bg-dark rounded-pill me-2">•</span>
                        Normalisation des pixels dans l'intervalle [0, 1]
                      </li>
                      <li className="mb-2">
                        <span className="badge bg-dark rounded-pill me-2">•</span>
                        Augmentation de données : rotations, flips, zooms
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Section>

            {/* Modèle */}
            <Section 
              id="modele" 
              title="Architecture du Modèle" 
              icon={Settings}
              bgColor="bg-light"
            >
              <div className="mb-4">
                <div className="card bg-secondary bg-opacity-10 border-0 mb-4">
                  <div className="card-body">
                    <h5 className="text-secondary fw-bold mb-3">Modèle MobileNetV2</h5>
                    <p className="text-muted">
                      Architecture CNN adaptée à la classification d'images médicales
                    </p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="card border">
                      <div className="card-body">
                        <h5 className="fw-bold mb-3">Paramètres d'Entraînement</h5>
                        <table className="table table-sm">
                          <tbody>
                            <tr>
                              <td>Fonction de perte:</td>
                              <td className="fw-bold">Categorical Crossentropy</td>
                            </tr>
                            <tr>
                              <td>Optimiseur:</td>
                              <td className="fw-bold">Adam</td>
                            </tr>
                            <tr>
                              <td>Époques:</td>
                              <td className="fw-bold">5</td>
                            </tr>
                            <tr>
                              <td>Taille de batch:</td>
                              <td className="fw-bold">32</td>
                            </tr>
                            <tr>
                              <td>Validation:</td>
                              <td className="fw-bold">Split 80/20</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-4">
                    <div className="card border">
                      <div className="card-body">
                        <h5 className="fw-bold mb-3">Performances</h5>
                        <div className="mb-4">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span>Précision</span>
                            <span className="text-primary fw-bold">95.08%</span>
                          </div>
                          <div className="progress" style={{ height: '8px' }}>
                            <div className="progress-bar bg-primary" style={{ width: '95%' }}></div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Perte de validation</span>
                          <span className="text-info fw-bold">0.15</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Limites et Perspectives */}
            <Section 
              id="perspectives" 
              title="Limites et Perspectives" 
              icon={Smartphone}
              bgColor="bg-light"
            >
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card bg-danger bg-opacity-10 border-0">
                    <div className="card-body">
                      <h5 className="fw-bold mb-3 text-danger">Limites Actuelles</h5>
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <span className="badge bg-danger rounded-pill me-2">•</span>
                          <span className="small">Dataset non diversifié</span>
                        </li>
                        <li className="mb-2">
                          <span className="badge bg-danger rounded-pill me-2">•</span>
                          <span className="small">Dataset ne répondant pas au contexte africain</span>
                        </li>
                        <li className="mb-2">
                          <span className="badge bg-danger rounded-pill me-2">•</span>
                          <span className="small">Source unique de données</span>
                        </li>
                        <li className="mb-2">
                          <span className="badge bg-danger rounded-pill me-2">•</span>
                          <span className="small">Pas encore testé en conditions réelles</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-4">
                  <div className="card bg-primary bg-opacity-10 border-0">
                    <div className="card-body">
                      <h5 className="text-primary fw-bold mb-3">Perspectives d'Amélioration</h5>
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <span className="badge bg-primary rounded-pill me-2">•</span>
                          <span className="small">Enrichir le dataset avec des données d'hôpitaux locaux</span>
                        </li>
                        <li className="mb-2">
                          <span className="badge bg-primary rounded-pill me-2">•</span>
                          <span className="small">Intégrer d'autres types de parasites</span>
                        </li>
                        <li className="mb-2">
                          <span className="badge bg-primary rounded-pill me-2">•</span>
                          <span className="small">Déployer le modèle sur smartphone</span>
                        </li>
                        <li className="mb-2">
                          <span className="badge bg-primary rounded-pill me-2">•</span>
                          <span className="small">Prise en compte de la parasitémie</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          </div>

          {/* Conclusion */}
          <div className="card bg-light text-black mt-5 border-0">
            <div className="card-body p-5">
              <p className="lead">
                Le paludisme demeure un problème majeur de santé publique, notamment en Afrique, où le diagnostic précoce 
                est essentiel pour réduire la mortalité. Grâce à l'apprentissage profond, notamment les algorithmes de vision 
                par ordinateur, il est désormais possible d'automatiser l'analyse des frottis sanguins avec une grande précision. 
                Ce projet s'inscrit dans cette dynamique, avec pour ambition de proposer un outil simple, rapide et accessible, 
                notamment pour les zones rurales où les ressources médicales sont limitées.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Apropos;