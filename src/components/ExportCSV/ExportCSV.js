import React from "react";
import { CSVLink, CSVDownload } from "react-csv";
import './ExportCSV.css'
function ExportCSV(props) {
    
  return (
    <button  disabled={props.canDisable} className="btn btn-primary col-2 mb-1">
      <CSVLink data={props.data} filename="expense_report">
      <i class="bi bi-file-earmark-arrow-down"></i> {" "}Report
      </CSVLink>
    </button>
  );
}

export default ExportCSV;
