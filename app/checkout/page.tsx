import Container from "../components/Container";
import FormWrap from "../components/FormWrap";
import CheckoutClient from "./_components/CheckoutClient";

const Checkout = () => {
  return (
    <div className="p-8">
      <Container>
        <FormWrap>
          <CheckoutClient />
        </FormWrap>
      </Container>
    </div>
  );
};

export default Checkout;
