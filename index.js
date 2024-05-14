require("dotenv").config();
const express = require("express");
const cors = require('cors')
const usersRouter = require('./controllers/user_controller')
const loginRouter = require('./controllers/login_controller')

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static('dist'))
app.use(express.json());
app.use(cors())

app.use('/login', loginRouter)
app.use('/api/users', usersRouter)

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
      return response.status(400).send({ error: "malformatted id" });
    }

    next(error);
};

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
