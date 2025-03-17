import { Component } from "@/utils/component";
import { Dialog } from "../dialog.ts/dialog";
import type { DecisionService } from "@/services/decision.service";
import "./paste-dialog.css";

export class PasteDialog extends Dialog {
  private textarea: Component<HTMLTextAreaElement>;
  private placeholder = `
  Paste a list of new options in a CSV-like format:

  title,1                 -> | title                 | 1 |
  title with whitespace,2 -> | title with whitespace | 2 |
  title , with , commas,3 -> | title , with , commas | 3 |
  title with "quotes",4   -> | title with "quotes"   | 4 |
  `;
  constructor(private readonly decisionService: DecisionService) {
    super({ showOkBtn: true, showCancelBtn: true });
    this.textarea = new Component<HTMLTextAreaElement>({
      tag: "textarea",
    });
    this.textarea.setAttribute("placeholder", this.placeholder);
    this.textarea.setAttribute("rows", "10");
    this.contentCotainer.append(this.textarea);
  }

  public showModal(): Promise<boolean> {
    this.textarea.getNode().value = "";
    return super.showModal();
  }

  protected okBtnCallback(): void {
    this.decisionService.setDecisionListFromString(
      this.textarea.getNode().value
    );

    super.okBtnCallback();
  }
}
