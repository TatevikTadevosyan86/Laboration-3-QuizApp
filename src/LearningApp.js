export class LearningApp {
  #root
  constructor(root) {
    this.#root = root;
  }
  start() {
    this.#showMenu();
  }
  #showMenu() {
    this.#root.innerHTML = `
     <h1>Learn & Play</h1>
      <p>Choose an activity</p>
      <div>
        <button type="button">Shapes</button>
        <button type="button">Colours</button>
        <button type="button">Counting</button>
        <button type="button">Letters</button>
      </div>
    `
  }
}