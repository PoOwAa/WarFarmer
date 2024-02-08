import { AgGridReact } from "ag-grid-react";
import { IRowNode, ColDef, ColGroupDef } from "ag-grid-community";
import { useCallback, useEffect, useState } from "react";
import { WFArcaneWithPrices } from '@warfarmer/types';
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import styled from "styled-components";

export interface ArcaneTableProps {
  filter: string;
  collection: string;
}

const IconImg = styled.img`
  display: block;
  width: 25px;
  height: auto;
  max-height: 50%;
`;

const StyledCell = styled.span`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
`;

const StyledCellText = styled.p`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

// const apiUrl = 'http://localhost:3000';
const apiUrl = 'https://api.warfarmer.andyrum.com';

export function ArcaneTable(props: ArcaneTableProps) {
  useEffect(() => {
    fetch(`${apiUrl}/api/arcane/prices`)
      .then((res) => res.json())
      .then(rowData => setRowData(rowData.map((row: WFArcaneWithPrices) => ({
        name: row.name,
        collection: row.collection,
        vosfor: row.vosfor,
        platinum10: row.ArcanePrices[0].sellPrice.sell10,
        platinum25: row.ArcanePrices[0].sellPrice.sell25,
        platinum50: row.ArcanePrices[0].sellPrice.sell50,
        platinum100: row.ArcanePrices[0].sellPrice.sell100,
        platinum250: row.ArcanePrices[0].sellPrice.sell250,
        platinum500: row.ArcanePrices[0].sellPrice.sell500,
        vosforPerPlat10: row.ArcanePrices[0].vosforPerPlat.sell10,
        vosforPerPlat25: row.ArcanePrices[0].vosforPerPlat.sell25,
        vosforPerPlat50: row.ArcanePrices[0].vosforPerPlat.sell50,
        vosforPerPlat100: row.ArcanePrices[0].vosforPerPlat.sell100,
        vosforPerPlat250: row.ArcanePrices[0].vosforPerPlat.sell250,
        vosforPerPlat500: row.ArcanePrices[0].vosforPerPlat.sell500,
        rarity: row.rarity,
        urlName: row.urlName,
        imageName: row.imageName,
      }))))
  }, []);

  const ArcaneNameRenderer = ({ value, data }: { value: string, data: WFArcaneWithPrices }) => (
    <StyledCell>
        <IconImg alt={`${value} icon`} src={`https://cdn.warframestat.us/img/${data.imageName}`} />
        <StyledCellText>
          {value}
        </StyledCellText>
    </StyledCell>
  );

  const VosforRenderer = ({ value } : { value: string }) => (
    <StyledCell>
        <StyledCellText>
          {value}
        </StyledCellText>
        <IconImg alt={`Vosfor icon`} src={`https://static.wikia.nocookie.net/warframe/images/f/fc/Vosfor.png`} />
    </StyledCell>
  );

  const PlatRenderer = ({ value } : { value: string }) => (
    <StyledCell>
        <StyledCellText>
          {Number.parseFloat(value).toFixed(2)}
        </StyledCellText>
        <IconImg alt={`Platinum icon`} src={`https://static.wikia.nocookie.net/warframe/images/e/e7/PlatinumLarge.png`} />
    </StyledCell>
  );

  const VosforPerPlatRenderer = ({ value } : { value: string }) => (
    <StyledCell>
      <StyledCellText>
        {Number.parseFloat(value).toFixed(2)}
      </StyledCellText>
      <IconImg alt={`Vosfor icon`} src={`https://static.wikia.nocookie.net/warframe/images/f/fc/Vosfor.png`} />/
      <IconImg alt={`Platinum icon`} src={`https://static.wikia.nocookie.net/warframe/images/e/e7/PlatinumLarge.png`} />
    </StyledCell>
  );

  const collectionFilter = ({data}: {data: WFArcaneWithPrices}) => {
    console.log({
      propCollection: props.collection,
      dataCollection: data.collection,
    })
    if (props.collection === 'all') {
      return true;
    }
    return data.collection === props.collection;
  };

  const isExternalFilterPresent = useCallback(() => {
    if (props.collection === 'all') {
      return false;
    }

    return true;
  }, [props.collection]);

  const doesExternalFilterPass = useCallback((node : IRowNode<WFArcaneWithPrices>) => {
    if (props.collection === 'all') {
      return true;
    }

    return node.data?.collection === props.collection;
  }, [props.collection]);

  const [rowData, setRowData] = useState([]);

  const colDefs: Array<ColDef | ColGroupDef> = [
    { field: 'name', filter: true, cellRenderer: ArcaneNameRenderer, getQuickFilterText: ({ value }: { value: string }) => value },
    { field: 'collection', filter: collectionFilter, hide: true },
    { field: 'vosfor', cellRenderer: VosforRenderer },
    { headerName: 'Platinum', children: [
      {
        field: 'platinum10',
        headerName: '10',
        cellRenderer: PlatRenderer
      },
      {
        field: 'platinum25',
        headerName: '25',
        cellRenderer: PlatRenderer,
        hide: true,
      },
      {
        field: 'platinum50',
        headerName: '50',
        cellRenderer: PlatRenderer,
        hide: true,
      },
      {
        field: 'platinum100',
        headerName: '100',
        cellRenderer: PlatRenderer
      },
      {
        field: 'platinum250',
        headerName: '250',
        cellRenderer: PlatRenderer
      },
      {
        field: 'platinum500',
        headerName: '500',
        cellRenderer: PlatRenderer,
        hide: true,
      },
    ], },
    { field: 'vosforPerPlat', children: [
      {
        field: 'vosforPerPlat10',
        headerName: '10',
        cellRenderer: VosforPerPlatRenderer
      },
      {
        field: 'vosforPerPlat25',
        headerName: '25',
        cellRenderer: VosforPerPlatRenderer,
        hide: true,
      },
      {
        field: 'vosforPerPlat50',
        headerName: '50',
        cellRenderer: VosforPerPlatRenderer,
        hide: true,
      },
      {
        field: 'vosforPerPlat100',
        headerName: '100',
        cellRenderer: VosforPerPlatRenderer
      },
      {
        field: 'vosforPerPlat250',
        headerName: '250',
        cellRenderer: VosforPerPlatRenderer
      },
      {
        field: 'vosforPerPlat500',
        headerName: '500',
        cellRenderer: VosforPerPlatRenderer,
        hide: true,
      },
    ] },
    { field: 'rarity', hide: true },
    { field: 'urlName', hide: true },
    { field: 'imageName', hide: true },
  ];

  return (
    <div className="ag-theme-quartz-dark" style={{ height: 500 }}>
      <AgGridReact<WFArcaneWithPrices>
        rowData={rowData}
        columnDefs={colDefs}
        quickFilterText={props.filter}
        isExternalFilterPresent={isExternalFilterPresent}
        doesExternalFilterPass={doesExternalFilterPass}
      />
    </div>
  );
}
