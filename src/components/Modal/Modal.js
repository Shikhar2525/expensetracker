import React from "react";
import ExpenseService from "../../services/expense.service";
import { useState } from "react";
import { categories } from "../../constants.ts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Modal(props) {
  const [spinner, setSpinner] = useState(false);
  const [category, setCategory] = useState();
  const deleteExpense = async (idToDelete) => {
    setSpinner(true);
    await ExpenseService.deleteExpense(idToDelete);
    document.getElementById("deleteClose").click();
    setSpinner(false);
    props.refreshList(true);
  };
  const [startDate, setStartDate] = useState();

  const handleClick = () => {
    props.sendFilterValues({category,startDate});
    document.getElementById("filterCLose").click();
    document.getElementsByClassName(".modal-backdrop").remove();
  };
  const handleChangeDropdown = (e) => {
    setCategory(e.target.value);
  };

  return (
    <>
      {props.type === "Delete" ? (
        <div
          class="modal fade"
          id={props.id}
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                  {props.type} <b>{props.name}</b>
                  {spinner ? (
                    <div class="spinner-border spinner-border-sm" role="status">
                      <span class="sr-only"></span>
                    </div>
                  ) : (
                    ""
                  )}
                </h5>
                <button
                  id="deleteClose"
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                Are you sure ? You want to delete <b>{props.name}</b>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  class="btn btn-danger"
                  onClick={() => {
                    deleteExpense(props.idToDelete);
                    props.refreshList(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : props.type === "Edit" ? (
        <div
          class="modal fade"
          id={props.id}
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                  {props.type} {props.name}
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body"></div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" class="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          class="modal fade"
          id={props.id}
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                  {props.type}
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <form className="">
                  <div class="form-group ">
                    <label>Category</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      id="category"
                      onChange={handleChangeDropdown}
                      required
                    >
                      <option value="">Select Category </option>
                      {categories.map((category) => {
                        return <option value={category}>{category}</option>;
                      })}
                    </select>
                  </div>
                  <div class="form-group mt-3">
                    <label>Date</label>
                    <DatePicker
                      type="date"
                      className="form-control"
                      dateFormat="MMMM yyyy"
                      showMonthYearPicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                    />
                  </div>
                  <div class="form-group mt-1">
                    <button type="button" className="btn" onClick={()=>setStartDate(null)}>Reset date</button>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button
                  id="filterCLose"
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  onClick={() => handleClick()}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;
