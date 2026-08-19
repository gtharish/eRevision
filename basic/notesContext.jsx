import {createContext,useState} from "react"

const NotesContext = createContext();

export default NotesContext = (props)=>{
const [state,setState] = useState();
    return (
      <NotesContext.Provider value = {{state,useState}}>
        {props.children}
      </NotesContext.Provider>

    )

    
}