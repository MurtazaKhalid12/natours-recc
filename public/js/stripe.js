import axios from 'axios';
import { showAlert } from './alerts';
import Stripe from 'stripe';

const stripe = Stripe(
  'pk_test_51Pfkv7I93a6lWNGayERTReN40yXTSR4JzIwGBvckoguGPcNyBBQ5SfVet43dmV8G1QTDT6hs8XNa3EdVmuVi9S3Q00juPhu7p9',
);
// import axios from 'axios';
// import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    // 1) Get the payment link from API
    const response = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    const paymentLink = response.data.session.url;

    // 2) Redirect to the Stripe payment link
    window.location.href = paymentLink;
  } catch (err) {
    console.log(err);
    showAlert(
      'error',
      'An error occurred while redirecting to the payment page.',
    );
  }
};
