import { useContext, useState, useEffect } from "react";
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import InputGroup from '@/components/InputGroup';
import ColorSelector from "@/components/ColorSelector";
import { cleanUpSingleRecord } from "@/helpers/helpers";
import { NotesContext } from "@/context/notesContext";
import TitleWrapper from "@/components/TitleWrapper";
import DeleteButton from "@/components/DeleteButton"

export const getServerSideProps = async (context) => {
    const previousPageUrl = context.req.headers.referer || '/'
    const { noteId } = context.params

    const Airtable = require('airtable');
    const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID);
    const table = base(process.env.AIRTABLE_TABLE_NAME);

    try {
        const note = await table.find(noteId);
        const cleanNote = await cleanUpSingleRecord(note);

        return {
            props: {
                note: cleanNote,
                previousPageUrl
            }
        };
    } catch (error) {
        // Handle error fetching note or cleaning up the record
        return {
            notFound: true
        };
    }
}

const EditNote = (props) => {
    const { note, previousPageUrl } = props
    const { updateNote, noteUpdating, removeNote, noteDeleting } = useContext(NotesContext);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteDescription, setNoteDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState('white');
    const router = useRouter();
    const { id, image } = note

    useEffect(() => {
        if (!note) {
            router.push('/listing'); // Redirect if note is not found
            return;
        }

        const { title, description, color } = note;
        setNoteTitle(title);
        setNoteDescription(description);
        setSelectedColor(color);
    }, [note, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!noteTitle || !noteDescription) {
            // Handle form validation error
            return;
        }

        const formData = {
            ...(noteTitle !== note.title && { title: noteTitle }),
            ...(noteDescription !== note.description && { description: noteDescription }),
            ...(selectedColor !== note.color && { color: selectedColor })
        };

        if (Object.keys(formData).length === 0) {
            // No changes made, do nothing
            return;
        }

        const response = await updateNote(note.id, formData);

        if (response && response.id === note.id) {
            router.push('/listing')
        }
    };

    const handleDeleteNote = async (id) => {
        const response = await removeNote(id, image)

        if (response && response.id === note.id) {
            router.push('/listing')
        }
    }

    const noteLoadingClass = noteUpdating || noteDeleting ? 'opacity-50' : '';

    return (
        <div>
            <TitleWrapper title='Edit Note' previousPageUrl={previousPageUrl} />
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
                        value={noteDescription}
                        onChange={(e) => setNoteDescription(e.target.value)}
                        className='appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white h-56 leading-7'
                    />
                </InputGroup>
                <InputGroup title="Select Note Color">
                    <ColorSelector selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                </InputGroup>
                <div className="flex items-center">
                    <button className='inline-flex items-center px-3 py-2 rounded cursor-pointer me-3 text-sm md:text-base bg-indigo-500 hover:bg-indigo-600 text-white'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 me-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        <span className="tracking-widest">Update Note</span>
                    </button>
                    <DeleteButton buttonText="Delete Note" onClick={() => handleDeleteNote(id)} />
                </div>
            </form>
        </div>
    )
}

export default withPageAuthRequired(EditNote)