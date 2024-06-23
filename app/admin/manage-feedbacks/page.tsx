import Container from "@/app/components/Container";
import getCurrentUser from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";
import getReports from "@/actions/getReports";
import ManageFeedbacksClient from "./ManageFeedbacksClient";

const ManageFeedbacks = async () => {
  const feedbacks = await getReports();
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access denied" />;
  }

  return (
    <div className="pt-8">
      <Container>
        <ManageFeedbacksClient feedbacks={feedbacks} />
      </Container>
    </div>
  );
};

export default ManageFeedbacks;
