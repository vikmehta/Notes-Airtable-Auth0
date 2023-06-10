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
                const { id, title, description, createdDate, color, image } = note

                return <Note key={id} id={id} title={title} description={description} createdDate={createdDate} color={color} image={image} />
            })}
        </Masonry>
    )
}

export default Notes