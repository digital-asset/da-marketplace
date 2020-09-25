import React from 'react'

import "./PageSection.css"

type Props = {
    background: 'white' | 'grey';
    border: 'grey' | 'blue';
}

const PageSection: React.FC<Props> = ({ children, border, background }) => (
    <div className={`page-section ${background} ${border}-border`}>
        { children }
    </div>
)

export default PageSection;
