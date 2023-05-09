import { useContext, useState, useEffect } from "react"
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client"
import { useRouter } from 'next/router'
import isEmpty from "lodash.isempty"
import { NotesContext } from "@/context/NotesContext"
import { getDateFromTimestamp, sanitizeContent, cleanUpSingleRecord } from "@/helpers/helpers"

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

const NoteSingle = (props) => {
    const { note } = props
    const [error, setError] = useState(null)
    const { removeNote, noteDeleting, errorDeletingNote } = useContext(NotesContext)
    const router = useRouter()

    useEffect(() => {
        if (!isEmpty(errorDeletingNote)) {
            setError(errorDeletingNote.msg)
        }
    }, [errorDeletingNote])

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError(null)
            }, 5000)
        }
    }, [error])

    if (isEmpty(note)) {
        return <h1>No Note found with given id</h1>
    }

    const { id, title, description, createdDate, color } = note
    const date = getDateFromTimestamp(createdDate)
    const sanitizedDescription = sanitizeContent(description)

    const handleDeleteNote = async (id) => {
        const response = await removeNote(id)

        if (!response.response && !error && !noteDeleting) {
            router.push('/')
        }
    }

    const styleConditional = noteDeleting ? 'opacity-50' : ''

    return (
        <>
            {error && <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-4 rounded relative' role='alert'>{error}</div>}
            <div className={`flex my-6 bg-white shadow-lg rounded-lg text-blue-500 bg-${color} ${styleConditional}`}>
                <div className="flex-1 p-5">
                    <h3 className="text-xl text-gray-700 font-semibold mb-2 noteTitle">
                        {title}
                    </h3>
                    <p className="text-gray-500 uppercase font-medium text-sm tracking-widest mb-3 createdDate">{date}</p>
                    <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
                </div>
                <div className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-r-lg editBox cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="block w-full mb-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    <span className="block rotate-90 tracking-widest uppercase">Edit</span>
                </div>
            </div>
            <span onClick={() => handleDeleteNote(id)} className="px-5 py-2 rounded bg-red-500 hover:bg-red-400 text-white tracking-widest cursor-pointer">Delete</span>
        </>
    )
}

export default withPageAuthRequired(NoteSingle)