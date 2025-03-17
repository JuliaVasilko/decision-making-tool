import { ErrorPage } from "./components/error-page/error-page";
import { HomePage } from "./components/home-page/home-page";
import { StartPage } from "./components/start-page/start-page";
import { Router } from "./router/Router";
import { decisionService } from "./services/decision.service";
import "./style.css";

const routes = {
  "/": (): HomePage => new HomePage(decisionService),
  "/start": (): StartPage => new StartPage(decisionService),
  "/404": (): ErrorPage => new ErrorPage(),
};

export const appRouter = new Router(routes, document.body);
