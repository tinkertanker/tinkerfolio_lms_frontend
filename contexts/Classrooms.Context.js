import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const ClassroomsContext = createContext();

const ClassroomsContextProvider = (props) => {
    const [classrooms, setClassrooms] = useState()

    return (
        <ClassroomsContext.Provider value={{classrooms, setClassrooms}}>
            { props.children }
        </ClassroomsContext.Provider>
    )
}

export default ClassroomsContextProvider
