import Note from "./Note"

const Notes = (props) => {
    const { notes } = props

    return (
        <div>
            {notes.map((note) => {
                const { id, title, description, createdTime, color } = note

                return <Note key={id} id={id} title={title} description={description} createdTime={createdTime} color={color} />
            })}
        </div>
    )
}

export default Notes