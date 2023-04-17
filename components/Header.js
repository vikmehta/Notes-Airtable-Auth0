import Link from "next/link"

const Header = () => {
    return (
        <header className='flex justify-between items-center'>
            <Link href="/">
                <span className='text-2xl font-bold text-gray-700'>My Notes</span>
            </Link>
            <nav className='flex'>
                <a href='/api/login' className='block rounded bg-blue-500 hover:bg-blue-600 text-white px-4 py-2'>Login</a>
                <a href='/api/logout' className='block rounded bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 ms-2'>Logout</a>
            </nav>
        </header>
    )
}

export default Header