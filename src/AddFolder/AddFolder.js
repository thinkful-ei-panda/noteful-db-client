import React from 'react'

import { CONFIG } from '../config'

import Context from '../Context/Context'

import cuid from 'cuid'

import ValidationError from '../ValidationError/ValidationError'

import './AddFolder.css'

export default class AddFolder extends React.Component {

    constructor ( props ) {

		super(props);

		this.state = {

			name: {
                value: '',
                touched: false
            }

        }
        
    }

    updateName ( name ) {

        this.setState ( { name: { value: name, touched: true } } )

    }
    
    validateName () {

		const name = this.state.name.value.trim ()
        
        if ( name.length === 0 ) return ' is required' 
        
        else if ( name.length < 3 ) return ' must be at least 3 characters long'

    }

    static contextType = Context

    formSubmit ( e ) {
        
        e.preventDefault ();
    
        const form = new FormData ( e.target )

        const formValuesArray = {

            id: cuid (),

            name: form.get ( 'folder-name-input' ),

        };
        
        fetch ( `${ CONFIG.API_ENDPOINT_FOLDERS }/`, {

            method: 'POST',
			body: JSON.stringify ( formValuesArray ),
            headers: { 'content-type': 'application/json' }

        } )

        .then ( res => {

            if ( !res.ok ) throw new Error ( res.status )

            return res.json ()

        } )
    
        .then ( () => { 
            
            this.context.addFolder ( formValuesArray )
        
            this.props.routerProps.history.push ( `/folder/${ formValuesArray.id }` )

        } )
    
        .catch ( error => this.setState ( { error } ) )

    }

    render () {

        const nameError = this.validateName ();

        return (

            <section id = 'add-folder-container' aria-label = 'Add a folder form'>

                <form id = 'add-folder-form'  onSubmit = { e => this.formSubmit ( e ) }>

                    <div className = 'add-folder-form-element-container'>

                        <label htmlFor = 'folder-name-input'>Folder Name { ( <ValidationError message = { nameError } /> ) }</label>
                            
                        <input type = 'text' name = 'folder-name-input' id = 'folder-name-input' placeholder = 'Folder name' required  onChange = { e => this.updateName ( e.target.value ) }/>

                    </div>

                    <div className = 'add-folder-form-element-container'>

                        <button type = 'submit' disabled = { this.validateName () }>Add folder</button>

                    </div>
                            
                    <div className = 'add-folder-error message-container'>
                        
                        { this.context.error }
                    
                    </div>

                </form>
                    
            </section>

        )

    }

}