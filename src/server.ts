import App from "./app";
import config from "./appConfig";


const app = new App(config.PORT);

app.listen();