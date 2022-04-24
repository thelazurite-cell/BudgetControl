import ReactDOM from "react-dom";
import React, { useState, useEffect } from "react";
import {
  TrashCan32 as Delete,
  Save32 as Save,
  Download32 as Download,
  Information32 as Information,
} from "@carbon/icons-react";
import { useAuth } from "../../auth/Auth";
import {
  DataTable,
  DataTableSkeleton,
  Table,
  TableBatchAction,
  TableBatchActions,
  TableBody,
  TableCell,
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
  unstable_PageSelector as PageSelector,
  unstable_Pagination as Pagination,
  Checkbox,
  TextInput,
  Select,
  SelectItem,
  Modal,
  Button,
  FlexGrid,
  Row,
  Column,
} from "carbon-components-react";
import { ChromePicker, BlockPicker } from "react-color";
import "../css/CrmTable.css";
import { DataService } from "../service/DataService";
import { useSensitiveData } from "../../SensitiveData";

const sizes = {
  Compact: "compact",
  Short: "short",
  Medium: "medium",
  Default: null,
  Tall: "tall",
};

const tableProps = {
  sizeProp: () => {
    return {
      size: sizes.Compact,
    };
  },
};

const paginationProps = () => ({
  disabled: false,
  pagesUnknown: false,
  backwardText: "Previous page",
  forwardText: "Next page",
  pageSize: 10,
  itemsPerPageText: "Items per page:",
  size: sizes.Compact,
  onChange: () => console.log("Pagination Change"),
});

const WithAPageSelector = () => (
  <Pagination {...paginationProps()} totalItems={350} pageSizes={[10, 20, 30]}>
    {({ currentPage, onSetPage, totalPages }) => (
      <PageSelector
        currentPage={currentPage}
        id={`page-selector`}
        onChange={(event) => onSetPage(event.target.value)}
        totalPages={totalPages}
      />
    )}
  </Pagination>
);
function isDarkColor(color) {
  let r;
  let g;
  let b;
  let a = 1;
  let hsp;

  if (color.match(/^rgb/)) {
    color = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    );
    r = color[1];
    g = color[2];
    b = color[3];
    a = color[4];
  } else {
    color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&"));

    r = color >> 16;
    g = (color >> 8) & 255;
    b = color & 255;
  }

  if (a === 0) {
    return false;
  }
  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)) / a;

  return hsp <= 127.5;
}

export const dataType = {
  id: 0,
  relatedId: 1,
  string: 2,
  number: 3,
  dateTime: 4,
  boolean: 5,
  color: 6,
};

export const DataManager = (props) => {
  console.log(props.dataType);
  return (
    <Modal
      modalHeading={`Add ${props.schemaName}`}
      modalLabel="Insert Data"
      primaryButtonText="Add"
      secondaryButtonText="Cancel"
      open={true}
      onRequestClose={() => props.onRequestClose()}
    >
      <p style={{ marginBottom: "1rem" }}></p>
      {props.dataType.schema.fields
        .filter((itm) => !itm.systemField)
        .map((itm) => {
          // return <p key={`modal:${itm.fieldName}`}>{itm.fieldFriendlyName}</p>;

          if (itm.fieldType === dataType.id) {
            const related = DataService.schemaCache[itm.fieldRelatesTo];
            console.log(`relatedData:`, related);

            const relatedSchema = related.schema;

            const displayValueField = relatedSchema.fields
              .filter((itm) => itm.relationshipView)
              .pop();

            const displayColorField = relatedSchema.fields
              .filter((itm) => itm.relationshipViewColor)
              .pop();

            return (
              <Select
                key={`modal:drop-down:${itm.fieldName}`}
                id={`modal:drop-down:${itm.fieldName}`}
                defaultValue="us-south"
                labelText={itm.fieldFriendlyName}
              >
                {related.data.map((selectItem) => {
                  const displayColor = selectItem[displayColorField.fieldName];
                  return (
                    <SelectItem
                      key={`modal:drop-down:${itm.fieldName}:itm:${selectItem.id}`}
                      style={{
                        backgroundColor: displayColor ? displayColor : "unset",
                        color: isDarkColor(displayColor || "#fff")
                          ? "#fff"
                          : "unset",
                      }}
                      value={selectItem.id}
                      text={selectItem[displayValueField.fieldName]}
                    />
                  );
                })}
              </Select>
            );
          } else if (itm.fieldType === dataType.color) {
            return (
              <>
                <FlexGrid>
                  <Row>
                    <Column lg={10}>
                      <TextInput
                        data-modal-primary-focus
                        key={`modal:input:${itm.fieldName}`}
                        id={`modal:input:${itm.fieldName}`}
                        labelText={itm.fieldFriendlyName}
                        placeholder="#fff"
                        style={{ marginBottom: "1rem" }}
                        readOnly={true}
                      />
                    </Column>
                    <Column lg={2}>
                      <Button />
                    </Column>
                  </Row>
                </FlexGrid>
                <ChromePicker key={`modal:picker:${itm.fieldName}`} />
              </>
            );
          } else {
            return (
              <>
                <TextInput
                  data-modal-primary-focus
                  key={`modal:input:${itm.fieldName}`}
                  id={`modal:input:${itm.fieldName}`}
                  labelText={itm.fieldFriendlyName}
                  placeholder="e.g. github.com"
                  style={{ marginBottom: "1rem" }}
                />
              </>
            );
          }
        })}
    </Modal>
  );
};

