import React, {Fragment} from 'react';
import Navbar from "../Navbar/Navbar";

const Layout = (props) => {
    return <Fragment>
        <header>
            <Navbar/>
        </header>
        <main className="container">
            <div>
                    {props.children}
            </div>
        </main>
        <footer>(c) Copyleft</footer>
    </Fragment>

};


export default Layout;