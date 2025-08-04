import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
export default function Profile() {
    const { user } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        if (user) {
            setProfileData(user);
        }
    }, [user]);

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">My Profile</h2>
            <div className="mt-4">
                <p><strong>Username:</strong> {profileData.username}</p>
                <p><strong>Email:</strong> {profileData.email}</p>
                {/* Add more profile fields as needed */}
            </div>
        </div>
    );
}