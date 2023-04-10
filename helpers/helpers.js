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