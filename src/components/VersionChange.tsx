import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

function VersionChanges(props: { isOpen: boolean; onClose: () => void }) {
    return (
        <Modal isOpen={props.isOpen} onOpenChange={props.onClose} className="dark text-white">
            <ModalContent>
                {(close) => (
                    <>
                        <ModalHeader>
                            What's new:
                        </ModalHeader>
                        <ModalBody>
                            <p className="text-xl font-bold">
                                1.6
                            </p>
                            <ul className="list-disc">
                                <li>Added the ability to show last join time</li>
                                <li>Fixed a small bug that would make the Minecraft checking service stop working when there weren't any online players</li>
                                <li>Updated link to developer details</li>
                            </ul>

                            <p className="text-xl font-bold">
                                1.5
                            </p>
                            <ul className="list-disc">
                                <li>Added one-time codes</li>
                                <li>Improved display in social media</li>
                            </ul>

                            <p className="text-xl font-bold">
                                1.4
                            </p>
                            <ul className="list-disc">
                                <li>Added pride flags to customization</li>
                                <li>Added stars next to every player</li>
                                <li>Added country flags</li>
                            </ul>

                            {/* <p className="text-xl font-bold">
                                1.3
                            </p>
                            <ul className="list-disc">
                                <li>Fixed the warning about online players showing when it shouldn't</li>
                                <li>Added a feedback modal</li>
                            </ul> */}

                            {/*<p className="text-xl font-bold">*/}
                            {/*    1.2*/}
                            {/*</p>*/}
                            {/*<ul className="list-disc">*/}
                            {/*    <li>Added player sessions</li>*/}
                            {/*    <li>Removed localization as everyone knows English</li>*/}
                            {/*    <li>Added a Privacy Policy</li>*/}
                            {/*</ul>*/}

                            {/*<p className="text-xl font-bold">*/}
                            {/*    1.1*/}
                            {/*</p>*/}
                            {/*<ul className="list-disc">*/}
                            {/*    <li>Added profile customization</li>*/}
                            {/*    <li>Added developer information</li>*/}
                            {/*    <li>Added a changelog</li>*/}
                            {/*    <li>Added MOTD, ping, online, and max players</li>*/}
                            {/*    <li>Added grouping of players</li>*/}
                            {/*</ul>*/}

                            {/*<p className="text-xl font-bold">*/}
                            {/*    1.0*/}
                            {/*</p>*/}
                            {/*<ul className="list-disc">*/}
                            {/*    <li>Initial release</li>*/}
                            {/*</ul>*/}
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={close}>Close</Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default VersionChanges;
