import { DataViewService } from "../service/DataViewService";
import { useAuth } from "../../auth/Auth";
import React, { useState, useEffect } from "react";
import { TextAreaSkeleton } from "@carbon/react";
import { CrmTable } from "./CrmTable";
import { TableWithCollectionFilter } from "./TableWithCollectionFilter";

export function DataViewManager(props) {
  const [componentsMap] = useState({
    0: React.createElement(CrmTable, { schemaName: props.schemaName }, null),
    1: React.createElement(
      TableWithCollectionFilter,
      { schemaName: props.schemaName },
      null
    ),
  });
  const [component, setComponent] = useState(null);
  const auth = useAuth();

  useEffect(() => {
    function dataUpdate() {
      try {
        setComponent(DataViewService.viewTypes[props.schemaName].viewType);
      } catch (e) {
        console.log("Couldn't load data");
      }
    }

    DataViewService.createListener(`${props.schemaName}`, dataUpdate);

    if (!DataViewService.viewTypes[props.schemaName]) {
      DataViewService.getViewType(auth.token, props.schemaName);
    }
    if (DataViewService.viewTypes[props.schemaName]) {
      dataUpdate();
    }
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
