import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-black text-success text-center py-4">
            <div className="container">
                <img src="src\consultation_9745685.png" alt="Medecin V" width="30" height="24"/>
                <p>© {new Date().getFullYear()} Tous droits réservés.</p>
                <ul className="list-unstyled">
                    <li><a href="#" className="text-white">Politique de confidentialité</a></li>
                    <li><a href="#" className="text-white">Conditions d'utilisation</a></li>
                    <li><a href="#" className="text-white">Aide</a></li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;