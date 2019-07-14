import { Link } from "gatsby"; 
import React from 'react';

const PageNavs = () => (
    <React.Fragment>
        <Link to="/dlonames/lobby" style={{color: 'inherit'}} activeStyle={{color: 'red'}}>
            DloNames
        </Link>
        <Link to="/d2lo4" style={{color: 'inherit'}} activeStyle={{color: 'red'}}>
            D2lo4
        </Link>
        <Link to="/soon" style={{color: 'inherit'}} activeStyle={{color: 'red'}}>
            Coming Soon
        </Link>
    </React.Fragment>
);

export default PageNavs;