import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ColorSelector from "@/components/ColorSelector"
import InputGroup from '@/components/InputGroup'
import { NotesContext } from '@/context/notesContext'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import TitleWrapper from '@/components/TitleWrapper'
import { CldUploadWidget, CldImage } from 'next-cloudinary';

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
    const [imageInfo, setImageInfo] = useState('')

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
            color: selectedColor,
            image: imageInfo
        }

        const response = await addNote(formData)
        setNoteTitle('')
        setNote('')
        setSelectedColor('white')

        if (!response.response && !noteLoadingStatus && !errorSingleNote) {
            router.push('/listing')
        }
    }

    const handleImageUpload = async (result, widget) => {
        const { event, info } = await result

        if (event === 'success') {
            setImageInfo(info.public_id)
        }

        widget.close({
            quiet: true
        });
    }

    const handleImageError = async (err, widget) => {
        if (err) {
            setError('Image Upload Error');

            widget.close({
                quiet: true
            });
            return;
        }
    }

    const noteLoadingClass = noteLoadingStatus ? 'opacity-50' : ''

    console.log(imageInfo)

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
                <div className='flex items-center flex-wrap mt-0 md:mt-3'>
                    <CldUploadWidget
                        uploadPreset="notes-airtable"
                        onUpload={handleImageUpload}
                        onError={handleImageError}
                    >
                        {({ open }) => {
                            function handleOnClick(e) {
                                e.preventDefault();
                                open();
                            }
                            return (
                                <button className="px-3 pe-4 py-3 me-2 flex items-center rounded-full bg-indigo-500 hover:bg-indigo-400 text-white" onClick={handleOnClick}>
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='w-6 me-1'><path fill="none" d="M0 0h24v24H0z"></path><path d="M5 20h14v-2H5v2zm0-10h4v6h6v-6h4l-7-7-7 7z"></path></svg>
                                    <span className='whitespace-nowrap'>Image</span>
                                </button>
                            );
                        }}
                    </CldUploadWidget>
                    <button className='shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white py-3 px-5 rounded-full me-2'>Create Note</button>
                    {imageInfo && (
                        <CldImage
                            width="48"
                            height="48"
                            src={imageInfo}
                            alt={noteTitle ? noteTitle : "Description of uploaded Image"}
                            className='previewImage w-10 h-10 rounded-full ring-2 ring-pink'
                        />
                    )}
                </div>
            </form>
        </div>
    )
}

export default withPageAuthRequired(AddNote)