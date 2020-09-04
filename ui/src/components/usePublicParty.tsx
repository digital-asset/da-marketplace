import { useState, useEffect } from 'react';
import { httpBaseUrl, ledgerId, PUBLIC_PARTY } from '../config';

const usePublicParty = () => {
    const [ publicPartyJwt, setPublicPartyJwt ] = useState('');
    const url = httpBaseUrl ?? `${httpBaseUrl}/api/ledger/${ledgerId}/public/token`;

    useEffect(() => {
        fetch(url, { method: 'POST' })
            .then(response => {
                return response.json();
            })
            .then(jsonResp => {
                setPublicPartyJwt(jsonResp['access_token'])
            })
            .catch(err => {
                console.log("Error while fetching public token: ", err);
            })
    }, []);

    return { party: PUBLIC_PARTY, token: publicPartyJwt };
}

export default usePublicParty;
