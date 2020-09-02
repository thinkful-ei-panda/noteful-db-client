import React from 'react';

import Context from '../Context/Context'

import { Link } from 'react-router-dom'

//import PropTypes from 'prop-types';

import './Sidebar.css'

export default class Sidebar extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
          hasError: true
        };
	  }
	  
	static contextType = Context;

	activeFolderClass ( currentFolder ) {
		
		let pathName = this.props.routerProps.location.pathname
		
		const noteId = pathName.slice ( 7, pathName.length )

		let filteredNoteList = [ ...this.context.notes ]

		filteredNoteList = filteredNoteList.filter ( note => note.id === noteId )

		// Highlights the All folders when displaying the entire note list.
		if ( pathName === currentFolder ) return 'folder active-folder'
		
		// Highlights the folder when displaying a folder list.
		if ( pathName === `/folder/${currentFolder}` ) return 'folder active-folder'

		// Highlights the folder when displaying a single note.
		if ( pathName.slice ( 0,7 ) === '/notes/' && currentFolder === filteredNoteList[ 0 ].folderId ) return 'folder active-folder'

		// Highlights the folder per onChange of select within AddNote.js
		//if ( this.props.selectFolderHighlight !== '' ) {
		if ( pathName === '/add-note' && this.context.selectFolderHighlight === currentFolder ) return 'folder active-folder'

		// Ignore all links not currently active.
		else return 'folder'
		
	}

	render () {
		
		return (
			
			<nav id = 'sidebar-nav' aria-label = 'sidebar-folder-navigation' role = 'navigation'>
									
				<Link to = '/'>
									
					<div className = { this.activeFolderClass ( '/' ) }>All Folders</div>
									
				</Link>
					
				{ this.context.folders.map ( folder => (

					<Link key = { folder.name } to = { `/folder/${ folder.id }` }>

						<div className = { this.activeFolderClass ( folder.id ) }>{ folder.name }</div>

					</Link>

				) ) }
		
				<Link to = '/add-folder'>

					<div className = { this.activeFolderClass ( '/add-folder' ) }>Add Folder</div>
									
				</Link>

			</nav>

		)

	}

}
