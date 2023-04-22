import '@/styles/globals.css'
import Header from '@/components/Header'
import { NotesProvider } from '@/context/NotesContext'

export default function App({ Component, pageProps }) {
	return (
		<div className="container mx-auto p-6">
			<NotesProvider>
				<Header />
				<Component {...pageProps} />
			</NotesProvider>
		</div>
	)
}
