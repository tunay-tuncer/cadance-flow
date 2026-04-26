import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

import { useSupabase } from "../../../hooks/useSupabase";
import { supabase } from "../../../config/supabaseClient"

import FlowPageGuestWrapper from '../../../wrappers/FlowPageGuestWrapper';
import ProjectPage from './ProjectPage';
import Loader from '../../../components/Loader';

const PublicProjectDetails = () => {
    const { trackingCode } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { isAuthenticated } = useAuth0();
    const { getClient } = useSupabase();

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
                const client = isAuthenticated ? await getClient() : supabase;

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

                if (data) {
                    const finalData = Array.isArray(data) ? data[0] : data;
                    setProjectData(finalData);
                }
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
    if (!projectData) return <div className="error-container">Proje verisi yüklenemedi.</div>;

    return (<FlowPageGuestWrapper content={<ProjectPage project={projectData} isPublic={true} />} />)

};

export default PublicProjectDetails;