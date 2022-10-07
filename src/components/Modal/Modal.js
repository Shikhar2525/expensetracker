import React from "react";
import ExpenseService from "../../services/expense.service";
import { useState } from "react";
import { categories } from "../../constants.ts";
import DatePicker from "react-datepicker";
import "./Modal.css";
import "react-datepicker/dist/react-datepicker.css";

function Modal(props) {
  const [spinner, setSpinner] = useState(false);
  const [spinner2, setSpinner2] = useState(false);
  const [category, setCategory] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [newName, setNewName] = useState(props.expense?.name);
  const [newPrice, setNewPrice] = useState(props.expense?.price);
  const [newCategory, setNewCategory] = useState(props.expense?.category);

  const removeBackDropModal = () => {
    let elements = document.getElementsByClassName("modal-backdrop");
    var arr = [...elements];
    arr.forEach((value) => {
      value.style.display = "none";
    });
  };
  const deleteExpense = async (idToDelete) => {
    setSpinner(true);
    await ExpenseService.deleteExpense(idToDelete);
    document.getElementById("deleteClose").click();
    setSpinner(false);
    removeBackDropModal();
    props.refreshList(true);
  };

  const handleEditExpense = async (idToEdit) => {
    setSpinner2(true);
    let newExpense = {
      name: newName,
      price: newPrice,
      category: newCategory,
      isEdited: true,
      editDate: new Date(),
    };
    await ExpenseService.updateExpense(idToEdit, newExpense);
    setSpinner2(false);
    removeBackDropModal();
    props.refreshList(true);
  };

  const handleClick = () => {
    props.sendFilterValues({ category, startDate });
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditExpense(props.idToEdit);
              props.refreshList(false);
            }}
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">
                    {props.type} {props.name}
                    {spinner2 ? (
                      <div
                        class="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span class="sr-only"></span>
                      </div>
                    ) : (
                      ""
                    )}
                  </h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <div class="alert alert-warning" role="alert">
                    Date cannot be changed.
                  </div>

                  <div className="form-group">
                    <label for="Price">New Expense Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="ExpenseName1"
                      aria-describedby="ExpenseName"
                      placeholder="Expense Name"
                      defaultValue={newName}
                      onBlur={() => {
                        setNewName(
                          document.getElementById("ExpenseName1").value
                        );
                      }}
                      required
                    />
                  </div>
                  <div class="form-group mt-3">
                    <label for="Price">New Price (Rs)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="Price1"
                      aria-describedby="Price"
                      placeholder="Amount in rupee"
                      defaultValue={newPrice}
                      onBlur={() => {
                        setNewPrice(document.getElementById("Price1").value);
                      }}
                      required
                    />
                  </div>
                  <div class="form-group mt-3 ">
                    <label>New Category</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      id="category1"
                      defaultValue={newCategory}
                      onBlur={() => {
                        setNewCategory(
                          document.getElementById("category1").value
                        );
                      }}
                      required
                    >
                      <option value="">Select Category </option>
                      {categories.map((category) => {
                        return <option value={category}>{category}</option>;
                      })}
                    </select>
                  </div>

                  <div class="form-group mt-1"></div>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                    id="editClose"
                  >
                    Close
                  </button>
                  <button type="submit" class="btn btn-success">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </form>
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
                    <p
                      type="button"
                      className="resetDate"
                      onClick={() => setStartDate(null)}
                    >
                      Reset date
                    </p>
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
