import type { Decision, DecisionResponse } from "@/models/decision";
import type { LocalStorageService } from "./local-storage.service";
import { localStorageService } from "./local-storage.service";
import type { FileSystemService } from "./file-system.service";
import { fileSystemService } from "./file-system.service";

export class DecisionService {
  private decisionList: Decision[] = [];
  private lastId = 0;
  private localStorageKey = "decision-list";

  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly fileSystemService: FileSystemService
  ) {
    this.loadListFromLocalStorage();
  }

  public getDecisionList(): Decision[] {
    return this.decisionList;
  }

  public addDecision(): void {
    this.decisionList.push({ id: this.generateNewId(), title: "", weight: "" });
  }

  public updateDecisionItemTitle(id: string, value: string): void {
    this.decisionList.find(item => item.id === id)!.title = value;
  }

  public updateDecisionItemWeight(id: string, value: string): void {
    this.decisionList.find(item => item.id === id)!.weight = value;
  }

  public clearList(): void {
    this.decisionList.length = 0;
  }

  public deleteItemById(id: string): void {
    this.decisionList = [...this.decisionList].filter(
      element => element.id !== id
    );
  }

  public saveListToFile(): void {
    this.fileSystemService.saveFile(this.generateDataToSave());
  }

  public async loadListFromFile(): Promise<void> {
    const data = await this.fileSystemService.loadFile<DecisionResponse>();

    this.decisionList = data.list;
    this.lastId = data.lastId;
  }

  public saveListToLocalStorage(): void {
    this.localStorageService.setItem(
      this.localStorageKey,
      this.generateDataToSave()
    );
  }

  public loadListFromLocalStorage(): void {
    const data = this.localStorageService.getItem<DecisionResponse>(
      this.localStorageKey
    ) ?? {
      lastId: 1,
      list: [{ id: "#1", title: "", weight: "" }],
    };

    this.decisionList = this.checkDecisionList(data.list);
    this.lastId = data.lastId;
  }

  public getValidatedDecisionList(): Decision[] {
    return this.decisionList.filter(this.strictValidateDecision.bind(this));
  }

  public setDecisionListFromString(string: string): void {
    const decisionList: Decision[] = string
      .split(/\r?\n/)
      .reduce((acc: Decision[], row) => {
        const splittedRow = row.split(",");
        const weight = String(splittedRow.pop()).trim();
        const title = splittedRow.join("").trim();
        if (this.checkWeight(weight) && this.checkTitle(title)) {
          const decision = {
            id: this.generateNewId(),
            title,
            weight,
          };
          acc.push(decision);
        }
        return acc;
      }, []);
    this.decisionList = [...this.decisionList, ...decisionList];
  }

  private generateNewId(): string {
    if (this.decisionList.length === 0) {
      this.lastId = 1;
      return `#1`;
    }

    const newId = this.lastId + 1;
    this.lastId = newId;
    return `#${newId}`;
  }

  private strictValidateDecision(decision: Decision): boolean {
    return (
      this.checkId(decision.id) &&
      this.checkTitle(decision.title) &&
      this.checkWeight(decision.weight)
    );
  }

  private softValidateDecision(decision: Decision): boolean {
    return this.checkId(decision.id);
  }

  private generateDataToSave(): DecisionResponse {
    return {
      lastId: this.lastId,
      list: this.decisionList,
    };
  }

  private checkDecisionList(list: Decision[]): Decision[] {
    return list
      .filter(this.softValidateDecision.bind(this))
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  private checkId(string: string): boolean {
    const idRegex = /^#([1-9]\d*)$/;
    return idRegex.test(string);
  }

  private checkWeight(string: string): boolean {
    const weightRegex = /^[1-9]\d*$/;

    return weightRegex.test(string) || string === undefined;
  }

  private checkTitle(string: string): boolean {
    return string.trim() !== "";
  }
}

export const decisionService = new DecisionService(
  localStorageService,
  fileSystemService
);
