
import React from 'react';
import { Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GenerateTrackingButton: React.FC = () => {
  const navigate = useNavigate();

  const handleRedirectToTrack = () => {
    navigate('/track');
  };

  return (
    <div className="w-full">
      <button
        onClick={handleRedirectToTrack}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium transition-all hover:bg-primary/90 active:scale-[0.98]"
      >
        <Truck size={18} />
        <span>Rastrear mi Servicio</span>
      </button>
    </div>
  );
};

export default GenerateTrackingButton;
