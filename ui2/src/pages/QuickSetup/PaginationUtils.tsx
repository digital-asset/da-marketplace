import React, { useState, useEffect } from 'react';

import { Button } from 'semantic-ui-react';

import { PartyDetails } from '@daml/hub-react';

import { ArrowLeftIcon, ArrowRightIcon } from '../../icons/icons';

export const PageControls = (props: {
  numberOfPages: number;
  page: number;
  setPage: (page: number) => void;
}) => {
  const { numberOfPages, page, setPage } = props;

  return numberOfPages > 1 ? (
    <div className="page-controls">
      <Button className="ghost" disabled={page === 1} onClick={() => setPage(page - 1)}>
        <ArrowLeftIcon />
      </Button>
      <p className="p2">
        Page {page} of {numberOfPages}
      </p>
      <Button className="ghost" disabled={page >= numberOfPages} onClick={() => setPage(page + 1)}>
        <ArrowRightIcon />
      </Button>
    </div>
  ) : null;
};

export function usePagination(parties: PartyDetails[]) {
  const rowsPerPage = 5;

  const [page, setPage] = useState(1);
  const [startingIndex, setStartingIndex] = useState(0);
  const [endingIndex, setEndingIndex] = useState(rowsPerPage);

  const numberOfPages = +(parties.length / rowsPerPage).toPrecision(1);

  useEffect(() => {
    if (numberOfPages > 1) {
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      setStartingIndex(start);
      setEndingIndex(end > parties.length ? parties.length : end);
    }
  }, [parties, page]);

  return { startingIndex, endingIndex, page, numberOfPages, setPage };
}
