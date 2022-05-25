import { operationType } from "./props/OperationType";
import { tableProps } from "./props/Table";
import { WithPagination } from "./WithPagination";
import { DataActionBar } from "./DataActionBar";
import React, { useState, useEffect } from "react";
import {
  TrashCan as Delete,
  Warning,
  Undo,
  Edit,
  IncompleteCancel,
  Save,
} from "@carbon/icons-react";
import { useAuth } from "../../auth/Auth";
import {
  Header,
  Button,
  InlineLoading,
  Tag,
  DataTable,
  DataTableSkeleton,
  Table,
  TableBatchAction,
  TableBatchActions,
  TableBody,
  TableContainer,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
  TableRow,
  TableHead,
  TableHeader,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableToolbarAction,
  TableToolbarContent,
  TableToolbarSearch,
  TableToolbarMenu,
  TableCell,
} from "@carbon/react";
import "../css/CrmTable.css";
import { DataService } from "../service/DataService";
import { ModalService } from "../service/ModalService";
import { DataManager } from "./DataManager";
import { ChangesPreview } from "./ChangesPreview";
import { CrmTableCell } from "./CrmTableCell";
import { FilterTypeEnum } from "../../api/data-query/filter-type.enum";
import { Query } from "../../api/data-query/query";
import { QueryGroup } from "../../api/data-query/query-group";
import { DataLoadingService } from "../service/DataViewService";

