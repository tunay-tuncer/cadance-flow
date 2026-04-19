import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useSupabase } from "../../../hooks/useSupabase";

import VisualizationProject from './VisualizationProject';
import DrawingProject from './DrawingProject';
import RenovationProject from './RenovationProject';
import Loader from '../../../components/Loader';

const ProjectDetailsController = () => {
    const { projectId } = useParams();
    const { getClient } = useSupabase();
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjectAndType = async () => {
            console.log("Fetching for ID:", projectId);
            setLoading(true);

            try {
                const supabase = await getClient();

                const { data, error: supabaseError } = await supabase
                    .from('cadance_flow')
                    .select(`
                        *,
                        project_phases (*),
                        project_assets (
                            *,
                            project_comments (
                                *,
                                profiles (avatar_url)
                            )
                        )
                    `)
                    .eq('id', projectId)
                    .single();

                if (supabaseError) {
                    console.error("Supabase Error:", supabaseError);
                    setError(supabaseError.message);
                } else {
                    setProjectData(data);
                }
            } catch (err) {
                console.error("Sistem Hatası:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) fetchProjectAndType();
    }, [projectId, getClient]);

    if (loading) return <Loader />;
    if (error) return <div className="error">Error: {error}</div>;
    if (!projectData) return <div className="error">Project not found.</div>;

    switch (projectData.project_type) {
        case 'viz':
            return <VisualizationProject project={projectData} />;
        case 'drawing':
            return <DrawingProject project={projectData} />;
        case 'renovation':
            return <RenovationProject project={projectData} />;
        default:
            return (
                <div className="error">
                    Unknown project type: {projectData.project_type}
                </div>
            );
    }
};

export default ProjectDetailsController;