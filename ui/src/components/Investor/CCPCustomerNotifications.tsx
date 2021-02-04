import React from 'react'

import { useLedger } from '@daml/react'
import { ContractId } from '@daml/types'
import { RejectedMarginCalculation } from '@daml.js/da-marketplace/lib/Marketplace/Clearing'

import { RejectedMarginCalculationInfo } from '../common/damlTypes'
import { useRegistryLookup } from '../common/RegistryLookup'
import { useContractQuery } from '../../websocket/queryStream'
import ActionRequiredNotification from '../common/ActionRequiredNotification'

type RejectedMarginCalculationProps = {
    calculation: RejectedMarginCalculationInfo;
    calculationRetry: () => Promise<void>;
}

export const useCCPCustomerNotifications = () => {
    const ledger = useLedger();
    const marginCallFailures = useContractQuery(RejectedMarginCalculation)
        .map(rejectedCalculation => <RejectedMarginCalculationNotification key={rejectedCalculation.contractId}
            calculation={rejectedCalculation}
            calculationRetry={async () => await retryMarginCalculation(rejectedCalculation.contractId)}/>);

    const retryMarginCalculation = async (cid: ContractId<RejectedMarginCalculation>) => {
        const choice = RejectedMarginCalculation.RejectedMarginCalculation_CustomerRetry;
        await ledger.exercise(choice, cid, {});
    }

    return marginCallFailures;
}

const RejectedMarginCalculationNotification: React.FC<RejectedMarginCalculationProps> = ({
    calculation,
    calculationRetry
}) => {
    const { ccpMap } = useRegistryLookup();
    const name = ccpMap.get(calculation.contractData.ccp)?.name || calculation.contractData.ccp;
    return (
        <ActionRequiredNotification onAction={calculationRetry} actionText = 'Retry'>
            <p>CCP <b>@{name}</b>: {calculation.contractData.note}</p>
        </ActionRequiredNotification>
    )
}
