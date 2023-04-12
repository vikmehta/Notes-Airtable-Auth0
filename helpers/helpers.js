import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

export const cleanUpRecords = async (records) => {
    const cleanData = await records.map((record) => {
        return {
            id: record.id,
            ...record.fields,
            createdTime: record['_rawJson'].createdTime
        }
    })

    return cleanData
}

// Get Date from Timestamp
export const getDateFromTimestamp = (timeStamp) => {
    const d = new Date(timeStamp)
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

    return `${da}-${mo}-${ye}`
}

// Sanitize the markup html
export const sanitizeContent = (content) => {
    const HTMLString = marked(content)
    const sanitizedHTMLString = DOMPurify.sanitize(HTMLString)
    return sanitizedHTMLString
}