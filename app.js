import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.get('/demo', (req, res) => {
  const einTag = 1000 * 60 * 60 * 24;
  const eineStunde = 1000 * 60 * 60;
  const zehnSekunden = 1000 * 10;
  const eineMinute = 1000 * 60;
  res.cookie('meinCookie', 'Das hier ist ein Text im Cookie', {
    maxAge: eineStunde,
    httpOnly: true,
  });
  res.send('Du hast eine Cookie!');
});

app.get('/mitcookie', (req, res) => {
  console.log('Hier ist das Cookie:', req.cookies);
  res.send('Mit Cookie');
});

app.post('/login', (req, res) => {
  const userName = req.body.userName;
  const token = jwt.sign({ userName }, process.env.JWT || 'SecretJWTKey', {
    expiresIn: '1d',
  });
  const einTag = 1000 * 60 * 60 * 24;
  res
    .cookie('loginCookie', token, {
      maxAge: einTag,
      httpOnly: true,
    })
    .send({
      auth: 'eingeloggt',
      userName: userName,
      // token,
    });
});

app.get('/nurEingeloggt', (req, res) => {
  try {
    // token in headers
    // const token = req.headers.authorization.split(' ')[1];
    // token in cookie
    const token = req.cookies.loginCookie;
    console.log(token);
    const tokenDecoded = jwt.verify(token, process.env.JWT || 'SecretJWTKey');
    console.log({ tokenDecoded });
    const { userName } = tokenDecoded;
    res.send({
      message: 'Inhalt nur für eingeloggten User',
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: 'Nicht eingeloggt',
    });
  }
});

app.listen(4000, () => console.log('Sever hört auf 4000'));
