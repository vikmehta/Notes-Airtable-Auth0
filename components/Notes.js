import Masonry from 'react-masonry-css'
import Note from "./Note"

const breakpoints = {
    default: 3,
    1100: 2,
    700: 1
};

const Notes = (props) => {
    const { notes } = props

    return (
        <Masonry
            breakpointCols={breakpoints}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
        >
            {notes.map((note) => {
                const { id, title, description, createdTime, color } = note

                return <Note key={id} id={id} title={title} description={description} createdTime={createdTime} color={color} />
            })}
        </Masonry>
    )
}

export default Notes