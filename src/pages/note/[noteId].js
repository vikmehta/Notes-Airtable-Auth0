import { useContext } from "react"
import { CldImage } from 'next-cloudinary';
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
    const { removeNote, noteDeleting } = useContext(NotesContext)
    const router = useRouter()

    if (isEmpty(note)) {
        return <h1>No Note found with given id</h1>
    }

    const { id, title, description, createdDate, color, image } = note
    const date = getDateFromTimestamp(createdDate)
    const sanitizedDescription = sanitizeContent(description)

    const handleDeleteNote = async (id) => {
        const response = await removeNote(id, image)

        if (response && response.id === note.id) {
            router.push('/listing')
        }
    }

    const styleConditional = noteDeleting ? 'opacity-50' : ''

    return (
        <>
            <TitleWrapper title='Note Details' previousPageUrl={previousPageUrl} />
            <div className={`lg:flex my-3 md:my-6 bg-white shadow-lg rounded-lg text-blue-500 bg-${color} ${styleConditional}`}>
                {image && (
                    <div className='rounded-t-lg md:rounded-l-lg lg:w-1/2 w-full'>
                        <CldImage
                            src={image}
                            alt={title}
                            width="700"
                            height={700}
                            className='rounded-t-lg md:rounded-l-lg w-full'
                        />
                    </div>
                )}
                <div className="flex-1 p-5">
                    <h3 className="text-xl text-gray-700 font-semibold mb-2 noteTitle">
                        {title}
                    </h3>
                    <p className="text-gray-500 uppercase font-medium text-sm tracking-widest mb-3 createdDate">{date}</p>
                    <div className="noteContent" dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
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