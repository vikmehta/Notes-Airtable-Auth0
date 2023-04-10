const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID);
const table = base(process.env.AIRTABLE_TABLE_NAME)
import { cleanUpRecords } from 'helpers/helpers';

const handler = async (req, res) => {
    try {
        const records = await table.select().firstPage()
        const cleanRecords = await cleanUpRecords(records)
        res.status(200)
        res.json(cleanRecords)
    } catch (error) {
        res.status(500)
        res.json({ msg: 'Something went wrong!' })
    }
}

export default handler