import cloudinary from '../../../helpers/cloudinary'

const deleteImage = async (req, res) => {
    const { publicId } = await req.body

    if (!publicId) {
        return res.status(404).json({ msg: 'No image found with the id' })
    }

    const response = await cloudinary.uploader.destroy(publicId)

    res.status(200).json({
        response
    })
}

export default deleteImage