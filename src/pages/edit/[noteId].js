import { useContext, useState, useEffect } from "react";
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import InputGroup from '@/components/InputGroup';
import ColorSelector from "@/components/ColorSelector";
import { cleanUpSingleRecord } from "@/helpers/helpers";
import { NotesContext } from "@/context/NotesContext";
import TitleWrapper from "@/components/TitleWrapper";

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
    const { updateNote, noteUpdating, noteUpdated, setNoteUpdated, errorNoteUpdating } = useContext(NotesContext);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteDescription, setNoteDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState('white');
    const router = useRouter();

    // console.log('noteUpdating', noteUpdating)
    // console.log('noteUpdated', noteUpdated)
    // console.log('errorNoteUpdating', errorNoteUpdating)

    useEffect(() => {
        if (!note) {
            router.push('/'); // Redirect if note is not found
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
        // console.log(response)

        // if (response && !noteUpdating && !errorNoteUpdating) {
        //     router.push('/');
        // }

        if (response && response.status === 200) {
            router.push('/')
            // setNoteUpdated(false)
        }
    };

    const noteLoadingClass = noteUpdating ? 'opacity-50' : '';

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
                <button className='px-4 py-2 mt-0 md:mt-3 shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white py-3 px-5 rounded-full'>Update Note</button>
            </form>
        </div>
    )
}

export default withPageAuthRequired(EditNote)