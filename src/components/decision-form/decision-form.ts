import { Component } from "@/utils/component";
import { Button } from "../button/button";
import { Input, Label } from "../input/input";
import { Link } from "../link/link";
import "./decision-form.css";

export class DecisionForm extends Component<HTMLFormElement> {
  private timeInput: Input;
  private sound = true;
  constructor() {
    super({ tag: "form", className: "form" });

    this.timeInput = new Input({
      type: "number",
      id: "seconds",
      name: "time",
      value: "5",
      validators: [
        { name: "required", value: "true" },
        { name: "min", value: "5" },
      ],
    });

    this.timeInput.addListener("input", this.setValidity.bind(this));

    const children = [
      new Link({
        className: "short-btn",
        text: "Back",
        url: "",
      }),
      new Button({
        className: "short-btn",
        text: "Sound",
        callback: this.toggleSound.bind(this),
      }),
      new Label("Time", "seconds"),
      this.timeInput,
      new Button({
        className: "middle-btn",
        text: "Play",
      }),
    ];

    this.appendChildren(children);
  }

  public submitForm(event: Event): {
    value: string;
    sound: boolean;
    isValid: boolean;
  } {
    event.preventDefault();
    const input = this.timeInput.getNode() as HTMLInputElement;

    if (input.validity.valueMissing) {
      input.setCustomValidity("This field is required.");
    } else if (input.validity.rangeUnderflow) {
      input.setCustomValidity("The number must be at least 5.");
    }

    input.reportValidity();

    return {
      value: input.value,
      sound: this.sound,
      isValid: (this.getNode() as HTMLFormElement).checkValidity(),
    };
  }

  public setDisabled(disabled: boolean): void {
    super.setDisabled(disabled);
    this.getChildren().forEach(child => child.setDisabled(this.getDisabled()));

    if (this.getDisabled()) {
      this.addClass("disabled");
    } else {
      this.removeClass("disabled");
    }
  }

  private setValidity(event?: Event): void {
    const input = event?.target as HTMLInputElement;
    input.setCustomValidity("");
  }

  private toggleSound(event?: Event): void {
    event?.preventDefault();
    this.sound = !this.sound;
    (event!.target as HTMLButtonElement).classList.toggle("active");
  }
}
