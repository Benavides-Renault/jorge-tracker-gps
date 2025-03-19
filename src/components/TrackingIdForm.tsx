
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

const TrackingIdForm: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingId.trim()) {
      toast.error('Por favor ingrese un número de rastreo');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate checking for a valid tracking ID
    // In a real application, this would validate against your backend
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/tracking/${trackingId}`);
    }, 800);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto"
    >
      <div className="relative">
        <input
          type="text"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Ingrese su número de rastreo"
          className="w-full h-12 pl-4 pr-12 rounded-xl bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="absolute right-1 top-1 h-10 px-3 flex items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-70 transition-all hover:bg-primary/90 active:scale-[0.98]"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-1">
              <div className="loading-dot w-1.5 h-1.5 bg-current rounded-full"></div>
              <div className="loading-dot w-1.5 h-1.5 bg-current rounded-full"></div>
              <div className="loading-dot w-1.5 h-1.5 bg-current rounded-full"></div>
            </div>
          ) : (
            <Search size={18} />
          )}
        </button>
      </div>
    </form>
  );
};

export default TrackingIdForm;
