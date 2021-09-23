import { useState, useEffect } from 'react'

import { useDefaultParties } from '@daml/hub-react'
import { deploymentMode, DeploymentMode } from '../../config'

export const useOperator = (): string | undefined => {
    const { parties } = useDablParties();
    return parties.userAdminParty;
}

export const usePublicParty = (): string | undefined => {
    const { parties } = useDablParties();
    return parties.publicParty;
}

type Result = {
    parties: {
        userAdminParty?: string;
        publicParty?: string;
    };
    loading: boolean;
}

const USER_ADMIN_PARTY_ID_KEY = 'default_parties/user_admin_party_id';
const PUBLIC_PARTY_ID_KEY = 'default_parties/public_party_id';

export const useDablParties = () => {
    const [publicParty, userAdminParty] = useDefaultParties();
    const [result, setResult] = useState<Result>({
        parties: {
            userAdminParty: undefined,
            publicParty: undefined
        },
        loading: true
    });

    useEffect(() => {
        const cachedUserAdmin = localStorage.getItem(USER_ADMIN_PARTY_ID_KEY) || undefined;
        const cachedPublicParty = localStorage.getItem(PUBLIC_PARTY_ID_KEY) || undefined;

        if (cachedUserAdmin || cachedPublicParty) {
            setResult({
                parties: {
                    userAdminParty: cachedUserAdmin,
                    publicParty: cachedPublicParty
                },
                loading: !cachedUserAdmin || !cachedPublicParty
            })
        }
    }, [])

    useEffect(() => {
        if (deploymentMode === DeploymentMode.PROD_DABL) {
            if (publicParty) {
                localStorage.setItem(PUBLIC_PARTY_ID_KEY, publicParty);
            }

            if (userAdminParty) {
                localStorage.setItem(USER_ADMIN_PARTY_ID_KEY, userAdminParty);
            }

            setResult({
                parties: { publicParty, userAdminParty },
                loading: !publicParty
            })
        } else {
            setResult({
                parties: {
                    userAdminParty: "Operator",
                    publicParty: "Public"
                },
                loading: false
            });
        }
    }, [publicParty, userAdminParty]);

    return result;
}
