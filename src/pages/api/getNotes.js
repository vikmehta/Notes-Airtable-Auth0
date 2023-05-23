import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID);
const table = base(process.env.AIRTABLE_TABLE_NAME)
import { cleanUpRecords } from 'helpers/helpers';

const handler = async (req, res) => {
    try {
        const { user } = await getSession(req, res)

        if (!user) {
            return res.status(401).json({ msg: 'User must be logged in to see notes!!!' })
        }

        const records = await table.select({
            filterByFormula: `userId = '${user.sub}'`,
            sort: [{ field: "createdDate", direction: "desc" }]
        }).all()

        const cleanRecords = await cleanUpRecords(records)
        res.status(200)
        res.json(cleanRecords)
    } catch (error) {
        res.status(500)
        res.json({ msg: 'Something went wrong!' })
    }
}

export default withApiAuthRequired(handler)