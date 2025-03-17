import { Component } from "@/utils/component";
import { DecisionList } from "../decision-list/decision-list";
import { Button } from "../button/button";
import type { DecisionService } from "@/services/decision.service";
import { Link } from "../link/link";
import { Dialog } from "../dialog.ts/dialog";
import { PasteDialog } from "../paste-dialog/paste-dialog";
import "./home-page.css";

export class HomePage extends Component {
  private decisionListComponent: DecisionList;
  private goToStartPageLink: Link;
  private validationDialog: Dialog;
  private pasteDialog: PasteDialog;

  constructor(private readonly decisionService: DecisionService) {
    super({ tag: "main", className: "homepage" });

    this.decisionListComponent = new DecisionList(this.decisionService);
    this.goToStartPageLink = new Link({
      className: "long-link",
      text: "Start",
      url: "start",
      preventedCallback: this.goToStartPage.bind(this),
    });
    this.validationDialog = new Dialog({
      showCancelBtn: true,
      textCancelButton: "Close",
      content: [
        new Component({
          tag: "p",
          text: "Please add at least 2 valid options. An option is considered valid if its title is not empty and its weight is greater than 0",
        }),
      ],
    });
    this.pasteDialog = new PasteDialog(this.decisionService);

    this.appendChildren([
      new Component({
        tag: "h1",
        className: "title",
        text: "Decision Making Tool",
      }),
      this.decisionListComponent,
      new Button({
        className: "long-btn",
        text: "Add Option",
        callback: this.addOption.bind(this),
      }),
      new Button({
        className: "long-btn",
        text: "Paste list",
        callback: this.pasteList.bind(this),
      }),
      new Button({
        className: "long-btn",
        text: "Clear list",
        callback: this.clearList.bind(this),
      }),
      new Button({
        className: "long-btn",
        text: "Save list to file",
        callback: this.saveList.bind(this),
      }),
      new Button({
        className: "long-btn",
        text: "Load list from file",
        callback: this.loadList.bind(this),
      }),
      this.goToStartPageLink,
      this.validationDialog,
      this.pasteDialog,
    ]);

    window.addEventListener("beforeunload", () =>
      this.decisionService.saveListToLocalStorage()
    );
  }

  public remove(): void {
    this.decisionService.saveListToLocalStorage();
    super.remove();
  }

  private addOption(): void {
    this.decisionService.addDecision();
    this.decisionListComponent.rerenderDecisionList();
  }

  private pasteList(): void {
    this.pasteDialog
      .showModal()
      .then(() => this.decisionListComponent.rerenderDecisionList())
      .catch(() => console.log("paste modal is closed"));
  }

  private clearList(): void {
    this.decisionService.clearList();
    this.decisionListComponent.rerenderDecisionList();
  }

  private saveList(): void {
    this.decisionService.saveListToFile();
  }

  private async loadList(): Promise<void> {
    await this.decisionService.loadListFromFile();
    this.decisionListComponent.rerenderDecisionList();
  }

  private goToStartPage(): void | boolean {
    if (this.decisionService.getValidatedDecisionList().length < 2) {
      this.validationDialog.showModal();
      return true;
    }
  }
}
