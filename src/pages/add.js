import { useState } from 'react'
import ColorSelector from "@/components/ColorSelector"

const AddNote = () => {
    const [noteTitle, setNoteTitle] = useState('')
    const [note, setNote] = useState('')
    const [selectedColor, setSelectedColor] = useState('white')

    const onFormSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <div>
            <h1>Add a new note</h1>
            <form onSubmit={onFormSubmit}>
                <div className="inputGroup">
                    <h4>Note Title</h4>
                    <input type="text" placeholder="Note Title" name="noteTitle" autocomplete="off" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
                </div>
                <div className="inputGroup">
                    <h4>Note</h4>
                    <textarea placeholder="Enter your note" name="note" spellCheck="false" value={note} onChange={(e) => setNote(e.target.value)} />
                </div>
                <div className="inputGroup">
                    <h4>Select Note Color</h4>
                    <ColorSelector selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                </div>
                <button className='rounded-full bg-red-500 px-4 py-2 mt-3'>Create Note</button>
            </form>
        </div>
    )
}

export default AddNote