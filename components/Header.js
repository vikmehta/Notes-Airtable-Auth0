import { useUser } from '@auth0/nextjs-auth0/client';
import Link from "next/link"

const Header = () => {
    const { user, error, isLoading } = useUser()

    if (isLoading) return <div>Loading...</div>;
    if (error) return null;

    return (
        <header className="shadow-md text-gray-600 body-font">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <Link href="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    <span className="ml-3 text-xl">My Notes</span>
                </Link>
                <nav className='flex ml-auto'>
                    {!user && <Link href='/api/auth/login' className='block rounded bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 ms-2'>Login</Link>}
                    {user && (
                        <>
                            <Link href="/add" className="block rounded bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 ms-2">Add Note</Link>
                            <Link href='/api/auth/logout' className='block rounded bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 ms-2'>Logout</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Header