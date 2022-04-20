import { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GiPauseButton } from "react-icons/gi";
import { RiFireFill } from "react-icons/ri";

import "../../styles/quiz/Stats.css";
import { Question } from "../../types";
import { setQuestionsAreLoaded } from "../../actions/quizTimerActions";
import PauseModal from "./PauseModal";
import { setQuizIsPaused } from "../../actions/quizTimerActions";

const Stats = ({
  questionNumber,
  quizQuestions,
  streak,
  isShowingResults,
  quizTimer,
  setQuizIsPaused,
  setQuestionNumber,
  setQuestionsAreLoaded,
}: Props) => {
  const [timeLeft, setTimeLeft] = useState(1000);
  const numberOfQuestions = quizQuestions.length;
  const isLastQuestion = quizQuestions.length === questionNumber;
  const navigate = useNavigate();

  useEffect(() => {
    setQuestionsAreLoaded(false);
  }, []);

  useEffect(() => {
    if (
      isShowingResults ||
      !quizTimer.questionsAreLoaded ||
      quizTimer.quizIsPaused
    ) {
    } else if (timeLeft > 1) {
      setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 10);
      // when time runs out
    } else {
      if (!isLastQuestion) {
        // when time runs out but not on the last question
        setQuestionNumber((prev) => prev + 1);
        setTimeLeft(1000);
        // resetStreak();
      } else {
        // when the time runs out on the last question
        navigate("/summary");
      }
    }
  }, [
    timeLeft,
    isShowingResults,
    quizTimer.questionsAreLoaded,
    quizTimer.quizIsPaused,
  ]);

  useEffect(() => {
    setTimeLeft(1000);
  }, [questionNumber]);

  const element = document.querySelector("#pausing-modal");

  return (
    <div className="stats">
      {element !== null && quizTimer.quizIsPaused && (
        <PauseModal
          questionNumber={questionNumber}
          setQuizIsPaused={setQuizIsPaused}
          element={element}
        />
      )}
      <div className="stats--top">
        <div className="timer-bar">
          <div
            className="time-left"
            style={{ width: `${timeLeft / 10}%` }}
          ></div>
        </div>
      </div>
      <div className="stats--bottom">
        <div className="icon--pause" onClick={() => setQuizIsPaused(true)}>
          <GiPauseButton />
        </div>
        <div className="question-number">
          {questionNumber}/{numberOfQuestions}
        </div>
        <div className="progressbar ">
          <div
            className="progress"
            style={{
              width: `${
                (Number(streak) / Number(quizQuestions.length)) * 100
              }%`,
            }}
          >
            <div className={`icon--streak ${streak ? "on-a-streak" : ""}`}>
              <RiFireFill />
              {streak}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RootState {
  quizQuestions: Question[];
  quizStats: {
    score: number;
    streak: number;
  };
  quizTimer: {
    quizIsPaused: boolean;
    questionsAreLoaded: boolean;
    isShowingResults: boolean;
  };
}

const mapState = (state: RootState) => ({
  quizQuestions: state.quizQuestions,
  streak: state.quizStats.streak,
  isShowingResults: state.quizTimer.isShowingResults,
  quizTimer: state.quizTimer,
});

const connector = connect(mapState, {
  setQuizIsPaused,
  setQuestionsAreLoaded,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  questionNumber: number;
  setQuestionNumber: React.Dispatch<React.SetStateAction<number>>;
};

export default connector(Stats);
