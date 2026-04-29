import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useSupabase } from "../../../hooks/useSupabase";
//COMPONENTS
import ProjectPage from './ProjectPage';
import Loader from '../../../components/Loader';

const ProjectDetailsController = () => {
    const { projectId } = useParams();
    const { getClient } = useSupabase();
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        const fetchProjectAndType = async () => {
            console.log("Fetching for Identifier:", projectId);
            setLoading(true);

            try {
                const supabase = await getClient();

                const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(projectId);

                // 2. Temel sorguyu oluştur
                let query = supabase
                    .from('cadance_flow')
                    .select(`
                    *,
                    project_phases (*),
                    project_assets (
                        *,
                        can_download,
                        project_comments (
                            *,
                            profiles (avatar_url, full_name)
                        )
                    )
                `);

                // 3. Formatına göre filtreyi uygula
                if (isUUID) {
                    query = query.eq('id', projectId);
                } else {
                    // Eğer UUID değilse tracking_number kolonunda ara
                    query = query.eq('tracking_number', projectId);
                }

                const { data, error: supabaseError } = await query.single();

                if (supabaseError) {
                    console.error("Supabase Error:", supabaseError);
                    setError(supabaseError.message);
                } else if (!data) {
                    setError("Proje bulunamadı.");
                } else {
                    // Verinin tekil obje olduğundan emin olarak state'e aktar
                    setProjectData(Array.isArray(data) ? data[0] : data);
                    console.log("Fetched Project Data:", data);
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

    return (
        <ProjectPage project={projectData} />
    )
};

export default ProjectDetailsController;