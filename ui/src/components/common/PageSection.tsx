import React from 'react'

import "./PageSection.scss"

type Props = {
    className?: string;
    background: 'white' | 'grey';
    border: 'grey' | 'blue';
}

const PageSection: React.FC<Props> = ({ children, className, border, background }) => (
    <div className={`page-section ${background} ${border}-border ${className}`}>
        { children }
    </div>
)

export default PageSection;
