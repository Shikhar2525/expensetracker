import React from "react";
import "./Card.css";
import Modal from "../Modal/Modal";
import { categoriesIcon, iconColors } from "../../constants.ts";
function Card(props) {
  return (
    <>
      <div class="card mt-3 mb-3 col-10">
        <div class="card-body">
          <div class="d-flex flex-column flex-lg-row">
            <div className="iconDiv">
              <span
                class={`${categoriesIcon[props.expense.category]} ${
                  iconColors[props.expense.category]
                } icon`}
              ></span>
            </div>
            <div class="row flex-fill">
              <div class="col-sm-5">
                <div className="cardName">
                  <h4 class="h5">{props.expense.name}</h4>
                  {props.index === 0 && (
                    <h6>
                      <span class="badge bg-danger new mt-1">New</span>
                    </h6>
                  )}
                </div>
                <span class="badge bg-secondary">{props.expense.category}</span>
                <span class="badge bg-success">{props.expense.dateString}</span>
                {props.expense.isEdited && (
                  <span class="badge bg-primary mt-1">Edited</span>
                )}
              </div>
              <div class="col-sm-4 py-2">
                <span class="badge bg-secondary">{props.expense.price} Rs</span>
              </div>
              <div class="col-sm-3 text-lg-end buttons">
                <h5>
                  <i
                    type="button"
                    class="bi bi-pencil-square mt-4"
                    data-bs-toggle="modal"
                    data-bs-target={`#A${props.expense.id}Edit`}
                  ></i>
                </h5>

                <button
                  type="button"
                  class="btn-close mt-4"
                  data-bs-toggle="modal"
                  data-bs-target={`#A${props.expense.id}Delete`}
                  aria-label="Close"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        id={`A${props.expense.id}Delete`}
        idToDelete={props.expense.id}
        name={props.expense.name}
        type="Delete"
        refreshList={(value) => props.setRefreshList(value)}
      />
      <Modal
        id={`A${props.expense.id}Edit`}
        idToEdit={props.expense.id}
        name={props.expense.name}
        expense={props.expense}
        type="Edit"
        refreshList={(value) => props.setRefreshList(value)}
      />
    </>
  );
}

export default Card;
