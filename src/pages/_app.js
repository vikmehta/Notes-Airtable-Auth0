import '@/styles/globals.css'
import Header from '@/components/Header'
import { NotesProvider } from '@/context/notesContext'
import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function App({ Component, pageProps }) {
	return (
		<UserProvider>
			<NotesProvider>
				<Header />
				<div className="container mx-auto px-2 py-4">
					<Component {...pageProps} />
				</div>
			</NotesProvider>
		</UserProvider>
	)
}
