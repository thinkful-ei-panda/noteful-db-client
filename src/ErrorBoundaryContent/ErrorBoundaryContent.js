import React from 'react'

export default class ErrorBoundaryContent extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            hasError:false
        };
    };
    
    static getDerivedStateFromError(error){
	 	return{hasError:true};
    };
    
    render(){
        
        if(this.state.hasError)return(<h3>Content display error</h3>);
        
        return this.props.children;
        
    };

}