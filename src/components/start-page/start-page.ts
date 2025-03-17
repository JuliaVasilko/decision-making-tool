import { Component } from "@/utils/component";
import type { DecisionService } from "@/services/decision.service";
import { DecisionForm } from "../decision-form/decision-form";
import { Diagramm } from "../diagramm/diagramm";
import "./start-page.css";
import audio from "@/assets/zvuk-tadam-i-aplodismenty.mp3";

export class StartPage extends Component {
  private diagrammComponent: Diagramm;
  private decisionForm: DecisionForm;
  private winnerNameComponent: Component;
  private defaultWinnerText = "The winner is: ";

  constructor(private readonly decisionService: DecisionService) {
    super({ tag: "main", className: "startpage" });

    this.diagrammComponent = new Diagramm(this.decisionService);
    this.decisionForm = new DecisionForm();
    this.decisionForm.addListener("submit", event =>
      this.chooseDecision(event!)
    );
    this.winnerNameComponent = new Component({
      tag: "p",
      className: "winner-name",
      text: this.defaultWinnerText,
    });

    this.appendChildren([
      new Component({
        tag: "h1",
        className: "title",
        text: "Decision Making Tool",
      }),
      this.decisionForm,
      this.winnerNameComponent,
      new Component({
        tag: "h2",
        className: "h2",
        text: "Press Start Button",
      }),
      new Component({ className: "canvas-wrapper" }, [this.diagrammComponent]),
    ]);
  }

  public async chooseDecision(event: Event): Promise<void> {
    const { value, isValid, sound } = this.decisionForm.submitForm(event);
    this.winnerNameComponent.setTextContent(this.defaultWinnerText);

    if (isValid) {
      this.decisionForm.setDisabled(true);
      try {
        const winner = await this.diagrammComponent.spinWheel(
          Number(value) * 1000
        );

        this.decisionForm.setDisabled(false);

        if (sound) {
          this.playMusic();
        }

        this.winnerNameComponent.setTextContent(
          this.defaultWinnerText + winner
        );
      } catch (error) {
        console.log(error);
      }
    }
  }

  private playMusic(): void {
    const audioElement = new Audio(audio);
    audioElement.addEventListener("canplaythrough", () => {
      audioElement.play().then(() => audioElement.remove());
    });
  }
}
