import React from 'react'

import Page from '../common/Page'
import PageSection from './PageSection'

import { NotificationCenterIcon } from '../../icons/Icons'

type Props = {
  sideNav: React.ReactElement;
  onLogout: () => void;
}

const NotificationCenter: React.FC<Props> = ({ sideNav, onLogout }) => {

  return (
    <Page
      sideNav={sideNav}
      menuTitle={<><NotificationCenterIcon size='24' strokeColor='#B4F5A3' /> Notifications</>}
      onLogout={onLogout}
    >
      <PageSection>
        <div>
          Hello
        </div>
      </PageSection>
    </Page>
  )
}

export default NotificationCenter;
