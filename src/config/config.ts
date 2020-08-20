import dotenv from 'dotenv';

dotenv.config();

const endpoint = process.env.ENDPOINT
const port = process.env.PORT

export { endpoint, port }

