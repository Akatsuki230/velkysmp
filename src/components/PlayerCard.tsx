import { Card, CardBody } from "@nextui-org/react";
import { Player } from "./Types";
import { getFlagImg } from "@/components/PrideFlags";
import { getFlag } from "@/components/Countries";

export function PlayerCard(props: { x: Player }) {
    const hasCustomName = props.x.profileStyle.displayName !== props.x.name;

    return (
        <Card key={props.x.name} className={`mt-2 ${props.x.online ? "bg-green-950 border-1 border-green-900" : ""}`}>
            <CardBody>
                <h2 className="font-bold flex flex-row items-center">
                    {props.x.profileStyle.hideStar ? "" : "⭐"}
                    {hasCustomName ? (
                        <>
                            <span style={{ color: props.x.profileStyle.nameColour }}>
                                {props.x.profileStyle.displayName}
                            </span>
                            <span className="ml-4 text-sm text-gray-500">({props.x.name})</span>
                        </>
                    ) : (
                        <span style={{ color: props.x.profileStyle.nameColour }}>{props.x.name}</span>
                    )}
                    {props.x.profileStyle.prideFlags?.map((flag) => (
                        <img key={flag} className="ml-1 h-5" src={getFlagImg(flag)} />
                    ))}
                    {props.x.profileStyle.countryCode && props.x.profileStyle.countryCode.toLowerCase() !== "none" && (
                        <img key={props.x.profileStyle.countryCode} className="ml-1 h-5"
                             src={getFlag(props.x.profileStyle.countryCode)} />
                    )}
                </h2>
                <span>
                    Playtime: {props.x.humantime}
                </span>
                {props.x.profileStyle.showLastJoinedDate && <span>
                    Last joined: {new Date(props.x.lastJoin ?? "1970-01-01T00:00:00.000Z").toLocaleString()}
                    </span>}
            </CardBody>
        </Card>
    );
}
