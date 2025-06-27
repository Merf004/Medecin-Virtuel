import React from 'react';
import { Github, Facebook, Linkedin, Mail } from 'lucide-react';

import MerFPhoto from '../assets/img/MerF.jpg';
import PabloPhoto from '../assets/img/Pablo.jpg';

const Equipe = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Merlin FEDIM",
      role: "Frontend",
      photo: MerFPhoto,
      description: "Mise sur pied du modèle, gestion de l'interface utilisateur et intégration des APIs",
      skills: ["React JS", "Node.js", "Bootstrap", "TailwindCSS", "HTML/CSS"],
      social: {
        github: "https://github.com/Merf004",
        linkedin: "https://linkedin.com/in/merlin-fedim-1923592a9",
        facebook: "https://facebook.com/merlin.fedim",
        email: "brice.fedim@facsciences-uy1.cm"
      }
    },
    {
      id: 2,
      name: "Mbassi ATANGANA",
      role: "Backend",
      photo: PabloPhoto,
      description: "Mise sur pied du modèle, mise sur pied de la base de données et du backend. Creation et déploiement des APIs",
      skills: ["Django", "Python", "PostgreSQL", "Render"],
      social: {
        github: "https://github.com/mbassi237",
        linkedin: "https://linkedin.com/in/mbassi-atangana-ab9997254",  
        facebook: "https://facebook.com/yannick.atangana.7777",
        email: "serge.mbassi@facsciences-uy1.cm"
      }
    }
  ];

  const SocialIcon = ({ platform, url }) => {
    const icons = {
      github: <Github size={20} />,
      linkedin: <Linkedin size={20} />,
      facebook: <Facebook size={20} />,
      email: <Mail size={20} />
    };
    
    const colors = {
      github: 'btn-outline-dark',
      linkedin: 'btn-outline-primary',
      facebook: 'btn-outline-primary',
      email: 'btn-outline-danger'
    };

    return (
      <a
        href={platform === 'email' ? `mailto:${url}` : url}
        target={platform !== 'email' ? "_blank" : undefined}
        rel={platform !== 'email' ? "noopener noreferrer" : undefined}
        className={`btn ${colors[platform]} btn-sm me-2`}
      >
        {icons[platform]}
      </a>
    );
  };

  return (
    <>
      {/* Bootstrap CSS CDN */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-gray mb-3">Equipe</h1>
        </div>

        {/* Team Cards */}
        <div className="row g-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="text-center p-3">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="rounded-circle mb-3"
                    width="150"
                    height="150"
                    style={{objectFit: 'cover'}}
                  />
                  <h5 className="card-title text-gray">{member.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{member.role}</h6>
                  <p className="card-text">{member.description}</p>
                  
                  {/* Skills */}
                  <div className="mb-3">
                    {member.skills.map((skill, index) => (
                      <span key={index} className="badge bg-success me-1 mb-1">
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  {/* Social Links */}
                  <div className="d-flex justify-content-center flex-wrap">
                    {Object.entries(member.social).map(([platform, url]) => (
                      <SocialIcon key={platform} platform={platform} url={url} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Equipe;