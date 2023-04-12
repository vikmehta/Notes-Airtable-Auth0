import { getDateFromTimestamp, sanitizeContent } from "helpers/helpers"

const Note = (props) => {
    const { id, title, description, createdTime } = props
    const createdDate = getDateFromTimestamp(createdTime)
    const sanitizedDescription = sanitizeContent(description)

    return (
        <div className="mb-2 p-4 border-2">
            <h3 className="text-xl text-gray-700 font-bold mb-1">{title}</h3>
            <p className="text-gray-500 font-medium text-sm mb-2">{createdDate}</p>
            <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
        </div>
    )
}

export default Note