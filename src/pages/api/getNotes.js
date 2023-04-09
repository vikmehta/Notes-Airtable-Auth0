const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID);
const table = base(process.env.AIRTABLE_TABLE_NAME)

const handler = async (req, res) => {
    const records = await table.select().firstPage()
    res.status(200)
    res.json(records)
}

export default handler