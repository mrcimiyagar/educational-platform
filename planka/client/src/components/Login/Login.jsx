import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Form, Grid, Header, Message } from 'semantic-ui-react';
import { usePrevious } from '../../lib/hooks';
import { useForm } from '../../hooks';
import styles from './Login.module.scss';

let loaded = false;

const createMessage = (error) => {
  if (!error) {
    return error;
  }

  switch (error.message) {
    case 'Invalid email or username':
      return {
        type: 'error',
        content: 'common.invalidEmailOrUsername',
      };
    case 'Invalid password':
      return {
        type: 'error',
        content: 'common.invalidPassword',
      };
    case 'Failed to fetch':
      return {
        type: 'warning',
        content: 'common.noInternetConnection',
      };
    case 'Network request failed':
      return {
        type: 'warning',
        content: 'common.serverConnectionFailed',
      };
    default:
      return {
        type: 'warning',
        content: 'common.unknownError',
      };
  }
};

const Login = React.memo(
  ({ defaultData, isSubmitting, error, onAuthenticate, onMessageDismiss }) => {
    const [t] = useTranslation();
    const wasSubmitting = usePrevious(isSubmitting);

    const [data, setData] = useForm(() => ({
      emailOrUsername: '',
      password: '',
      ...defaultData,
    }));

    const message = useMemo(() => createMessage(error), [error]);

    const emailOrUsernameField = useRef(null);

    const handleSubmit = useCallback(() => {
      const cleanData = {
        ...data,
        emailOrUsername: data.emailOrUsername.trim(),
      };

      cleanData.emailOrUsername = 'demo@demo.demo';
      cleanData.password = 'demo';

      onAuthenticate(cleanData);
    }, [onAuthenticate, data]);

    useEffect(() => {
      if (wasSubmitting && !isSubmitting && error) {
        switch (error.message) {
          case 'Invalid email or username':
            emailOrUsernameField.current.select();

            break;
          case 'Invalid password':
            setData((prevData) => ({
              ...prevData,
              password: '',
            }));

            break;
          default:
        }
      }
    }, [isSubmitting, wasSubmitting, error, setData]);

    if (!loaded) {
      loaded = true;
      handleSubmit();
    }

    return (
      <div className={classNames(styles.wrapper, styles.fullHeight)}>
        <Grid verticalAlign="middle" className={styles.fullHeightPaddingFix}>
          <Grid.Column widescreen={4} largeScreen={5} computer={6} tablet={16} mobile={16}>
            <Grid verticalAlign="middle" className={styles.fullHeightPaddingFix}>
              <Grid.Column>
                <div className={styles.loginWrapper}>
                  <Header as="h1" textAlign="center" content="" className={styles.formTitle} />
                  <div>
                    {message && (
                      <Message
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...{
                          [message.type]: true,
                        }}
                        visible
                        content={t(message.content)}
                        onDismiss={onMessageDismiss}
                      />
                    )}
                    <Form size="large" onSubmit={handleSubmit}>
                      <Form.Button
                        primary
                        size="large"
                        icon="right arrow"
                        labelPosition="right"
                        content=""
                        floated="right"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        style={{ display: 'none' }}
                      />
                    </Form>
                  </div>
                </div>
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid>
      </div>
    );
  },
);

Login.propTypes = {
  defaultData: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  isSubmitting: PropTypes.bool.isRequired,
  error: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onAuthenticate: PropTypes.func.isRequired,
  onMessageDismiss: PropTypes.func.isRequired,
};

Login.defaultProps = {
  error: undefined,
};

export default Login;
