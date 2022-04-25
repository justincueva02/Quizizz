import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/firebase-config";

export const register =
  (email: string, password: string) => async (dispatch: any) => {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    localStorage.setItem("userId", user.user.uid);
    dispatch({ type: "SIGN_IN", payload: user.user.uid });
  };

export const login =
  (email: string, password: string) => async (dispatch: any) => {
    const user = await signInWithEmailAndPassword(auth, email, password);
    console.log("DISPATCHED");
    localStorage.setItem("userId", user.user.uid);
    dispatch({ type: "SIGN_IN", payload: user.user.uid });
  };

export const setLoggedIn = () => {
  const userId = localStorage.getItem("userId");
  return { type: "SIGN_IN", payload: userId };
};

export const logout = () => {
  localStorage.removeItem("userId");
  return { type: "LOGOUT" };
};

export const fetchUsersQuizizz = () => async (dispatch: any, getState: any) => {
  const isLoggedIn = getState().account.isLoggedIn;
  const userId = getState().account.userId;

  if (!isLoggedIn) {
    console.log("your not even logged in");
    return;
  }
  console.log("this should run FIRST");

  const response = await fetch(
    `https://quizizz-32675-default-rtdb.firebaseio.com/${userId}/myBuilds.json`
  );
  const data = await response.json();
  console.log("this should run SECOND");
  dispatch({ type: "GOT_USERS_QUIZIZZ", payload: data });
};

export const deleteAUsersQuiz =
  (quizId: string) => async (dispatch: any, getState: any) => {
    const userId = getState().account.userId;
    await fetch(
      `https://quizizz-32675-default-rtdb.firebaseio.com/${userId}/myBuilds/${quizId}.json`,
      { method: "DELETE" }
    );
    dispatch({ type: "DELETED_A_QUIZ", payload: quizId });
  };
