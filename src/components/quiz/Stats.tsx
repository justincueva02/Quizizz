import { connect, ConnectedProps } from "react-redux";
import { GiPauseButton, GiPlayButton } from "react-icons/gi";
import { RiFireFill } from "react-icons/ri";

import "../../styles/quiz/Stats.css";
import { Question } from "../../types";

interface RootState {
  quizQuestions: Question[];
}

const mapState = (state: RootState) => ({
  quizQuestions: state.quizQuestions,
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  questionNumber: number;
};

const Stats = ({ questionNumber, quizQuestions }: Props) => {
  const numberOfQuestions = quizQuestions.length;
  return (
    <div className="stats">
      <div className="icon--pause">
        <GiPauseButton />
      </div>
      <div className="question-number">
        {questionNumber}/{numberOfQuestions}
      </div>
      <div className="progressbar ">
        <div className="progress progress--2">
          <div className="icon--streak">
            <RiFireFill />5
          </div>
        </div>
      </div>
    </div>
  );
};

export default connector(Stats);
