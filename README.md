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


## Updating a record

- To update records, use the **update** or **replace** method given by Airtable API.
- The **update** method will only update the fields you include. Fields not included will remain unchanged.
- The **replace** will perform a destructive update and clear all unincluded cell values.

Updating a record in Airtable is very similar to creating a new record.

- The **first argument** of **update method** should be an array of up to 10 record objects.
- Each of these objects should have and **id** property representing the record ID, and a **fields** property.
- The value of the fields key is another object containing your record's cell values.
- **update** method will return an array of updated record objects if the call was successful.

Accoring to the Airtable API documentation, we can also include a **single record object at the top level**. This one is much simpler, so we will use this approach.

```
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
```

In the example above we updating a single record by passing an object in update method that contains the id and title as required fields.

## Delete a record

To delete a single record we only need the id of that record.

```
const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID);
const table = base(process.env.AIRTABLE_TABLE_NAME)

const deleteNote = async (req, res) => {
    try {
        const { id } = req.body

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

export default deleteNote
```

## Adding Authentication using Auth0
Follow thse useful links:
- https://www.npmjs.com/package/@auth0/nextjs-auth0
- https://auth0.com/docs/quickstart/webapp/nextjs
- https://www.youtube.com/watch?v=jgKRnhJBfpQ

### Step 1: Create an account in Auth0

To add authentication to any next app using Auth0 package, follow the steps below:
- Create an account in Auth0 by visiting auth0.com
- Create a Tenant. A Tenant is basically a grouping of your apps.
- Enter basic details like Name of your app, the domain etc.
- We need the following three pieces of information to proceed
    1. Domain
    2. Client ID
    3. Client Secret

### Step 2: Configure Callback URLs

A callback URL is a URL in your application where Auth0 redirects the user after they have authenticated. The callback URL for your app must be added to the Allowed Callback URLs field in your Application Settings. If this field is not set, users will be unable to log in to the application and will get an error.

In our app the callback url will be **http://localhost:3000/api/auth/callback**

### Step 3: Configure Logout URLs

A logout URL is a URL in your application that Auth0 can return to after the user has been logged out of the authorization server. 

In our app the logout url will be **http://localhost:3000**

### Step 4: Install the Auth0 Next js SDK

Run the following command within your project directory to install the nextjs-auth0 npm package

`npm install @auth0/nextjs-auth0`

### Step 5: Configure the SDK

In the root directory of your next js application, create a file **.env.local**.
Add the following environment variables:

```
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://{yourDomain}'
AUTH0_CLIENT_ID='{yourClientId}'
AUTH0_CLIENT_SECRET='{yourClientSecret}'
```

The SDK will read these values from the Node.js process environment and automatically configure itself.

### Step 6: Add the dynamic API Route

Create an auth directory under the pages/api directory. Under this newly created auth directory, create a [...auth0].js file. The path to your dynamic API route file should then be pages/api/auth/[...auth0].js.

Add the following to this file and save

```
import { handleAuth } from '@auth0/nextjs-auth0';

export default handleAuth();
```

This creates the following routes:

/api/auth/login: The route used to perform login with Auth0.
/api/auth/logout: The route used to log the user out.
/api/auth/callback: The route Auth0 will redirect the user to after a successful login.
/api/auth/me: The route to fetch the user profile from.


### Step 7: Add the UserProvider component

On the frontend side, the SDK uses React Context to manage the authentication state of your users. To make that state available to all your pages, you need to override the App component and wrap its inner component with a UserProvider.

In the _app.js file add the following code

```
import '@/styles/globals.css'
import Header from '@/components/Header'
import { NotesProvider } from '@/context/NotesContext'
import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function App({ Component, pageProps }) {
	return (
		<div className="container mx-auto p-6">
			<UserProvider>
				<NotesProvider>
					<Header />
					<Component {...pageProps} />
				</NotesProvider>
			</UserProvider>
		</div>
	)
}
```

Note in the code above we are wrapping everything with **UserProvider** component. Now we can access the authentication state in any component using the **useUser()** hook.

### Add Login link and logout link

Users can now log in to your application by visiting the /api/auth/login route provided by the SDK. 

```
<a href="/api/auth/login">Login</a>
```

This will work, but we will display the login and logout link conditionally based on whether a user is logged in or not.

```
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from "next/link"

const Header = () => {
    const { user, error, isLoading } = useUser()

    if (isLoading) return <div>Loading...</div>;
    if (error) return null;

    return (
        <nav>
            {!user && <a href='/api/auth/login'>Login</a>}
            {user && <a href='/api/auth/logout'>Logout</a>}
        </nav>
    )
}

export default Header
```

In the example above we use the Login and Logout links on the Header component.
We use the **useUser()** hook to get the values of user, error and isLoading.
We check and if a user exist we display the Logout button, else we display the Login Button.


### Protecting the Routes and Pages

In our app, we used the withPageAuthRequired HOC to protect private routes and pages.

```
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client"

const PrivateComponent = (props) => {
    // This is our private component we want to hide from public
}

export default withPageAuthRequired(PrivateComponent)
```

In the above example we wrap the component that we want to hide from public by wrapping it in a HOC withPageAuthRequired.