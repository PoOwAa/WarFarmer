import { useState } from 'react';
import { ArcaneTable } from './table';
import { ArcaneCollection } from '@warfarmer/types';

/* eslint-disable-next-line */
export interface ArcaneProps {}

export function Arcane(props: ArcaneProps) {
  const [filter, setFilter] = useState('');
  const [collection, setCollection] = useState('all');

  const onFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const collections: ArcaneCollection[] = ['Ascension', 'Cavia', 'Duviri', 'Eidolon', 'Hex', 'Holdfasts', 'Necralisk', 'Ostron', 'Solaris', 'Steel'];

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-center p-4">
        <label className="input input-accent">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
          <input className="grow" type="text" placeholder="Search..." onInput={onFilter} />
        </label>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">Select an Arcane Collection:</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center space-x-2">
            <input className="radio radio-accent" type="radio" name="collectionFilter" id="all" onChange={() => setCollection('all')} checked={collection === 'all'}/>
            <span className="text-base">All</span>
          </label>
          {collections.map((coll) => (
            <label key={coll} className="flex items-center space-x-2">
              <input className="radio radio-accent" type="radio" name="collectionFilter" id={coll} onChange={() => setCollection(coll)} checked={collection === coll}/>
              <span className="text-base ml-3">{coll}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4">
        <ArcaneTable filter={filter} collection={collection}/>
      </div>
    </div>
  );
}

export default Arcane;
