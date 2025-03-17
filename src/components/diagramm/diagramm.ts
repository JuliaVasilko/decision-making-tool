import type { Decision } from "@/models/decision";
import type { DecisionService } from "@/services/decision.service";
import { Component } from "@/utils/component";

export class Diagramm extends Component<HTMLCanvasElement> {
  private animationFrame?: number;
  private duration?: number;
  private currentAngle = 0;
  private cancelAnimation = false;
  private decisionList: Decision[];
  private colors: string[];
  private startTime?: number;
  private speed = 10;
  private minSpeed = 0.5;
  private deceleration?: number;

  constructor(private readonly decisionService: DecisionService) {
    super({ tag: "canvas", className: "diagramm" });
    this.decisionList = this.shuffleArray(
      this.decisionService.getValidatedDecisionList()
    );
    this.colors = this.generateRandomColors();

    this.setAttribute("width", "500");
    this.setAttribute("height", "500");
    this.drawDiagramm();
  }

  public async spinWheel(duration: number): Promise<string> {
    this.duration = duration;
    this.startTime = performance.now();

    this.resetData();

    return new Promise((resolve, reject) => {
      this.animationFrame = requestAnimationFrame(
        this.animate.bind(this, resolve, reject)
      );
    });
  }

  public remove(): void {
    this.cancelAnimation = true;
    super.remove();
  }

  private drawDiagramm(): void {
    const canvas = this.getNode() as HTMLCanvasElement;
    const context = canvas.getContext("2d");

    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const totalWeight = this.decisionList.reduce(
      (sum, item) => sum + Number(item.weight),
      0
    );
    let startAngle = this.currentAngle % (2 * Math.PI);

    this.decisionList.forEach((item, index) => {
      const sliceAngle = (Number(item.weight) / totalWeight) * 2 * Math.PI;
      let endAngle = startAngle + sliceAngle;
      endAngle = endAngle % (2 * Math.PI);

      context.beginPath();
      context.moveTo(canvas.width / 2, canvas.height / 2);
      context.arc(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2,
        startAngle,
        endAngle
      );
      context.closePath();
      context.fillStyle = this.colors[index % this.colors.length];
      context.fill();
      context.strokeStyle = "#fff";
      context.lineWidth = 2;
      if (sliceAngle >= 0.3) {
        this.drawSegmentText(context, canvas, item.title, startAngle, endAngle);
      }
      context.stroke();

      startAngle = endAngle;
    });

    this.drawPointer(context, canvas);
    this.drawCenterCircle(context, canvas);
  }

  private drawPointer(
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ): void {
    const centerX = canvas.width / 2;
    const topY = 5;
    const pointerSize = 15;

    context.beginPath();
    context.moveTo(centerX - pointerSize, topY);
    context.lineTo(centerX + pointerSize, topY);
    context.lineTo(centerX, topY + pointerSize);
    context.closePath();

    context.fillStyle = "red";
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = "black";
    context.stroke();
  }

  private drawCenterCircle(
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ): void {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 20;

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.fillStyle = "white";
    context.fill();
    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.stroke();
  }

  private animate(
    resolve: (value: string | PromiseLike<string>) => void,
    reject: (reason?: string) => void,
    time: number
  ): void {
    if (this.cancelAnimation) {
      reject("remove");
    }
    const canvas = this.getNode() as HTMLCanvasElement;
    const context = canvas.getContext("2d");

    if (!context) return;

    this.deceleration = this.speed / (this.duration! / 16);

    const elapsed = time - this.startTime!;
    if (elapsed >= this.duration!) {
      cancelAnimationFrame(this.animationFrame!);
      const winner = this.selectWinner();
      if (winner === "error") {
        reject("error");
      } else {
        resolve(winner);
      }
      return;
    }

    this.speed = Math.max(this.speed - this.deceleration, this.minSpeed);
    this.currentAngle += this.speed * (Math.PI / 180);
    this.currentAngle %= 2 * Math.PI;

    this.drawDiagramm();

    this.animationFrame = requestAnimationFrame(
      this.animate.bind(this, resolve, reject)
    );
  }

  private selectWinner(): string {
    const totalWeight = this.decisionList.reduce(
      (sum, item) => sum + Number(item.weight),
      0
    );

    const pointerAngle = (Math.PI / 2) * 3;

    let startAngle = this.currentAngle;
    for (const item of this.decisionList) {
      const sliceAngle = (Number(item.weight) / totalWeight) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      if (pointerAngle >= startAngle && pointerAngle < endAngle) {
        return item.title;
      }
      startAngle = endAngle;
    }

    return "error";
  }

  private generateRandomColors(): string[] {
    return Array.from(
      { length: this.decisionList.length },
      () =>
        `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`
    );
  }

  private shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  private drawSegmentText(
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    text: string,
    startAngle: number,
    endAngle: number
  ): void {
    const maxTextLength = 13;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 3;

    if (startAngle > endAngle) {
      endAngle += 2 * Math.PI;
    }
    const midAngle = (startAngle + endAngle) / 2;

    const flip = midAngle > Math.PI ? Math.PI : 0;

    const textX = centerX + radius * Math.cos(midAngle);
    const textY = centerY + radius * Math.sin(midAngle);

    context.save();
    context.translate(textX, textY);
    context.rotate(midAngle + flip);

    context.fillStyle = "white";
    context.font = "16px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";

    if (text.length >= maxTextLength) {
      text = `${text.substring(0, maxTextLength)}...`;
    }

    context.lineWidth = 4;
    context.strokeStyle = "black";
    context.strokeText(text, 0, 0);

    context.fillText(text, 0, 0);
    context.restore();
  }

  private resetData(): void {
    this.speed = 10;
    this.deceleration = 0;
    this.currentAngle = 0;
  }
}
