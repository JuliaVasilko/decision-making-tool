import { Component } from "@/utils/component";
import { Link } from "../link/link";

export class ErrorPage extends Component {
  constructor() {
    super({ className: "error-page" }, [
      new Component({ tag: "h1", text: "Page not found" }),
      new Link({ text: "Back to main page", url: "", className: "long-link" }),
    ]);
  }
}
