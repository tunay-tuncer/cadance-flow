import { useState, useEffect } from 'react';
import { useSupabase } from './useSupabase';

export const useFetchProjects = (user) => {
  const { getClient } = useSupabase();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [logs, setLogs] = useState([]);
  const [approveCount, setApproveCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const getData = async () => {
      setLoading(true);

      try {
        const supabase = await getClient();

        // 1. Profil ve Rol bilgisini çek[cite: 8]
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.sub)
          .limit(1);

        const userRole = profileData?.[0]?.role || 'client'; 
        console.log("userRole:", userRole); 
        setRole(userRole); 

        // 2. Projeleri çek[cite: 8]
        let projectQuery = supabase
          .from('cadance_flow')
          .select('*'); 

        if (userRole !== 'admin') {
           projectQuery = projectQuery.or(`client_id.eq.${user.sub},is_sample.eq.true`); 
        }

        const { data: projectData, error: projectError } = await projectQuery
          .order('created_at', { ascending: true }); 

        if (projectError) {
          console.error("Proje hatası:", projectError.message); 
        } else if (projectData) {
          setProjects(projectData); 
        }

        // 3. Onay Sayısını çek (BURASI TAMAMEN GÜNCELLENDİ)
        let approvalQuery = supabase
          .from('project_phases')
          .select(`
            requires_approval,
            is_complete,
            cadance_flow!inner(client_id)
          `)
          .eq('requires_approval', true)   // Sadece onay gerektirenleri getir
          .eq('is_complete', false);       // Henüz ONAYLANMAMIŞ (bekleyen) olanları getir

        // Eğer kullanıcı admin değilse, bağlı olduğu projenin sahibini doğrula
        if (userRole !== 'admin') {
          approvalQuery = approvalQuery.eq('cadance_flow.client_id', user.sub);
        }

        const { data: approveData, error: approveError } = await approvalQuery; 

        if (approveError) {
           console.error("Approve hatası:", approveError.message); 
        } else if (approveData) {
          setApproveCount(approveData.length);
        }

        // 4. Activity logları çek
        let logsQuery = supabase
          .from('activity_logs')
          .select('*'); 

        if (userRole !== 'admin') {
          logsQuery = logsQuery.eq('profile_id', user.sub); 
        }

        const { data: logData, error: logError } = await logsQuery
          .order('created_at', { ascending: false }); 

        if (logError) {
          console.error("Log hatası:", logError.message); 
        } else {
          setLogs(logData ?? []); 
        }

      } catch (err) {
        console.error("Fetch hatası:", err.message); 
      } finally {
        setLoading(false); 
      }
    };

    getData();
  }, [user, getClient]); 

  return { projects, loading, role, approveCount, logs }; 
};