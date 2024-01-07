import express from 'express'
import cors from 'cors'
import pkg from 'mercadopago';

const { MercadoPagoConfig, Preference } = pkg;

const client = new MercadoPagoConfig({ 
    accessToken: 'APP_USR-2926550097213535-092911-5eded40868803c83f12e9eef1afa99fa-1160956296',
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'
})

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server funcionando correctamente')
})

app.post('/create_preference', async (req, res) => {
    try {
        const body = {
            items: [
                {
                    title: req.body.title,
                    quantity: Number(req.body.quantity),
                    unit_price: Number(req.body.price),
                    currency_id: 'MXN'
                }
            ],
            back_urls: {
                success: 'https://checkoutpro-test.netlify.app/',
                failure: 'https://checkoutpro-test.netlify.app/',
                pending: 'https://checkoutpro-test.netlify.app/',
            },
            auto_return: 'approved',
            excluded_payment_methods: [
                {
                    id: "visa"
                },
                {
                    id: "debvisa"
                }
            ],
            "installments": 6
        }

        const preference = new Preference(client)
        const result = await preference.create({ body })

        res.json({
            id: result.id
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Error al crear preferencia'
        })
    }
})

const preference = new Preference(client);

preference.create({ body: {
	items: [
		{
			id: '<ID>',
			title: '<title>',
			quantity: 1,
			unit_price: 10000
		}
	],
} }).then(console.log).catch(console.log);

app.listen(port, () => {
    console.log(`El servidor esta corriendo en el puerto ${port}`)
})