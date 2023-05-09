import { useContext, useState, useEffect } from "react"
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import isEmpty from "lodash.isempty"
import { useRouter } from 'next/router'
import InputGroup from '@/components/InputGroup'
import ColorSelector from "@/components/ColorSelector"
import { cleanUpSingleRecord } from "@/helpers/helpers"
import usePrevious from "hooks/usePrevious"
import { NotesContext } from "@/context/NotesContext"

export const getServerSideProps = async (context) => {
    const { noteId } = context.params

    const Airtable = require('airtable');
    const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID)
    const table = base(process.env.AIRTABLE_TABLE_NAME)

    const note = await table.find(noteId)
    const cleanNote = await cleanUpSingleRecord(note)

    return {
        props: {
            note: cleanNote
        }
    }
}

const EditNote = (props) => {
    const { note } = props

    const [noteTitle, setNoteTitle] = useState('')
    const [noteDescription, setNoteDescription] = useState('')
    const [selectedColor, setSelectedColor] = useState('white')

    const prevNote = usePrevious(note)

    const router = useRouter()

    useEffect(() => {
        if (isEmpty(note)) {
            return <h1>No Note found with given id.</h1>
        }

        const { id, title, description, color } = note

        setNoteTitle(title)
        setNoteDescription(description)
        setSelectedColor(color)

    }, [note])

    const { updateNote, noteUpdated, noteUpdating, errorNoteUpdating } = useContext(NotesContext)

    useEffect(() => {
        if (noteUpdated && !noteUpdating && !errorNoteUpdating) {
            router.push('/')
        }
    }, [noteUpdated, noteUpdating, errorNoteUpdating, router])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!noteTitle || !noteDescription) {
            // setError('Please fill out the Title and Note fields.')
            return
        }

        const formData = {}

        if (prevNote.title !== noteTitle) {
            formData.title = noteTitle
        }

        if (prevNote.description !== noteDescription) {
            formData.description = noteDescription
        }

        if (prevNote.color !== selectedColor) {
            formData.color = selectedColor
        }

        if (isEmpty(formData)) return

        const response = await updateNote(note.id, formData)

        if (!response.response && !noteUpdating && !errorNoteUpdating) {
            router.push('/')
        }

        // updateNote(note.id, formData)
    }

    const noteLoadingClass = noteUpdating ? 'opacity-50' : ''

    return (
        <div>
            <h1 className='text-2xl mb-5'>Edit note</h1>
            <form onSubmit={handleSubmit} className={`bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 bg-${selectedColor} ${noteLoadingClass}`}>
                <InputGroup title="Note Title">
                    <input
                        type="text"
                        placeholder="Note Title"
                        name="noteTitle"
                        autoComplete="off"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        className='appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
                    />
                </InputGroup>
                <InputGroup title="Note">
                    <textarea
                        placeholder="Enter your note"
                        name="note"
                        spellCheck="false"
                        value={noteDescription}
                        onChange={(e) => setNoteDescription(e.target.value)}
                        className='appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white h-56 leading-7'
                    />
                </InputGroup>
                <InputGroup title="Select Note Color">
                    <ColorSelector selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                </InputGroup>
                <button className='px-4 py-2 mt-3 shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white py-3 px-5 rounded-full'>Update Note</button>
            </form>
        </div>
    )
}

export default withPageAuthRequired(EditNote)