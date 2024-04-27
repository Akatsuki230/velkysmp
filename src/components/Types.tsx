export type Player = {
    uuid?: string;
    name: string;
    humantime: string;
    seconds: number;
    online: boolean;
    profileStyle: ProfileStyle;
};

export type GroupModes = "none" | "online" | "playtime" | "first_letter";

export type ProfileStyle = {
    displayName: string;
    nameColour: string;
    prideFlags: string[] | undefined;
    countryCode: string;
    hideStar: boolean;
};
