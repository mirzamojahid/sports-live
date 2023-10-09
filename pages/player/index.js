/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'

function index() {
    const [datax, setDatax] = useState({ "src": null, "type": null });
    const [loading, setLoading] = useState(true);

    async function checkUrl() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('id')
        const type = urlParams.get('type')
        setDatax({ src: id, type: type });
        setLoading(false);
    }

    useEffect(() => {
        checkUrl();
    }, [])


    return (
        <div style={{ width: "100vw", height: "100vh" }} id="container">
            {loading == true ? <div>Loading....</div> : <>
                {
                    datax.src !== null && datax.type === "bdix" ? <iframe class="metaframe rptss" style={{ width: "100%", height: "100%" }} src={datax.src} scrolling="no" allow="autoplay; encrypted-media" allowfullscreen=""></iframe>
                        : <iframe allowfullscreen="" style={{ width: "100%", height: "100%" }} src={datax.src}></iframe>
                }
            </>
            }
        </div>
    )

}

export default index