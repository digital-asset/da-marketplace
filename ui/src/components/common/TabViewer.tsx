import React, { useState } from 'react'
import { Menu, Segment, Header } from 'semantic-ui-react'

type ITabInfo = {
    name: string,
    content: React.ReactElement
}

const TabViewer = (props: { tabs: ITabInfo[] }) =>  {
    const { tabs } = props
    const [ activeTab, setActiveTab ] = useState<ITabInfo>(tabs[0])

    if (tabs.length == 0) {
        return null
    }

    const handleItemClick = (tab: ITabInfo) => setActiveTab(tab)

    return (
        <div className='tab-viewer'>
            <Segment inverted>
                <Menu inverted pointing secondary>
                    {tabs.map(t =>
                        <Menu.Item
                            name={t.name}
                            active={activeTab.name === t.name}
                            onClick={() => handleItemClick(t)}
                        >
                            <Header as='h3' className='dark'>{t.name}</Header>
                        </Menu.Item>
                    )}
                </Menu>
                {activeTab.content}
            </Segment>
        </div>
    )
}

export default TabViewer;
