import React from "react";
import { CSVLink } from "react-csv";
import "./ExportCSV.css";
function ExportCSV(props) {
  return (
    <button
      disabled={props.canDisable}
      className="btn btn-primary col-2 mb-1 report"
    >
      <CSVLink data={props.data} filename="expense_report">
        <span
          class="d-inline-block"
          tabindex="0"
          data-toggle="tooltip"
          title="Download current table data"
        >
          <i class="bi bi-file-earmark-arrow-down"></i> Report
        </span>
      </CSVLink>
    </button>
  );
}

export default ExportCSV;
