const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

//Pug setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(`${__dirname}/public`));

app.use(express.static(path.join(__dirname, 'public')));

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

// 1) MIDDLEWARES
// FIXME:
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
//   console.log(process.env.NODE_ENV);
// }

app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

//---ROUTES
app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'The Forest Hiker',
    user: 'Jonas',
  });
});

app.get('/overview', (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours',
  });
});

app.get('/tour', (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
  });
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
