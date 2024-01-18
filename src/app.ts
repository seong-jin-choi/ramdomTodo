import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import path from "path";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import csp from "./csp";
// import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";
import "./passport";
import { MONGO_URL_PROD } from "./db";
import apiRouter from "./routers/apiRouter";

const app = express();

app.use(csp);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: {
      policy: "same-origin-allow-popups",
    },
    referrerPolicy: {
      policy: ["no-referrer-when-downgrade"],
    },
  })
);
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/views"));
app.use("/", express.static(path.join(__dirname, "static")));
app.use(cookieParser());
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("dev"));
app.use(
  session({
    secret: `${process.env.COOKIE_SECRET}`,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: MONGO_URL_PROD }),
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// app.use(routes.home, globalRouter);
// app.use(routes.user, userRouter);
// app.use(routes.admin, adminRouter);
app.use("/api", apiRouter);
// app.use(routes.auth, authRouter);
app.use((_, res) => {
  // 404 처리 부분
  res.status(404).render("error/404");
});

export default app;
