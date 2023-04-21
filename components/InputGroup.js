const InputGroup = (props) => {
    const { children, title } = props

    return (
        <div className="mb-5 inputGroup">
            <h3 className="text-slate-600 text-lg font-semibold mb-2">{title}</h3>
            {children}
        </div>
    )
}

export default InputGroup