export const CrmTable = (props) => {
  const [headers, setHeaders] = useState({ headers: [] });
  const [data, setData] = useState({ data: [] });
  const [loadingHeaders, setLoadingHeaders] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [expandable, setExpandable] = useState(false);
  const [schemaName, setSchemaName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
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
    // console.log(selectedRows);
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
      return loadingHeaders || loadingData ? (
        <DataTableSkeleton />
      ) : (
        <>
          {modalOpen ? (
            <DataManager
              onRequestClose={() => setModalOpen(false)}
              schemaName={schemaName}
              dataType={DataService.schemaCache[props.schemaName]}
            />
          ) : null}
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
                      onClick={batchActionClick(selectedRows)}
                    >
                      Delete
                    </TableBatchAction>
                    <TableBatchAction
                      renderIcon={Save}
                      iconDescription="Save the selected rows"
                      onClick={batchActionClick(selectedRows)}
                    >
                      Save
                    </TableBatchAction>
                    <TableBatchAction
                      renderIcon={Download}
                      iconDescription="Download the selected rows"
                      onClick={batchActionClick(selectedRows)}
                    >
                      Download
                    </TableBatchAction>
                  </TableBatchActions>
                  <TableToolbarContent>
                    <TableToolbarSearch onChange={onInputChange} />
                    <TableToolbarMenu>
                      <TableToolbarAction onClick={() => setModalOpen(true)}>
                        Add row
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
                      if (loadingData) return <p>fuck off</p>;
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
                                    currentSchema={currentSchema}
                                    schemaCache={DataService.schemaCache}
                                    cell={cell}
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
                              <TableSelectRow {...getSelectionProps({ row })} />
                              {row.cells.map((cell) => (
                                <CrmTableCell
                                  key={`${id}:${cell.id}:CrmTableCell`}
                                  color={color}
                                  currentSchema={currentSchema}
                                  schemaCache={DataService.schemaCache}
                                  cell={cell}
                                />
                              ))}
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
                <WithAPageSelector></WithAPageSelector>
              </TableContainer>
            )}
          />
        </>
      );
    }
  }
  return <DynamicRows {...props} />;
};

export const CrmTableCell = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const sensitive = useSensitiveData();

  const cellInfo = props.currentSchema.fields
    .filter((itm) => itm.fieldName === props.cell.info.header)
    .pop();

  let isSensitiveCell = cellInfo.fieldSensitive;
  const isRelatedField = cellInfo.fieldRelatesTo.length > 0;

  let displayValue = null;
  let displayColor = props.color;

  if (isRelatedField) {
    const relatedSchema = props.schemaCache[cellInfo.fieldRelatesTo].schema;

    const displayValueFields = relatedSchema.fields.filter(
      (itm) => itm.relationshipView
    );

    const displayColorFields = relatedSchema.fields.filter(
      (itm) => itm.relationshipViewColor
    );

    const relatedRecord = props.schemaCache[cellInfo.fieldRelatesTo].data
      .filter((itm) => itm.id === props.cell.value)
      .pop();

    if (displayValueFields.length > 0) {
      const displayValueField = (displayValueFields || []).pop();

      // check the field sensitivity of the field within the related schema.
      // if this check doesn't occur, then the value from the related data will be displayed
      // even if the sensitive data toggle was switched on

      isSensitiveCell = isSensitiveCell || displayValueField.fieldSensitive;

      if (relatedRecord) {
        displayValue = relatedRecord[displayValueField.fieldName];
        // console.log(
        //   `${props.cell.info.header}==${props.cell.value} --> ${cellInfo.fieldRelatesTo}:${relatedField.fieldName}==${relatedValue}`,
        //   relatedSchema
        // );
      }
    }
    if (displayColorFields.length > 0) {
      const displayColorField = (displayColorFields || []).pop();

      if (relatedRecord) {
        displayColor =
          relatedRecord[displayColorField.fieldName] || props.color;
      }
    }
  }

  return (
    <TableCell
      key={props.cell.id}
      style={{
        backgroundColor: displayColor ? displayColor : "unset",
        color: isDarkColor(displayColor || "#fff") ? "#fff" : "unset",
      }}
    >
      {isSensitiveCell && !sensitive.showSensitiveData ? (
        <span className="hidden-data">
          <span className="hidden-data--tooltip">
            <Information height="18" />
            <span>Hidden</span>
            <span className="hidden-data--tooltip--text">
              This value has been hidden as privacy mode is enabled.
            </span>
          </span>
        </span>
      ) : typeof props.cell.value === "boolean" ? (
        <Checkbox
          id={`${props.cell.id}:checkbox`}
          labelText=""
          checked={props.cell.value}
          disabled={true}
        />
      ) : (
        displayValue || props.cell.value
      )}
    </TableCell>
  );
};
