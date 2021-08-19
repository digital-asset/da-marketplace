import { useState, useEffect } from 'react'

import { useDefaultParties } from '@daml/hub-react'
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
}

export const useDablParties = () => {
    const [publicParty, userAdminParty] = useDefaultParties();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<Result>({ parties: devParties, loading: true });

    useEffect(() => {
        if (!publicParty) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [publicParty]);

    useEffect(() => {
        if (deploymentMode === DeploymentMode.PROD_DABL) {
            publicParty && userAdminParty && setResult({
                parties: { publicParty, userAdminParty },
                loading
            });
        } else {
            setResult({ parties: devParties, loading: false });
        }
    }, [publicParty, userAdminParty, loading]);

    return result;
}

const devParties = {
    userAdminParty: "Operator",
    publicParty: "Public"
}
