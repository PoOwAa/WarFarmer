import { useState } from 'react';
import { ArcaneTable } from './table';

/* eslint-disable-next-line */
export interface ArcaneProps {}

export function Arcane(props: ArcaneProps) {
  const [filter, setFilter] = useState('');
  const [collection, setCollection] = useState('all');

  const onFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  return (
    <>
      <input type="text" placeholder="Search..." onInput={onFilter} />
      <div>
        <label>
          <input type="radio" name="collectionFilter" id="all" onChange={() => setCollection('all')} checked={collection === 'all'}/>
          All
        </label>
        <label>
          <input type="radio" name="collectionFilter" id="duviri" onChange={() => setCollection('Duviri')} checked={collection === 'Duviri'}/>
          Duviri
        </label>
        <label>
          <input type="radio" name="collectionFilter" id="eidolon" onChange={() => setCollection('Eidolon')} checked={collection === 'Eidolon'}/>
          Eidolon
        </label>
        <label>
          <input type="radio" name="collectionFilter" id="holdfasts" onChange={() => setCollection('Holdfasts')} checked={collection === 'Holdfasts'}/>
          Holdfasts
        </label>
        <label>
          <input type="radio" name="collectionFilter" id="necralisk" onChange={() => setCollection('Necralisk')} checked={collection === 'Necralisk'}/>
          Necralisk
        </label>
        <label>
          <input type="radio" name="collectionFilter" id="ostron" onChange={() => setCollection('Ostron')} checked={collection === 'Ostron'}/>
          Ostron
        </label>
        <label>
          <input type="radio" name="collectionFilter" id="solaris" onChange={() => setCollection('Solaris')} checked={collection === 'Solaris'}/>
          Solaris
        </label>
        <label>
          <input type="radio" name="collectionFilter" id="steel" onChange={() => setCollection('Steel')} checked={collection === 'Steel'}/>
          Steel
        </label>
        <label>
          <input type="radio" name="collectionFilter" id="cavia" onChange={() => setCollection('Cavia')} checked={collection === 'Cavia'}/>
          Cavia
        </label>
        <label>
          <input type="radio" name="collectionFilter" id="ascension" onChange={() => setCollection('Ascension')} checked={collection === 'Ascension'}/>
          Ascension
        </label>
        <label>
          <input type="radio" name="collectionFilter" id="hex" onChange={() => setCollection('Hex')} checked={collection === 'Hex'}/>
          Hex
        </label>
      </div>
      <ArcaneTable filter={filter} collection={collection}/>
    </>
  );
}

export default Arcane;
