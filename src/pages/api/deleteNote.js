import ownsRecord from './middleware/OwnsRecord';
const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID);
const table = base(process.env.AIRTABLE_TABLE_NAME)

const deleteNote = async (req, res) => {
    try {
        const { id } = req.query

        if (!id) {
            res.status(400).json({ msg: 'Missing a required field!' })
        }

        const deletedRecord = await table.destroy(id)

        res.status(200)
        res.json(deletedRecord)
    } catch (error) {
        console.log(error)
        res.status(500)
        res.json({ msg: 'Something went wrong!' })
    }
}

export default ownsRecord(deleteNote)