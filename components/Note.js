import Link from "next/link"
import { getDateFromTimestamp, sanitizeContent } from "helpers/helpers"

const Note = (props) => {
    const { id, title, description, createdTime } = props
    const createdDate = getDateFromTimestamp(createdTime)
    const sanitizedDescription = sanitizeContent(description)

    return (
        <div className="flex mb-3 bg-white shadow-lg rounded-lg text-blue-500">
            <div className="flex-1 p-5">
                <h3 className="text-xl text-gray-700 font-semibold mb-2">
                    <Link href={`/note/${id}`}>{title}</Link>
                </h3>
                <p className="text-gray-500 uppercase font-medium text-sm tracking-widest mb-3">{createdDate}</p>
                <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
            </div>
            <div className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-r-lg editBox cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="block w-full mb-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                <span className="block rotate-90 tracking-widest uppercase">Edit</span>
            </div>
        </div>
    )
}

export default Note