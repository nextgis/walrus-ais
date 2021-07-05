import { useEffect, useState } from 'react';

import Logo from '../images/warlus-logo-detail.svg';

import {
  Notification,
  Container,
  Progress,
  Columns,
  Heading,
  Button,
  Block,
  Form,
  Hero,
} from 'react-bulma-components';
import { useCookies } from 'react-cookie';
import { RMBR_KEY } from '../constants';
import connector from '../servises/connector';

interface LoginComponentProps {
  onLogin: () => void;
}

interface LoginFormProps {
  login: string;
  setLogin: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  rmbrLogin: boolean;
  setRmbrLogin: (val: boolean) => void;
  onEnterKeyDown: () => void;
}

interface ShowErrorProps {
  message: string;
}

function ShowError<Props extends ShowErrorProps = ShowErrorProps>(
  props: Props,
) {
  return (
    <Block style={{ padding: '1rem 0', lineHeight: '0' }}>
      <Notification color="danger">{props.message}</Notification>
    </Block>
  );
}

function LoginForm<Props extends LoginFormProps = LoginFormProps>({
  login,
  setLogin,
  password,
  setPassword,
  rmbrLogin,
  setRmbrLogin,
  onEnterKeyDown,
}: Props) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onEnterKeyDown();
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <Form.Field>
        <Form.Label>Логин</Form.Label>
        <Form.Control>
          <Form.Input
            type="login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Пользователь NextGIS Web"
            onKeyDown={handleKeyDown}
          />
        </Form.Control>
      </Form.Field>
      <Form.Field>
        <Form.Label>Пароль</Form.Label>
        <Form.Control>
          <Form.Input
            type="password"
            placeholder="*************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </Form.Control>
      </Form.Field>
      <Form.Field>
        <Form.Control>
          <Form.Checkbox
            checked={!rmbrLogin}
            onChange={(e) => setRmbrLogin(!e.target.checked)}
          >
            Не запоминать логин и пароль
          </Form.Checkbox>
        </Form.Control>
      </Form.Field>
    </form>
  );
}

export function LoginContainer<
  Props extends LoginComponentProps = LoginComponentProps,
>({ onLogin }: Props) {
  const [cookies, setCookies] = useCookies([RMBR_KEY]);
  const getFromMem = () => cookies[RMBR_KEY];
  let initLogin = '';
  let initPassword = '';
  const fromMem = getFromMem();
  if (fromMem) {
    initLogin = fromMem.login;
    initPassword = fromMem.password;
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [login, setLogin] = useState(initLogin);
  const [password, setPassword] = useState(initPassword);
  const [rmbrLogin, setRmbrLogin] = useState(true);

  const valid = () => !!(login && password);

  useEffect(() => {
    if (valid()) {
      makeLogin();
    }
  }, []);

  function makeLogin() {
    setLoading(true);
    const auth = { login, password };
    connector
      .login(auth)
      .then(() => {
        if (rmbrLogin) {
          setCookies(RMBR_KEY, JSON.stringify(auth));
        }
        onLogin();
      })
      .catch(() => {
        setError('Ошибка входа');
        setCookies(RMBR_KEY, '');
        setLoading(false);
      });
  }

  const formProps = {
    login,
    setLogin,
    password,
    setPassword,
    rmbrLogin,
    setRmbrLogin,
  };

  return (
    <Hero size="fullheight" color="primary">
      <Hero.Body>
        <Container>
          <Columns centered>
            <Columns.Column
              tablet={{ size: 5 }}
              desktop={{ size: 4 }}
              widescreen={{ size: 3 }}
            >
              <div
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  width: '40%',
                }}
              >
                <img src={Logo} style={{ height: '120px' }} />
              </div>
              <Heading>Warlus AIS</Heading>
              {getFromMem() ? (
                <Progress />
              ) : (
                <>
                  <LoginForm
                    {...formProps}
                    onEnterKeyDown={makeLogin}
                  ></LoginForm>
                  {error && <ShowError message={error}></ShowError>}
                  <Button.Group align="right" style={{ paddingTop: '.5rem' }}>
                    <Button
                      disabled={!valid()}
                      onClick={makeLogin}
                      loading={loading}
                    >
                      Войти
                    </Button>
                  </Button.Group>
                </>
              )}
            </Columns.Column>
          </Columns>
        </Container>
      </Hero.Body>
    </Hero>
  );
}
