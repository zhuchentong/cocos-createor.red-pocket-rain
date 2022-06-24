import {
  _decorator,
  Component,
  Node,
  Label,
  assert,
  Animation,
  director,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Start")
export class Start extends Component {
  @property({ type: Label })
  startTime: Label;

  start() {
    assert(this.startTime);

    const anim = this.startTime.getComponent(Animation);

    anim.on(Animation.EventType.FINISHED, () => {
      director.loadScene("Game");
    });
  }

  update(deltaTime: number) {}
}
