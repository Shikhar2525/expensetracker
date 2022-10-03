import React from "react";
import { CSVLink, CSVDownload } from "react-csv";
import './ExportCSV.css'
function ExportCSV(props) {
    
  return (
    <button  disabled={props.canDisable} className="btn btn-primary col-2 mb-2">
      <CSVLink data={props.data} filename="expense_report">
        Report
      </CSVLink>
    </button>
  );
}

export default ExportCSV;
