import React from 'react'

import { Link } from 'react-router-dom'

import './Header.css'

export default class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          hasError: true
        };
      }

    render () {

        return (
           
           <header>

                <h1>
                
                    <Link to = '/' className = 'header-link'>Noteful</Link>
                    
                </h1>
                
            </header>

        )

    }

}