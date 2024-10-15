import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, Progress, Tab, Tabs } from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
import Head from "next/head";
import { parseCookies } from "nookies";
import { GroupModes, Player } from "@/components/Types";
import {
    renderGroupedByNone,
    renderGroupedByOnline,
    renderGroupedByPlaytime,
    renderGroupedByFirstLetter
} from "@/components/PlayerLists";
import VersionChanges from "@/components/VersionChange";
import CustomizeProfileModal from "@/components/CustomizeProfileModal";
import FeedbackModal from "@/components/FeedbackModal";
import WarningModal from "@/components/WarningModal";

const LATEST_VERSION = "6";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const { isOpen: versionIsOpen, onOpen: versionOnOpen, onClose: versionOnClose } = useDisclosure();
    const { isOpen: warningIsOpen, onOpen: warningOnOpen, onClose: warningOnClose } = useDisclosure();
    const {
        isOpen: customizeProfileIsOpen,
        onOpen: customizeProfileOnOpen,
        onClose: customizeProfileOnClose
    } = useDisclosure();
    const {
        isOpen: feedbackIsOpen,
        onOpen: feedbackOnOpen,
        onClose: feedbackOnClose
    } = useDisclosure();
    const [users, setUsers] = useState([] as Player[]);
    const [loading, setLoading] = useState(true);
    const [motd, setMotd] = useState("");
    const [online, setOnline] = useState(0);
    const [max, setMax] = useState(0);
    const [ping, setPing] = useState(0);
    const [grouping, setGroupingProp] = useState("online" as GroupModes);

    function setGrouping(x: GroupModes) {
        setGroupingProp(x);
        document.cookie = `GROUPING=${x}; path=/; max-age=31536000`;
    }

    useEffect(() => {
        const cookies = parseCookies();
        switch (cookies.GROUPING) {
            case "none":
            case "online":
            case "playtime":
            case "first_letter":
                setGrouping(cookies.GROUPING);
                break;
            default:
                setGrouping("none");
        }

        fetch("/api/get")
            .then((res) => res.json())
            .then((data) => {
                setUsers(data.players);
                setMotd(data.motd);
                setOnline(data.online);
                setMax(data.max);
                setPing(data.ping);
                setLoading(false);
            });

        // if (cookies.VERSION !== LATEST_VERSION) {
        //     document.cookie = `VERSION=${LATEST_VERSION}`;
        //     versionOnOpen();
        // }
        // No longer show updates

        warningOnOpen();
    }, []);

    return (
        <main className={`${inter.className} min-h-[100vh]`}>
            <Head>
                <title>VelkySMP</title>
                <meta name="description" content="VelkySMP Status Monitor by Akatsuki2555" />
                <meta name="og:title" content="VelkySMP Status Monitor" />
                <meta name="og:description" content="VelkySMP Status Monitor by Akatsuki2555" />
                <meta name="og:url" content="https://velkysmp-mon.vercel.app" />
                <meta name="og:image" content="https://velkysmp-mon.vercel.app/favicon.ico" />
                <link rel="icon" href="/favicon.ico" />
                <meta property="og:site_name" content="Velky SMP Status Monitor" />
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="en_US" />
            </Head>
            <div className="flex justify-center">
                <div className="w-[400px] md:w-[600px] lg:w-[800px] xl:w-[1100px]">
                    <VersionChanges isOpen={versionIsOpen} onClose={versionOnClose} />

                    <div
                        style={{
                            backgroundImage: "url('/bg.webp')",
                            backgroundPosition: "center",
                            backgroundSize: "cover"
                        }}
                        className="h-40 rounded-2xl m-1 p-12"
                    >
                        <h1 className="text-4xl mb-2">
                            VelkySMP
                        </h1>
                        <h2 className="text-xl">
                            Status Monitor
                        </h2>
                    </div>
                    <Button title="Customize Profile" onClick={customizeProfileOnOpen}>
                        Customize Profile
                    </Button>
                    <Button title="Developer" className="ml-2" onClick={() => {
                        location.href = "https://akatsuki.nekoweb.org/";
                    }}>
                        Developer
                    </Button>
                    <Button title="Developer" className="ml-2" onClick={() => {
                        location.href = "/privacy";
                    }}>
                        Privacy Policy
                    </Button>
                    <Button title="Feedback" className="ml-2" onClick={feedbackOnOpen}>
                        Feedback
                    </Button>
                    <br />
                    <p>
                        Welcome to the VelkySMP Status Monitor by Akatsuki2555! This page shows the status of the
                        VelkySMP server, as well as the playtime of all players.
                    </p>
                    {loading || (
                        <>
                            <p className="mt-2">
                                MOTD: {motd}
                            </p>
                            <p>
                                {online}/{max}
                            </p>
                            <p>
                                Ping: {ping}ms
                            </p>
                        </>
                    )}

                    {loading && <Progress isIndeterminate aria-label="Loading..." className="my-2" />}

                    {online > 12 && <Card>
                        <CardBody className="bg-yellow-800 font-bold">
                            WARNING: The maximum online players that can be shown is 12 and that is a limitation of
                            Minecraft. For the players that don't appear online, their playtime will not be counted.
                        </CardBody>
                    </Card>}

                    <p className="mt-2">
                        Group by:
                    </p>
                    <Tabs selectedKey={grouping} onSelectionChange={(x) => setGrouping(x.toString() as GroupModes)}>
                        <Tab key="none" title="None">
                            {renderGroupedByNone(loading, users)}
                        </Tab>
                        <Tab key="online" title="Online/Offline">
                            {renderGroupedByOnline(loading, users)}
                        </Tab>
                        <Tab key="playtime" title="Playtime">
                            {renderGroupedByPlaytime(loading, users)}
                        </Tab>
                        <Tab key="first_letter" title="First Letter">
                            {renderGroupedByFirstLetter(loading, users)}
                        </Tab>
                    </Tabs>

                    <p className="text-sm mt-4">
                        This page is not affiliated with VelkySMP or Velky himself. This page is made as a community
                        project by Akatsuki2555.
                    </p>

                    <CustomizeProfileModal isOpen={customizeProfileIsOpen} onClose={customizeProfileOnClose} />
                    <FeedbackModal isOpen={feedbackIsOpen} onClose={feedbackOnClose} />
                    <WarningModal isOpen={warningIsOpen} onClose={warningOnClose} />
                </div>
            </div>
        </main>
    );
}
