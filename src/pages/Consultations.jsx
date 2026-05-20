import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Consultations() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(createPageUrl('TelehealthPlatform'), { replace: true });
  }, []);
  return null;
}