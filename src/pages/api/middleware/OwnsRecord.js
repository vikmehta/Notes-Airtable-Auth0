import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
const Airtable = require('airtable')
const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID);
const table = base(process.env.AIRTABLE_TABLE_NAME)

const ownsRecord = (handler) => withApiAuthRequired(async (req, res) => {
    const { user } = await getSession(req, res)

    if (!user) {
        return res.status(401).json({ msg: 'User must be logged in!' })
    }

    const { id } = req.method === 'DELETE' ? req.query : req.body

    try {
        const existingRecord = await table.find(id)

        if (!existingRecord || user.sub !== existingRecord.fields.userId) {
            return res.status(404).json({ msg: 'Record not found' })
        }

        req.record = existingRecord

        return handler(req, res)
    } catch (error) {
        console.log(error)
        res.status(500)
        res.json({ msg: 'Something went wrong!' })
    }
})

export default ownsRecord