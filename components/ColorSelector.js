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
                        className={`shadow-sm shadow-slate-500 hover:shadow-slate-900 mr-5 w-16 h-8 cursor-pointer bg-${item} ${selectedColor === item ? 'selectedColor' : ''}`}
                    />
                )
            })}
            <input type="hidden" name="selectedColor" value={selectedColor} />
        </div>
    )
}

export default ColorSelector