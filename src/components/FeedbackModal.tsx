import { Button, Card, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import React, { useState } from "react";

const FeedbackModal = (props: {isOpen: boolean, onClose: () => void}) => {
    const [nameField, setNameField] = useState("");
    const [feedbackField, setFeedbackField] = useState("");

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const submit = (close: () => void) => {
        (async () => {
            setError(false);
            setErrorMessage("");
            const res = await fetch("/api/sendFeedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: nameField,
                    feedback: feedbackField
                })
            })

            if (!res.ok) {
                const json = await res.json();
                setError(true);
                setErrorMessage(json.error);
                return;
            }

            close();
        })()
    }

    return <Modal isOpen={props.isOpen} onClose={props.onClose} backdrop="blur" className="dark text-foreground bg-background">
        <ModalContent>
            {(close) => {
                return (
                    <>
                        <ModalHeader>Feedback</ModalHeader>
                        <ModalBody>
                            <p>Here you can share your feedback.</p>
                            <Input type="text" value={nameField} onChange={x => setNameField(x.target.value)} label="Name" prefix="Akatsuki..." />
                            <Input type="text" value={feedbackField} onChange={x => setFeedbackField(x.target.value)} label="Feedback Message" prefix="This could be better..." />
                            {error && <Card className="bg-red-700 p-2 text-white">
                                An error occurred: {errorMessage}
                            </Card>}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={() => submit(close)}>Submit</Button>
                            <Button onClick={close}>Cancel</Button>
                        </ModalFooter>
                    </>
                );
            }}
        </ModalContent>
    </Modal>;
}

export default FeedbackModal;
