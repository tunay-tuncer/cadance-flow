import { useState, useEffect } from 'react';
import supabaseClient from '../config/supabaseClient';

export const useFetchProjects = (user) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!user) return;

    const getData = async () => {
      setLoading(true);

      // 1. Get the role from the profiles table
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', user.sub)
        .single();

      const userRole = profile?.role || 'client';
      setRole(userRole);

      // 2. Fetch Projects with Role-Based Filter
      let projectQuery = supabaseClient
        .from('cadance_flow')
        .select(`*, profiles:client_id (full_name, email)`);

      if (userRole !== 'admin') {
        projectQuery = projectQuery.eq('client_id', user.sub);
      }

      const { data: projectData } = await projectQuery.order('created_at', { ascending: true });
      if (projectData) setProjects(projectData);

      // 3. Fetch Logs with Role-Based Filter
      let logsQuery = supabaseClient
        .from('activity_logs')
        .select('*');

      // If not admin, only show logs where user_id matches the logged-in user
      if (userRole !== 'admin') {
        logsQuery = logsQuery.eq('user_id', user.sub); // Adjust 'user_id' to your actual column name
      }

      const { data: logData, error: logError } = await logsQuery.order('created_at', { descending: true });
      
      if (!logError) setLogs(logData);

      setLoading(false);
    };

    getData();
  }, [user]);

  return { projects, loading, role, logs };
};