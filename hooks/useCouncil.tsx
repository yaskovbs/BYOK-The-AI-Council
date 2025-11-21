import { useContext } from 'react';
import { CouncilContext } from '@/contexts/CouncilContext';

export function useCouncil() {
  const context = useContext(CouncilContext);
  
  if (!context) {
    throw new Error('useCouncil must be used within CouncilProvider');
  }
  
  return context;
}
