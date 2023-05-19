import Link from 'next/link'

const TitleWrapper = (props) => {
    const { title, previousPageUrl } = props

    return (
        <div className="flex items-center titleWrapper">
            <Link href={previousPageUrl} className="ps-2 pe-3 py-2 me-3 flex items-center rounded bg-gray-100 hover:bg-gray-200 text-gray-600 backButton">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="w-6 me-1"><path d="M427 234.625H167.296l119.702-119.702L256 85 85 256l171 171 29.922-29.924-118.626-119.701H427v-42.75z"></path></svg>
                <span className="tracking-widest">Back</span>
            </Link>
            <h1 className="tracking-widest heading">{title}</h1>
        </div>
    )
}

export default TitleWrapper