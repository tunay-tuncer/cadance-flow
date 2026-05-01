import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

import { useSupabase } from "../../../hooks/useSupabase";
import { supabase } from "../../../config/supabaseClient"

import FlowPageGuestWrapper from '../../../wrappers/FlowPageGuestWrapper';
import ProjectPage from './ProjectPage';
import Loader from '../../../components/Loader';
import styles from "../../../styles/PublicProjectDetails.module.css"

import { MdLockOutline, MdPrivacyTip } from "react-icons/md";

const PublicProjectDetails = () => {
    const { trackingCode } = useParams(); // URL'den :trackingCode parametresini alıyoruz
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { isAuthenticated } = useAuth0();
    const { getClient } = useSupabase(); // Yetkili client

    const navigate = useNavigate();

    useEffect(() => {
        const handleContextMenu = (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        };
        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);


    useEffect(() => {
        const fetchProject = async () => {
            setLoading(true);
            try {
                // EĞER giriş yapmışsa yetkili client, yapmamışsa standart client kullan
                const client = supabase; // Always use anon client — RLS allows public projects via tracking_number

                const { data, error } = await client
                    .from('cadance_flow')
                    .select(`
                    *,
                    project_phases (*),
                    project_assets (
                        *,
                        project_comments (
                            *,
                            profiles (*)
                        )
                    )
                `)
                    .eq('tracking_number', trackingCode)
                    .single();

                if (data) setProjectData(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [trackingCode, isAuthenticated]);


    if (loading) return <Loader />;
    if (error) return <div className="error-container">{error}</div>;
    if (!projectData && !loading) {
        return (
            <FlowPageGuestWrapper content={
                <div className={styles.errorStateContainer}>
                    <MdPrivacyTip className={styles.errorIcon} />
                    <h1>Project Not Found</h1>
                    <p>The tracking code you entered is invalid or the project has been moved.</p>
                    <button onClick={() => navigate('/')} className={styles.primaryButton}>
                        Return to Homepage
                    </button>
                </div>
            } />
        );
    }
    if (projectData && !projectData.is_public) {
        return (
            <FlowPageGuestWrapper content={
                <div className={styles.errorStateContainer}>
                    <MdLockOutline className={styles.errorIcon} />
                    <h1>Private Project</h1>
                    <p>This project is currently private. If you are the owner, please log in to view it.</p>
                    <div className={styles.actionGroup}>
                        <button onClick={() => navigate('/')} className={styles.secondaryButton}>Home</button>
                        <button onClick={() => navigate('/login')} className={styles.primaryButton}>Log In</button>
                    </div>
                </div>
            } />
        );
    }
    return (<FlowPageGuestWrapper content={<ProjectPage project={projectData} isPublic={true} />} />)

};

export default PublicProjectDetails;