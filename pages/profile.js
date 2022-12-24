import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import UserProfile from '../components/profile/user-profile';

function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getSession().then((session) => {
            if (!session) {
                router.replace("/auth");
            } else {
                setLoading(false);
            }
        });
    });
    return !loading && <UserProfile />;
}

export default ProfilePage;
