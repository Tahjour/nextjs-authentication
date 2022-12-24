import { getSession } from 'next-auth/react';
import {useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AuthForm from '../components/auth/auth-form';

function AuthPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getSession().then((session) => {
            if (session) {
                router.replace("/profile");
            } else {
                setLoading(false);
            }
        });
    });
    return !loading && <AuthForm />;
}

export default AuthPage;
