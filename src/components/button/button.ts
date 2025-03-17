import { Component } from "@/utils/component";
import "./button.css";
interface ButtonProbs {
  className?: string;
  text: string;
  callback?: (event?: Event) => void;
}

export class Button extends Component<HTMLInputElement> {
  constructor(probs: ButtonProbs) {
    super({ tag: "button", className: probs.className, text: probs.text });

    if (probs.callback) {
      this.addListener("click", event => probs.callback!(event!));
    }
  }

  public setDisabled(disabled: boolean): void {
    super.setDisabled(disabled);

    this.getNode().disabled = this.getDisabled();
  }
}
