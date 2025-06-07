import React from "react";
import {Link} from "react-router-dom" 


function Navbar(){
    return <nav class="navbar bg-black">
    <div class="container-fluid">
        <Link to = '/'>
            <img src="src\consultation_9745685.png" alt="Medecin V" width="30" height="24"/>
        </Link>
        <form class="d-flex" role="search">
            <button class="btn btn-outline-success me-3">Connexion</button>
            <button class="btn btn-outline-success">Inscription</button>
        </form>
    </div>
  </nav>
}


export default Navbar