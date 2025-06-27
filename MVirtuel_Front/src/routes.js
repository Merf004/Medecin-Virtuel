import Dashboard from "views/Dashboard.js";
import Listepatients from "views/Listepatients.js";
import Listeanalyses from "views/Listeanalyses.js";
import Ajouterpatient from "views/Ajouterpatient.js";
import Analyse from "views/Analyse.js";
import Equipe from "views/Equipe.js";
import Apropos from "views/Apropos.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "bi bi-speedometer2", // ou bi-graph-up pour tableau de bord
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/listepatients",
    name: "Liste des patients",
    icon: "bi bi-people", // ou bi-person-lines-fill pour liste de patients
    component: Listepatients,
    layout: "/admin"
  },
  {
    path: "/listeanalyses",
    name: "Liste des analyses",
    icon: "bi bi-list-ul", // ou bi-file-earmark-text pour liste d'analyses
    component: Listeanalyses,
    layout: "/admin"
  },
  {
    path: "/ajouterpatient",
    name: "Nouveau patient",
    icon: "bi bi-person-plus", // ou bi-plus-circle pour ajouter patient
    component: Ajouterpatient,
    layout: "/admin"
  },
  {
    path: "/analyse",
    name: "Nouvelle analyse",
    icon: "bi bi-clipboard2-pulse", // ou bi-graph-down pour nouvelle analyse
    component: Analyse,
    layout: "/admin"
  },
  {
    path: "/equipe",
    name: "Equipe",
    icon: "bi bi-people-fill", // ou bi-person-workspace pour équipe
    component: Equipe,
    layout: "/admin"
  },
  {
    path: "/apropos",
    name: "A propos",
    icon: "bi bi-info-circle", // ou bi-question-circle pour à propos
    component: Apropos,
    layout: "/admin"
  }
];

export default dashboardRoutes;