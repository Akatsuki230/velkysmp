import {
    Button,
    CircularProgress,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader
} from "@nextui-org/react";
import { useState } from "react";

function CustomizeProfileModal(props: { isOpen: boolean, onClose: () => void }) {
    const [oneTimeCode, setOneTimeCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState("");
    const [error, setError] = useState("");

    const confirm = () => {
        setLoading(true);
        setError("");
        fetch("/api/useOneTimeCode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ oneTimeCode })
        }).then(x => x.json()).then(x => {
            console.log(x);
            setLoading(false);
            if (x.name && x.token) {
                setToken(x.token);
                setError("");
            } else {
                setError(x.error);
            }
        });
    };

    return (
        <div className="dark text-white">
            <Modal isOpen={props.isOpen} onClose={props.onClose}>
                <ModalContent>
                    {(close) => (
                        <div className="dark bg-gray-950 text-white">
                            <ModalHeader>
                                Customize Profile
                            </ModalHeader>
                            <ModalBody>
                                <h1 className="text-2xl font-bold">How to customize your profile:</h1>
                                <p>To customize your profile, simply DM @akatsuki2555 and she'll send you a one-time code.
                                    You'll then get a link to your profile settings.</p>
                                <p>One time codes are valid for only 30 minutes, after that they expire.</p>
                                <p className="font-bold">Avoid showing the URL you get anywhere.
                                    People can see your past sessions and change your public profile.</p>

                                <p>Input the code you got from Akatsuki here:</p>
                                <Input disabled={loading} type="password" label="Code" value={oneTimeCode}
                                       onChange={x => setOneTimeCode(x.target.value)} />

                                {loading && <CircularProgress />}
                                {token && <>
                                    <p>Your profile URL is:</p>
                                    <p className="text-xl font-bold">{token}</p>
                                    <p>Save it somewhere safe as the code was already deleted.</p>
                                </>}
                                {error && <p className="text-red-500">{error}</p>}
                            </ModalBody>
                            <ModalFooter>
                                {/*<Button color="primary" onClick={confirm}>Confirm token</Button>*/}
                                {/*go to link or use one time code*/}
                                {!token && <Button onClick={confirm}>Use one-time code</Button>}
                                {token && <Button color="success" onClick={() => window.open("/profile/" + token)}>Open profile</Button>}
                                <Button onClick={close}>Cancel</Button>
                            </ModalFooter>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

export default CustomizeProfileModal;