import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ColorSelector from "@/components/ColorSelector"
import InputGroup from '@/components/InputGroup'
import { NotesContext } from '@/context/notesContext'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import TitleWrapper from '@/components/TitleWrapper'

export const getServerSideProps = async (context) => {
    const previousPageUrl = context.req.headers.referer || '/'

    return {
        props: {
            previousPageUrl
        }
    }
}

const AddNote = (props) => {
    const { previousPageUrl } = props

    const [noteTitle, setNoteTitle] = useState('')
    const [note, setNote] = useState('')
    const [selectedColor, setSelectedColor] = useState('white')
    const [error, setError] = useState(null)

    const { addNote, noteLoadingStatus, errorSingleNote } = useContext(NotesContext)
    const router = useRouter()

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError(null)
            }, 5000)
        }
    }, [error])

    useEffect(() => {
        if (errorSingleNote) {
            setError(errorSingleNote)
        }
    }, [errorSingleNote])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!noteTitle || !note) {
            setError('Please fill out the Title and Note fields.')
            return
        }

        const formData = {
            title: noteTitle,
            description: note,
            color: selectedColor
        }

        const response = await addNote(formData)
        setNoteTitle('')
        setNote('')
        setSelectedColor('white')

        if (!response.response && !noteLoadingStatus && !errorSingleNote) {
            router.push('/')
        }
    }

    const noteLoadingClass = noteLoadingStatus ? 'opacity-50' : ''

    return (
        <div>
            {error && <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-4 rounded relative' role='alert'>{error}</div>}
            <TitleWrapper title="Create a new note" previousPageUrl={previousPageUrl} />
            <form onSubmit={handleSubmit} className={`bg-white shadow-md rounded px-2 md:px-8 pt-2 pb-4 md:py-8 mb-4 my-3 md:my-6 ${noteLoadingClass}`}>
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
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className='appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white h-56 leading-7'
                    />
                </InputGroup>
                <InputGroup title="Select Note Color">
                    <ColorSelector selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                </InputGroup>
                <button className='px-4 py-2 mt-0 md:mt-3 shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white py-3 px-5 rounded-full'>Create Note</button>
            </form>
        </div>
    )
}

export default withPageAuthRequired(AddNote)