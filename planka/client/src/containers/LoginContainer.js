import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { authenticate, clearAuthenticateError, logout } from '../actions/entry';
import Login from '../components/Login';

const mapStateToProps = ({
  ui: {
    authenticateForm: { data: defaultData, isSubmitting, error },
  },
}) => ({
  defaultData,
  isSubmitting,
  error,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      onLogout: logout,
      onAuthenticate: authenticate,
      onMessageDismiss: clearAuthenticateError,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
