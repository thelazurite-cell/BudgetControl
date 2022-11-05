import { DataViewService } from "../service/DataViewService";
import { useAuth } from "../../auth/Auth";
import React, { useState, useEffect } from "react";
import { TextAreaSkeleton } from "@carbon/react";
import { CrmTable } from "./CrmTable";
import { TableWithCollectionFilter } from "./TableWithCollectionFilter";

export function DataViewManager(props) {
  const [componentsMap, setComponentsMap] = useState({});
  const [component, setComponent] = useState(null);
  const auth = useAuth();

  useEffect(() => {
    console.log(props.schemaName);
    setComponentsMap({
      0: React.createElement(CrmTable, { schemaName: props.schemaName }, null),
      1: React.createElement(
        TableWithCollectionFilter,
        { schemaName: props.schemaName },
        null
      ),
    });
    function dataUpdate() {
      try {
        setComponent(DataViewService.viewTypes[props.schemaName].viewType);
      } catch (e) {
        console.log("Couldn't load data");
      }
    }

    DataViewService.createListener(`${props.schemaName}_view`, dataUpdate);

    if (!DataViewService.viewTypes[props.schemaName]) {
      DataViewService.getViewType(auth.token, props.schemaName);
    }
    if (DataViewService.viewTypes[props.schemaName]) {
      dataUpdate();
    }
    return () => {
      const index = DataViewService.viewTypes.indexOf(
        DataViewService.viewTypes.filter(
          (viewType) => viewType === props.schemaName
        )
      );
      DataViewService.viewTypes.splice(index, 1);
      DataViewService.removeListener(`${props.schemaName}_view`, dataUpdate);
    };
  }, [props.schemaName, auth.token]);

  return (
    <>
      {component === null ? (
        <TextAreaSkeleton />
      ) : (
        <>{componentsMap[component]}</>
      )}
    </>
  );
}
