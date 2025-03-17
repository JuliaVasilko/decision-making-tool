var u = Object.defineProperty;
var U = (s, t, A) => t in s ? u(s, t, { enumerable: !0, configurable: !0, writable: !0, value: A }) : s[t] = A;
var I = (s, t, A) => U(s, typeof t != "symbol" ? t + "" : t, A);
class l {
  constructor({ tag: t = "div", className: A = "", text: i = "" }, e) {
    I(this, "node");
    I(this, "children", []);
    I(this, "disabled", !1);
    const g = document.createElement(t);
    g.className = A, g.textContent = i, this.node = g, e && this.appendChildren(e);
  }
  createElement(t) {
    const A = document.createElement(t);
    this.node = A;
  }
  appendChildren(t) {
    t.forEach((A) => {
      this.append(A);
    });
  }
  append(t) {
    this.children.push(t), this.node.append(t.getNode());
  }
  getNode() {
    return this.node;
  }
  getChildren() {
    return this.children;
  }
  setTextContent(t) {
    this.node.textContent = t;
  }
  setAttribute(t, A) {
    this.node.setAttribute(t, A);
  }
  removeAttribute(t) {
    this.node.removeAttribute(t);
  }
  toggleClass(t) {
    this.node.classList.toggle(t);
  }
  addClass(t) {
    this.node.classList.add(t);
  }
  removeClass(t) {
    this.node.classList.contains(t) && this.node.classList.remove(t);
  }
  setDisabled(t) {
    this.disabled = t;
  }
  getDisabled() {
    return this.disabled;
  }
  addListener(t, A, i) {
    this.node.addEventListener(t, A, i);
  }
  removeListener(t, A, i) {
    this.node.removeEventListener(t, A, i);
  }
  removeChildren() {
    this.children.forEach((t) => {
      t.remove();
    }), this.children.length = 0;
  }
  remove() {
    this.removeChildren(), this.node.remove();
  }
}
class d extends l {
  constructor({ url: t, className: A, text: i, preventedCallback: e }) {
    super({ tag: "a", className: A, text: i }), this.setAttribute("href", t), this.addListener("click", (g) => {
      g == null || g.preventDefault(), !(e && e(g)) && (this.getDisabled() || Q.navigate(`/${t}`));
    });
  }
}
class G extends l {
  constructor() {
    super({ className: "error-page" }, [
      new l({ tag: "h1", text: "Page not found" }),
      new d({ text: "Back to main page", url: "", className: "long-link" })
    ]);
  }
}
class c extends l {
  constructor(t) {
    super({ tag: "button", className: t.className, text: t.text }), t.callback && this.addListener("click", (A) => t.callback(A));
  }
  setDisabled(t) {
    super.setDisabled(t), this.getNode().disabled = this.getDisabled();
  }
}
class r extends l {
  constructor(t) {
    super({ tag: "input", className: "input" }), this.setInputProperties(t);
  }
  setDisabled(t) {
    super.setDisabled(t), this.getNode().disabled = this.getDisabled();
  }
  setInputProperties({
    type: t,
    placeholder: A,
    id: i,
    validators: e,
    value: g = "",
    name: C,
    callback: o
  }) {
    const n = this.getNode();
    n.type = t, n.placeholder = A ?? "", n.value = g, C && (n.name = C), i && (n.id = i), o && this.addListener("input", (a) => o(a)), e == null || e.forEach(
      (a) => this.setAttribute(a.name, a.value)
    );
  }
}
class k extends l {
  constructor(t, A) {
    super({ tag: "label", text: t }), this.setAttribute("for", A);
  }
}
class D extends l {
  constructor(A) {
    super({ tag: "ul", className: "item-list" });
    I(this, "decisionList", []);
    this.decisionService = A, this.renderDecisionList();
  }
  rerenderDecisionList() {
    this.removeChildren(), this.renderDecisionList();
  }
  saveDecisionList() {
    this.decisionService.saveListToLocalStorage();
  }
  renderDecisionList() {
    this.decisionList = this.decisionService.getDecisionList(), this.appendChildren(
      this.decisionList.map(
        (A) => new R(A, this.decisionService)
      )
    );
  }
}
class R extends l {
  constructor(A, i) {
    super({ tag: "li", className: "item" });
    I(this, "item");
    this.decisionService = i, this.item = A;
    const e = new k(A.id, A.id), g = new r({
      id: A.id,
      type: "text",
      placeholder: "Title",
      value: A.title,
      callback: this.updateTitle.bind(this)
    }), C = new r({
      type: "number",
      placeholder: "Weight",
      value: A.weight,
      callback: this.updateWeight.bind(this)
    }), o = new c({
      className: "delete-btn",
      text: "Delete",
      callback: this.removeItem.bind(this)
    });
    this.appendChildren([e, g, C, o]);
  }
  removeItem() {
    this.decisionService.deleteItemById(this.item.id), this.remove();
  }
  updateTitle(A) {
    this.decisionService.updateDecisionItemTitle(
      this.item.id,
      A.target.value
    );
  }
  updateWeight(A) {
    this.decisionService.updateDecisionItemWeight(
      this.item.id,
      A.target.value
    );
  }
}
class p extends l {
  constructor({
    showOkBtn: A,
    textOkButton: i = "Confirm",
    showCancelBtn: e,
    textCancelButton: g = "Cancel",
    content: C
  }) {
    super({ tag: "dialog", className: "dialog" });
    I(this, "contentCotainer");
    I(this, "resolve");
    I(this, "reject");
    I(this, "okBtn");
    I(this, "cancelBtn");
    I(this, "actionContainer");
    this.contentCotainer = new l(
      { className: "dialog-content" },
      C
    ), this.actionContainer = new l({
      tag: "div",
      className: "dialog-actions"
    }), A && (this.okBtn = new c({
      text: i,
      callback: this.okBtnCallback.bind(this)
    }), this.actionContainer.append(this.okBtn)), e && (this.cancelBtn = new c({
      text: g,
      callback: this.cancelBtnCallback.bind(this)
    }), this.actionContainer.append(this.cancelBtn)), this.appendChildren([this.contentCotainer, this.actionContainer]);
  }
  showModal() {
    return this.getNode().showModal(), new Promise((A, i) => {
      this.resolve = A, this.reject = i;
    });
  }
  closeModal(A) {
    this.getNode().close(), A ? this.resolve(A) : this.reject(A), this.resolve = void 0, this.reject = void 0;
  }
  okBtnCallback() {
    this.closeModal(!0);
  }
  cancelBtnCallback() {
    this.closeModal(!1);
  }
}
class W extends p {
  constructor(A) {
    super({ showOkBtn: !0, showCancelBtn: !0 });
    I(this, "textarea");
    I(this, "placeholder", `
  Paste a list of new options in a CSV-like format:

  title,1                 -> | title                 | 1 |
  title with whitespace,2 -> | title with whitespace | 2 |
  title , with , commas,3 -> | title , with , commas | 3 |
  title with "quotes",4   -> | title with "quotes"   | 4 |
  `);
    this.decisionService = A, this.textarea = new l({
      tag: "textarea"
    }), this.textarea.setAttribute("placeholder", this.placeholder), this.textarea.setAttribute("rows", "10"), this.contentCotainer.append(this.textarea);
  }
  showModal() {
    return this.textarea.getNode().value = "", super.showModal();
  }
  okBtnCallback() {
    this.decisionService.setDecisionListFromString(
      this.textarea.getNode().value
    ), super.okBtnCallback();
  }
}
class Z extends l {
  constructor(A) {
    super({ tag: "main", className: "homepage" });
    I(this, "decisionListComponent");
    I(this, "goToStartPageLink");
    I(this, "validationDialog");
    I(this, "pasteDialog");
    this.decisionService = A, this.decisionListComponent = new D(this.decisionService), this.goToStartPageLink = new d({
      className: "long-link",
      text: "Start",
      url: "start",
      preventedCallback: this.goToStartPage.bind(this)
    }), this.validationDialog = new p({
      showCancelBtn: !0,
      textCancelButton: "Close",
      content: [
        new l({
          tag: "p",
          text: "Please add at least 2 valid options. An option is considered valid if its title is not empty and its weight is greater than 0"
        })
      ]
    }), this.pasteDialog = new W(this.decisionService), this.appendChildren([
      new l({
        tag: "h1",
        className: "title",
        text: "Decision Making Tool"
      }),
      this.decisionListComponent,
      new c({
        className: "long-btn",
        text: "Add Option",
        callback: this.addOption.bind(this)
      }),
      new c({
        className: "long-btn",
        text: "Paste list",
        callback: this.pasteList.bind(this)
      }),
      new c({
        className: "long-btn",
        text: "Clear list",
        callback: this.clearList.bind(this)
      }),
      new c({
        className: "long-btn",
        text: "Save list to file",
        callback: this.saveList.bind(this)
      }),
      new c({
        className: "long-btn",
        text: "Load list from file",
        callback: this.loadList.bind(this)
      }),
      this.goToStartPageLink,
      this.validationDialog,
      this.pasteDialog
    ]), window.addEventListener(
      "beforeunload",
      () => this.decisionService.saveListToLocalStorage()
    );
  }
  remove() {
    this.decisionService.saveListToLocalStorage(), super.remove();
  }
  addOption() {
    this.decisionService.addDecision(), this.decisionListComponent.rerenderDecisionList();
  }
  pasteList() {
    this.pasteDialog.showModal().then(() => this.decisionListComponent.rerenderDecisionList()).catch(() => console.log("paste modal is closed"));
  }
  clearList() {
    this.decisionService.clearList(), this.decisionListComponent.rerenderDecisionList();
  }
  saveList() {
    this.decisionService.saveListToFile();
  }
  async loadList() {
    await this.decisionService.loadListFromFile(), this.decisionListComponent.rerenderDecisionList();
  }
  goToStartPage() {
    if (this.decisionService.getValidatedDecisionList().length < 2)
      return this.validationDialog.showModal(), !0;
  }
}
class T extends l {
  constructor() {
    super({ tag: "form", className: "form" });
    I(this, "timeInput");
    I(this, "sound", !0);
    this.timeInput = new r({
      type: "number",
      id: "seconds",
      name: "time",
      value: "5",
      validators: [
        { name: "required", value: "true" },
        { name: "min", value: "5" }
      ]
    }), this.timeInput.addListener("input", this.setValidity.bind(this));
    const A = [
      new d({
        className: "short-btn",
        text: "Back",
        url: ""
      }),
      new c({
        className: "short-btn",
        text: "Sound",
        callback: this.toggleSound.bind(this)
      }),
      new k("Time", "seconds"),
      this.timeInput,
      new c({
        className: "middle-btn",
        text: "Play"
      })
    ];
    this.appendChildren(A);
  }
  submitForm(A) {
    A.preventDefault();
    const i = this.timeInput.getNode();
    return i.validity.valueMissing ? i.setCustomValidity("This field is required.") : i.validity.rangeUnderflow && i.setCustomValidity("The number must be at least 5."), i.reportValidity(), {
      value: i.value,
      sound: this.sound,
      isValid: this.getNode().checkValidity()
    };
  }
  setDisabled(A) {
    super.setDisabled(A), this.getChildren().forEach((i) => i.setDisabled(this.getDisabled())), this.getDisabled() ? this.addClass("disabled") : this.removeClass("disabled");
  }
  setValidity(A) {
    (A == null ? void 0 : A.target).setCustomValidity("");
  }
  toggleSound(A) {
    this.sound = !this.sound, A.target.classList.toggle("active");
  }
}
class Y extends l {
  constructor(A) {
    super({ tag: "canvas", className: "diagramm" });
    I(this, "animationFrame");
    I(this, "duration");
    I(this, "currentAngle", 0);
    I(this, "cancelAnimation", !1);
    I(this, "decisionList");
    I(this, "colors");
    I(this, "startTime");
    I(this, "speed", 1);
    I(this, "minSpeed", 0.5);
    I(this, "deceleration");
    this.decisionService = A, this.decisionList = this.shuffleArray(
      this.decisionService.getValidatedDecisionList()
    ), this.colors = this.generateRandomColors(), this.setAttribute("width", "500"), this.setAttribute("height", "500"), this.drawDiagramm();
  }
  async spinWheel(A) {
    return this.duration = A, this.startTime = performance.now(), new Promise((i, e) => {
      this.animationFrame = requestAnimationFrame(
        this.animate.bind(this, i, e)
      );
    });
  }
  remove() {
    this.cancelAnimation = !0, super.remove();
  }
  drawDiagramm() {
    const A = this.getNode(), i = A.getContext("2d");
    if (!i) return;
    i.clearRect(0, 0, A.width, A.height);
    const e = this.decisionList.reduce(
      (C, o) => C + Number(o.weight),
      0
    );
    let g = this.currentAngle % (2 * Math.PI);
    this.decisionList.forEach((C, o) => {
      const n = Number(C.weight) / e * 2 * Math.PI;
      let a = g + n;
      a = a % (2 * Math.PI), i.beginPath(), i.moveTo(A.width / 2, A.height / 2), i.arc(
        A.width / 2,
        A.height / 2,
        A.width / 2,
        g,
        a
      ), i.closePath(), i.fillStyle = this.colors[o % this.colors.length], i.fill(), i.strokeStyle = "#fff", i.lineWidth = 2, n >= 0.3 && this.drawSegmentText(i, A, C.title, g, a), i.stroke(), g = a;
    }), this.drawPointer(i, A), this.drawCenterCircle(i, A);
  }
  drawPointer(A, i) {
    const e = i.width / 2, g = 5, C = 15;
    A.beginPath(), A.moveTo(e - C, g), A.lineTo(e + C, g), A.lineTo(e, g + C), A.closePath(), A.fillStyle = "red", A.fill(), A.lineWidth = 3, A.strokeStyle = "black", A.stroke();
  }
  drawCenterCircle(A, i) {
    const e = i.width / 2, g = i.height / 2, C = 20;
    A.beginPath(), A.arc(e, g, C, 0, 2 * Math.PI), A.fillStyle = "white", A.fill(), A.strokeStyle = "black", A.lineWidth = 2, A.stroke();
  }
  animate(A, i, e) {
    if (this.cancelAnimation && i("remove"), !this.getNode().getContext("2d")) return;
    if (this.deceleration = this.speed / (this.duration / 16), e - this.startTime >= this.duration) {
      cancelAnimationFrame(this.animationFrame);
      const n = this.selectWinner();
      n === "error" ? i("error") : A(n);
      return;
    }
    this.speed = Math.max(this.speed - this.deceleration, this.minSpeed), this.currentAngle += this.speed * (Math.PI / 180), this.currentAngle %= 2 * Math.PI, this.drawDiagramm(), this.animationFrame = requestAnimationFrame(
      this.animate.bind(this, A, i)
    );
  }
  selectWinner() {
    const A = this.decisionList.reduce(
      (g, C) => g + Number(C.weight),
      0
    ), i = Math.PI / 2 * 3;
    let e = this.currentAngle % (2 * Math.PI);
    for (const g of this.decisionList) {
      const C = Number(g.weight) / A * 2 * Math.PI;
      let o = e + C;
      if (o = o % (2 * Math.PI), i >= e && i < o)
        return g.title;
      e = o;
    }
    return "error";
  }
  generateRandomColors() {
    return Array.from(
      { length: this.decisionList.length },
      () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`
    );
  }
  shuffleArray(A) {
    return [...A].sort(() => Math.random() - 0.5);
  }
  drawSegmentText(A, i, e, g, C) {
    const n = i.width / 2, a = i.height / 2, S = i.width / 3;
    g > C && (C += 2 * Math.PI);
    const h = (g + C) / 2, w = h > Math.PI ? Math.PI : 0, J = n + S * Math.cos(h), M = a + S * Math.sin(h);
    A.save(), A.translate(J, M), A.rotate(h + w), A.fillStyle = "white", A.font = "16px Arial", A.textAlign = "center", A.textBaseline = "middle", e.length >= 13 && (e = `${e.substring(0, 13)}...`), A.lineWidth = 4, A.strokeStyle = "black", A.strokeText(e, 0, 0), A.fillText(e, 0, 0), A.restore();
  }
}
const E = "data:audio/mpeg;base64,SUQzAwAAAABEJlRZRVIAAAAGAAAAMjAyMQBUREFUAAAABgAAADAxMDMAVElNRQAAAAYAAAAxNjEwAFBSSVYAABnsAABYTVAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwMzAyLCAyMDE3LzAzLzAyLTE2OjU5OjM4ICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiCiAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICB4bWxuczp4bXBETT0iaHR0cDovL25zLmFkb2JlLmNvbS94bXAvMS4wL0R5bmFtaWNNZWRpYS8iCiAgICB4bWxuczpjcmVhdG9yQXRvbT0iaHR0cDovL25zLmFkb2JlLmNvbS9jcmVhdG9yQXRvbS8xLjAvIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjIxYWFiOWYzLWMwNmYtM2E0NC1iZWM4LTU4YzBjMjkxZmFkMCIKICAgeG1wTU06RG9jdW1lbnRJRD0iOWI4MTUwZGQtMmY4MS1iNTQyLTkyYzAtZjQ4ZTAwMDAwMDY1IgogICB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YzA0NjY4NmYtN2VlZS05NzQ3LTllYmEtZDYxNzFmNThlNmU4IgogICB4bXA6TWV0YWRhdGFEYXRlPSIyMDIxLTAzLTAxVDE2OjEwOjU3KzAyOjAwIgogICB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wMy0wMVQxNjoxMDo1NyswMjowMCIKICAgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQcmVtaWVyZSBQcm8gQ0MgMjAxNy4xIChXaW5kb3dzKSIKICAgeG1wOkNyZWF0ZURhdGU9IjIwMjEtMDMtMDFUMTY6MTA6MjcrMDI6MDAiCiAgIHhtcERNOmF1ZGlvU2FtcGxlUmF0ZT0iLTEiCiAgIHhtcERNOmF1ZGlvU2FtcGxlVHlwZT0iMTZJbnQiCiAgIHhtcERNOmF1ZGlvQ2hhbm5lbFR5cGU9IlN0ZXJlbyIKICAgeG1wRE06c3RhcnRUaW1lU2NhbGU9IjMwMDAwIgogICB4bXBETTpzdGFydFRpbWVTYW1wbGVTaXplPSIxMDAxIgogICBkYzpmb3JtYXQ9Ik1QMyI+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJhYzQyNmEzYS1kNGRhLWIzN2ItNTNmZS1mOGQ1MDAwMDAwOTIiCiAgICAgIHN0RXZ0OndoZW49IjIwMjEtMDMtMDFUMTY6MTA6NTcrMDI6MDAiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFByZW1pZXJlIFBybyBDQyAyMDE3LjEgKFdpbmRvd3MpIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIi8+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249ImNyZWF0ZWQiCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OWE5NDk3MzctYTVlZC1hYjRkLTkzMTYtYTA0YzI4MzdjNTQ0IgogICAgICBzdEV2dDp3aGVuPSIyMDIxLTAzLTAxVDE2OjEwOjU3KzAyOjAwIgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQcmVtaWVyZSBQcm8gQ0MgMjAxNy4xIChXaW5kb3dzKSIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozOGM4NjVkMC0xYzEwLWM4NDUtODBhYS1iN2YzMmFlMmMzNjAiCiAgICAgIHN0RXZ0OndoZW49IjIwMjEtMDMtMDFUMTY6MTA6NTcrMDI6MDAiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFByZW1pZXJlIFBybyBDQyAyMDE3LjEgKFdpbmRvd3MpIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIi8+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjIxYWFiOWYzLWMwNmYtM2E0NC1iZWM4LTU4YzBjMjkxZmFkMCIKICAgICAgc3RFdnQ6d2hlbj0iMjAyMS0wMy0wMVQxNjoxMDo1NyswMjowMCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUHJlbWllcmUgUHJvIENDIDIwMTcuMSAoV2luZG93cykiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii9tZXRhZGF0YSIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgIDx4bXBNTTpJbmdyZWRpZW50cz4KICAgIDxyZGY6QmFnPgogICAgIDxyZGY6bGkKICAgICAgc3RSZWY6aW5zdGFuY2VJRD0iMWRjZjFjMjEtN2M1MS05ZWFmLTEwM2EtNjhhZDAwMDAwMDhlIgogICAgICBzdFJlZjpkb2N1bWVudElEPSIyMWFiMmExOS1jMTY4LTE1ZTAtNWJmYy0wN2VkMDAwMDAwNjEiCiAgICAgIHN0UmVmOmZyb21QYXJ0PSJ0aW1lOjBkNDU3Njg2MDI4ODAwZjI1NDAxNjAwMDAwMCIKICAgICAgc3RSZWY6dG9QYXJ0PSJ0aW1lOjUwODU0MDAzMjAwZjI1NDAxNjAwMDAwMGQ0NTc2ODYwMjg4MDBmMjU0MDE2MDAwMDAwIgogICAgICBzdFJlZjpmaWxlUGF0aD0iUmFyZSBUYSBEYSBTb3VuZCBFZmZlY3QubXA0IgogICAgICBzdFJlZjptYXNrTWFya2Vycz0iTm9uZSIvPgogICAgPC9yZGY6QmFnPgogICA8L3htcE1NOkluZ3JlZGllbnRzPgogICA8eG1wTU06UGFudHJ5PgogICAgPHJkZjpCYWc+CiAgICAgPHJkZjpsaT4KICAgICAgPHJkZjpEZXNjcmlwdGlvbgogICAgICAgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMTAtMjNUMTI6MzI6NThaIgogICAgICAgeG1wOk1vZGlmeURhdGU9IjIwMjEtMDMtMDFUMTY6MDU6NDcrMDI6MDAiCiAgICAgICB4bXA6TWV0YWRhdGFEYXRlPSIyMDIxLTAzLTAxVDE2OjA1OjQ3KzAyOjAwIgogICAgICAgeG1wTU06SW5zdGFuY2VJRD0iMWRjZjFjMjEtN2M1MS05ZWFmLTEwM2EtNjhhZDAwMDAwMDhlIgogICAgICAgeG1wTU06RG9jdW1lbnRJRD0iMjFhYjJhMTktYzE2OC0xNWUwLTViZmMtMDdlZDAwMDAwMDYxIgogICAgICAgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmUyMzZlMmYzLTIyZDQtYTU0YS04NzJiLTBmM2VjYjQ3ZDlkYyI+CiAgICAgIDx4bXBETTpkdXJhdGlvbgogICAgICAgeG1wRE06dmFsdWU9IjE4MzQiCiAgICAgICB4bXBETTpzY2FsZT0iMS8xMDAwIi8+CiAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgPHJkZjpTZXE+CiAgICAgICAgPHJkZjpsaQogICAgICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICAgICBzdEV2dDppbnN0YW5jZUlEPSIxZGNmMWMyMS03YzUxLTllYWYtMTAzYS02OGFkMDAwMDAwOGUiCiAgICAgICAgIHN0RXZ0OndoZW49IjIwMjEtMDMtMDFUMTY6MDU6NDcrMDI6MDAiCiAgICAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFByZW1pZXJlIFBybyBDQyAyMDE3LjEgKFdpbmRvd3MpIgogICAgICAgICBzdEV2dDpjaGFuZ2VkPSIvIi8+CiAgICAgICA8L3JkZjpTZXE+CiAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgICAgPC9yZGY6bGk+CiAgICA8L3JkZjpCYWc+CiAgIDwveG1wTU06UGFudHJ5PgogICA8eG1wTU06RGVyaXZlZEZyb20KICAgIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OWE5NDk3MzctYTVlZC1hYjRkLTkzMTYtYTA0YzI4MzdjNTQ0IgogICAgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5YTk0OTczNy1hNWVkLWFiNGQtOTMxNi1hMDRjMjgzN2M1NDQiCiAgICBzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6OWE5NDk3MzctYTVlZC1hYjRkLTkzMTYtYTA0YzI4MzdjNTQ0Ii8+CiAgIDxjcmVhdG9yQXRvbTp3aW5kb3dzQXRvbQogICAgY3JlYXRvckF0b206ZXh0ZW5zaW9uPSIucHJwcm9qIgogICAgY3JlYXRvckF0b206aW52b2NhdGlvbkZsYWdzPSIvTCIKICAgIGNyZWF0b3JBdG9tOnVuY1Byb2plY3RQYXRoPSJcXD9cQzpcVXNlcnNcS3JvaGFcRG9jdW1lbnRzXEFkb2JlXFByZW1pZXJlIFByb1wxMS4wXNCR0LXQtyDQvdCw0LfQstCw0L3QuNGPLnBycHJvaiIvPgogICA8Y3JlYXRvckF0b206bWFjQXRvbQogICAgY3JlYXRvckF0b206YXBwbGljYXRpb25Db2RlPSIxMzQ3NDQ5NDU1IgogICAgY3JlYXRvckF0b206aW52b2NhdGlvbkFwcGxlRXZlbnQ9IjExMjk0NjgwMTgiLz4KICAgPHhtcERNOnByb2plY3RSZWYKICAgIHhtcERNOnR5cGU9Im1vdmllIi8+CiAgIDx4bXBETTpkdXJhdGlvbgogICAgeG1wRE06dmFsdWU9IjY3IgogICAgeG1wRE06c2NhbGU9IjEwMDEvMzAwMDAiLz4KICAgPHhtcERNOnN0YXJ0VGltZWNvZGUKICAgIHhtcERNOnRpbWVGb3JtYXQ9IjI5OTdEcm9wVGltZWNvZGUiCiAgICB4bXBETTp0aW1lVmFsdWU9IjAwOzAwOzAwOzAwIi8+CiAgIDx4bXBETTphbHRUaW1lY29kZQogICAgeG1wRE06dGltZVZhbHVlPSIwMDswMDswMDswMCIKICAgIHhtcERNOnRpbWVGb3JtYXQ9IjI5OTdEcm9wVGltZWNvZGUiLz4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7kEAAAAAAAEuAAAAIAAAJcAAAAQAAAS4AAAAgAAAlwAAABP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7kEC+gAfYAEuAAAAIAAAJcAAAAQAAAS4AAAAgAAAlwAAABP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7kED/gAvoAEuAAAAIAAAJcAAAAQAAAS4AAAAgAAAlwAAABP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7kED/gAvoAEuAAAAIAAAJcAAAAQAAAS4AAAAgAAAlwAAABP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7kED/gAvoAEuAAAAIAAAJcAAAAQAAAS4AAAAgAAAlwAAABP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7kED/gAvoAEuAAAAIAAAJcAAAAQAAAS4AAAAgAAAlwAAABP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7kED/gAvoAEuAAAAIAAAJcAAAAQAAAS4AAAAgAAAlwAAABP//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AaqqpVA/UwqCho58URkXEhIK1E1lURKLj5hvJKojI+Jw8FyBowkWEUNB+HhYybih11frdI8TC3V2j/tV2jxMTdU8f/8TzCsOMPQLCwbNf///zX//////////////////////////////////////////////////trV81SooQu024v/7kED/gAvoAEuAAAAIAAAJcAAAAQAAAS4AAAAg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IhJ39dmHasZmpt/iFJZOsrUzeUvyOP1ZfRnz5FFxN4hQ9Rzj9JEGqMYV42xbUCczGjSVIWTpToSplOQlgNI6kUdUaUfI/UUd4OUuSTDUo0kJtFyYS7LDui+lTSbRFhAjSlLsgjlQ10+LqLcWJEoTJGRJcXWLl9LjEn0E1f///////////////////////////////////////////////////////////////////////////////////+DV/cIAh9jBYILuI1JkJIdDSJpIP1HzVpKXSknYbYvF/wELf/////gUKiwe///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7kGDWgAf7S9Hp+XtiAAAJcAAAAQV0SR0hMYbAAAAlwAAABP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7kED/gAvoAEuAAAAIAAAJcAAAAQAAAS4AAAAgAAAlwAAABP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7kED/gAvoAEuAAAAIAAAJcAAAAQAAAS4AAAAgAAAlwAAABP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7kED/gAvoAEuAAAAIAAAJcAAAAQAAAS4AAAAgAAAlwAAABP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7kED/gAvoAEuAAAAIAAAJcAAAAQAAAS4AAAAgAAAlwAAABP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7kED/gAvoAEuAAAAIAAAJcAAAAQAAAS4AAAAgAAAlwAAABP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7kED/gAvoAEuAAAAIAAAJcAAAAQAAAS4AAAAgAAAlwAAABP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7kED/gAvoAEuAAAAIAAAJcAAAAQAAAS4AAAAgAAAlwAAABP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7kED/gAvoAEuAAAAIAAAJcAAAAQAAAS4AAAAgAAAlwAAABP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7kED/gAvoAEuAAAAIAAAJcAAAAQAAAS4AAAAgAAAlwAAABP//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7kED/gAvoAEuAAAAIAAAJcAAAAQAAAS4AAAAgAAAlwAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFRBRwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADIwMjEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
class N extends l {
  constructor(A) {
    super({ tag: "main", className: "startpage" });
    I(this, "diagrammComponent");
    I(this, "decisionForm");
    I(this, "winnerNameComponent");
    I(this, "defaultWinnerText", "The winner is: ");
    this.decisionService = A, this.diagrammComponent = new Y(this.decisionService), this.decisionForm = new T(), this.decisionForm.addListener(
      "submit",
      (i) => this.chooseDecision(i)
    ), this.winnerNameComponent = new l({
      tag: "p",
      className: "winner-name",
      text: this.defaultWinnerText
    }), this.appendChildren([
      new l({
        tag: "h1",
        className: "title",
        text: "Decision Making Tool"
      }),
      this.decisionForm,
      this.winnerNameComponent,
      new l({
        tag: "h2",
        className: "h2",
        text: "Press Start Button"
      }),
      new l({ className: "canvas-wrapper" }, [this.diagrammComponent])
    ]);
  }
  async chooseDecision(A) {
    const { value: i, isValid: e, sound: g } = this.decisionForm.submitForm(A);
    if (this.winnerNameComponent.setTextContent(this.defaultWinnerText), e) {
      this.decisionForm.setDisabled(!0);
      try {
        const C = await this.diagrammComponent.spinWheel(
          Number(i) * 1e3
        );
        this.decisionForm.setDisabled(!1), g && this.playMusic(), this.winnerNameComponent.setTextContent(
          this.defaultWinnerText + C
        );
      } catch (C) {
        console.log(C);
      }
    }
  }
  playMusic() {
    const A = new Audio(E);
    A.addEventListener("canplaythrough", () => {
      A.play().then(() => A.remove());
    });
  }
}
class L {
  constructor(t, A) {
    I(this, "routes");
    I(this, "appRoot");
    I(this, "currentComponent", null);
    this.routes = t, this.appRoot = A, this.init();
  }
  navigate(t) {
    this.routes[t] ? (history.pushState(null, "", t), this.renderRoute()) : this.navigate("/404");
  }
  init() {
    window.addEventListener("popstate", () => this.renderRoute()), document.addEventListener("DOMContentLoaded", () => this.renderRoute());
  }
  renderRoute() {
    const t = window.location.pathname, A = this.routes[t] || this.routes["/404"];
    A && (this.currentComponent && this.currentComponent.remove(), this.currentComponent = A(), this.appRoot.appendChild(this.currentComponent.getNode()));
  }
}
class y {
  constructor() {
    I(this, "prefix", "[er-decision-making-tool]");
  }
  setItem(t, A) {
    const i = JSON.stringify(A);
    localStorage.setItem(`${this.prefix} ${t}`, i);
  }
  getItem(t) {
    const A = localStorage.getItem(`${this.prefix} ${t}`);
    return A ? JSON.parse(A) : void 0;
  }
  removeItem(t) {
    localStorage.removeItem(`${this.prefix} ${t}`);
  }
}
const b = new y();
class V {
  saveFile(t) {
    const A = new Blob([JSON.stringify(t, null, 2)], {
      type: "application/json"
    }), i = document.createElement("a");
    i.href = URL.createObjectURL(A), i.download = "option-list", document.body.appendChild(i), i.click(), document.body.removeChild(i);
  }
  loadFile() {
    const t = document.createElement("input");
    return t.type = "file", t.accept = "application/json", new Promise((A, i) => {
      t.addEventListener("change", async () => {
        var C;
        const e = (C = t.files) == null ? void 0 : C[0];
        if (!e) {
          i(new Error("No file"));
          return;
        }
        const g = new FileReader();
        g.onload = async (o) => {
          var n;
          try {
            const a = JSON.parse((n = o.target) == null ? void 0 : n.result);
            A(a);
          } catch (a) {
            i(new Error("Error JSON: " + a));
          }
        }, g.readAsText(e);
      }), t.click();
    });
  }
}
const j = new V();
class v {
  constructor(t, A) {
    I(this, "decisionList", []);
    I(this, "lastId", 0);
    I(this, "localStorageKey", "decision-list");
    this.localStorageService = t, this.fileSystemService = A, this.loadListFromLocalStorage();
  }
  getDecisionList() {
    return this.decisionList;
  }
  addDecision() {
    this.decisionList.push({ id: this.generateNewId(), title: "", weight: "" });
  }
  updateDecisionItemTitle(t, A) {
    this.decisionList.find((i) => i.id === t).title = A;
  }
  updateDecisionItemWeight(t, A) {
    this.decisionList.find((i) => i.id === t).weight = A;
  }
  clearList() {
    this.decisionList.length = 0;
  }
  deleteItemById(t) {
    this.decisionList = [...this.decisionList].filter(
      (A) => A.id !== t
    );
  }
  saveListToFile() {
    this.fileSystemService.saveFile(this.generateDataToSave());
  }
  async loadListFromFile() {
    const t = await this.fileSystemService.loadFile();
    this.decisionList = t.list, this.lastId = t.lastId;
  }
  saveListToLocalStorage() {
    this.localStorageService.setItem(
      this.localStorageKey,
      this.generateDataToSave()
    );
  }
  loadListFromLocalStorage() {
    const t = this.localStorageService.getItem(
      this.localStorageKey
    ) ?? {
      lastId: 1,
      list: [{ id: "#1", title: "", weight: "" }]
    };
    this.decisionList = this.checkDecisionList(t.list), this.lastId = t.lastId;
  }
  getValidatedDecisionList() {
    return this.decisionList.filter(this.strictValidateDecision.bind(this));
  }
  setDecisionListFromString(t) {
    const A = t.split(/\r?\n/).reduce((i, e) => {
      const g = e.split(","), C = String(g.pop()).trim(), o = g.join("").trim();
      if (this.checkWeight(C) && this.checkTitle(o)) {
        const n = {
          id: this.generateNewId(),
          title: o,
          weight: C
        };
        i.push(n);
      }
      return i;
    }, []);
    this.decisionList = [...this.decisionList, ...A];
  }
  generateNewId() {
    if (this.decisionList.length === 0)
      return this.lastId = 1, "#1";
    const t = this.lastId + 1;
    return this.lastId = t, `#${t}`;
  }
  strictValidateDecision(t) {
    return this.checkId(t.id) && this.checkTitle(t.title) && this.checkWeight(t.weight);
  }
  softValidateDecision(t) {
    return this.checkId(t.id);
  }
  generateDataToSave() {
    return {
      lastId: this.lastId,
      list: this.decisionList
    };
  }
  checkDecisionList(t) {
    return t.filter(this.softValidateDecision.bind(this)).sort((A, i) => A.id.localeCompare(i.id));
  }
  checkId(t) {
    return /^#([1-9]\d*)$/.test(t);
  }
  checkWeight(t) {
    return /^[1-9]\d*$/.test(t) || t === void 0;
  }
  checkTitle(t) {
    return t.trim() !== "";
  }
}
const m = new v(
  b,
  j
), F = {
  "/": () => new Z(m),
  "/start": () => new N(m),
  "/404": () => new G()
}, Q = new L(F, document.body);
export {
  Q as appRouter
};
