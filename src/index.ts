import express from "express";
import config from "./config";
import logger from "./utils/logger";
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from "cors";
import requestLogger from "./middleware/requestlogger";
import routes from "./routes/index";
import { NextFunction, Request, Response } from "express";
import { HttpException } from "./utils/Exceptions/http/httpexceptions";
import{authenticate} from "./middleware/auth";
import cookieParser from "cookie-parser"

//app is the main express application where we will configure middlewares ,routes and error handlers

 const app= express();

 //config helmet
 //helmet adds many security headers to  HTTP responses so hackers can’t easily exploit  the app.
app.use(helmet());

 //config body parser
 //body will always be in json format
app.use(bodyParser.json());
// to support URL-encoded bodies 
app.use(bodyParser.urlencoded({extended:true}));

 //config cors
 // cors is the rule that controls who can call your API 
app.use(cors());

 //add middlewares
 /*middlewares are the “steps” that a request goes through before it reaches the final route handler 
  (like add order)and before the response goes back to the client.*/
app.use(requestLogger)

//user cookie parser
app.use(cookieParser())
 //config routes
 app.use('/',routes)
//config 404 handler
app.use((req,res)=>{
    res.status(404).json({message:"Resource not found"});
});
 //config error handler
 app.use((error:Error,req:Request,res:Response,next:NextFunction)=>{
if(error instanceof HttpException){
const httpexception= error as HttpException;
logger.error("%s[%d]\"%s\"%o",httpexception.name,httpexception.status,httpexception.message,httpexception.details||{})
res.status(httpexception.status).json({
  message:httpexception.message,
  details:httpexception.details ||undefined 
});
}else{
  logger.error("Unhandled  Error %s",error.message);
  res.status(500).json({
    message:"Internal Server Error"
  });
}
 });

  app.listen(config.port,() =>{
    logger.info("Server is runing on http://%s:%d",config.host ,config.port);
  });


