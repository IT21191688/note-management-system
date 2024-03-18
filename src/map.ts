import NoteRouter from "./routes/note-route";
import UserRouter from "./routes/user-route";
import constants from "./utills/constants";

const requestMappings = (app: any) => {
  app.use(constants.API.PREFIX.concat("/user"), UserRouter);
  app.use(constants.API.PREFIX.concat("/note"), NoteRouter);
};

export default requestMappings;
