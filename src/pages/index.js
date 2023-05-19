import Head from 'next/head'
import { useContext, useEffect } from 'react'
import { cleanUpRecords } from 'helpers/helpers'
import Notes from '@/components/Notes'
import { NotesContext } from '@/context/NotesContext'
import { useUser } from '@auth0/nextjs-auth0/client';

export const getServerSideProps = async (context) => {
	const Airtable = require('airtable');
	const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID);
	const table = base(process.env.AIRTABLE_TABLE_NAME)

	// const notes = await table.select({
	// 	sort: [{ field: "createdDate", direction: "desc" }],
	// 	//pageSize: 2
	// }).firstPage()

	const notes = await table.select({
		sort: [{ field: "createdDate", direction: "desc" }],
		// pageSize: 2
	}).all()

	const cleanNotes = await cleanUpRecords(notes)

	return {
		props: {
			initialNotes: cleanNotes
		}
	}
}

const Home = (props) => {
	const { initialNotes } = props
	const { notes, setNotes } = useContext(NotesContext)
	const { user, error, isLoading } = useUser();

	useEffect(() => {
		setNotes(initialNotes)
	}, [initialNotes, setNotes])

	return (
		<>
			<Head>
				<title>Notes App</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				{!user && <h1 className='text-xl my-20 text-center'>You must be logged in to see / create notes.</h1>}
				{user && (
					<>
						<h1 className='text-xl mb-5'>NextJS - AirTable - Auth0 App</h1>
						<Notes notes={notes} />
					</>
				)}
			</main>
		</>
	)
}

export default Home