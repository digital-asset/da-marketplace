import React from 'react'
import { Pagination, PaginationProps } from 'semantic-ui-react'

const PaginationControls = (props: {
    totalPages: number,
    onPageChange: (activePage: number) => void
}) => (
  <Pagination
    className='paginataion-controls'
    boundaryRange={0}
    defaultActivePage={1}
    ellipsisItem={null}
    firstItem={null}
    lastItem={null}
    onPageChange={(_, data) => data.activePage && props.onPageChange(Number(data.activePage))}
    totalPages={props.totalPages}
  />
)

export default PaginationControls;
