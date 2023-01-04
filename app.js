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
    console.log('User ist verifiziert, Daten wird an den Client gesendet');
    const { userName } = tokenDecoded;
    res.send({
      message:
        'Inhalt nur für eingeloggten User. Kommt von API, muss gefetcht werden. Frontend kennt das ohne Fetchen nicht!!!',
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: 'Nicht eingeloggt',
    });
  }
});

app.get('/checklogin', (req, res) => {
  try {
    const token = req.cookies.loginCookie;
    const tokenDecoded = jwt.verify(token, process.env.JWT || 'SecretJWTKey');
    console.log('Token im Cookie ist gültig. Der User ist eingeloggt');
    res.status(200).end();
  } catch (error) {
    res.status(401).end();
  }
});

app.listen(4000, () => console.log('Sever hört auf 4000'));
