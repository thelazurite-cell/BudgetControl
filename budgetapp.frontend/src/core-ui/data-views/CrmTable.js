import { operationType } from "./props/OperationType";
import { tableProps } from "./props/Table";
import { WithPagination } from "./WithPagination";
import React, { useState, useEffect } from "react";
import {
  TrashCan as Delete,
  Download,
  Warning,
  Undo,
} from "@carbon/icons-react";
import { useAuth } from "../../auth/Auth";
import {
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
} from "@carbon/react";
import "../css/CrmTable.css";
import { DataService } from "../service/DataService";
import { ModalService } from "../service/ModalService";
import { DataManager } from "./DataManager";
import { ChangesPreview } from "./ChangesPreview";
import { CrmTableCell } from "./CrmTableCell";

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
  const auth = useAuth();

  useEffect(() => {
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

        setLoadingHeaders(false);
      } catch (e) {
        console.log("Couldn't load data");
      }
    }

    DataService.setAuthToken(auth.token);
    DataService.createListener(props.schemaName, dataUpdate);

    if (!DataService.schemaCache[props.schemaName]) {
      DataService.fetchSchema(props.schemaName);
    }
    if (
      DataService.schemaCache[props.schemaName] &&
      !DataService.schemaCache[props.schemaName].data
    ) {
      DataService.fetchAll(props.schemaName);
    } else if (loadingHeaders) {
      setTimeout(() => {
        dataUpdate();
      }, 1500);
    }
  }, [props.schemaName, auth.token, loadingHeaders]);

  const batchActionClick = (selectedRows) => {
    console.log(selectedRows);
  };

  const deleteActionClick = (selectedRows) => {
    const deletedItems = selectedRows.map((itm) => {
      return { id: itm.id };
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
      const insertsCached =
        DataService.schemaCache[props.schemaName] &&
        DataService.schemaCache[props.schemaName].pendingCommits &&
        DataService.schemaCache[props.schemaName].pendingCommits.insert.length >
          0;

      const updatesCached =
        DataService.schemaCache[props.schemaName] &&
        DataService.schemaCache[props.schemaName].pendingCommits &&
        DataService.schemaCache[props.schemaName].pendingCommits.update.length >
          0;

      const deletesCached =
        DataService.schemaCache[props.schemaName] &&
        DataService.schemaCache[props.schemaName].pendingCommits &&
        DataService.schemaCache[props.schemaName].pendingCommits.delete.length >
          0;

      const modalName = "changes-preview";
      return loadingHeaders || loadingData ? (
        <DataTableSkeleton />
      ) : (
        <>
          {modalOpen ? (
            <DataManager
              onRequestClose={() => setModalOpen(false)}
              onNewRecord={(data) => {
                const pendingInserts = DataService.getInsertCacheName(
                  props.schemaName
                );

                DataService.schemaCache[
                  props.schemaName
                ].pendingCommits.insert.push(JSON.parse(JSON.stringify(data)));
                localStorage.setItem(
                  pendingInserts,
                  JSON.stringify(
                    DataService.schemaCache[props.schemaName].pendingCommits
                      .insert
                  )
                );
              }}
              schemaName={schemaName}
              dataType={DataService.schemaCache[props.schemaName]}
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
                      <TableBatchAction
                        renderIcon={Delete}
                        iconDescription="Delete the selected rows"
                        onClick={() => {
                          deleteActionClick(selectedRows);
                        }}
                      >
                        Delete
                      </TableBatchAction>
                      <TableBatchAction
                        renderIcon={Download}
                        iconDescription="Download the selected rows"
                        onClick={batchActionClick(selectedRows)}
                      >
                        Export
                      </TableBatchAction>
                    </TableBatchActions>
                    <TableToolbarContent>
                      <TableToolbarSearch onChange={onInputChange} />
                      <TableToolbarMenu>
                        <TableToolbarAction onClick={() => setModalOpen(true)}>
                          Insert {props.schemaName}
                        </TableToolbarAction>
                        <TableToolbarAction onClick={this.handleOnHeaderAdd}>
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
                          <TableHeader key={i} {...getHeaderProps({ header })}>
                            {header.header}
                          </TableHeader>
                        ))}
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
                          .filter((itm) => itm.expandableDescription === true)
                          .pop();

                        const headerCell = currentSchema.fields
                          .filter((itm) => itm.expandableHeader === true)
                          .pop();

                        return (
                          <React.Fragment key={row.id}>
                            {expandable ? (
                              <>
                                <TableExpandRow {...getRowProps({ row })}>
                                  <TableSelectRow
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
                                        ? fullData[descriptionCell.fieldName]
                                        : null || "No Description Provided"}
                                    </div>
                                  </>
                                </TableExpandedRow>
                              </>
                            ) : (
                              <TableRow {...getRowProps({ row })}>
                                <TableSelectRow
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
      );
    }
  }
  return <DynamicRows {...props} />;
};
