import { useState } from "react";

const url = window.location.href + 'api/forges/';

function CreateForge({ onSuccess }) {
    const [name, setName] = useState("");

    const createForge = async () => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'X-Session-ID': localStorage.getItem('sessionId')
            },
            body: JSON.stringify({
                'name': name
            })
        });
        if (res.ok) {
            const data = await res.json();
            onSuccess(data.forge);
        }
    };

    return (
        <>
            <h2>Create a new Forge</h2>
            <form onSubmit={(event) => {
                event.preventDefault();
                createForge();
            }}>
                <label>
                    Name:
                    <input onChange={(event) => setName(event.target.value)} name="name" value={name} />
                </label>
                <input type="submit" value="Create" />
            </form>
        </>
    );
}
export default CreateForge;