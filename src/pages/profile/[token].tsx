import { PlayerCard } from "@/components/PlayerCard";
import { Player, ProfileStyle } from "@/components/Types";
import { Button, Card, CardBody, Input, Select, SelectItem, Switch, Tab, Tabs, useDisclosure } from "@nextui-org/react";
import { MongoClient, WithId } from "mongodb";
import { GetServerSidePropsContext } from "next";
import { Inter } from "next/font/google";
import React, { useEffect, useRef, useState } from "react";
import FeedbackModal from "@/components/FeedbackModal";
import { getFlagImg, listFlags } from "@/components/PrideFlags";
import { getCodes, getFlag, getName } from "@/components/Countries";
import { Tooltip } from "@nextui-org/tooltip";
import { motion } from "framer-motion";

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token } = context.params as { token: string };

    const mongodb = new MongoClient(process.env.MONGODB_URI!);

    await mongodb.connect();

    const collPlaytimes = mongodb.db(process.env.MONGODB_DATABASE!).collection("Playtimes");
    const user = await collPlaytimes.findOne({ token }) as WithId<{
        uuid: string;
        humantime: string;
        name: string;
        online: boolean;
        seconds: number;
        token: string;
        profileStyle: ProfileStyle;
        lastjoin: Date;
    }> | null;

    const loginHistory = mongodb.db(process.env.MONGODB_DATABASE!).collection("LoginHistory");
    await loginHistory.insertOne({
        token,
        ip: context.req.socket.remoteAddress,
        date: new Date(),
        browser: context.req.headers["user-agent"]
    });

    const loginAttempts = await loginHistory.find({ token: { "$eq": token } }).sort({ date: -1 }).limit(10).toArray() as WithId<{
        token: string; ip: string; browser: string; date: Date;
    }>[];

    if (!user) {
        return {
            notFound: true
        };
    }

    if (!user.profileStyle) {
        user.profileStyle = {
            nameColour: "#FFFFFF", displayName: user.name, countryCode: "none", prideFlags: [], hideStar: false, showLastJoinedDate: false
        };
    }

    if (!user.profileStyle.countryCode) {
        user.profileStyle.countryCode = "none";
    }

    user.profileStyle.prideFlags = Array.isArray(user.profileStyle.prideFlags)
        ? user.profileStyle.prideFlags
        : [];

    if (!user.profileStyle.hideStar) {
        user.profileStyle.hideStar = false;
    }

    const collLastPlaytimes = mongodb.db(process.env.MONGODB_DATABASE!).collection("LastPlaytimes");
    const playtimes = await collLastPlaytimes.find({ "uuid": { "$eq": user.uuid } }).toArray();

    return {
        props: {
            token: token,
            name: user.name,
            profileStyle: user.profileStyle,
            humantime: user.humantime,
            seconds: user.seconds,
            online: user.online,
            lastJoin: user.lastjoin.toISOString(),
            pastPlaytimes: playtimes.map(x => {
                return {
                    name: x.name, humantime: x.humanplaytime, start: x.join_timestamp, end: x.leave_timestamp
                };
            }),
            loginAttempts: loginAttempts.map(x => {
                return {
                    ip: x.ip, browser: x.browser, date: x.date.toISOString()
                };
            })
        }
    };
}

const inter = Inter({ subsets: ["latin"] });


function PrideFlags(params: {
    playerCard: Player; setPlayerCard: React.Dispatch<React.SetStateAction<Player>>
}) {
    const addPrideFlag = (flag: string) => {
        if (!params.playerCard.profileStyle.prideFlags) params.playerCard.profileStyle.prideFlags = [];
        params.playerCard.profileStyle.prideFlags.push(flag);
        params.setPlayerCard({ ...params.playerCard });
    };

    const removePrideFlag = (flag: string) => {
        if (!params.playerCard.profileStyle.prideFlags) params.playerCard.profileStyle.prideFlags = [];
        params.playerCard.profileStyle.prideFlags = params.playerCard.profileStyle.prideFlags.filter(x => x !== flag);
        params.setPlayerCard({ ...params.playerCard });
    };

    return (
        <>
            <Card className="mt-2">
                <CardBody>
                    <h2 className="font-bold text-xl mb-2">Your pride flags</h2>
                    <div className="flex flex-row">
                        {params.playerCard.profileStyle.prideFlags ? (params.playerCard.profileStyle.prideFlags.map((x, i) => {
                            return (<img key={x} className="inline h-6 mr-2" src={getFlagImg(x)}
                                onClick={() => removePrideFlag(x)} />);
                        })) : (<p>No pride flags</p>)}
                    </div>
                    <h2 className="font-bold text-xl mt-2">Add pride flags</h2>
                    <div className="flex flex-row">
                        {listFlags()
                            .filter((x) => !params.playerCard.profileStyle.prideFlags?.includes(x))
                            .map((x, i) => {
                                return (<img key={x} className="inline h-6 mr-2" src={getFlagImg(x)}
                                    onClick={() => addPrideFlag(x)} />);
                            })}
                    </div>
                </CardBody>
            </Card>
            <p className="text-xs text-gray-500">Here you can add pride flags to your profile. </p>
        </>
    );
}

