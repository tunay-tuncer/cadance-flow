import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import supabaseClient from "../../../config/supabaseClient";


import VisualizationProject from './VisualizationProject';
import DrawingProject from './DrawingProject';
import RenovationProject from './RenovationProject';
import Loader from '../../../components/Loader';

const ProjectDetailsController = () => {
    const { projectId } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjectAndType = async () => {
            console.log("Fetching for ID:", projectId);
            setLoading(true);

            const { data, error } = await supabaseClient
                .from('cadance_flow')
                .select(`
                *,
                project_phases (*),
                project_assets (*)
        `)
                .eq('id', projectId)
                .single();

            if (error) {
                console.log("Supabase Error:", error);
                setError(error.message);
            } else {
                setProjectData(data);
            }
            setLoading(false);
        };

        if (projectId) fetchProjectAndType();
    }, [projectId]);

    if (loading) return <Loader />
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