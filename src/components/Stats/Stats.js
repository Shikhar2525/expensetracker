import React from "react";
import { circleColor, categories, categoryColors } from "../../constants.ts";
import { useEffect, useState } from "react";
import "../Stats/Stats.css";
import ExpenseService from "../../services/expense.service";
import { useAuth0 } from "@auth0/auth0-react";
import ReactApexChart from "react-apexcharts";
import Modal from "../Modal/Modal";
import { priceWithComma, totalExpense } from "../ManageExpense/ManageExpense";

function Stats() {
  const [expenses, setExpenses] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const { user } = useAuth0();
  const [filterValues, setFilterValues] = useState();

  const fetchDataAPI = async (mode) => {
    setSpinner(true);
    let allExpenses = [];
    const data = await ExpenseService.getAllExpenses(
      user,
      mode === "INITIAL" ? null : filterValues
    );
    const json = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    for (let key in json) {
      allExpenses.push(json[key]);
    }
    allExpenses.forEach((value, index) => {
      allExpenses[index].date = new Date(allExpenses[index].date);
    });
    setExpenses(allExpenses);
    setSpinner(false);
  };

  const getCategoryTotal = (category) => {
    let total = 0;
    expenses.forEach((expense) => {
      if (expense.category === category) {
        total = total + parseInt(expense.price);
      }
    });
    return total;
  };
  const categoryExpense = () => {
    let allCategoryTotal = [];
    categories.forEach((category) => {
      if (getCategoryTotal(category) !== 0) {
        let temp = {
          name: category,
          value: getCategoryTotal(category),
        };
        allCategoryTotal.push(temp);
      }
    });
    return allCategoryTotal;
  };

  const calcPercent = (value) => {
    let total = 0;
    categoryExpense().forEach((expense) => {
      total = total + expense.value;
    });
    return (value * 100) / total;
  };

  const getChartData = () => {
    let labels = [];
    let series = [];
    let colors = [];

    categoryExpense().forEach((pair, index) => {
      if (pair.value !== 0) {
        labels.push(pair.name);
        series.push(pair.value);
        colors.push(categoryColors[pair.name]);
      }
    });
    return { label: labels, series: series, colors: colors };
  };

  const chartData = {
    series: getChartData().series,
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      colors: getChartData().colors,
      labels: getChartData().label,
      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  const getFilterValues = (valueObj) => {
    setFilterValues({
      category: valueObj.category,
      date: valueObj.startDate,
    });
  };

  useEffect(() => {
    fetchDataAPI("INITIAL");
  }, []);

  useEffect(() => {
    fetchDataAPI();
  }, [filterValues]);

  return (
    <div className="mainParent">
      <hr className="container" />
      <div className="container filterButtons">
        <div className="leftSideButtons">
          <div class="dropdown quick">
            <button
              class="btn btn-warning dropdown-toggle"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Quick Filters{" "}
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li
                onClick={() =>
                  setFilterValues({ date: new Date(), category: null })
                }
              >
                <p class="dropdown-item">This Month</p>
              </li>
              <li
                onClick={() =>
                  setFilterValues({
                    date: null,
                    category: null,
                    thisYear: true,
                  })
                }
              >
                <p class="dropdown-item">This Year</p>
              </li>
            </ul>
          </div>
          <div class="vr"></div>
          <button
            type="button"
            class="btn btn-primary filterButton "
            data-bs-toggle="modal"
            data-bs-target={`#filterModal`}
          >
            <i class="bi bi-funnel"></i> Filter
          </button>
          <div class="vr"></div>
          <button
            type="button"
            class="btn btn-danger menuButtons filterButton"
            onClick={() => {
              setFilterValues(null);
            }}
            disabled={!filterValues}
          >
            Remove Filters
          </button>
        </div>
        <div className="rightSideButtons filterButton">
          <button type="button" class="btn  btn-dark  total">
            Total
            <span class="badge bg-secondary ">
              {priceWithComma(totalExpense(expenses))} Rs
            </span>
          </button>
        </div>
      </div>
      <hr className="container" />
      {filterValues && (
        <>
          <div
            class="container alert alert-primary col-12  filterApplied"
            role="alert"
          >
            Filter applied on{" "}
            <u>
              {filterValues?.date?.toString() || filterValues?.thisYear
                ? "Date"
                : ""}
              {filterValues?.date?.toString() && filterValues?.category
                ? " & "
                : ""}
              {filterValues?.category
                ? `Category: ${filterValues?.category}`
                : ""}
            </u>
          </div>
          <hr className="container" />
        </>
      )}
      <div className="container main3">
        <div className="left mb-5 col-7">
          <div className="head1 ">
            <h2>Grpahical Representation</h2>
            {spinner ? (
              <div class="spinner-border mt-1" role="status">
                <span class="sr-only"></span>
              </div>
            ) : (
              ""
            )}
          </div>
          {chartData.series.length ? (
            <ReactApexChart
              options={chartData.options}
              series={chartData.series}
              type="pie"
              width={600}
              className="mt-3 graph mb-3"
            />
          ) : (
            <div class="alert alert-danger col-10 mt-3" role="alert">
              No Data Available.
            </div>
          )}
        </div>
        <div className="right mb-5 col-5">
          <div className="head">
            <h2>Statistics</h2>
            {spinner ? (
              <div class="spinner-border mt-1" role="status">
                <span class="sr-only"></span>
              </div>
            ) : (
              ""
            )}
          </div>
          {categoryExpense().length < 1 ? (
            <div
              class="container-fluid alert alert-danger col-12 mt-3"
              role="alert"
            >
              No Data Available.
            </div>
          ) : (
            <>
              {categoryExpense().map((expense, index) => {
                return (
                  <>
                    <div className="progress mt-3">
                      <div
                        className={`progress-bar ${circleColor[expense.name]}`}
                        role="progressbar"
                        style={{ width: `${calcPercent(expense.value) | ""}%` }}
                      >
                        {priceWithComma(expense.value)} Rs
                      </div>
                    </div>
                    <label
                      className={`${
                        categoryExpense().length - 1 === index ? "mb-5" : ""
                      }`}
                    >
                      {expense.name}{" "}
                      {Math.round(calcPercent(expense.value) * 10) / 10 || "0"}%
                    </label>
                  </>
                );
              })}
            </>
          )}
        </div>
      </div>
      <Modal
        id="filterModal"
        type="Filter"
        sendFilterValues={(value) => getFilterValues(value)}
      />
    </div>
  );
}

export default Stats;
