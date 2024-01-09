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
                    id: req.body.id,
                    title: req.body.title,
                    quantity: Number(req.body.quantity),
                    unit_price: Number(req.body.price),
                    currency_id: 'MXN',
                    description: req.body.description,
                    picture_url: req.body.url,
                }
            ],
            back_urls: {
                success: 'https://checkoutpro-test.netlify.app/success/',
                failure: 'https://checkoutpro-test.netlify.app/failure/',
                pending: 'https://checkoutpro-test.netlify.app/pending/',
            },
            auto_return: 'approved',
            payment_methods: {
                excluded_payment_methods: [
                    {
                            id: "visa"
                    }
                ],
                installments:6,
            },
            payer: {
                phone: { area_code: '+52', number: '5554178003' },
                address: { zip_code: '16050', street_name: 'calle falsa', street_number: '123' },
                email: 'test_user_94708656@testuser.com',
                name: 'Lalo',
                surname: 'Landa',
            },
            external_reference: 'arturo.araujo.alvarez@gmail.com',
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
			unit_price: 100,
            description: '<description>',
            picture_url: 'url',
		}
	],
    payment_methods: {
        excluded_payment_methods: [
            {
                    id: "visa"
            }
        ],
        installments:6,
    },
    auto_return: 'approved',
    back_urls: {
        success: 'https://checkoutpro-test.netlify.app/success/',
        failure: 'https://checkoutpro-test.netlify.app/failure/',
        pending: 'https://checkoutpro-test.netlify.app/pending/',
    },
    payer: {
        phone: { area_code: '+52', number: '5554178003' },
        address: { zip_code: '16050', street_name: 'calle falsa', street_number: '123' },
        email: 'test_user_94708656@testuser.com',
        name: 'Lalo',
        surname: 'Landa',
    },
    external_reference: 'arturo.araujo.alvarez@gmail.com',
} }).then(console.log).catch(console.log);

app.listen(port, () => {
    console.log(`El servidor esta corriendo en el puerto ${port}`)
})