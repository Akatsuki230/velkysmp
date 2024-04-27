import React from 'react';
import { Button } from "@nextui-org/react";
import Head from "next/head";

const PrivacyPolicy = () => {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8 min-h-screen">

            <Head>
                <title>Velky SMP | Privacy</title>
                <meta name="description" content="Velky SMP Privacy Policy" />
                <link rel="icon" href="/favicon.ico" />
                <meta property="og:title" content="Velky SMP | Privacy" />
                <meta property="og:description" content="Velky SMP Privacy Policy" />
                <meta property="og:image" content="https://velkysmp-mon.vercel.app/favicon.ico" />
                <meta property="og:url" content="https://velkysmp-mon.vercel.app/privacy" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Velky SMP Status Monitor" />
                <meta property="og:locale" content="en_US" />
            </Head>

            <Button onClick={() => {
                location.href = "/";
            }}>
                Go back
            </Button>
            <h1 className="text-3xl font-bold mb-4">Privacy</h1>

            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Minecraft Server Users</h2>
                <p className="mb-4">Upon joining VelkySMP, our service will collect your username, along with the date and time of your join, and your UUID (unique identifier) to prevent the creation of multiple profiles in case of a username change. Additionally, a logout date will be recorded upon your departure. These data points are utilized to calculate your playtime on the server. All timestamps are stored with minute accuracy.</p>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Website Users</h2>
                <p className="mb-4">We prioritize your privacy. Our website does not collect nor will it ever collect any user data. The only information stored within your browser includes your preferred language, your last selected grouping mode, and the most recent version of the website you visited. No other user data is stored in any manner.</p>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Feature Suggestions</h2>
                <p className="mb-4">If you wish to suggest new features for the website, please note that this cannot be done directly on the platform. Instead, kindly send feature suggestions and bug reports via direct message to Akatsuki on Discord.</p>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Public and Private Information</h2>
                <h3 className="text-xl font-bold mb-2">Public Information:</h3>
                <ul className="list-disc pl-6 mb-4">
                    <li><strong>Username:</strong> Your Minecraft username is publicly visible.</li>
                    <li><strong>Playtime:</strong> The total playtime accumulated is publicly displayed.</li>
                    <li><strong>Online Status:</strong> Your current online status is visible to others.</li>
                    <li><strong>Display Name and Color:</strong> If configured, your chosen display name and color are publicly visible.</li>
                    <li><strong>Pride Flags:</strong> Selected pride flags are publicly visible.</li>
                    <li><strong>Country Flag:</strong> If you select a country flag, it is publicly visible. You can deselect it at any time.</li>
                </ul>

                <h3 className="text-xl font-bold mb-2">Private Information:</h3>
                <p className="mb-4"><strong>Profile Token Required:</strong> Access to the following information requires a profile token:</p>
                <ul className="list-disc pl-6">
                    <li><strong>Past 10 Game Sessions:</strong> Details of your last ten game sessions are accessible privately.</li>
                </ul>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-2">Right to Data Removal</h2>
                <p>Should you desire the removal of all data associated with your username from the website, please contact Akatsuki via direct message. You will need to provide evidence confirming ownership of the account you're using on the server. Upon verification, all associated data will be promptly deleted.</p>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
