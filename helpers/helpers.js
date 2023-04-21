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

export const cleanUpSingleRecord = async (record) => {
    const cleanData = {
        id: record.id,
        ...record.fields,
        createdTime: record['_rawJson'].createdTime
    }

    return cleanData
}

// Get Date from Timestamp
export const getDateFromTimestamp = (timeStamp) => {
    const d = new Date(timeStamp)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    const formattedDate = d.toLocaleString("en-US", options)
    return formattedDate
}

// Sanitize the markup html
export const sanitizeContent = (content) => {
    const HTMLString = marked(content)
    const sanitizedHTMLString = DOMPurify.sanitize(HTMLString)
    return sanitizedHTMLString
}