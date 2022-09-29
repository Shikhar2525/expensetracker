import { db } from "../firebase";
import {
  collection,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const expenseRef = collection(db, "allexpenses");
class ExpenseService {
  addExpense = (newExpense) => {
    return addDoc(expenseRef, newExpense);
  };
  getAllExpenses = () => {
    return getDocs(expenseRef);
  };
  deleteExpense = (id) => {
    const expense = doc(db, "allexpenses", id);
    return deleteDoc(expense);
  };
}
export default new ExpenseService();
