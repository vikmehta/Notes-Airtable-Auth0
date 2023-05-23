import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
const Airtable = require('airtable')
const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID);
const table = base(process.env.AIRTABLE_TABLE_NAME)

const createNote = async (req, res) => {
    try {
        const { user } = await getSession(req, res)

        if (!user) {
            return res.status(401).json({ msg: 'Record not created. User must be logged in to post!!!' })
        }

        const { title, description, color } = req.body

        if (!title || !description || !color) {
            return res.status(400).json({ msg: 'Record not created. Missing the required fields!!!' })
        }

        const createdRecord = await table.create({
            title,
            description,
            color,
            userId: user.sub
        })

        res.status(201)
        res.json(createdRecord)
    } catch (error) {
        console.log(error)
        res.status(500)
        res.json({ msg: 'Something went wrong!' })
    }
}

export default withApiAuthRequired(createNote)