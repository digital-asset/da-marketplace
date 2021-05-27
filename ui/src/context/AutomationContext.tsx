import React, { useEffect, useState } from 'react';
import { getPublicAutomation, PublicAutomation } from '../automation';
import { isHubDeployment } from '../config';

type AutomationState = {
  automations?: PublicAutomation[];
  loading: boolean;
};

type AutomationProviderProps = {
  publicParty: string;
};

const AutomationStateContext = React.createContext<AutomationState>({
  automations: [],
  loading: false,
});

export const AutomationProvider: React.FC<AutomationProviderProps> = ({
  publicParty,
  children,
}) => {
  const [automations, setAutomations] = useState<PublicAutomation[] | undefined>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isHubDeployment) return;
    setLoading(true);
    getPublicAutomation(publicParty).then(autos => {
      setAutomations(autos);
    });
    const timer = setInterval(() => {
      getPublicAutomation(publicParty).then(autos => {
        setAutomations(autos);
        if (!!automations && automations.length > 0) {
          clearInterval(timer);
          setLoading(false);
        }
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [automations, publicParty]);
  return (
    <AutomationStateContext.Provider value={{ automations, loading }}>
      {children}
    </AutomationStateContext.Provider>
  );
};

export function useAutomations() {
  const context = React.useContext<AutomationState>(AutomationStateContext);
  if (context === undefined) {
    throw new Error('useAutomations must be used within an AutomationProvider');
  }
  return context.automations;
}
