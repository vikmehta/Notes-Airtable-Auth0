const createNote = async (req, res) => {
    try {
        console.log(req.url)
        console.log(req.method)
        console.log(req.body)
    } catch (error) {
        console.log(error)
        res.json({ msg: 'Something went wrong!' })
    }
}

export default createNote