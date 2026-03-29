'use client';

import { useEffect, useState } from 'react';

// Decodes JWT (without verifying signature) to get roles
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export default function RoleGuard({ allowedRoles, children }) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = parseJwt(token);
      setRole(decoded?.role || null);
    }
    setLoading(false);
  }, []);

  if (loading) return null; // or a spinner
  
  // If allowedRoles is provided and current role is not in the list, hide content
  if (allowedRoles && !allowedRoles.includes(role)) {
    return null; 
  }

  return <>{children}</>;
}
