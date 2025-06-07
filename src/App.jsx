import { Fragment, useState } from 'react';
import Navbar from './components/Navbar';
import Principal from './components/Principal';
import Secondaire from './components/Secondaire';
import Footer from './components/Footer';

import {createBrowserRouter, RouterProvider} from "react-router-dom"
import ListePatients from './Pages/ListePatients';
import Analyse from './Pages/Analyse';

const router = createBrowserRouter([
        {
                path: '/',
                element: <Fragment>
                                <Navbar/>
                                <Principal/>
                                <Secondaire/>
                                <Footer/>
                        </Fragment>
        },
        {
                path: '/listepatients',
                element: <Fragment>
                                <Navbar/>
                                <ListePatients/>
                        </Fragment>
                
        },
        {
                path: 'analyse/:id',
                element: <Fragment>
                                <Navbar/>
                                <Analyse/>
                        </Fragment>
        }
        
])

function App() {
return    <RouterProvider router={router}/>

}

export default App
