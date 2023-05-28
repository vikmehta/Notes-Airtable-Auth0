import { useContext, useState, useEffect } from "react"
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client"
import { useRouter } from 'next/router'
import isEmpty from "lodash.isempty"
import { NotesContext } from "@/context/notesContext"
import { getDateFromTimestamp, sanitizeContent, cleanUpSingleRecord } from "@/helpers/helpers"
import DeleteButton from "@/components/DeleteButton"
import EditButton from "@/components/EditButton"
import TitleWrapper from "@/components/TitleWrapper"

export const getServerSideProps = async (context) => {
    const previousPageUrl = context.req.headers.referer || '/'
    const { noteId } = context.params

    const Airtable = require('airtable');
    const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID)
    const table = base(process.env.AIRTABLE_TABLE_NAME)

    const note = await table.find(noteId)
    const cleanNote = await cleanUpSingleRecord(note)

    return {
        props: {
            note: cleanNote,
            previousPageUrl
        }
    }
}

const NoteSingle = (props) => {
    const { note, previousPageUrl } = props
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
            <TitleWrapper title='Note Details' previousPageUrl={previousPageUrl} />
            {error && <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-4 rounded relative' role='alert'>{error}</div>}
            <div className={`flex my-3 md:my-6 bg-white shadow-lg rounded-lg text-blue-500 bg-${color} ${styleConditional}`}>
                <div className="flex-1 p-5">
                    <h3 className="text-xl text-gray-700 font-semibold mb-2 noteTitle">
                        {title}
                    </h3>
                    <p className="text-gray-500 uppercase font-medium text-sm tracking-widest mb-3 createdDate">{date}</p>
                    <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
                </div>
            </div>
            <div className="flex items-center">
                <EditButton id={id} color="white" />
                <DeleteButton onClick={() => handleDeleteNote(id)} />
            </div>
        </>
    )
}

export default withPageAuthRequired(NoteSingle)