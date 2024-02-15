import express from 'express'
import cors from 'cors'
import pkg from 'mercadopago';

const { MercadoPagoConfig, Payment, Preference, MerchantOrder } = pkg;

const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-7864635266086541-021323-a9f1850992664647015525c939353fad-1670626191',
});

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Server funcionando correctamente')
})

const merchantOrder = new MerchantOrder(client);

app.post('/get_order_detail', (req, res) => {
  const { body } = req;
  merchantOrder.get({ merchantOrderId: body.order })
  .then(
    function (response) {
      console.log(response, 'response')
      res.status(201).json({
        order: response
      });
    }
  )
  .catch(
    function (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  );
})

const preference = new Preference(client);

app.post('/get_preference', (req, res) => {
  const { body } = req;
  
  preference.create({body})
  .then(
      function (response) {
        res.status(201).json({
          id: response.id
        });
      }
    )
    .catch(
      function (error) {
        console.log(error);
        const { errorMessage, errorStatus } = validateError(error);
        res.status(errorStatus).json({ error_message: errorMessage });
      }
    );
})

const payment = new Payment(client);

app.post("/process_payment", (req, res) => {
  const { body } = req;

  payment.create({ body })
    .then(
      function (response) {
        res.status(201).json({
          detail: response,
          status: response.status,
          id: response.id,
          authorization_code: response.authorization_code
        });
      }
    )
    .catch(
      function (error) {
        console.log(error);
        const { errorMessage, errorStatus } = validateError(error);
        res.status(errorStatus).json({ error_message: errorMessage });
      }
    );
});

function validateError(error) {
  let errorMessage = 'Unknown error cause';
  let errorStatus = 400;

  if (error.cause) {
    const sdkErrorMessage = error.cause[0];
    errorMessage = sdkErrorMessage || errorMessage;

    const sdkErrorStatus = error.status;
    errorStatus = sdkErrorStatus || errorStatus;
  }

  return { errorMessage, errorStatus };
}

app.listen(port, () => {
  console.log(`El servidor esta corriendo en el puerto ${port}`)
})