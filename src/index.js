import React from "react";
import ReactDOM from "react-dom";

import "./index.css";

import "./font-awesome-css/new-font-awesome.css";

import $ from "jquery";

import * as Table from "reactabular-table";
import * as select from "selectabular";

import { cloneDeep, findIndex } from "lodash";
import { compose } from "redux";
import classnames from "classnames";

var moment = require("moment");
var today = moment();

class PersonList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [
        {
          id_page: 100,
          page_short: "John",
          conference_short: "fddfd",
          company_name: "fi"
        }
      ],
      selectedRows: [],

      // Set Property to display tagged data

      columns: [
        {
          property: "id_page",
          props: {
            style: {
              width: "15%",
              textAlign: "right"
            }
          },
          header: {
            label: "#ID",
            formatters: []
          },
          width: "15%"
        },
        {
          property: "page_short",
          props: {
            style: {
              width: "16%",
              textTransform: "uppercase"
            }
          },
          header: {
            label: "Page Short",
            formatters: []
          },
          width: "16%"
        },
        {
          property: "conference_short",
          props: {
            style: {
              width: "28%",
              textTransform: "uppercase"
            }
          },
          header: {
            label: "Conference",
            formatters: []
          },
          width: "28%"
        },
        {
          property: "company_name",
          props: {
            style: {
              width: "25%"
            }
          },
          header: {
            label: "Company Name",
            formatters: []
          },
          width: "25%"
        },
        {
          property: "page_archivedown",
          props: {
            style: {
              width: "15%",
              textAlign: "left"
            }
          },
          header: {
            label: "Archive Down:(Day)",
            name: "archivedays",
            formatters: []
          },
          cell: {
            formatters: [
              (value, { rowData }) => (
                <div>
                  // Convert page_archivedown to Number
                  {moment(rowData.page_archivedown, "M/D/YYYY h:mm:ss A")
                    .startOf("day")
                    .diff(today.startOf("day"), "days")}
                </div>
              )
            ]
          }
        },

        {
          property: "page_archivedown",
          props: {
            style: {
              width: "15%",
              textAlign: "left"
            }
          },

          header: {
            label: "(Date)",
            formatters: []
          },
          width: "15%",

          cell: {
            formatters: []
          }
        },
        {
          header: {
            label: "box",
            formatters: [
              // Select all less than equal zero function
              name => (
                <button
                  onClick={() => {
                    const rows = cloneDeep(this.state.rows);

                    for (let i = 0; i < rows.length; i++) {
                      if (
                        moment(
                          rows[i]["page_archivedown"],
                          "M/D/YYYY h:mm:ss A"
                        )
                          .startOf("day")
                          .diff(today.startOf("day"), "days") <= 0
                      ) {
                        Object.assign(rows[i], {
                          ["selected"]: true
                        });

                        console.log(rows[i]);
                      }
                    }

                    this.setState({ rows });
                  }}
                  style={{
                    width: "120px",
                    background: "red",
                    boxShadow:
                      "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)"
                  }}
                >
                  {"Select All < 0"}
                </button>
              )
            ]
          },
          props: {
            style: {
              width: "30%"
            }
          },
          cell: {
            formatters: [
              (value, { rowIndex, rowData }) => (
                <div>
                  <button
                    className="warning remove-button inline"
                    style={{
                      border: "1px #f5f5f5 solid",
                      marginRight: "18px",
                      marginBottom: "3px",
                      boxShadow:
                        "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)"
                    }}
                    onClick={event =>
                      this.onExpire(rowIndex, rowData.id_page, event)
                    }
                  >
                    <div className="icon">
                      <i className="fa fa-history"> </i>
                    </div>{" "}
                  </button>

                  <button
                    className="remove-button inline"
                    style={{
                      border: "1px #f5f5f5 solid",
                      marginRight: "18px",
                      marginBottom: "3px",
                      boxShadow:
                        "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)"
                    }}
                    onClick={() => this.onRemove(rowIndex, rowData.id_page)}
                  >
                    <div className="icon">
                      <i className="fa fa-times-circle-o"> </i>
                    </div>
                  </button>

                  <button
                    onClick={this.preventClickPropagation}
                    className="remove-button success inline"
                    style={{
                      border: "1px #f5f5f5 solid",
                      marginRight: "1px",
                      marginBottom: "3px",
                      boxShadow:
                        "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)"
                    }}
                  >
                    <a
                      href={
                        "http://wsw.com/webcast/" +
                        rowData.conference_short +
                        "/" +
                        rowData.page_short
                      }
                      style={{}}
                      target="_blank"
                    >
                      View
                    </a>
                  </button>
                </div>
              )
            ]
          }
        }
      ]
    };

    // binding

    this.onRemove = this.onRemove.bind(this);
    this.onRemoveAll = this.onRemoveAll.bind(this);

    this.onExpire = this.onExpire.bind(this);
    this.onExpireAll = this.onExpireAll.bind(this);

    this.onRow = this.onRow.bind(this);

    this.onSelectRow = this.onSelectRow.bind(this);
    this.getSelectedRowIndex = this.getSelectedRowIndex.bind(this);

    this.getAllExpired = this.getAllExpired.bind(this);

    this.onSelectRow = this.onSelectRow.bind(this);
    this.getSelectedRowIndex = this.getSelectedRowIndex.bind(this);

    this.preventClickPropagation = this.preventClickPropagation.bind(this);

    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    // grab data from database

    this.loadData();
  }
  render() {
    const { columns, rows, selectedRows } = this.state;
    const selectedRowIndex = this.getSelectedRowIndex(selectedRows);

    var filtered = rows.filter((x, i, arr) => {
      return x.selected && x.id_page;
    });

    var filteredTimeRow = rows.filter((x, i, arr) => {
      return (
        moment(x.page_archivedown, "M/D/YYYY h:mm:ss A")
          .startOf("day")
          .diff(today.startOf("day"), "days") <= 0 && x.id_page
      );
    });

    var selectedId = [];

    for (var key in filtered) {
      if (filtered.hasOwnProperty(key)) {
        selectedId.push(filtered[key]["id_page"]);
      }
    }

    var filteredAllExpiredID = [];

    for (var key in filteredTimeRow) {
      if (filteredTimeRow.hasOwnProperty(key)) {
        filteredAllExpiredID.push(filteredTimeRow[key]["id_page"]);
      }
    }

    var buttonStyle = {
      margin: "10px 10px 10px 0"
    };

    var divOneStyle = {
      fontSize: "18px",
      color: "white",
      fontWeight: 900,
      float: "left",
      display: "inline"
    };

    var divTwoStyle = {
      fontSize: "18px",
      color: "white",
      fontWeight: 900,
      float: "right",
      display: "inline"
    };

    return (
      <div>
        <Table.Provider className="primary" columns={columns}>
          <Table.Header />

          <Table.Body rows={rows} rowKey="id_page" onRow={this.onRow} />

          <tfoot id="bottom-footer">
            <div style={divOneStyle}>
              Total Pages: {this.state.rows.length + " "}
              <br />
              Pages to Expire: {filteredAllExpiredID.length + " "}
              <br />
              Selected: {selectedId.length + " "}
            </div>

            <div style={divTwoStyle}>
              <button
                className="btn btn-default footer__button--green"
                style={buttonStyle}
                onClick={() => {
                  this.setState(
                    compose(
                      select.rows(row => row),
                      select.all
                    )(rows)
                  );
                }}
              >
                <i class="fa fa-check-circle-o" aria-hidden="true" />
                <div className="footer__button--off"> Select All </div>{" "}
              </button>

              <button
                className="btn btn-default footer__button--gray"
                style={buttonStyle}
                onClick={() => {
                  this.setState(
                    compose(
                      select.rows(row => !row),
                      select.none
                    )(rows)
                  );
                }}
              >
                <i class="fa fa-chain-broken" aria-hidden="true" />

                <div className="footer__button--off">Select None</div>
              </button>

              <button
                className="btn btn-default footer__button--orange"
                style={buttonStyle}
                onClick={this.onExpireAll}
              >
                <i class="fa fa-history" aria-hidden="true" />

                <div className="footer__button--off">Expire Selected </div>
              </button>

              <button
                className="btn btn-default footer__button--red"
                style={buttonStyle}
                onClick={() => {
                  this.setState(
                    compose(
                      select.rows(row => !row),
                      select.none
                    )(rows)
                  );
                }}
              >
                <i class="fa fa-times-circle-o" aria-hidden="true" />

                <div className="footer__button--off">Remove Selected</div>
              </button>
            </div>
          </tfoot>
        </Table.Provider>
      </div>
    );
  }

  onRow(row, { rowIndex }) {
    var archiveDownDayFormatted = moment(
      this.state.rows[rowIndex].page_archivedown,
      "M/D/YYYY h:mm:ss A"
    );

    var archiveDays = archiveDownDayFormatted
      .startOf("day")
      .diff(today.startOf("day"), "days");

    var textColor;
    var warningcolor;
    switch (true) {
      case archiveDays > 0:
        warningcolor = "inherit";
        break;
      case archiveDays <= 0 && archiveDays >= -5:
        warningcolor = "#FFFF66";
        break;
      case archiveDays <= -5 && archiveDays >= -10:
        warningcolor = "#fa6800";
        textColor = "white";
        break;
      case archiveDays <= -10:
        warningcolor = "#f44336";
        textColor = "white";
        break;
      default:
        warningcolor = "inherit";
        break;
    }

    return {
      style: { backgroundColor: warningcolor, color: textColor },

      className: classnames(row.selected && "selected-row"),
      onClick: () => this.onSelectRow(rowIndex)
    };
  }

  getAllExpired() {}

  onSelectRow(selectedRowIndex) {
    const { rows } = this.state;
    const selectedRowId = rows[selectedRowIndex].id_page;

    this.setState({
      rows: select.toggle(row => row.id_page === selectedRowId)(rows)
    });
  }

  getSelectedRowIndex(selectedRows) {
    return findIndex(this.state.rows, {
      id: selectedRows[0] && selectedRows[0].id_page
    });
  }

  onExpire(index, id, event) {
    const rows = cloneDeep(this.state.rows);
    const idx = findIndex(rows, { id });

    rows.splice(index, 1);
    this.setState({ rows });
    console.log(index);
    console.log(idx);
    console.log(id);

    $.ajax({
      data: { action: "expire", pages: [id] },
      type: "POST",
      dataType: "json",
      traditional: true
    });

    rows.splice(index, 1);
    this.setState({ rows });

    event.stopPropagation();
  }

  onExpireAll(index, id) {
    const rows = cloneDeep(this.state.rows);
    const idx = findIndex(rows, { id });

    var filteredTimeRow2 = rows.filter((x, i, arr) => {
      return (
        moment(x.page_archivedown, "M/D/YYYY h:mm:ss A")
          .startOf("day")
          .diff(today.startOf("day"), "days") <= 0 && x.id_page
      );
    });

    var filteredAllExpiredID2 = [];

    for (var key in filteredTimeRow2) {
      if (filteredTimeRow2.hasOwnProperty(key)) {
        filteredAllExpiredID2.push(filteredTimeRow2[key]["id_page"]);
      }
    }

    console.log(index);
    console.log(idx);
    console.log(id);
    console.log(filteredTimeRow2);
    console.log(filteredAllExpiredID2);

    $.ajax({
      data: { action: "expire", pages: filteredAllExpiredID2 },
      type: "POST",
      dataType: "json",
      traditional: true
    });

    rows.splice(0, filteredAllExpiredID2.length);
    this.setState({ rows });
  }

  onRemove(index, id) {
    const rows = cloneDeep(this.state.rows);
    const idx = findIndex(rows, { id });

    console.log(index);
    console.log(idx);
    console.log(id);

    $.ajax({
      data: { action: "remove", pages: [id] },
      type: "POST",
      dataType: "json",
      traditional: true
    });

    rows.splice(index, 1);

    this.setState({ rows });
  }
  onRemoveAll(index, id) {
    const rows = cloneDeep(this.state.rows);
    const idx = findIndex(rows, { id });

    console.log(index);
    console.log(idx);
    console.log(id);

    $.ajax({
      data: { action: "remove", pages: [id] },
      type: "POST",
      dataType: "json",
      traditional: true
    });

    rows.splice(index, 1);

    this.setState({ rows });
  }

  expireSelected(index, id) {
    const rows = cloneDeep(this.state.rows);
    const idx = findIndex(rows, { id });

    var filtered2 = rows.filter((x, i, arr) => {
      return x.selected && x.id_page;
    });

    var selectedId2 = [];

    for (var key in filtered2) {
      if (filtered2.hasOwnProperty(key)) {
        selectedId2.push(filtered2[key]["id_page"]);
      }
    }

    console.log(index);
    console.log(idx);
    console.log(id);
    console.log(filtered2);
    console.log(selectedId2);

    $.ajax({
      data: { action: "expire", pages: [id] },
      type: "POST",
      dataType: "json",
      traditional: true
    });

    rows.splice(index, 1);

    this.setState({ rows });
  }

  removeSelected(index, id) {
    const rows = cloneDeep(this.state.rows);
    const idx = findIndex(rows, { id });

    var filtered2 = rows.filter((x, i, arr) => {
      return x.selected && x.id_page;
    });

    var selectedId2 = [];

    for (var key in filtered2) {
      if (filtered2.hasOwnProperty(key)) {
        selectedId2.push(filtered2[key]["id_page"]);
      }
    }

    console.log(index);
    console.log(idx);
    console.log(id);
    console.log(filtered2);
    console.log(selectedId2);

    $.ajax({
      data: { action: "remove", pages: [id] },
      type: "POST",
      dataType: "json",
      traditional: true
    });

    rows.splice(index, 1);

    this.setState({ rows });
  }

  preventClickPropagation(e) {
    e.stopPropagation();
  }

  loadData() {
    $.ajax({
      data: { action: "load" },
      type: "POST",
      dataType: "json"
    }).done(rows => {
      this.setState({ rows });
    });

    console.log("state has been updated");
  }
}

var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("bottom-footer").style.display = "inherit";
  } else {
    document.getElementById("bottom-footer").style.display = "none";
  }
  prevScrollpos = currentScrollPos;
};

ReactDOM.render(<PersonList />, document.getElementById("root"));
