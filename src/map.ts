import UserRouter from "./routes/user-route";
import constants from "./utills/constants";

const requestMappings = (app: any) => {
  app.use(constants.API.PREFIX.concat("/user"), UserRouter);
};

export default requestMappings;
