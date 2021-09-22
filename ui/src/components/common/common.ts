import { useState, useEffect } from 'react'

import { useDefaultParties } from '@daml/hub-react'
import { deploymentMode, DeploymentMode } from '../../config'

export const useOperator = () => {
    const { parties } = useDablParties();
    // Note... there's a timing bug where this falls back to "Operator"
    // on Daml Hub deployments, before the API call to get default
    // parties is used.
    //
    // Fixing this means returning a type of `string | undefined`, which
    // affects too many other parts of the codebase to be worth doing on 0.1.x
    //
    // However, this bug is fixed in 0.2.0
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
        setLoading(!publicParty);
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