type SuggestedCountriesProps = {
    playerCard: {
        profileStyle: {
            countryCode: string
        }
    },
    countrySuggestions: Array<{
        code: string
    }>,
    setCountryCode: (code: string) => void,
    getName: (code: string) => string,
    getFlag: (code: string) => string
};

const SuggestedCountries: React.FC<SuggestedCountriesProps> = ({
    playerCard,
    countrySuggestions,
    setCountryCode,
    getName,
    getFlag
}) => {
    if (playerCard.profileStyle.countryCode === "NONE" || !playerCard.profileStyle.countryCode) {
        return (
            <Card className="mt-2">
                <CardBody>
                    <h2 className="font-bold text-xl mb-2">Suggested countries</h2>
                    <div className="flex flex-row">
                        {countrySuggestions.map((x, i) => (
                            <motion.div key={x.code} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Tooltip className="dark text-white" key={x.code} content={getName(x.code)}>
                                    <img className="inline h-6 mr-2" src={getFlag(x.code)}
                                        onClick={() => setCountryCode(x.code)} />
                                </Tooltip>
                            </motion.div>
                        ))}
                    </div>
                </CardBody>
            </Card>
        );
    }
    return null;
};


export default function ProfileToken(props: {
    token: string;
    name: string;
    humantime: string;
    profileStyle: ProfileStyle;
    seconds: number;
    online: boolean;
    lastJoin: string;
    pastPlaytimes: { name: string; humantime: string; start: number; end: number }[];
    loginAttempts: { ip: string; browser: string; date: string }[];
}) {

    const [playerCard, setPlayerCard] = useState<Player>(props);
    const [customizationStatus, setCustomizationStatus] = useState("hide" as "hide" | "error" | "success");
    const { isOpen: feedbackIsOpen, onOpen: feedbackOnOpen, onClose: feedbackOnClose } = useDisclosure();
    const [loginsShowIP, setLoginsShowIP] = useState(false);

    const [countrySuggestions, setCountrySuggestions] = useState<{ code: string, probability: number }[]>([]);

    const hasRan = useRef(false);

    useEffect(() => {
        if (hasRan.current) return;
        hasRan.current = true;

        fetch("/api/getCountrySuggestions?name=" + encodeURIComponent(playerCard.name)).then((res) => {
            if (res.ok) {
                res.json().then((data: any) => {
                    setCountrySuggestions(data);
                });
            }
        });
    });


    const setColor = (color: string) => {
        setPlayerCard({ ...playerCard, profileStyle: { ...playerCard.profileStyle, nameColour: color } });
    };

    const setName = (name: string) => {
        if (name === "") name = playerCard.name;
        setPlayerCard({ ...playerCard, profileStyle: { ...playerCard.profileStyle, displayName: name } });
    };

    const getLastPlayed = () => {
        // Sort the pastPlaytimes array based on the end time in descending order
        const sortedPlaytimes = props.pastPlaytimes.sort((a, b) => b.end - a.end);

        // Return the first element of the sorted array
        return sortedPlaytimes[0];
    }


    // addPrideFlag, removePrideFlag


    const setCountryCode = (code: string) => {
        setPlayerCard({ ...playerCard, profileStyle: { ...playerCard.profileStyle, countryCode: code.toUpperCase() } });
    };

    const saveCustomization = () => {
        fetch("/api/setCustomization", {
            method: "POST", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                newNameColor: playerCard.profileStyle.nameColour,
                newDisplayName: playerCard.profileStyle.displayName,
                newPrideFlags: playerCard.profileStyle.prideFlags,
                newCountryCode: playerCard.profileStyle.countryCode,
                newHideStar: playerCard.profileStyle.hideStar,
                newShowLastJoinDate: playerCard.profileStyle.showLastJoinedDate,
                token: props.token
            })
        }).then((res) => {
            if (!res.ok) {
                setCustomizationStatus("error");
            }
            res.json().then((data) => {
                if (data.success) {
                    setCustomizationStatus("success");
                } else {
                    setCustomizationStatus("error");
                }
            });
        });
    };

    const getCountryContent = () => {
        const thing = [<SelectItem key="NONE" value="NONE">
            None
        </SelectItem>];

        // other countries
        getCodes().forEach((x) => {
            thing.push(<SelectItem key={x}>
                {getName(x)}
            </SelectItem>);
        });

        return thing;
    };

    function setHideStar(value: boolean) {
        setPlayerCard({ ...playerCard, profileStyle: { ...playerCard.profileStyle, hideStar: value } });
    }

    return (<main className={inter.className}>
        <div className="flex justify-center">
            <div className="w-[400px] md:w-[600px] lg:w-[800px] xl:w-[1100px] min-h-screen">
                <Tabs>
                    <Tab key="profile" title="Profile">
                        <h1 className="font-bold text-3xl my-4">Customize profile for {props.name}</h1>
                        <h2 className="font-bold text-xl">Preview</h2>
                        <PlayerCard x={playerCard} />
                        <h2 className="font-bold text-xl mb-2">Customize</h2>
                        <Input
                            type="color"
                            label="Display color"
                            description="Choose a color for your display name."
                            onChange={(x) => setColor(x.target.value)}
                            defaultValue={playerCard.profileStyle.nameColour}
                        ></Input>
                        <Input
                            className="mt-2"
                            type="text"
                            label="Display name"
                            description="Choose a display name for your profile."
                            onChange={(x) => setName(x.target.value)}
                            defaultValue={playerCard.profileStyle.displayName}
                        ></Input>
                        <PrideFlags playerCard={playerCard} setPlayerCard={setPlayerCard} />
                        <br />
                        <Select label="Country" selectedKeys={[playerCard.profileStyle.countryCode ?? "NONE"]}
                            onChange={x => setCountryCode(x.target.value)}
                            description="You can select your country here to display it. You can type the first letter of the country to jump to it.">
                            {getCountryContent()}
                        </Select>

                        <SuggestedCountries playerCard={playerCard} countrySuggestions={countrySuggestions}
                            setCountryCode={setCountryCode} getName={getName} getFlag={getFlag} />

                        <Switch isSelected={!playerCard.profileStyle.hideStar} className="mt-2"
                            onChange={x => setHideStar(!x.target.checked)}>Show star next to username</Switch>
                        <p className="text-xs text-gray-500">Here you can disable the little star next to your
                            username. This is default for all profiles.</p>
                        <Switch isSelected={playerCard.profileStyle.showLastJoinedDate} className="mt-2"
                            onChange={(x) => setPlayerCard({ ...playerCard, profileStyle: { ...playerCard.profileStyle, showLastJoinedDate: x.target.checked } })}>Show last joined time publicly</Switch>
                        <p className="text-xs text-gray-500">Check if you want to show your last joined time publicly.</p>


                        <Button className="mt-2" color="primary" onClick={saveCustomization}>Save</Button>
                        <p>
                            {customizationStatus === "error" && (<span className="text-red-600">
                                Error while saving
                            </span>)}
                            {customizationStatus === "success" && (<span className="text-green-600">
                                Success
                            </span>)}
                        </p>
                    </Tab>
                    <Tab key="sessions" title="Past Sessions">
                        {props.pastPlaytimes.map((x, i) => {
                            return (<Card key={i} className="p-2 my-2">
                                <CardBody>
                                    <p className="font-bold">Playtime: {x.humantime}</p>
                                    <p>Start: {new Date(x.start).toLocaleString()}</p>
                                    <p>End: {new Date(x.end).toLocaleString()}</p>
                                </CardBody>
                            </Card>);
                        })}
                    </Tab>
                    <Tab key="logins" title="Logins">
                        <h1>This page shows your past loads of this page.</h1>
                        <Switch checked={loginsShowIP} onChange={x => setLoginsShowIP(x.target.checked)}>Show IP</Switch>
                        {props.loginAttempts.map((x, i) => {
                            return (<Card key={i} className="p-2 my-2">
                                <CardBody>
                                    <p>When: {new Date(x.date).toLocaleString()}</p>
                                    <p>From IP: {loginsShowIP ? x.ip : "<hidden>"}</p>
                                    <p>Browser: {x.browser}</p>
                                </CardBody>
                            </Card>);
                        })}
                    </Tab>
                    <Tab key="feedback" title="Missing Something?">
                        <p>Are you missing something that you want to customize? Do you want to report a bug?</p>
                        <Button color="primary" onClick={feedbackOnOpen}>Send Feedback</Button>
                    </Tab>
                </Tabs>
            </div>
        </div>

        <FeedbackModal isOpen={feedbackIsOpen} onClose={feedbackOnClose} />
    </main>);
}
