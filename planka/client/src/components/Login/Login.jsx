import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Grid, Header } from 'semantic-ui-react';
import styles from './Login.module.scss';

let username;
let password;

const Login = React.memo(({ onAuthenticate }) => {
  localStorage.removeItem('accessToken');

  const handleSubmit = useCallback(() => {
    const cleanData = {};

    cleanData.emailOrUsername = username;
    cleanData.password = password;

    onAuthenticate(cleanData);
  }, [onAuthenticate]);

  window.onmessage = (e) => {
    if (e.data.sender === 'main') {
      if (e.data.action === 'init') {
        username = e.data.username;
        password = e.data.password;
        handleSubmit();
      }
    }
  };

  return (
    <div className={classNames(styles.wrapper, styles.fullHeight)}>
      <Grid verticalAlign="middle" className={styles.fullHeightPaddingFix}>
        <Grid.Column widescreen={4} largeScreen={5} computer={6} tablet={16} mobile={16}>
          <Grid verticalAlign="middle" className={styles.fullHeightPaddingFix}>
            <Grid.Column>
              <div className={styles.loginWrapper}>
                <Header as="h1" textAlign="center" content="" className={styles.formTitle} />
              </div>
            </Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid>
    </div>
  );
});

Login.propTypes = {
  onAuthenticate: PropTypes.func.isRequired,
};

export default Login;
