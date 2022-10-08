import React from "react";
import { circleColor, categories, categoryColors } from "../../constants.ts";
import { useEffect, useState } from "react";
import "../Stats/Stats.css";
import ExpenseService from "../../services/expense.service";
import { useAuth0 } from "@auth0/auth0-react";
import ReactApexChart from "react-apexcharts";

function Stats() {
  const [expenses, setExpenses] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const { user } = useAuth0();

  const fetchDataAPI = async () => {
    setSpinner(true);
    let allExpenses = [];
    const data = await ExpenseService.getAllExpenses(user);
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
      let temp = {
        name: category,
        value: getCategoryTotal(category),
      };
      allCategoryTotal.push(temp);
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
    let labels=[];
    let series=[];
    let colors=[];

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

  useEffect(() => {
    fetchDataAPI();
  }, []);

  return (
    <div className="container main">
      <div className="left mb-5 col-6">
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
      <div className="right mb-5 col-6">
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

        {categoryExpense().map((expense, index) => {
          return (
            <>
              <div className="progress mt-3">
                <div
                  className={`progress-bar ${circleColor[expense.name]}`}
                  role="progressbar"
                  style={{ width: `${calcPercent(expense.value)}%` }}
                ></div>
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
      </div>
    </div>
  );
}

export default Stats;