export const CrmTable = (props) => {
  const [headers, setHeaders] = useState({ headers: [] });
  const [data, setData] = useState({ data: [] });
  const [loadingHeaders, setLoadingHeaders] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [expandable, setExpandable] = useState(false);
  const [schemaName, setSchemaName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [insertModal, setInsertModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [canUpdate, setCanUpdate] = useState(true);
  const [force, setForce] = useState(false);
  const [filter, setFilter] = useState(null);
  let [deleteBulk, setDeleteBulk] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    setFilter(props.filter);
    function dataUpdate() {
      try {
        setHeaders({
          headers: DataService.schemaCache[props.schemaName].headers,
        });

        setExpandable(
          DataService.schemaCache[props.schemaName].schema.isExpandable
        );
        setSchemaName(
          DataService.schemaCache[props.schemaName].schema.schemaName
        );

        if (DataService.schemaCache[props.schemaName].data) {
          setData({
            data: DataService.schemaCache[props.schemaName].data,
          });
          setLoadingData(false);
        }

        if (props.loading) {
          props.loading(false, DataService.schemaCache[props.schemaName]);
        }
        setLoadingHeaders(false);
        setForce(false);
      } catch (e) {
        console.log("Couldn't load data");
      }
    }
    DataService.setAuthToken(auth.token);
    DataService.createListener(`${props.schemaName}`, dataUpdate);
    DataLoadingService.createListener(`${props.schemaName}_load`, () => {
      setLoadingHeaders(true);
      setLoadingData(true);
    });

    if (!DataService.schemaCache[props.schemaName] || force) {
      DataService.fetchSchema(props.schemaName);
    }
    if (
      DataService.schemaCache[props.schemaName] &&
      (!DataService.schemaCache[props.schemaName].data || force)
    ) {
      if (
        filter &&
        filter.fieldName &&
        filter.fieldValue &&
        filter.fieldValue.length > 0
      ) {
        setLoadingData(false);
        setLoadingHeaders(false);
      } else if (!props.filter) {
        DataService.fetchAll(props.schemaName);
        setLoadingData(false);
        setLoadingHeaders(false);
      }
    } else if (loadingHeaders) {
      setTimeout(() => {
        dataUpdate();
      }, 1500);
    }
  }, [
    props.schemaName,
    auth.token,
    loadingHeaders,
    force,
    props.loading,
    props,
    filter,
  ]);

  const batchActionClick = (selected, id) => {
    // const items = JSON.parse(JSON.stringify(rows.selected));
    // if (selected) {
    //   items.push(id);
    // } else {
    //   const index = rows.selected.indexOf(id);
    //   items.splice(index, 1);
    // }
    // const deletes =
    //   DataService.schemaCache[props.schemaName].pendingCommits.delete;
    // let total = 0;
    // items.forEach((itm) => {
    //   if (deletes.filter((temp) => temp.id === itm.id).length > 0) {
    //     total++;
    //   }
    // });
    // setDeleteBulk(total === rows.selected.length);
  };

  const deleteActionClick = (selectedRows) => {
    const deletedItems = [];

    selectedRows.forEach((itm) => {
      if (
        DataService.schemaCache[props.schemaName].pendingCommits.delete.filter(
          (del) => del.id === itm.id
        ).length === 0
      ) {
        deletedItems.push({ id: itm.id });
      }
    });

    const pendingDeletes = DataService.getDeleteCacheName(props.schemaName);

    DataService.schemaCache[props.schemaName].pendingCommits.delete.push(
      ...deletedItems.map((itm) => JSON.parse(JSON.stringify(itm)))
    );

    localStorage.setItem(
      pendingDeletes,
      JSON.stringify(
        DataService.schemaCache[props.schemaName].pendingCommits.delete
      )
    );

    document
      .getElementById(`${props.schemaName}-table`)
      .getElementsByClassName("cds--batch-summary__cancel")[0]
      .click();

    DataService.refresh();
  };

  const insertInRandomPosition = (array, element) => {
    const index = Math.floor(Math.random() * (array.length + 1));
    return [...array.slice(0, index), element, ...array.slice(index)];
  };

  class DynamicRows extends React.Component {
    state = {
      rows: data.data,
      headers: headers.headers,
      id: 0,
    };

    handleOnHeaderAdd = () => {
      const length = this.state.headers.length;
      const header = {
        key: `header_${length}`,
        header: `Header ${length}`,
      };

      this.setState((state) => {
        const rows = state.rows.map((row) => {
          return {
            ...row,
            [header.key]: header.header,
          };
        });
        return {
          rows,
          headers: state.headers.concat(header),
        };
      });
    };

    handleOnRowAdd = () => {
      this.setState((state) => {
        const { id: _id, rows } = state;
        const id = _id + 1;
        const row = {
          id: "" + id,
          name: `New Row ${id}`,
          protocol: "HTTP",
          port: id * 100,
          rule: id % 2 === 0 ? "Round robin" : "DNS delegation",
          attached_groups: `Row ${id}'s VM Groups`,
          status: "Starting",
        };

        state.headers
          .filter((header) => row[header.key] === undefined)
          .forEach((header) => {
            row[header.key] = header.header;
          });

        return {
          id,
          rows: insertInRandomPosition(rows, row),
        };
      });
    };

    render() {
      const sizeProp = tableProps.sizeProp();

      const pendingCommits =
        DataService.schemaCache[props.schemaName] &&
        DataService.schemaCache[props.schemaName].pendingCommits;

      const insertsCached =
        pendingCommits &&
        DataService.schemaCache[props.schemaName].pendingCommits.insert.length >
          0;

      const updatesCached =
        pendingCommits &&
        DataService.schemaCache[props.schemaName].pendingCommits.update.length >
          0;

      const deletesCached =
        pendingCommits &&
        DataService.schemaCache[props.schemaName].pendingCommits.delete.length >
          0;

      const modalName = "changes-preview";
      return (
        <>
          <Header className="settings-header" aria-label="action bar">
            <DataActionBar>
              {({
                handleSubmit,
                isSubmitting,
                success,
                description,
                ariaLive,
              }) => (
                <div style={{ display: "flex", width: "300px" }}>
                  <Button
                    kind="secondary"
                    className="action-button"
                    disabled={isSubmitting || success}
                  >
                    <label className="action-button-label">
                      <IncompleteCancel />
                    </label>
                  </Button>
                  {isSubmitting ? (
                    <InlineLoading
                      style={{ marginLeft: "1rem" }}
                      description={description}
                      status={
                        isSubmitting ? "active" : success ? "finished" : "error"
                      }
                      aria-live={ariaLive}
                    />
                  ) : (
                    <Button
                      id="save"
                      className="action-button"
                      onClick={() =>
                        handleSubmit(props.schemaName, () => {
                          setForce(true);
                          setLoadingData(true);
                          setLoadingHeaders(true);
                          if (props.loading) {
                            props.loading(true);
                          }

                          // DataService.fetchSchema(props.schemaName, true);
                          if (
                            DataService.schemaCache[props.schemaName] &&
                            DataService.schemaCache[props.schemaName].filter
                          ) {
                            DataService.updateFilter(
                              props.schemaName,
                              DataService.schemaCache[props.schemaName].filter
                            );
                          } else {
                            DataService.fetchAll(props.schemaName);
                          }

                          setTimeout(() => {
                            if (
                              DataService.schemaCache[props.schemaName].data
                            ) {
                              setData({
                                data: DataService.schemaCache[props.schemaName]
                                  .data,
                              });
                              setLoadingData(false);
                            }

                            if (props.loading) {
                              props.loading(false);
                            }
                            setLoadingHeaders(false);
                            setForce(false);
                          }, 1500);
                        })
                      }
                    >
                      <label className="action-button-label">
                        <Save />
                      </label>
                    </Button>
                  )}
                </div>
              )}
            </DataActionBar>
          </Header>
          {loadingHeaders || loadingData ? (
            <DataTableSkeleton />
          ) : (
            <>
              {modalOpen ? (
                <DataManager
                  onRequestClose={() => setModalOpen(false)}
                  onNewRecord={(data, existingId) => {
                    const cacheName = existingId
                      ? DataService.getUpdateCacheName(props.schemaName)
                      : DataService.getInsertCacheName(props.schemaName);

                    const schemaCache =
                      DataService.schemaCache[props.schemaName];
                    const use = existingId
                      ? schemaCache.pendingCommits.update
                      : schemaCache.pendingCommits.insert;
                    use.push(JSON.parse(JSON.stringify(data)));
                    localStorage.setItem(cacheName, JSON.stringify(use));
                  }}
                  schemaName={schemaName}
                  dataType={DataService.schemaCache[props.schemaName]}
                  existingId={updateId}
                />
              ) : null}
              {insertModal ? (
                <ChangesPreview
                  modalName={modalName}
                  showModal={insertModal}
                  closeModal={() => {
                    ModalService.resetModalEvents(modalName);

                    setInsertModal(false);
                  }}
                  schemaName={props.schemaName}
                  operationType={operationType.insert}
                  actionIcon={() => <Delete />}
                />
              ) : null}
              {updateModal ? (
                <ChangesPreview
                  modalName={modalName}
                  showModal={updateModal}
                  closeModal={() => {
                    ModalService.resetModalEvents(modalName);

                    setUpdateModal(false);
                  }}
                  schemaName={props.schemaName}
                  operationType={operationType.update}
                  actionIcon={() => <Undo />}
                />
              ) : null}
              {deleteModal ? (
                <ChangesPreview
                  modalName={modalName}
                  showModal={deleteModal}
                  closeModal={() => {
                    ModalService.resetModalEvents(modalName);

                    setDeleteModal(false);
                  }}
                  schemaName={props.schemaName}
                  operationType={operationType.delete}
                  actionIcon={() => <Undo />}
                />
              ) : null}
              <div className="data-table--warnings">
                {insertsCached ? (
                  <Tag
                    className="data-table--warnings--tag"
                    size="sm"
                    title="Clear Filter"
                    type="purple"
                    aria-label="view unsaved inserts button"
                    role="button"
                    onClick={() => setInsertModal(true)}
                  >
                    <Warning />{" "}
                    <p className="data-table--warnings--tag--label">
                      {
                        DataService.schemaCache[props.schemaName].pendingCommits
                          .insert.length
                      }{" "}
                      unsaved insert(s)
                    </p>
                  </Tag>
                ) : null}
                {deletesCached ? (
                  <Tag
                    className="data-table--warnings--tag"
                    size="sm"
                    title="Clear Filter"
                    type="red"
                    aria-label="view unsaved deletions button"
                    role="button"
                    onClick={() => setDeleteModal(true)}
                  >
                    <Warning />{" "}
                    <p className="data-table--warnings--tag--label">
                      {
                        DataService.schemaCache[props.schemaName].pendingCommits
                          .delete.length
                      }{" "}
                      unsaved deletion(s)
                    </p>
                  </Tag>
                ) : null}
                {updatesCached ? (
                  <Tag
                    className="data-table--warnings--tag"
                    size="sm"
                    title="Clear Filter"
                    type="teal"
                    aria-label="view unsaved updates button"
                    role="button"
                    onClick={() => setUpdateModal(true)}
                  >
                    <Warning />
                    <p className="data-table--warnings--tag--label">
                      {
                        DataService.schemaCache[props.schemaName].pendingCommits
                          .update.length
                      }{" "}
                      unsaved update(s)
                    </p>
                  </Tag>
                ) : null}
              </div>
              <div id={`${props.schemaName}-table`}>
                <DataTable
                  rows={this.state.rows}
                  headers={this.state.headers}
                  {...this.props}
                  render={({
                    rows,
                    headers,
                    getHeaderProps,
                    getSelectionProps,
                    getToolbarProps,
                    getBatchActionProps,
                    getRowProps,
                    onInputChange,
                    selectedRows,
                    getTableProps,
                    getTableContainerProps,
                  }) => (
                    <TableContainer
                      title={schemaName}
                      //   description="Use the toolbar menu to add rows and headers"
                      {...getTableContainerProps()}
                    >
                      <TableToolbar {...getToolbarProps()}>
                        <TableBatchActions {...getBatchActionProps()}>
                          <>
                            <TableBatchAction
                              renderIcon={Delete}
                              iconDescription="Delete the selected rows"
                              onClick={() => {
                                deleteActionClick(selectedRows);
                              }}
                              disabled={deleteBulk}
                              tooltip="Delete selected rows"
                            >
                              <>
                                <>Delete</>
                              </>
                            </TableBatchAction>
                            {/* <TableBatchAction
                          renderIcon={Download}
                          iconDescription="Download the selected rows"
                          onClick={() => batchActionClick(selectedRows)}
                        >
                          Export
                        </TableBatchAction> */}
                          </>
                        </TableBatchActions>
                        <TableToolbarContent>
                          <TableToolbarSearch onChange={onInputChange} />
                          <TableToolbarMenu>
                            <TableToolbarAction
                              onClick={() => {
                                setUpdateId(null);
                                setModalOpen(true);
                              }}
                            >
                              Insert {props.schemaName}
                            </TableToolbarAction>
                            <TableToolbarAction
                              onClick={this.handleOnHeaderAdd}
                            >
                              Add header
                            </TableToolbarAction>
                          </TableToolbarMenu>
                        </TableToolbarContent>
                      </TableToolbar>
                      <Table {...getTableProps()} {...sizeProp}>
                        <TableHead>
                          <TableRow>
                            {expandable ? <TableExpandHeader /> : null}
                            <TableSelectAll {...getSelectionProps()} />
                            {headers.map((header, i) => (
                              <TableHeader
                                key={i}
                                {...getHeaderProps({ header })}
                              >
                                {header.header}
                              </TableHeader>
                            ))}
                            {canUpdate ? (
                              <TableHeader>Actions</TableHeader>
                            ) : null}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row) => {
                            if (loadingData) {
                              return null;
                            }
                            let color;
                            const colorCell = row.cells.filter(
                              (cell) => cell.info.header === "color"
                            );
                            if (colorCell.length > 0) {
                              color = colorCell.pop().value || "#fff";
                            }

                            const id = row.id;
                            const fullData = data.data
                              .filter((r) => r.id === id)
                              .pop();

                            const currentSchema =
                              DataService.schemaCache[schemaName].schema;

                            const descriptionCell = currentSchema.fields
                              .filter(
                                (itm) => itm.expandableDescription === true
                              )
                              .pop();

                            const headerCell = currentSchema.fields
                              .filter((itm) => itm.expandableHeader === true)
                              .pop();

                            return (
                              <React.Fragment key={row.id}>
                                {expandable ? (
                                  <>
                                    <TableExpandRow
                                      id={`${schemaName}:${row.id}`}
                                      {...getRowProps({ row })}
                                    >
                                      <TableSelectRow
                                        onChange={(e) =>
                                          batchActionClick(e, row.id)
                                        }
                                        {...getSelectionProps({ row })}
                                      />
                                      {row.cells.map((cell) => (
                                        <CrmTableCell
                                          key={`${id}:${cell.id}:CrmTableCell`}
                                          color={color}
                                          schemaName={schemaName}
                                          currentSchema={currentSchema}
                                          schemaCache={DataService.schemaCache}
                                          cell={cell}
                                          rowId={id}
                                        />
                                      ))}
                                      {canUpdate ? (
                                        <TableCell>
                                          <Button
                                            className="table-action-button"
                                            onClick={() => {
                                              setUpdateId(id);
                                              setModalOpen(true);
                                            }}
                                          >
                                            <Edit />
                                          </Button>
                                        </TableCell>
                                      ) : null}
                                    </TableExpandRow>
                                    <TableExpandedRow
                                      colSpan={headers.length + 3}
                                      className="demo-expanded-td"
                                    >
                                      <>
                                        <h6>
                                          {fullData
                                            ? fullData[headerCell.fieldName]
                                            : null || "No Header Provided"}
                                        </h6>
                                        <div>
                                          {fullData
                                            ? fullData[
                                                descriptionCell.fieldName
                                              ]
                                            : null || "No Description Provided"}
                                        </div>
                                      </>
                                    </TableExpandedRow>
                                  </>
                                ) : (
                                  <TableRow
                                    id={`${schemaName}:${row.id}`}
                                    {...getRowProps({ row })}
                                  >
                                    <TableSelectRow
                                      onChange={(e) =>
                                        batchActionClick(e, row.id)
                                      }
                                      {...getSelectionProps({ row })}
                                    />
                                    {row.cells.map((cell) => (
                                      <CrmTableCell
                                        key={`${id}:${cell.id}:CrmTableCell`}
                                        color={color}
                                        currentSchema={currentSchema}
                                        schemaName={schemaName}
                                        schemaCache={DataService.schemaCache}
                                        cell={cell}
                                        rowId={id}
                                      />
                                    ))}
                                    {canUpdate ? (
                                      <TableCell>
                                        <>
                                          <Button
                                            className="table-action-button"
                                            onClick={() => {
                                              setUpdateId(id);
                                              setModalOpen(true);
                                            }}
                                          >
                                            <Edit />
                                          </Button>
                                          <Button className="table-action-button">
                                            <Edit />
                                          </Button>
                                        </>
                                      </TableCell>
                                    ) : null}
                                  </TableRow>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </TableBody>
                      </Table>
                      <WithPagination></WithPagination>
                    </TableContainer>
                  )}
                />
              </div>
            </>
          )}
        </>
      );
    }
  }
  return <DynamicRows {...props} />;
};
