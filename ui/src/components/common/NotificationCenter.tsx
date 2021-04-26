import React, { useEffect, useState } from 'react'
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

const NotificationCenter: React.FC<Props> = ({ sideNav, onLogout, showNotificationAlert, handleNotificationAlert }) => {
  const history = useHistory();
  const notifications = useAllNotifications();
  const [prevLocation, setPrevLocation] = useState<string>();
  const [prevPath, setPrevPath] = useState<string>();

  const historyState = history.location.state as string;

  useEffect(() => {
    const tempLocation = historyState?.split('/');
    const tempPath = historyState;
    if (historyState) {
      sessionStorage.setItem('prevLocation', tempLocation[tempLocation.length - 1]);
      sessionStorage.setItem('prevPath', tempPath);
      setPrevLocation(tempLocation[tempLocation.length - 1]);
      setPrevPath(tempPath);
    } else {
      const tempLocation = sessionStorage.getItem('prevLocation');
      const tempPrevPath = sessionStorage.getItem('prevPath');
      if (tempLocation) setPrevLocation(tempLocation);
      if (tempPrevPath) setPrevPath(tempPrevPath);
    }
  });

  const handleGoBack = () => {
      history.push(`${prevPath}`);
  }

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
          <a className='a2' onClick={handleGoBack}>
            {`Return to ${prevLocation?.split('-').map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(' ')}`}
          </a>
        </div>
        <div className='notification-center-notification'>
          {notifications.length > 0 ? notifications : 'No Notifications'}
        </div>
      </PageSection>
    </Page>
  )
}

export default NotificationCenter;
