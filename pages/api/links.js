const { getBlogs, snapDocsJson } = require("../../firestore.js");


export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).send({ msg: 'Method Not Allowed' });
    }

    const apiKey = process.env.DB_API_KEY
    const projectId = process.env.DB_PROJECT_ID
    const collectIdX = process.env.DB_COLLECTION_IDX
    try {
        let rex = [
        ];
        const next = req.body.next || null
        rex = await getBlogs(apiKey, projectId, collectIdX, next);
        if (rex === null) {
            res.status(400).json({ err: true, msg: "Something went wrong!" })
        }
        const data = snapDocsJson(rex);
        if (data !== undefined) {
            let obj = {
                err: false,
                limit: null
            }
            if (data.length === 5) {
                const x = data.pop()
                delete x.img
                obj['data'] = data;
                obj['next'] = x;
            } else {
                obj['data'] = data;
                obj['next'] = null;
            }
            res.status(200).json(obj)
        }
    } catch (e) {
        res.status(400).json({ err: true, msg: e.message })
    }


}