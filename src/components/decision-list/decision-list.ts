import { Component } from "@/utils/component";
import type { Decision } from "@/models/decision";
import type { DecisionService } from "@/services/decision.service";
import { Button } from "../button/button";
import { Input, Label } from "../input/input";
import "./decision-list.css";

export class DecisionList extends Component {
  private decisionList: Decision[] = [];

  constructor(private readonly decisionService: DecisionService) {
    super({ tag: "ul", className: "item-list" });

    this.renderDecisionList();
  }

  public rerenderDecisionList(): void {
    this.removeChildren();
    this.renderDecisionList();
  }

  public saveDecisionList(): void {
    this.decisionService.saveListToLocalStorage();
  }

  private renderDecisionList(): void {
    this.decisionList = this.decisionService.getDecisionList();
    this.appendChildren(
      this.decisionList.map(
        item => new DecisionListItem(item, this.decisionService)
      )
    );
  }
}

class DecisionListItem extends Component<HTMLLIElement> {
  private item: Decision;

  constructor(
    item: Decision,
    private readonly decisionService: DecisionService
  ) {
    super({ tag: "li", className: "item" });

    this.item = item;
    const label = new Label(item.id, item.id);
    const firstInput = new Input({
      id: item.id,
      type: "text",
      placeholder: "Title",
      value: item.title,
      callback: this.updateTitle.bind(this),
    });
    const secondInput = new Input({
      type: "number",
      placeholder: "Weight",
      value: item.weight,
      callback: this.updateWeight.bind(this),
    });
    const deleteButton = new Button({
      className: "delete-btn",
      text: "Delete",
      callback: this.removeItem.bind(this),
    });

    this.appendChildren([label, firstInput, secondInput, deleteButton]);
  }

  private removeItem(): void {
    this.decisionService.deleteItemById(this.item.id);
    this.remove();
  }

  private updateTitle(event: Event): void {
    this.decisionService.updateDecisionItemTitle(
      this.item.id,
      (event.target as HTMLInputElement).value
    );
  }

  private updateWeight(event: Event): void {
    this.decisionService.updateDecisionItemWeight(
      this.item.id,
      (event.target as HTMLInputElement).value
    );
  }
}
