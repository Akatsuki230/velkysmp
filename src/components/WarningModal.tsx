import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

const WarningModal = (props: {isOpen: boolean, onClose: () => void}) => {
    return <Modal isOpen={props.isOpen} onClose={props.onClose} backdrop="blur" className="dark text-foreground bg-background">
        <ModalContent>
            {(close) => {
                return (
                    <>
                        <ModalHeader>Deprecation Warning</ModalHeader>
                        <ModalBody>
                            <p className="text-red-600"><strong>TL;DR: This serice will shut down following the 31st of October.</strong></p>
                            <p>It has been fun running this service as a side project of mine, but I have other projects to maintain and in recent times I haven't seen recent usage of this project.</p>
                            <p>As a decision of mine, I am going to be shutting down this project. Customization codes will not be given out anymore and this website will shut down on the date.</p>
                            <p>The project's source code was, is and will be available on GitHub and Codeberg. If you want to host this, do as you want. Create a fork and go!</p>
                            <p>Thank you for using this service.</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={close}>OK</Button>
                        </ModalFooter>
                    </>
                );
            }}
        </ModalContent>
    </Modal>;
}

export default WarningModal;