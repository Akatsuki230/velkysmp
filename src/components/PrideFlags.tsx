const prideFlags = [
    "ace",
    "agender",
    "androgyne",
    "aro",
    "aroace",
    "bi",
    "enby",
    "fluid",
    "gay",
    "genderqueer",
    "lesbian",
    "pan",
    "polyamorous",
    "polysexual",
    "trans"
];

export function getFlagImg(flag: string) {
    return "/prideflags/" + flag + "-flag.svg";
}

export function listFlags(): string[] {
    return prideFlags;
}