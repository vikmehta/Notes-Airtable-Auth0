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
