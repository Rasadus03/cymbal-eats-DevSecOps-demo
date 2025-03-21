import Alert from 'react-bootstrap/Alert';
import PropTypes from 'prop-types';


function Warning({customer}) {
  if (customer !== undefined){
    if (customer.get("email") === "None") {
    return (
        <Alert variant="warning"  dismissible>
          <Alert.Heading>Oh snap! You are not logged in!</Alert.Heading>
          <p>
            Please Sign In to be able to use our cool application.
          </p>
        </Alert>
    );
  }
  }
  return "";
}
Alert.propTypes = {
  customer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    photoURL: PropTypes.string.isRequired,
  }).isRequired};

export default Warning;