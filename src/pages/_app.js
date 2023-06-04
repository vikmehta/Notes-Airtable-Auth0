import { useState, useEffect } from 'react'
import Router from "next/router";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Header from '@/components/Header'
import Loader from '@/components/Loader';
import { NotesProvider } from '@/context/notesContext'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const start = () => {
			setLoading(true);
		};
		const end = () => {
			setLoading(false);
		};
		Router.events.on("routeChangeStart", start);
		Router.events.on("routeChangeComplete", end);
		Router.events.on("routeChangeError", end);
		return () => {
			Router.events.off("routeChangeStart", start);
			Router.events.off("routeChangeComplete", end);
			Router.events.off("routeChangeError", end);
		};
	}, []);

	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<UserProvider>
					<NotesProvider>
						<Header />
						<div className="container mx-auto px-2 py-4">
							<Component {...pageProps} />
						</div>
					</NotesProvider>
				</UserProvider>
			)}
		</>
	);
}