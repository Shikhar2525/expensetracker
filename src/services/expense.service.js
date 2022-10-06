import { db } from "../firebase";
import {
  collection,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  where,
  query,
  Query,
} from "firebase/firestore";
import { useAuth0 } from "@auth0/auth0-react";

const expenseRef = collection(db, "allexpenses");

class ExpenseService {
  addExpense = (newExpense) => {
    return addDoc(expenseRef, newExpense);
  };
  getAllExpenses = (user, filterValues) => {
    const email = where("user", "==", user.email);
    const month = where("month", "==", new Date(filterValues?.date).getMonth());
    const year = where("year", "==", new Date(filterValues?.date).getFullYear());
    const thisYear = where("year", "==", new Date().getFullYear());
    const category = where("category", "==", filterValues?.category);
    let queryRef = query(
      expenseRef,
      email,
      filterValues?.date ? month : email,
      filterValues?.date ? year : email,
      filterValues?.category ? category : email,
      filterValues?.thisYear ? thisYear :email
    );

    return getDocs(queryRef);
  };
  deleteExpense = (id) => {
    const expense = doc(db, "allexpenses", id);
    return deleteDoc(expense);
  };
}
export default new ExpenseService();
