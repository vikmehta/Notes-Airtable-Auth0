import Link from "next/link"
import { getDateFromTimestamp, sanitizeContent } from "helpers/helpers"
import EditButton from "./EditButton"

const Note = (props) => {
    const { id, title, description, createdDate, color } = props
    const created = getDateFromTimestamp(createdDate)
    const sanitizedDescription = sanitizeContent(description)

    return (
        <div className={`flex mb-3 bg-white shadow-lg rounded-lg text-blue-500 bg-${color} note-container`}>
            <div className="flex-1 px-5 py-5 md:px-9 md:py-7 noteWrapper">
                <h3 className="text-xl text-gray-700 font-semibold mb-2 uppercase noteTitle">
                    <Link href={`/note/${id}`}>{title}</Link>
                </h3>
                <p className="text-gray-500 uppercase font-medium text-sm tracking-widest mb-3 createdDate">
                    <Link href={`/note/${id}`}>
                        {created}
                    </Link>
                </p>
                <div className="noteContent" dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
                <EditButton id={id} className='mt-4' color={color} />
            </div>
        </div>
    )
}

export default Note