import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import {
  Notification,
  Container,
  Columns,
  Heading,
  Button,
  Block,
  Form,
  Hero,
} from 'react-bulma-components';
import connector from '../servises/connector';

const RMBR_KEY = 'ngw-login';

interface LoginComponentProps {
  onLogin: () => void;
}

interface ShowErrorProps {
  message: string;
}

function ShowError<Props extends ShowErrorProps = ShowErrorProps>(
  props: Props,
) {
  return (
    <Block style={{ paddingBottom: '1rem' }}>
      <Notification color="danger">{props.message}</Notification>
    </Block>
  );
}

export function LoginContainer<
  Props extends LoginComponentProps = LoginComponentProps,
>({ onLogin }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [valid, setValid] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [rmbrLogin, setRmbrLogin] = useState(true);
  const [cookies, setCookies] = useCookies([RMBR_KEY]);

  useEffect(() => {
    setError('');
    setValid(!!(login && password));
  }, [login, password]);
  const auth = { login, password };
  const onLoginClick = () => {
    setLoading(true);
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
        setValid(false);
        setLoading(false);
      });
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
              <Heading>Warlus AIS</Heading>
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
                {error && <ShowError message={error}></ShowError>}
                <Button.Group align="right">
                  <Button
                    disabled={!valid}
                    onClick={onLoginClick}
                    loading={loading}
                  >
                    Войти
                  </Button>
                </Button.Group>
              </form>
            </Columns.Column>
          </Columns>
        </Container>
      </Hero.Body>
    </Hero>
  );
}
