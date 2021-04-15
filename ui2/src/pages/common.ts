import { CreateEvent } from '@daml/ledger';

export type ServicePageProps<T extends object> = {
  services: Readonly<CreateEvent<T, any, any>[]>;
};
