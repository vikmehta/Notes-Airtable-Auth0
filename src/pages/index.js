import Head from 'next/head'
import { useContext, useEffect } from 'react'
import { cleanUpRecords } from 'helpers/helpers'
import Notes from '@/components/Notes'
import { NotesContext } from '@/context/NotesContext'

export const getServerSideProps = async (context) => {
	const Airtable = require('airtable');
	const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID);
	const table = base(process.env.AIRTABLE_TABLE_NAME)

	const notes = await table.select({
		sort: [{ field: "createdDate", direction: "desc" }]
	}).firstPage()
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
				<h1 className='text-xl mb-5'>NextJS - AirTable - Auth0 App</h1>
				<Notes notes={notes} />
			</main>
		</>
	)
}

export default Home