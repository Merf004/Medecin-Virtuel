import React from "react";

function Navbar(){
    return <nav class="navbar bg-black">
    <div class="container-fluid">
        <a class="navbar-brand text-success" href="#">
            <img src="src\consultation_9745685.png" alt="Medecin V" width="30" height="24"/>
            <span class="fs-6 ms-2 fst-itali">Medecin virtuel</span>
        </a>
        <form class="d-flex" role="search">
        <button class="btn btn-outline-success me-3">Connexion</button>
            <button class="btn btn-outline-success">Inscription</button>
        </form>
    </div>
  </nav>
}


export default Navbar