const Note = (props) => {
    const { id, title, description, createdTime } = props
    return (
        <div className="mb-2 p-4 border-2">
            <h3 className="text-xl text-gray-700 font-bold">{title}</h3>
            <p>{createdTime}</p>
        </div>
    )
}

export default Note