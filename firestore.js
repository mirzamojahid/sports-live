const whereExtract = (field, value) => {
    return {
        "fieldFilter": {
            "field": {
                "fieldPath": field
            },
            "op": "EQUAL",
            "value": {
                "stringValue": value
            }
        }
    }
}

const startAfterVal = ({ startAfterx }) => {
    return {
        "before": false,
        "values": startAfterx

    }
}

const whereContains = (field, value) => {

    return {
        "compositeFilter": {
            "op": "AND",
            "filters": [
                {
                    "fieldFilter": {
                        "field": {
                            "fieldPath": field
                        },
                        "op": "GREATER_THAN_OR_EQUAL",
                        "value": {
                            "stringValue": value
                        }
                    }
                },
                {
                    "fieldFilter": {
                        "field": {
                            "fieldPath": field
                        },
                        "op": "LESS_THAN_OR_EQUAL",
                        "value": {
                            "stringValue": value + "\uf8ff"
                        }
                    }
                }
            ]
        }
    }

}

const queryStructured = ({ collectionId, limit = null, whereType = "Contains", whereField, whereValue, orderBy, startAfterValues, selectFields }) => {

    let search_pagination = {
        "structuredQuery": {
            "from": [{
                "collectionId": collectionId
            }],
            "orderBy": [
                {
                    "field": {
                        "fieldPath": orderBy
                    },
                    "direction": "ASCENDING"
                },
                {
                    "field": {
                        "fieldPath": "__name__"
                    },
                    "direction": "ASCENDING"
                }
            ],
            "limit": limit == null ? null : limit,
            "select": selectFields == null ? null : selectField(selectFields),
            "startAt": startAfterValues == null ? null : startAfterVal({ startAfterx: startAfterValues }),
            "where": whereField == null ? null : (whereType == "Contains" ? whereContains(whereField, whereValue) : whereExtract(whereField, whereValue))
        }
    }
    return search_pagination;
}

const selectField = (fields) => {
    return {
        "fields": fields.map((data) => {
            return {
                "fieldPath": data
            }
        })
    }
}

const snapDocJson = (valuex) => {
    let obj = {};
    if (valuex !== null) {
        console.log(valuex);
        obj["id"] = valuex.name.split("/")[6];
        for (let [key, value] of Object.entries(valuex.fields)) {
            for (let v1 of Object.values(value)) {
                obj[key] = v1
            }
        }
    }


    return obj
}

const snapDocsJson = (valuex) => {
    let arr = [];
    if (valuex !== null) {
        if (!valuex[0].hasOwnProperty('document')) {
            return arr;
        }
        valuex.map((e) => {
            let obj = {};
            obj["id"] = e.document.name;
            for (let [key, value] of Object.entries(e.document.fields)) {
                for (let v1 of Object.values(value)) {
                    obj[key] = v1

                }

            }
            arr.push(obj);
        })
    }

    return arr
}


const getBlogById = async (apiKey, projectId, collectIdX, id) => {

    console.log(id);
    try {
        let res = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectIdX}/${id}/?key=${apiKey}`, {
            method: "GET",
        })
        let data = await res.json();
        if (res.status === 200) {
            return data;
        } else if (res.status === 429) {
            return 429;
        } else if (res.status === 404) {
            return null;
        }
    } catch (e) {
        return null;
    }
}



const getBlogs = async (apiKey, projectId, collectIdX, next) => {
    try {
        if (next !== null) {
            let x =
                [{
                    "stringValue":
                        next.title
                }, { "referenceValue": `projects/${projectId}/databases/(default)/documents/${collectIdX}/${next.id}` }]

            next = x;
        }
        let res = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?key=${apiKey}`, {
            method: "POST",
            body: JSON.stringify(
                queryStructured({ collectionId: collectIdX, orderBy: "title", limit: 5, selectFields: ["title", "img", "src", "type"], startAfterValues: next })
            )
        })
        let data = await res.json();

        console.log(data);

        if (res.status === 200) {
            return data;
        } else if (res.status == 429) {
            return 429;
        } else {
            return data;
        }
    } catch (e) {
        return null;
    }
}



module.exports = { whereExtract, whereContains, queryStructured, selectField, selectField, snapDocJson, snapDocsJson, getBlogById, getBlogs };