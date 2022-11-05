import { Button, Select, SelectItem, DropdownSkeleton } from "@carbon/react";
import { DataService } from "../service/DataService";
import { AddAlt, TrashCan, WarningAlt } from "@carbon/icons-react";
import { CrmTable } from "./CrmTable";
import { useAuth } from "../../auth/Auth";
import { useState } from "react";
import "../css/TableWithCollectionFilter.css";
import { DraggableModal } from "./DraggableModal";
import { DataManager, createRecordTemplate } from "./DataManager";
import { DataTransfer } from "../../api/DataTransfer";
import { DataLoadingService } from "../service/DataLoadingService";
import { WarningMessage } from "./WarningMessage";

export function TableWithCollectionFilter(props) {
  const auth = useAuth();
  const [items, setItems] = useState([{ value: "test" }]);
  const [loading, setLoading] = useState(true);
  const [dependenciesLoaded, setDependenciesLoaded] = useState(false);
  const [collectionFilter, setCollectionFilter] = useState(null);
  const [collectionClone, setCollectionClone] = useState(null);
  const [createFilter, setCreateFilter] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [tableFilter, setTableFilter] = useState({
    fieldName: null,
    fieldValue: null,
  });

  const fetchAllDependencies = (def, saveCollectionConfig) => {
    if (!def) {
      return;
    }

    const dependencies = def.schema.fields.filter(
      (field) => field.fieldType === 0 && field.fieldRelatesTo
    );

    dependencies.forEach((dependency) => {
      console.log(dependency.fieldRelatesTo);
      DataService.fetchSchema(dependency.fieldRelatesTo);
      DataService.fetchAll(dependency.fieldRelatesTo);

      if (saveCollectionConfig) {
        if (dependency.collectionFilter) {
          console.log("filter");
          tableFilter.fieldName = dependency.fieldName;
          if (
            DataService.schemaCache[props.schemaName] &&
            DataService.schemaCache[props.schemaName].filter
          ) {
            tableFilter.fieldValue =
              DataService.schemaCache[props.schemaName].filter.fieldValue;
          }
          setTableFilter(tableFilter);
          setCollectionFilter(
            DataService.schemaCache[dependency.fieldRelatesTo]
          );
          setTimeout(() => {
            if (!tableFilter.fieldValue) {
              tableFilter.fieldValue = collectionFilter[0].id;
              setTableFilter(tableFilter);
            }
          }, 150);
          fetchAllDependencies(
            DataService.schemaCache[dependency.fieldRelatesTo],
            false
          );
        }

        if (dependency.collectionClone) {
          console.log("clone");
          setCollectionClone(
            DataService.schemaCache[dependency.fieldRelatesTo]
          );
        }
      }

      console.log(DataService.schemaCache[dependency.fieldRelatesTo]);
    });
    console.log(dependencies);
  };

  const loadDependencies = (def) => {
    console.log(def);
    if (!dependenciesLoaded && def) {
      fetchAllDependencies(def, true);
      setTimeout(() => {
        setDependenciesLoaded(true);
        setTimeout(() => {
          DataService.updateFilter(props.schemaName, tableFilter);
        }, 500);
      }, 1000);
    }
  };

  const collectionFilterCanDisplay =
    collectionFilter &&
    collectionFilter.data &&
    collectionFilter.data.length > 0;
  return (
    <>
      <>
        {collectionFilter && collectionFilter.schema && createFilter ? (
          <DataManager
            schemaName={collectionFilter.schema.schemaName}
            dataType={collectionFilter}
            onRequestClose={() => setCreateFilter(false)}
            onNewRecord={(data, existingId) => {
              setDependenciesLoaded(false);

              const api = new DataTransfer(auth.token);
              api.insert(
                { type: collectionFilter.schema.schemaName, data },
                (response) => {
                  console.log(data, response);
                  const createdFilter = response.data.results.pop();

                  const modifiableFields = DataService.schemaCache[
                    props.schemaName
                  ].schema.fields.filter((itm) => !itm.systemField);

                  const inserts = [];

                  collectionClone.data.forEach((data) => {
                    const clone = JSON.parse(
                      JSON.stringify(createRecordTemplate(modifiableFields))
                    );
                    Object.assign(clone, data);
                    clone.id = "";

                    const dependencies = DataService.schemaCache[
                      props.schemaName
                    ].schema.fields.filter(
                      (field) => field.fieldType === 0 && field.fieldRelatesTo
                    );

                    const needsDefaults = DataService.schemaCache[
                      props.schemaName
                    ].schema.fields.filter(
                      (itm) => itm.collectionDefaultsFrom.length > 0
                    );

                    console.log(needsDefaults);

                    dependencies.forEach((dependency) => {
                      if (dependency.collectionFilter) {
                        clone[dependency.fieldName] = createdFilter.id;
                      }

                      if (dependency.collectionClone) {
                        clone[dependency.fieldName] = data.id;
                      }
                    });

                    needsDefaults.forEach((setDefault) => {
                      clone[setDefault.fieldName] =
                        createdFilter[setDefault.collectionDefaultsFrom];
                    });

                    inserts.push(JSON.parse(JSON.stringify(clone)));
                  });

                  console.log(inserts);

                  api.insert(
                    { type: props.schemaName, data: inserts },
                    (response) => {
                      console.log(response);
                      const schemaName = collectionFilter.schema.schemaName;
                      DataService.fetchAll(schemaName);
                      DataService.fetchAll(props.schemaName);
                      setCollectionFilter(DataService.schemaCache[schemaName]);
                      setTimeout(() => {
                        DataLoadingService.pushEvent();
                        setDependenciesLoaded(true);
                        tableFilter.fieldValue = createdFilter.id;
                        setTableFilter(tableFilter);
                        DataService.updateFilter(props.schemaName, tableFilter);
                      }, 500);
                    },
                    (error) => {
                      console.log(error);
                      setTimeout(() => {
                        setDependenciesLoaded(true);
                      }, 500);
                    }
                  );
                },
                (error) => {
                  console.log(error);
                  setTimeout(() => {
                    setDependenciesLoaded(true);
                  }, 500);
                }
              );
            }}
          />
        ) : null}
      </>
      <>
        {confirmDelete ? (
          <DraggableModal
            id="confirm-delete-filter"
            className="inserts-view-modal"
            open={confirmDelete}
            modalHeading={"Confirm Deletion"}
            onRequestClose={() => setConfirmDelete(false)}
            primaryButtonText="Delete"
            secondaryButtonText="Cancel"
          >
            <WarningMessage
              message={`If you delete this ${collectionFilter.schema.schemaName}, then
                all related ${props.schemaName} records will also be deleted.
                This action cannot be undone.`}
            />
          </DraggableModal>
        ) : null}
      </>
      <>
        <div className="filter-toolbar">
          {!dependenciesLoaded ? (
            <DropdownSkeleton className="filter-toolbar--dropdown" />
          ) : (
            <>
              <Select
                className="filter-toolbar--dropdown"
                id="default"
                labelText=" "
                label="Dropdown menu options"
                aria-label="Dropdown menu options"
                items={items}
                value={tableFilter.fieldValue}
                onChange={(e) => {
                  console.log(e);
                  tableFilter.fieldValue = e.target.selectedOptions[0].value;
                  DataLoadingService.pushEvent();
                  setTableFilter(JSON.parse(JSON.stringify(tableFilter)));

                  setTimeout(() => {
                    DataService.updateFilter(props.schemaName, tableFilter);
                  }, 500);
                }}
                itemToString={(item) => (item ? item.text : "")}
              >
                {collectionFilterCanDisplay ? (
                  <>
                    {collectionFilter.data.map((selectItem) => {
                      const displayValueField = collectionFilter.schema.fields
                        .filter((itm) => itm.relationshipView)
                        .pop();

                      return (
                        <SelectItem
                          key={`filter-toolbar:drop-down:itm:${selectItem.id}`}
                          value={selectItem.id}
                          text={selectItem[displayValueField.fieldName]}
                        />
                      );
                    })}
                  </>
                ) : (
                  <SelectItem value="" text="No data available" />
                )}
              </Select>
              <Button
                className="table-action-button"
                onClick={() => setCreateFilter(true)}
              >
                <AddAlt />
              </Button>
              <Button
                kind="danger"
                className="table-action-button"
                onClick={() => setConfirmDelete(true)}
              >
                <TrashCan />
              </Button>
            </>
          )}
        </div>
        {tableFilter ? (
          <CrmTable
            schemaName={props.schemaName}
            filter={tableFilter}
            loading={(value, schema) => {
              setLoading(value);
              setTimeout(() => {
                if (!value) {
                  console.log(value);
                  loadDependencies(schema);
                }
              }, 500);
            }}
          ></CrmTable>
        ) : null}
      </>
    </>
  );
}
