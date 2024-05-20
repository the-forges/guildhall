import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';

function Authenticated({ children }) {
    const [loading, setLoading] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [challenge, setChallenge] = useState("");
    const sessionId = localStorage.getItem("sessionId");

    const url = window.location.href + 'api/';

    useEffect(() => {
        if (sessionId != null && sessionId !== "") {
            setAuthenticated(true);
        }

        if (!authenticated) {
            if (!loading) {
                setLoading(true);
                fetch(`${url}preauth`).then(async (res) => {
                    const data = await res.json();
                    setChallenge(data.challenge);
                });
            }

            let timer = setInterval(async () => {
                if (authenticated) {
                    clearInterval(timer);
                    return;
                }

                if (challenge !== "") {
                    const res = await fetch(`${url}authenticated/${challenge}`);
                    const data = await res.json();
                    if (data.user) {
                        setAuthenticated(!authenticated);
                        setLoading(false);
                        localStorage.setItem("sessionId", challenge);
                        localStorage.setItem("user", JSON.stringify(data.user));
                    }
                }
            }, 100);

            return () => clearInterval(timer);
        }

        window.addEventListener("logout", () => {
            localStorage.clear();
            setAuthenticated(false);
        });
    });

    if (!authenticated) {
        return (
            <>
                <h1>Guildhall</h1>
                <h2>Please scan your passport</h2>
                <QRCodeSVG value={url + 'authenticate/' + challenge} />
                <p>Session Id: {challenge}</p>
            </>
        );
    }

    return (
        <>
            {children}
        </>
    );
}

export default Authenticated;