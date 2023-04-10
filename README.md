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

## Refactoring the getNotes serverless function

If you make a get request on `/api/getNotes` endpoint on your browser, you will see that the server is responding with a json with all our notes, and it will look like this:

```
[
    {
        "_table": {
            "_base": {
                "_airtable": {},
                "_id": "<BASE ID>"
            },
            "id": null,
            "name": "Notes"
        },
        "id": "<RECORD ID>",
        "_rawJson": {
            "id": "<RECORD ID>",
            "createdTime": "2023-04-04T04:36:46.000Z",
            "fields": {
                "description": "- Place 1\n- Place 2\n- Place 3\n",
                "title": "Places to visit"
            }
        },
        "fields": {
            "description": "- Place 1\n- Place 2\n- Place 3\n",
            "title": "Places to visit"
        }
    },
    ...
]
```

As we can see that it contains a lot of extra information that I might not need. So we will run a clean up function and get only the information that we need.

The cleanup function will look something like this:

```
export const cleanUpRecords = async (records) => {
    const cleanData = await records.map((record) => {
        return {
            id: record.id,
            ...record.fields,
            createdTime: record['_rawJson'].createdTime
        }
    })

    return cleanData
}
```

Now we can refactor our getNotes function to use and return the cleaned up data. We will also use try and catch block to handle the errors. After refactoring the **getNotes** will look like this:

```
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
```

## Create a new record

- To create new records, use the **create** method given by Airtable API.
- Note that table names and table ids can be used interchangeably.
- The **first argument** of **create method** should be an array of up to 10 record objects.
- Each of these objects should have one key called **fields**.
- The value of the fields key is another object containing your record's cell values.
- **create** method will return an array of created record objects if the call was successful.

Accoring to the Airtable API documentation, we can also include a **single record object at the top level**. This one is much simpler, so we will use this approach.

```
const Airtable = require('airtable)
const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID);
const table = base(process.env.AIRTABLE_TABLE_NAME)

const createNote = async (req, res) => {
    try {
        const { title, description } = req.body

        if (!title || !description) {
            return res.status(400).json({ msg: 'Record not created. Missing the required fields!!!'})
        }

        const createdRecord = await table.create({
            title,
            description
        })

        res.status(200)
        res.json(createdRecord)
    } catch(error) {
        res.status(500)
        res.json({ msg: 'Something went wrong!' })
    }
}

export default createNote
```

In the example above we create a single record by passing an object in create method that contains the title and description as required fields.