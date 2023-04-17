import axios from 'axios';
import { createContext, useState, useEffect } from "react";

export const NotesContext = createContext()

export const NotesProvider = (props) => {
    const { children } = props
    const [notes, setNotes] = useState([])
    const [notesLoadingStatus, setNotesLoadingStatus] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getNotes = async () => {
            setNotesLoadingStatus(true)
            try {
                const response = await axios.get('/api/getNotes')
                const responseData = response.data
                setNotes(responseData)
                setNotesLoadingStatus(false)
            } catch (error) {
                console.log(error)
                setNotesLoadingStatus(false)
                setError(`Something went wrong fetching Notes. ${error.message}`)
            }
        }

        getNotes()
    }, [])

    const globalState = {
        notes,
        notesLoadingStatus,
        error
    }

    return (
        <NotesContext.Provider value={globalState}>
            {children}
        </NotesContext.Provider>
    )
}