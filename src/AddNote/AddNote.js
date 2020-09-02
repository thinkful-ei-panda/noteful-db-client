import React from 'react'

import { CONFIG } from '../config'

import Context from '../Context/Context'

//import PropTypes from 'prop-types'

import cuid from 'cuid'

import ValidationError from '../ValidationError/ValidationError'

import './AddNote.css'

export default class AddNote extends React.Component {
    
    constructor ( props ) {

		super ( props )

		this.state = {
            
            name: {
                value: '',
                touched: false
            },

            content: {
                value: '',
                touched: false
            },
            
            select: {
                value: '',
                touched: false
            },

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
    
    updateContent ( content ) {

        this.setState ( { content: { value: content, touched: true } } )

    }
    
    validateContent () {
        
        const content = this.state.content.value.trim ()
        
		if ( content.length === 0 ) return ' is required'
        
        else if (content.length < 3) return ' must be at least 3 characters long'

    }
    
    updateSelect ( select ) {

        this.setState ( { select: { value: select, touched: true } } )

    }
    
    validateSelect () {

        const select = this.state.select.value.trim ()

        if ( select === '' || select === 'Choose a folder' ) return ' is required'

    }

    static contextType = Context

    formSubmit ( e ) {
        
        e.preventDefault ()

        const form = new FormData ( e.target )
        
        const date = new Date ()
        
        const formValuesArray = {

            content: form.get ( 'note-content-input' ),

            folderId: form.get ( 'note-folder-select' ),

            id: cuid (),

            modified: date.toISOString (),

            name: form.get ( 'note-name-input' ),

        }
        
        fetch ( `${ CONFIG.API_ENDPOINT_NOTES }/`, {

            method: 'POST',
			body: JSON.stringify ( formValuesArray ),
            headers: { 'content-type': 'application/json' }

        } )

        .then ( res => {

            if ( !res.ok ) throw new Error ( res.status )

            return res.json ()

        } )
    
        .then ( data => { 
            
            this.context.addNote ( formValuesArray )
        
            let selectVal = form.get ( 'note-folder-select' )
    
            this.props.routerProps.history.push ( `/folder/${ selectVal }` )

        } )
    
        .catch ( error => this.setState ( { error } ) )

    }

    render () {

        const nameError = this.validateName()

        const contentError = this.validateContent()

        const selectError = this.validateSelect()

        // Solve: find a way to have this triggered onChange in the select
        //this.props.folderToHighlight ( e.target.value )
        
        return (

            <section id = 'add-note-container' aria-label = 'Add a note form'>

                <form id = 'add-note-form'  onSubmit = { e => this.formSubmit ( e ) }>

                    <div className = 'add-note-form-element-container'>

                        <label htmlFor = 'note-name-input'>Name { ( <ValidationError message = { nameError } /> ) }</label>
                            
                        <input type = 'text' name = 'note-name-input' id = 'note-name-input' placeholder = 'Note name' required onChange = { e => this.updateName ( e.target.value ) }/>
                        

                    </div>

                    <div className = 'add-note-form-element-container'>

                        <label htmlFor = 'note-content-input'>Content { ( <ValidationError message = { contentError } /> ) }</label>

                        <textarea id = 'note-content-input' name = 'note-content-input' placeholder = 'Note content' required onChange = { e => this.updateContent ( e.target.value ) }></textarea>

                    </div>

                    <div className = 'add-note-form-element-container'>

                        <label htmlFor = 'note-folder-select'>Select a folder  { ( <ValidationError message = { selectError } /> ) }</label>

                        <select id = 'note-folder-select' name = 'note-folder-select' onChange = { e => this.updateSelect ( e.target.value ) }>

                                    <option id = 'default'>Choose a folder</option>

                                    { this.context.folders.map ( folder => (
                                        
                                        <option key = { folder.id } id = { folder.id } value = { folder.id }>{ folder.name }</option>

                                    ) ) }

                                </select>

                    </div>
                    
                    <div className = 'add-note-form-element-container'>

                        <button type = 'submit' disabled = { this.validateName () || this.validateContent () || this.validateSelect () }>Add note</button>

                    </div>

                    <div className = 'add-note-error message-container'>
                        
                        { this.context.error }
    
                    </div>

                </form>
                    
            </section>

        )

    }

}

//AddNote.propTypes = {

  //  name: PropTypes.string.isRequired,

//}