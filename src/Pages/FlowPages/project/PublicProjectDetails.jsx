import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
// Dikkat: Burada kendi oluşturduğun standart supabase client'ını import etmelisin
// Genellikle src/supabaseClient.js gibi bir yerdedir.
import { supabase } from "../../../config/supabaseClient"

import FlowPageGuestWrapper from '../../../wrappers/FlowPageGuestWrapper';
import VisualizationProject from './VisualizationProject';
import DrawingProject from './DrawingProject';
import RenovationProject from './RenovationProject';
import Loader from '../../../components/Loader';

const PublicProjectDetails = () => {
    const { trackingCode } = useParams(); // URL'den :trackingCode parametresini alıyoruz
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPublicProject = async () => {
            setLoading(true);
            try {
                // Burada getClient() kullanmıyoruz! 
                // Çünkü anonim kullanıcıda token yok.
                const { data, error: supabaseError } = await supabase
                    .from('cadance_flow')
                    .select(`
                        *,
                        project_phases (*),
                        project_assets (*)
                    `)
                    .eq('tracking_number', trackingCode) // Takip numarasıyla eşleştiriyoruz
                    .single();

                if (supabaseError) {
                    console.error("Sorgu Hatası:", supabaseError);
                    setError("Proje bulunamadı veya geçersiz takip kodu.");
                } else {
                    setProjectData(data);
                }
            } catch (err) {
                console.error("Sistem Hatası:", err);
                setError("Bir bağlantı hatası oluştu.");
            } finally {
                setLoading(false);
            }
        };

        if (trackingCode) {
            fetchPublicProject();
        }
    }, [trackingCode]);

    if (loading) return <Loader />;
    if (error) return <div className="error-container">{error}</div>;
    if (!projectData) return <div className="error-container">Proje verisi yüklenemedi.</div>;

    // Proje tipine göre ilgili sayfayı render ediyoruz
    switch (projectData.project_type) {
        case 'viz':
            return <FlowPageGuestWrapper content={<VisualizationProject project={projectData} isPublic={true} />} />


        case 'drawing':
            return <DrawingProject project={projectData} isPublic={true} />;
        case 'renovation':
            return <RenovationProject project={projectData} isPublic={true} />;
        default:
            return <div className="error">Bilinmeyen proje tipi.</div>;
    }
};

export default PublicProjectDetails;