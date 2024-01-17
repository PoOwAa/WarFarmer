import { AgGridReact } from "ag-grid-react";
import { IRowNode, ColDef } from "ag-grid-community";
import { useCallback, useEffect, useState } from "react";
import { WFArcaneWithPrices } from '@warfarmer/types';
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme

export interface ArcaneTableProps {
  filter: string;
  collection: string;
}

export function ArcaneTable(props: ArcaneTableProps) {
  useEffect(() => {
    fetch('http://localhost:3000/api/arcane/prices')
      .then((res) => res.json())
      .then(rowData => setRowData(rowData.map((row: WFArcaneWithPrices) => ({
        name: row.name,
        collection: row.collection,
        vosfor: row.vosfor,
        platinum: row.ArcanePrices[0].sellPrice.sell100,
        vosforPerPlat: row.ArcanePrices[0].vosforPerPlat.sell100,
        rarity: row.rarity,
        urlName: row.urlName,
        imageName: row.imageName,
      }))))
  }, []);

  const ArcaneNameRenderer = ({ value, data }: { value: string, data: WFArcaneWithPrices }) => (
    <span
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        alignItems: "center",
      }}>
        { value && (
          <img
            alt={`${value} icon`}
            src={`https://cdn.warframestat.us/img/${data.imageName}`}
            style={{
              display: "block",
              width: "25px",
              height: 'auto',
              maxHeight: '50%',
              marginRight: '12px',
            }}
          />
        )}
        <p
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </p>
    </span>
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

  const colDefs: ColDef[] = [
    { field: 'name', filter: true, cellRenderer: ArcaneNameRenderer, getQuickFilterText: ({ value }: { value: string }) => value },
    { field: 'collection', filter: collectionFilter },
    { field: 'vosfor', valueFormatter: ({ value }: { value: string}) => `${Number.parseFloat(value).toFixed(2)} v` },
    { field: 'platinum', valueFormatter: ({ value }: { value: string}) => `${Number.parseFloat(value).toFixed(2)} p` },
    { field: 'vosforPerPlat', valueFormatter: ({ value }: { value: string}) => `${Number.parseFloat(value).toFixed(2)} v/p` },
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
