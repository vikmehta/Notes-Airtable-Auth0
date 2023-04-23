import axios from 'axios';
import { createContext, useState, useEffect } from "react";
import { cleanUpSingleRecord } from "@/helpers/helpers";

export const NotesContext = createContext()

export const NotesProvider = (props) => {
    const { children } = props
    const [notes, setNotes] = useState([])
    const [notesLoadingStatus, setNotesLoadingStatus] = useState(false)
    const [error, setError] = useState(null)

    const [noteLoadingStatus, setNoteLoadingStatus] = useState(false)
    const [errorDeletingNote, setErrorDeletingNote] = useState(null)

    const [noteDeleting, setNoteDeleting] = useState(false)
    const [errorSingleNote, setErrorSingleNote] = useState(null)

    // useEffect(() => {
    //     const getNotes = async () => {
    //         setNotesLoadingStatus(true)
    //         try {
    //             const response = await axios.get('/api/getNotes')
    //             const responseData = response.data
    //             setNotes(responseData)
    //             setNotesLoadingStatus(false)
    //         } catch (error) {
    //             console.log(error)
    //             setNotesLoadingStatus(false)
    //             setError(`Something went wrong fetching Notes. ${error.message}`)
    //         }
    //     }

    //     getNotes()
    // }, [])

    const addNote = async (note) => {
        setNoteLoadingStatus(true)
        try {
            const response = await axios.post('/api/createNote', note)
            const responseData = await cleanUpSingleRecord(response.data)
            setNotes([responseData, ...notes])
            setNoteLoadingStatus(false)
            return response
        } catch (error) {
            console.log(error)
            setErrorSingleNote(`Something went wrong adding a Note. ${error.message}`)
            setNoteLoadingStatus(false)
            return error
        }
    }

    const removeNote = async (id) => {
        setNoteDeleting(true)
        try {
            const response = await axios.delete(`/api/deleteNote?id=${id}`)
            setNoteDeleting(false)
            return response
        } catch (error) {
            setErrorDeletingNote({
                msg: 'Something went wrong deleting the note',
                error
            })
            setNoteDeleting(false)
            return error
        }
    }

    const globalState = {
        notes,
        setNotes,
        addNote,
        removeNote,
        noteDeleting,
        errorDeletingNote,
        noteLoadingStatus,
        errorSingleNote
    }

    return (
        <NotesContext.Provider value={globalState}>
            {children}
        </NotesContext.Provider>
    )
}