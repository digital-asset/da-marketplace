import React, { useEffect, useRef } from 'react';
import { useStreamQueries } from '../../Main';
import { Button } from 'semantic-ui-react';

import { RouteComponentProps, useHistory, useParams } from 'react-router-dom';
import { usePartyName } from '../../config';
import { render } from '../../components/Claims/render';
import { transformClaim } from '../../components/Claims/util';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { PieChart, Pie, Cell } from 'recharts';
import Tile from '../../components/Tile/Tile';
import StripedTable from '../../components/Table/StripedTable';
import { ArrowLeftIcon } from '../../icons/icons';
import { damlSetValues } from '../common';

export const Instrument: React.FC<RouteComponentProps> = () => {
  const el = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const { contractId } = useParams<any>();
  const { getName } = usePartyName('');
  const cid = contractId.replace('_', '#');

  const { contracts: instruments, loading: instrumentsLoading } =
    useStreamQueries(AssetDescription);
  const { contracts: deposits, loading: depositsLoading } = useStreamQueries(AssetDeposit);
  const instrument = instruments.find(c => c.contractId === cid);

  useEffect(() => {
    if (!el.current || !instrument) return;
    const data = transformClaim(instrument.payload.claims, 'root');
    render(el.current, data);
  }, [el, instrument]);

  if (instrumentsLoading || depositsLoading) {
    return <h5>Loading instrument...</h5>;
  }

  if (!instrument) return <h5>Instrument not found</h5>;

  const COLORS = ['#5AF6AC', '#131720', '#FF29D0', '#835AF6', '#CBD0CB'];

  let groupedDeposits = new Map<string, number>();

  deposits
    .filter(d => d.payload.asset.id.label === instrument.payload.assetId.label)
    .map(d => {
      let current = groupedDeposits.get(getName(d.payload.account.owner)) || 0;
      groupedDeposits.set(getName(d.payload.account.owner), current + +d.payload.asset.quantity);
    });
  const total = Array.from(groupedDeposits.values()).reduce((acc, item) => (acc += item), 0);
  const pieData: {
    name: string;
    value: number;
  }[] = Array.from(groupedDeposits.keys())
    .filter(key => getDataPercentage(groupedDeposits.get(key) || 0) > 5)
    .map(key => {
      return { name: key, value: groupedDeposits.get(key) || 0 };
    });

  return (
    <div className="instrument">
      <Button className="ghost back-button" onClick={() => history.goBack()}>
        <ArrowLeftIcon /> back
      </Button>
      <Tile header={<h3>{instrument.payload.description}</h3>}>
        <h5>Details</h5>
        <StripedTable
          headings={['Issuer', 'Signatories', 'Label', 'Version', 'Description']}
          loading={instrumentsLoading}
          rows={[
            {
              elements: [
                getName(instrument.payload.issuer),
                damlSetValues(instrument.payload.assetId.signatories)
                  .map(party => getName(party))
                  .join(', '),
                instrument.payload.assetId.label,
                instrument.payload.assetId.version,
                instrument.payload.description,
              ],
            },
          ]}
        />
      </Tile>
      <div className="position-holdings">
        <Tile header={<h3>Position Holdings</h3>}>
          <StripedTable
            headings={['Investor', 'Quantity']}
            loading={depositsLoading}
            rows={Array.from(groupedDeposits.keys()).map(key => {
              return {
                elements: [key, groupedDeposits.get(key)],
              };
            })}
          />
        </Tile>
        <Tile header={<h3>Allocations - Top 5%</h3>}>
          <div className="pie-chart">
            <PieChart width={400} height={400}>
              <Pie
                dataKey="value"
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                label={data => ` ${data.name} ${getDataPercentage(data.value)}% `}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </div>
        </Tile>
      </div>
      <Tile header={<h3>Claims</h3>}>
        <div ref={el} style={{ height: '100%' }} />
      </Tile>
    </div>
  );

  function getDataPercentage(val: number) {
    return +((val / total) * 100).toFixed(1);
  }
};