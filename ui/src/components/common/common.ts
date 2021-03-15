import { useState, useEffect } from 'react'

import { useWellKnownParties } from '@daml/hub-react'
import { deploymentMode, DeploymentMode } from '../../config'

export const useOperator = () => {
    const { parties } = useDablParties();
    return parties.userAdminParty;
}

type Result = {
    parties: {
        userAdminParty: string;
        publicParty: string;
    };
    loading: boolean;
    error: string | null;
}

export const useDablParties = () => {
    const { parties, loading, error } = useWellKnownParties();
    const [ result, setResult ] = useState<Result>({ parties: devParties, loading: true, error: null });

    useEffect(() => {
        if (deploymentMode === DeploymentMode.PROD_DABL) {
            if (error && !loading) {
                console.error(`Error fetching DABL parties: ${error}`);
            }

            parties && setResult({ parties, loading, error });
        } else {
            setResult({ parties: devParties, loading: false, error: null });
        }
    }, [parties, loading, error]);

    return result;
}

const devParties = {
    userAdminParty: "Operator",
    publicParty: "Public"
}
