const ColorSelector = (props) => {
    const { selectedColor, setSelectedColor } = props

    const colors = ['blue', 'orange', 'yellow', 'turquoise', 'purple', 'pink', 'gray', 'white']

    return (
        <div className='flex'>
            {colors.map((item, index) => {
                return (
                    <div
                        key={index}
                        onClick={() => setSelectedColor(item)}
                        className={`flex justify-center items-center shadow-sm shadow-slate-500 hover:shadow-slate-900 mr-5 w-20 h-9 cursor-pointer bg-${item} ${selectedColor === item ? 'selectedColor' : ''}`}
                    >
                        {(selectedColor === item) && <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>}
                    </div>
                )
            })}
            <input type="hidden" name="selectedColor" value={selectedColor} />
        </div>
    )
}

export default ColorSelector