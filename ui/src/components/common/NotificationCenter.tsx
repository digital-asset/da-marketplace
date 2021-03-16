import React, { useState } from 'react'

import Page from '../common/Page'
import PageSection from './PageSection'
import { useRelationshipRequestNotifications } from '../common/RelationshipRequestNotifications'
import { useCCPCustomerNotifications } from '../CCP/CCPCustomerNotifications'
import { useBrokerCustomerInviteNotifications } from '../Investor/BrokerCustomerInviteNotifications'
import { useCCPCustomerInviteNotifications } from '../Investor/CCPInviteNotifications'
import { useDismissibleNotifications } from '../common/DismissibleNotifications'
import { useExchangeInviteNotifications } from '../Investor/ExchangeInviteNotifications'

import { NotificationCenterIcon } from '../../icons/Icons'

type Props = {
  sideNav: React.ReactElement;
  onLogout: () => void;
}

const NotificationCenter: React.FC<Props> = ({ sideNav, onLogout }) => {
  const notifications = [
    ...useRelationshipRequestNotifications(),
    ...useCCPCustomerNotifications(),
    ...useCCPCustomerInviteNotifications(),
    ...useBrokerCustomerInviteNotifications(),
    ...useExchangeInviteNotifications(),
    ...useDismissibleNotifications()
  ];

  return (
    <Page
      sideNav={sideNav}
      menuTitle={<><NotificationCenterIcon size='24' strokeColor='#B4F5A3' /> Notifications</>}
      onLogout={onLogout}
    >
      <PageSection>
        {notifications}
      </PageSection>
    </Page>
  )
}

export default NotificationCenter;
