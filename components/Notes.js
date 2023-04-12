import Note from "./Note"

const Notes = (props) => {
    const { notes } = props

    return (
        <div>
            {notes.map((note) => {
                const { id, title, description, createdTime } = note

                return <Note key={id} id={id} title={title} description={description} createdTime={createdTime} />
            })}
        </div>
    )
}

export default Notes