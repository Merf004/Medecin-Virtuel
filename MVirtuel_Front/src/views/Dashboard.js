import React, { useState, useEffect } from "react";
import ChartistGraph from "react-chartist";
// react-bootstrap components
import {
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";




function Dashboard() {

  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
  const day = String(d.getDate()).padStart(2, '0');

  const today = `${year}-${month}-${day}`;

  const [patientPaSexe, setPatientParSexe] = useState([]);
  const [nombrepatient, setnombrepatient] = useState([]);
  const [totalanalyse, settotalanalyse] = useState([]);
  const [analyserepartie, setanalyserepartie] = useState([]);
  const [evolutionmensuelleparasite, setevolutionmensuelleparasite] = useState([]);
  const [derniereanalyse, setderniereanalyse] = useState([]);
  const [repartitionsexeparasite, setrepartitionsexeparasite] = useState([]);
  const [trancheageinfectees, settrancheageinfectees] = useState([]);
  
  


    useEffect(() => {
      fetch("http://127.0.0.1:8000/api/patientparsexe/")
        .then(response => response.json())
        .then(data => { 
          setPatientParSexe(data)
        })
        .catch(error => console.error("Erreur :", error));
    }, []);


    useEffect(() => {
      fetch("http://127.0.0.1:8000/api/nombrepatient/")
        .then(response => response.json())
        .then(data => { 
          setnombrepatient(data)
        })
        .catch(error => console.error("Erreur :", error));
    }, []);


        useEffect(() => {
      fetch("http://127.0.0.1:8000/api/totalanalyse/")
        .then(response => response.json())
        .then(data => { 
          settotalanalyse(data)
        })
        .catch(error => console.error("Erreur :", error));
    }, []);


        useEffect(() => {
      fetch(`http://127.0.0.1:8000/api/analyserepartie/?date=${today}`)
        .then(response => response.json())
        .then(data => { 
          setanalyserepartie(data)
        })
        .catch(error => console.error("Erreur :", error));
    }, []);
    
        useEffect(() => {
      fetch("http://127.0.0.1:8000/api/evolutionmensuelleparasite/")
        .then(response => response.json())
        .then(data => { 
          console.log(data)
          setevolutionmensuelleparasite(data)
        })
        .catch(error => console.error("Erreur :", error));
    }, []);

        useEffect(() => {
      fetch("http://127.0.0.1:8000/api/derniereanalyse/")
        .then(response => response.json())
        .then(data => {   
          const derniereanalyse = data.map(entry => {
          const parsedStatus = JSON.parse(entry.status.replace(/'/g, '"'));
          const finalStatus = parsedStatus.Parasitized > parsedStatus.Uninfected ? 'Positif' : 'Négatif';
          return {
            ...entry,
            status: finalStatus
            };
          });
          setderniereanalyse(derniereanalyse)
        })
        .catch(error => console.error("Erreur :", error));
    }, []);
    
    useEffect(() => {
      fetch("http://127.0.0.1:8000/api/repartitionsexeparasite/")
        .then(response => response.json())
        .then(data => { 
          setrepartitionsexeparasite(data)
        })
        .catch(error => console.error("Erreur :", error));
    }, []);

      useEffect(() => {
      fetch("http://127.0.0.1:8000/api/trancheageinfectees/")
        .then(response => response.json())
        .then(data => { 
          settrancheageinfectees(data)
        })
        .catch(error => console.error("Erreur :", error));
    }, []);




  // Convertir l'objet en tableau pour l'affichage
  const ageGroups = Object.entries(trancheageinfectees).map(([tranche, nombre]) => ({
    tranche: `${tranche} ans`,
    nombre: nombre
  }));

  const getProgressWidth = (nombre) => {
    const max = Math.max(...ageGroups.map(group => group.nombre));
    return (nombre / max) * 100;
  };

  const getProgressColor = (nombre) => {
    if (nombre >= 1) return 'bg-info';
    return 'bg-secondary';
  };


  const nombrecasmois = [0, 0, 0, 0, 0, Object.values(evolutionmensuelleparasite)[0], 0, 0, 0, 0, 0, 0]
  const sum = nombrecasmois.reduce((accumulator, currentValue) => {
  return accumulator + currentValue;
}, 0);


  return (
    <>

        {/* Styles CSS directement dans le JS */}
        <style jsx>{`
          #chartHours .ct-series-a .ct-line {
            stroke: #dc3545  !important;
            stroke-width: 3px !important;
          }

          #chartHours .ct-series-a .ct-point {
            stroke: #dc3545  !important;
            fill: #dc3545  !important;
          }
        `}</style>
      <Container fluid>
        <Row>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-single-02 text-warning"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Patient par sexe</p>
                      <Card.Title as="h4"><span className="text-warning">M</span> : {patientPaSexe.masculin} <br/> <span className="text-warning">F</span> : {patientPaSexe.feminin}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  Total : {nombrepatient['Nombre de patients']}
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-notes text-info"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Total d'analyse</p>
                      <Card.Title as="h4">{totalanalyse["Nombre d'analyse effectuees"]}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  Total : {totalanalyse["Nombre d'analyse effectuees"]}
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-fav-remove text-danger"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Cas parasités aujourd'hui</p>
                      <Card.Title as="h4">{analyserepartie.parasites}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-clock-o mr-1"></i>
                  date : {analyserepartie.date}
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Cas non parasités aujourd'hui</p>
                      <Card.Title as="h4">{analyserepartie.non_parasites}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  date : {analyserepartie.date}
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="8">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Evolution mensuelle des cas parasités</Card.Title>
                <p className="card-category text-danger">{sum} cas total</p>
              </Card.Header>
              <Card.Body>
                <div className="ct-chart" id="chartHours">
                  <ChartistGraph
                    data={{
                      labels: [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "Mai",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ],
                      series: [
                        nombrecasmois,
                      ],
                    }}
                    type="Line"
                    options={{
                      low: 0,
                      high: 200,
                      showArea: false,
                      height: "245px",
                      axisX: {
                        showGrid: false,
                      },
                      lineSmooth: true,
                      showLine: true,
                      showPoint: true,
                      fullWidth: true,
                      chartPadding: {
                        right: 50,
                      },
                    }}
                    responsiveOptions={[
                      [
                        "screen and (max-width: 640px)",
                        {
                          axisX: {
                            labelInterpolationFnc: function (value) {
                              return value[0];
                            },
                          },
                        },
                      ],
                    ]}
                  />
                </div>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  NB: L'application a commencé a fonctionner ce mois(Juin), donc la forme de la courbe est logique.
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col md="4">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Derniers patients analysés</Card.Title>
                <p className="card-category">Les 10 derniers</p>
              </Card.Header>
              <Card.Body>
                <div className="container mt-4">
                  <div className="card">
                    <div className="card-body p-0">
                      <div className="list-group list-group-flush" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                        {derniereanalyse.map((person) => (
                          <div key={person.code_patient} className="list-group-item d-flex justify-content-between align-items-center py-3">
                            <div>
                              <h5 className="mb-1">{person.nom_patient}</h5>
                              <small className="text-muted">ID: {person.code_patient} | Date: {person.date}</small>
                            </div>
                            <div>
                              <span 
                                className={`badge px-3 py-2 rounded ${
                                  person.status === 'Négatif' 
                                    ? 'bg-success text-white' 
                                    : 'bg-danger text-white'
                                }`}
                                style={{ minWidth: '80px' }}
                              >
                                {person.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <hr></hr>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Repartition des cas positif par sexe</Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="ct-chart" id="chartActivity">
                  <ChartistGraph
                    data={{
                      labels: Object.keys(repartitionsexeparasite),
                      series: [Object.values(repartitionsexeparasite)],
                    }}
                    type="Bar"
                    options={{
                      seriesBarDistance: 10,
                      axisX: {
                        showGrid: false,
                      },
                      height: "245px",
                    }}
                    responsiveOptions={[
                      [
                        "screen and (max-width: 640px)",
                        {
                          seriesBarDistance: 5,
                          axisX: {
                            labelInterpolationFnc: function (value) {
                              return value[0];
                            },
                          },
                        },
                      ],
                    ]}
                  />
                </div>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <p><span className="text-info">Homme</span> : {repartitionsexeparasite.Masculin}</p>
                  <p><span className="text-danger">Femme</span> : {repartitionsexeparasite.Feminin}</p>
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col md="6">
            <Card className="card-tasks">
              <Card.Header>
                <Card.Title as="h4">Répartition des cas positifs par Tranches d'Âge</Card.Title>
                <p className="card-category">pas = 10 ans</p>
              </Card.Header>
              <Card.Body>
                <div className="container mt-4">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <span className="badge"> Total : {ageGroups.reduce((sum, group) => sum + group.nombre, 0)}</span>
                    </div>
                    <div className="card-body p-0">
                      <div className="list-group list-group-flush" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                        {ageGroups.map((group, index) => (
                          <div key={index} className="list-group-item py-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div>
                                <h6 className="mb-1 fw-bold">{group.tranche}</h6>
                              </div>
                              <div className="text-end">
                                <span className="badge fs-6 px-3 py-2">
                                  {group.nombre}
                                </span>
                              </div>
                            </div>
                            <div className="progress" style={{ height: '8px' }}>
                              <div 
                                className={`progress-bar ${getProgressColor(group.nombre)}`}
                                role="progressbar" 
                                style={{ width: `${getProgressWidth(group.nombre)}%` }}
                                aria-valuenow={group.nombre} 
                                aria-valuemin="0" 
                                aria-valuemax="100"
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
