## App Introduction

This is an app created using NextJS, Airtable and Auth0.
This app is created following [this](https://youtube.com/playlist?list=PLZ14qQz3cfJJOcbbVi_nVEPqC2334LLMz) tutorial on youtube by James Q Quick.

For this app we will use Tailwind CSS.
Follow [this link](https://tailwindcss.com/docs/guides/nextjs) to setup Tailwind CSS with NextJS.

## Using Airtable

- To use [Airtable](https://airtable.com/), sign up for a free plan with your google account.
- After signing up create a Base (database), and a table inside the base.
- Install airtable as a dependency `npm install airtable`
- To use Airtable for CRUD operations we need the following 3 things:
    (1) Access Token
    (2) Base Id
    (3) Table Name
- Save the above as environment variables.

## List all records from Airtable

Create a serverless function in Next.js by creating a file inside /api folder called getNotes.js

```
const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID);
const table = base(process.env.AIRTABLE_TABLE_NAME)

const handler = async (req, res) => {
    const records = await table.select().firstPage()
    res.status(200)
    res.json(records)
}

export default handler
```

In the example above we are creating **base and table** variables by referring to our environment variables.

In the function, we are selecting the table and retriving first page of data and saving it in a variable called records. We are then simply sending these records as a json response.