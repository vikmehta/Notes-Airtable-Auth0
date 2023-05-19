import '@/styles/globals.css'
import Header from '@/components/Header'
import { NotesProvider } from '@/context/NotesContext'
import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function App({ Component, pageProps }) {
	return (
		<UserProvider>
			<NotesProvider>
				<Header />
				<div className="container mx-auto p-6">
					<Component {...pageProps} />
				</div>
			</NotesProvider>
		</UserProvider>
	)
}
