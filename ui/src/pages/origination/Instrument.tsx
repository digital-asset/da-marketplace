import React, { useEffect, useRef } from 'react';
import { useStreamQueries } from '../../Main';
import { Header } from 'semantic-ui-react';

import { RouteComponentProps, useHistory, useParams } from 'react-router-dom';
import { usePartyName } from '../../config';
import { render } from '../../components/Claims/render';
import { transformClaim } from '../../components/Claims/util';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { PieChart, Pie, Cell } from 'recharts';
import Tile from '../../components/Tile/Tile';
import StripedTable from '../../components/Table/StripedTable';
import BackButton from '../../components/Common/BackButton';
import InfoCard from '../../components/Common/InfoCard';
import { damlSetValues } from '../common';

export const Instrument: React.FC<RouteComponentProps> = () => {
  const el = useRef<HTMLDivElement>(null);
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
      <BackButton />

      <div className="page-section-row">
        <InfoCard
          title={instrument.payload.description}
          info={[
            { label: 'Issuer', data: getName(instrument.payload.issuer) },
            {
              label: 'Signatories',
              data: damlSetValues(instrument.payload.assetId.signatories)
                .map(party => getName(party))
                .join(', '),
            },
            { label: 'Label', data: instrument.payload.assetId.label },

            { label: 'Version', data: instrument.payload.assetId.version },
            { label: 'Description', data: instrument.payload.description },
          ]}
        />
        <StripedTable
          headings={['Investor', 'Quantity']}
          loading={depositsLoading}
          title="Position Holdings"
          rows={Array.from(groupedDeposits.keys()).map(key => {
            return {
              elements: [key, groupedDeposits.get(key)],
            };
          })}
        />
      </div>

      {pieData.length > 0 && (
        <Tile header="Allocations - Top 5%">
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
      )}
      <Tile header="Claims">
        <div ref={el} style={{ height: '100%' }} />
      </Tile>
    </div>
  );

  function getDataPercentage(val: number) {
    return +((val / total) * 100).toFixed(1);
  }
};
