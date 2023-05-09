import { useUser } from '@auth0/nextjs-auth0/client';
import Link from "next/link"

const Header = () => {
    const { user, error, isLoading } = useUser()

    if (isLoading) return <div>Loading...</div>;
    if (error) return null;

    return (
        <header className='flex justify-between items-center'>
            <Link href="/">
                <span className='text-2xl font-bold text-gray-700'>My Notes</span>
            </Link>
            <nav className='flex'>
                {!user && <Link href='/api/auth/login' className='block rounded bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 ms-2'>Login</Link>}
                {user && (
                    <>
                        <Link href="/add" className="block rounded bg-green-500 hover:bg-green-600 text-white px-4 py-2 ms-2">Add Note</Link>
                        <Link href='/api/auth/logout' className='block rounded bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 ms-2'>Logout</Link>
                    </>
                )}
            </nav>
        </header>
    )
}

export default Header