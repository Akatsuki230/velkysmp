import {
    Button,
    CircularProgress,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure
} from "@nextui-org/react";
import { GetServerSidePropsContext } from "next";
import { Inter } from "next/font/google";
import React, { useState } from "react";
import Head from "next/head";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    return {
        props: {
            loggedIn: false
        }
    };
}

const inter = Inter({ subsets: ["latin"] });

export default function Admin(props: {
    loggedIn: boolean;
    users: { name: string; token: string; playtime: string }[]
}) {
    const [enteredToken, setEnteredToken] = useState("");

    const [oneTimeCodeFor, setOneTimeCodeFor] = useState("");
    const [oneTimeCode, setOneTimeCode] = useState("");
    const [oneTimeCodeGenerated, setOneTimeCodeGenerated] = useState(false);


    function logIn() {
        saveCookie("auth-token", enteredToken);
        window.location.reload();
    }

    const { isOpen: oneTimeCodeIsOpen, onOpen: oneTimeCodeOpen, onClose: oneTimeCodeOnClose } = useDisclosure();

    function readCookie(name: string): string | null {
        const value = `${name}=`;
        const parts = document.cookie.split("; ");

        for (let i = 0; i < parts.length; i++) {
            if (parts[i].indexOf(value) === 0) {
                return parts[i].substring(value.length);
            }
        }
        return null;
    }


    function saveCookie(name: string, value: string): void {
        document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=None; Secure`;
    }

    function generateOneTimeCodeFor(name: string) {
        setOneTimeCodeFor(name);
        setOneTimeCode("");
        setOneTimeCodeGenerated(false);
        oneTimeCodeOpen();

        fetch("/api/generateOneTimeCode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                token: readCookie("auth-token") ?? ""
            })
        }).then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    setOneTimeCode(data.code);
                    setOneTimeCodeGenerated(true);
                });
            }
        });
    }


    return (
        <main className={inter.className}>
            <div className="flex justify-center min-h-screen">
                <div className="w-[400px] md:w-[600px] lg:w-[800px] xl:w-[1100px]">
                    <h1 className="text-3xl font-bold">Admin panel</h1>
                    {props.loggedIn ? (
                        <>
                            <Head>
                                <title>Velky SMP | Admin panel</title>
                                <meta name="description" content="Velky SMP Admin panel" />
                                <link rel="icon" href="/favicon.ico" />
                                <meta property="og:title" content="Velky SMP | Admin panel" />
                                <meta property="og:description" content="Velky SMP Admin panel" />
                                <meta property="og:image" content="https://velkysmp-mon.vercel.app/favicon.ico" />
                                <meta property="og:url" content="https://velkysmp-mon.vercel.app/admin" />
                                <meta property="og:type" content="website" />
                                <meta property="og:site_name" content="Velky SMP Status Monitor" />
                                <meta property="og:locale" content="en_US" />
                            </Head>
                            <h2 className="text-2xl font-bold">Users</h2>
                            <Table>
                                <TableHeader>
                                    <TableColumn>NAME</TableColumn>
                                    <TableColumn>TOKEN</TableColumn>
                                    <TableColumn>PLAYTIME</TableColumn>
                                    {/*    add a button for generating a one time code */}
                                    <TableColumn>ONE-TIME CODE</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {props.users.map((user, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{user.name}</TableCell>
                                                <TableCell>{user.token}</TableCell>
                                                <TableCell>{user.playtime}</TableCell>
                                                <TableCell><Button
                                                    onClick={() => generateOneTimeCodeFor(user.name)}>Generate</Button></TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </>
                    ) : (
                        <>
                            <Head>
                                <title>Velky SMP | Log in</title>
                                <meta name="description" content="Velky SMP Log in" />
                                <link rel="icon" href="/favicon.ico" />
                                <meta property="og:title" content="Velky SMP | Log in" />
                                <meta property="og:description" content="Velky SMP Log in" />
                                <meta property="og:image" content="https://velkysmp-mon.vercel.app/favicon.ico" />
                                <meta property="og:url" content="https://velkysmp-mon.vercel.app/admin" />
                                <meta property="og:type" content="website" />
                                <meta property="og:site_name" content="Velky SMP Status Monitor" />
                                <meta property="og:locale" content="en_US" />
                            </Head>
                            <h2 className="text-2xl font-bold">Log in</h2>
                            <Input type="password" label="Enter AdminToken" value={enteredToken}
                                   onChange={(x) => setEnteredToken(x.target.value)}></Input>
                            <Button color="primary" onClick={logIn}>Log in</Button>
                        </>
                    )}
                </div>
            </div>

            <Modal isOpen={oneTimeCodeIsOpen} onClose={oneTimeCodeOnClose} className="dark text-white bg-background">
                <ModalContent>
                    {(close) => (
                        <ModalBody>
                            <ModalHeader>
                                One time code
                            </ModalHeader>
                            <ModalBody>
                                <p>For: {oneTimeCodeFor}</p>
                                <p>The code is:</p>
                                {oneTimeCodeGenerated ? <p className="text-3xl font-bold">{oneTimeCode}</p> :
                                    <CircularProgress />}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" onClick={close}>Close</Button>
                            </ModalFooter>
                        </ModalBody>
                    )}
                </ModalContent>
            </Modal>
        </main>
    );
}
