import React from "react";
import backgroundImage from './27230.jpg';
import TextCarousel from "./TextCarousel";

function Principal(){

  const texts = [
    "Prévenez le paludisme, protégez votre santé !",
    "Votre santé, notre priorité. Détectez le paludisme facilement.",
    "La Région africaine de l’OMS supporte une part importante et disproportionnée de la charge mondiale du paludisme.",
    "Soyez proactif : surveillez votre santé contre le paludisme.",
    "Informez-vous et agissez contre le paludisme.",
    "Détection rapide, résultats fiables : ensemble contre le paludisme.",
    "En 2023, on estime à 263 millions le nombre de cas de paludisme et à 597 000 le nombre de décès dus au paludisme dans 83 pays.",
    "En 2023, 94 % des cas de paludisme (246 millions) et 95 % des décès dus à la maladie (569 000) ont été enregistrés dans la Région africaine.",
    "Les enfants de moins de cinq ans représentaient quelque 76 % des décès dus au paludisme dans la Région."

];

    return <div
    style={{
      backgroundImage: `url(${backgroundImage})`, // Utilisez l'image importée
      backgroundSize: 'cover', // Ajuste l'image à la taille de la div
      backgroundPosition: 'center', // Centre l'image
      width: '100%',
      height: '500px', // Définissez une hauteur pour la div
      color: 'white', // Couleur du texte pour le contraste
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    }}
  >
    <h1>Bienvenue dans votre outil de détection du paludisme</h1>
    <TextCarousel texts={texts} interval={8000} />
    <button type="button" className="btn btn-success btn-lg" style={{width:"30%"}}>Commencer</button>
    
</div>
}

export default Principal