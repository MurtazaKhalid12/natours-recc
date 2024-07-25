const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const hpp = require('hpp');
const helmet = require('helmet');
const app = express();
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');
app.set('view engine', 'pug');
const cookieParser = require('cookie-parser');
app.set('views', path.join(__dirname, 'views'));
// 1) GLOBAL MIDDLEWARES

// Set security HTTP headers
app.use(helmet());
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');

// app.use(
//   expressCspHeader({
//     directives: {
//       'default-src': [SELF],
//       'script-src': [SELF, INLINE, 'somehost.com'],
//       'style-src': [SELF, 'mystyles.net'],
//       'img-src': ['data:', 'images.com'],
//       'worker-src': [NONE],
//       'block-all-mixed-content': true,
//     },
//   }),
// );
// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(
  express.urlencoded({
    extended: true,
    limit: '10kb',
  }),
);
app.use(cookieParser());
app.use(express.json());

// Data sanitization against NOSQL query injection
app.use(mongoSanitize());

// Data sanitization agains XSS
app.use(xss());

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);
// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

app.use(helmet({ contentSecurityPolicy: false }));

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
