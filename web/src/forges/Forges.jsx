import { useEffect, useState } from "react";
import CreateForge from "./Create";
import Forge from './Forge';


const url = window.location.href + 'api/forges';

async function findAll() {
    const res = await fetch(url, {
        headers: {
            "X-Session-ID": localStorage.getItem("sessionId")
        }
    });
    const data = await res.json();
    console.log(data);
    if (data.forges) {
        return data.forges;
    }
    return [];
}

function Forges() {
    const [forges, setForges] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [newForge, setNewForge] = useState(false);

    useEffect(() => {
        if (!loaded) {
            findAll().then((data) => {
                setForges(data);
                setLoaded(true);
            });
        }
    })

    let forgeForm = newForge ? <CreateForge onSuccess={(forge) => {
        forges.push(forge);
        setForges(forges);
        setNewForge(false);
    }} /> : null;

    if (forges.length > 0) {
        let forgeCards = forges.map((forge) => <Forge key={forge.id} id={forge.id} name={forge.name} />);
        return (
            <>
                {forgeCards}
                {!newForge &&
                    <button onClick={() => setNewForge(true)}>Create A Forge</button>
                }
                {forgeForm}
            </>
        );
    }

    return (
        <>
            <p>You are not currently part of a Forge.</p>
            {!newForge &&
                <button onClick={() => setNewForge(true)}>Create A Forge</button>
            }
            {forgeForm}
        </>
    );
}
export default Forges