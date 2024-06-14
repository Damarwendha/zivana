import Container from "../components/Container";
import FormWrap from "../components/FormWrap";
import FeedbackClient from "./_components/FeedbackClient";

function Feedback() {
  return (
    <div className="p-8">
      <Container>
        <FormWrap>
          <FeedbackClient />
        </FormWrap>
      </Container>
    </div>
  );
}

export default Feedback;
