/**
 * 
 * @file initilize the express application
 * 
 */
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { MongoDBConnection } from "../commons/utils";
import config from "./appConfig";
import publicV1APIs from "./api/public";
import cors from "cors";
import passport from "passport";
import session  from "express-session";

export default class App {
  public app: express.Application;
  public port: number | string;
  public mongoDbConnection: MongoDBConnection;

  constructor(port: number | string) {
    this.app = express();
    this.port = port;
    this.mongoDbConnection = new MongoDBConnection(config.MONGO_URL);
    this.initializeMiddlewares();
    this.initializeAPIs();
  }

  public initializeAPIs(): void {
    this.app.use("/public", publicV1APIs);
  }


  public initializeMiddlewares(): void {
    this.app.use(session({secret: 'cat'}))
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(bodyParser.json());
    this.app.use(cors({
      origin: config
        .CORS_OPTIONS
        .WHITELISTDOMAINS
    }));
  }


  public connectToDataBases(): void {
    mongoose.connect(config.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err: any) => {
      if (err) {
        console.error("ERROR Connecting the database", JSON.stringify(err, null, 2));
      } else {
        console.info("\n*************MONGODB connected**************\n");
      }
    });
  }


  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Server Started At Port ${this.port}`);
    });
  }
}