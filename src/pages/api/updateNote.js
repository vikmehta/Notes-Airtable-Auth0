const isEmpty = require('lodash.isempty');
const Airtable = require('airtable')
const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID);
const table = base(process.env.AIRTABLE_TABLE_NAME)

const updateNote = async (req, res) => {
    try {
        const { id, ...updates } = req.body

        if (!id || isEmpty(updates)) {
            return res.status(400).json({ msg: 'No record updated. Missing required values!' })
        }

        const updatedRecord = await table.update(id, updates)

        res.status(200)
        res.json(updatedRecord)
    } catch (error) {
        console.log(error)
        res.status(500)
        res.json({ msg: 'Something went wrong!' })
    }
}

export default updateNote