import React from 'react'
import { useHistory } from 'react-router-dom'

import Page from '../common/Page'
import PageSection from './PageSection'
import { useRelationshipRequestNotifications } from '../common/RelationshipRequestNotifications'
import { useCCPCustomerNotifications } from '../CCP/CCPCustomerNotifications'
import { useBrokerCustomerInviteNotifications } from '../Investor/BrokerCustomerInviteNotifications'
import { useCCPCustomerInviteNotifications } from '../Investor/CCPInviteNotifications'
import { useDismissibleNotifications } from '../common/DismissibleNotifications'
import { useExchangeInviteNotifications } from '../Investor/ExchangeInviteNotifications'

import { NotificationCenterIcon, ArrowLeftIcon } from '../../icons/Icons'

type Props = {
  sideNav: React.ReactElement;
  onLogout: () => void;
  prevPath?: string;
  showNotificationAlert?: boolean;
  handleNotificationAlert?: () => void;
}

export const useAllNotifications = () => {
  const notifications = [
    ...useRelationshipRequestNotifications(),
    ...useCCPCustomerNotifications(),
    ...useCCPCustomerInviteNotifications(),
    ...useBrokerCustomerInviteNotifications(),
    ...useExchangeInviteNotifications(),
    ...useDismissibleNotifications()
  ];

  return notifications;
}

const NotificationCenter: React.FC<Props> = ({ sideNav, onLogout, prevPath, showNotificationAlert, handleNotificationAlert }) => {
  const history = useHistory();
  const notifications = useAllNotifications();

  return (
    <Page
      sideNav={sideNav}
      menuTitle={<><NotificationCenterIcon size='24' strokeColor='#B4F5A3' /> Notifications</>}
      onLogout={onLogout}
      showNotificationAlert={showNotificationAlert}
      handleNotificationAlert={handleNotificationAlert}
    >
      <PageSection className='notification-center'>
        <div className='return-link'>
          <ArrowLeftIcon/>
          <a className='a2' onClick={() => history.goBack()}> {`Return to ${prevPath}`}</a>
        </div>
        <div className='notification-center-notification'>
          {notifications}
        </div>
      </PageSection>
    </Page>
  )
}

export default NotificationCenter;
