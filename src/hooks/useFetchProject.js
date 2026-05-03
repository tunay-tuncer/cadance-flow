import { useState, useEffect } from 'react';
import { useSupabase } from './useSupabase';
import { data } from 'react-router';

export const useFetchProjects = (user) => {
  const { getClient } = useSupabase();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!user) return;

    const getData = async () => {
      setLoading(true);

      try {
        const supabase = await getClient();

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.sub)
          .limit(1);

        const userRole = profileData?.[0]?.role || 'client';
        console.log("userRole:", userRole);
        setRole(userRole);

        // 2. Projeleri çek
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

        // 3. Activity logları çek
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

  return { projects, loading, role, logs };
};