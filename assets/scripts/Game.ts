import {
  _decorator,
  Component,
  Prefab,
  instantiate,
  assert,
  Input,
  Label,
  ProgressBar,
  Animation,
  Sprite,
  director,
  AudioSource,
  UITransform,
  Vec3,
  Widget,
  view,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Game")
export class Game extends Component {
  @property({ type: Prefab })
  redEnvelopPrfb?: Prefab;

  @property({ type: Prefab })
  scorePrfb?: Prefab;

  @property({ type: Number })
  time: number;

  @property({ type: Number })
  maxRedEnvelopNumber: Prefab;

  @property({ type: Label })
  timeLabel: Label;

  @property({ type: ProgressBar })
  timeProgressBar: ProgressBar;

  @property({ type: Label })
  endTimeLabel: Label;

  redEnvelopCount = 0;

  currentScore = 0;

  currentTime!: number;

  gameOver: boolean = false;

  start() {
    this.schedule(this.createRedEnvelop, 1);
    this.schedule(this.updateTime, 1);

    this.currentTime = this.time;
    this.timeLabel.string = this.currentTime.toString();
  }

  update(deltaTime: number) {
    if (this.gameOver) {
      setTimeout(() => {
        director.loadScene("End");
      }, 1000);
    }
  }

  /**
   * 更新游戏时间
   */
  updateTime() {
    this.currentTime -= 1;
    this.timeLabel.string = this.currentTime.toString();
    this.timeProgressBar.progress = this.currentTime / this.time;

    if (this.currentTime <= 0) {
      // 游戏结束
      this.gameOver = true;
      this.unschedule(this.createRedEnvelop);
      this.unschedule(this.updateTime);

      this.node.destroyAllChildren();
    }

    if (this.currentTime === 3) {
      const anim = this.endTimeLabel.getComponent(Animation);
      anim.play();
    }
  }

  createSecore() {
    const scoreNode = instantiate(this.scorePrfb);

    const labelNode = scoreNode.getChildByPath("Label");
    const label = labelNode.getComponent(Label);
    const ani = scoreNode.getComponent(Animation);

    label.string = this.currentScore.toString();

    ani.on(Animation.EventType.FINISHED, () => {
      scoreNode.active = false;
      scoreNode.destroy();
    });

    this.node.addChild(scoreNode);
  }

  /**
   * 创建红包
   */
  createRedEnvelop() {
    assert(this.redEnvelopPrfb);

    const node = instantiate(this.redEnvelopPrfb);

    node.once("SCORE", (value) => {
      this.currentScore += value;
      this.createSecore();
    });

    this.redEnvelopCount += 1;

    this.node.addChild(node);
  }
}
