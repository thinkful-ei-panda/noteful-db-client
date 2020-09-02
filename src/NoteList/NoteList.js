import React from 'react'

import { CONFIG } from '../config'

import Context from '../Context/Context'

import { Link } from 'react-router-dom'

import './NoteList.css'

export default class NoteList extends React.Component {

    static contextType = Context

    deleteClick ( noteId ) {

        fetch ( `${ CONFIG.API_ENDPOINT_NOTES }/${ noteId }`, {

            method: 'DELETE',
            headers: { 'content-type': 'application/json' }

        } )

        .then ( res => {

            if ( !res.ok ) throw new Error ( res.status )

            return res.json ()

        } )
    
        .then ( data => { 
            
            //let key = CONFIG.API_ENDPOINT_NOTES.slice ( 22, CONFIG.API_ENDPOINT_NOTES.length )
            
            this.context.deleteNote ( noteId )

            //this.setState ( { [ key ]: [ ...data ] } )

            // My preference would be having this move to the relevant folder, rather than index.
            this.props.routerProps.history.push ( '/' )

        } )
    
        .catch ( error => this.setState ( { error } ) )
    
    }

    render () {

        const pathName = this.props.routerProps.location.pathname

        let noteContent = ''

        // All Notes
        let filteredNoteList = [ ...this.context.notes ]
        
        // Folder filtered notes
        if ( pathName.slice ( 0, 7 ) === '/folder' ) {

            filteredNoteList = filteredNoteList.filter ( note => `/folder/${ note.folderId  }` === pathName )
        
        }

        // Single note
        if ( pathName.slice ( 0, 5 ) === '/note' ) {

            filteredNoteList = filteredNoteList.filter ( note => note.id === pathName.slice ( 7, pathName.length ) )

            noteContent = filteredNoteList[ 0 ].content

        }

        const addNoteButton = () => {
            
            if ( filteredNoteList.length > 1 || filteredNoteList.length < 1) {
                
                return (

                    <section>
                            
                        <Link to = '/add-note' className = 'add-note-link'>
                
                            <div id = 'add-note-button' aria-label = 'Note add button'>Add Note</div>

                        </Link>

                    </section>
            
                );

            }

        }

        return (

            <>
                
                { filteredNoteList.map ( ( note, index ) => (
                    
                    <article key = { note.id } className = 'note' id = { note.id } aria-label = 'Note'>
                        
                        <div className = 'note-name' aria-label = 'Note name'>

                            <Link to = { `/notes/${ note.id }` }>

                                <h2  aria-label = 'Note header'>{ note.name }</h2>

                            </Link>

                        </div>

                        <div className = 'note-modified' aria-label = 'Note date'>

                            { note.modified }
                            
                        </div>

                        <div className = 'note-delete' aria-label = 'Note delete'>

                            <button value = { note.id } aria-label = 'Note delete button' onClick = { () => this.deleteClick ( note.id ) }>Delete</button>
                                
                        </div>
            
                        <div className = 'note-content'>{ noteContent }</div>

                    </article>

                ) ) }
                
                { addNoteButton () }

            </>

        )

    }

}