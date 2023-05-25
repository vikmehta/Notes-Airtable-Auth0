const DeleteButton = (props) => {
    const { onClick } = props

    return (
        <span onClick={onClick} className="inline-flex items-center bg-red-500 hover:bg-red-400 text-white px-3 py-2 rounded cursor-pointer me-3 text-sm md:text-base">
            <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 me-1"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
            <span className="tracking-widest">Delete</span>
        </span>
    )
}

export default DeleteButton