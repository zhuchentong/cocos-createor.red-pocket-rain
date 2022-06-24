import {
  _decorator,
  Component,
  Vec3,
  view,
  UITransform,
  Input,
  EventMouse,
  Animation,
  Sprite,
  sp,
  resources,
  SpriteAtlas,
  SpriteFrame,
  AudioSource,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("RedEnvelop")
export class RedEnvelop extends Component {
  @property({ type: SpriteFrame })
  normalSpriteFrame;

  @property({ type: SpriteFrame })
  specialSpriteFrame;

  private readonly minSpeed = 400;
  private readonly maxSpeed = 800;

  private position: Vec3 = new Vec3();

  private transform?: UITransform;

  private isSpecial = false;

  private speed: number;

  private clickAudio: AudioSource;

  setDefaultPostition() {
    const size = view.getVisibleSize();

    const range = size.width - this.transform.width;

    const x = Math.random() * range + this.transform.width / 2;

    this.node.setPosition(x, size.height + this.transform.height / 2);
  }

  start() {
    this.clickAudio = this.node.getComponent(AudioSource);
    this.transform = this.node.getComponent(UITransform);

    this.node.once(Input.EventType.TOUCH_START, this.playExplodeAni, this);

    this.setDefaultType();
    this.setDefaultPostition();
    this.setDefaultSpeed();
  }

  setDefaultSpeed() {
    const speed =
      this.minSpeed + (this.maxSpeed - this.minSpeed) * Math.random();

    this.speed = this.isSpecial ? speed * 2 : speed;
  }

  setDefaultType() {
    this.isSpecial = Math.random() < 0.2;
    const sprite = this.node.getComponent(Sprite);

    if (this.isSpecial) {
      sprite.spriteFrame = this.specialSpriteFrame;
    } else {
      sprite.spriteFrame = this.normalSpriteFrame;
    }
  }

  playExplodeAni(event: EventMouse) {
    const ani = this.getComponent(Animation);

    ani.play(this.isSpecial ? "special" : "normal");

    ani.on(Animation.EventType.FINISHED, () => {
      this.node.active = false;
      this.node.destroy();
    });

    this.clickAudio.playOneShot(this.clickAudio.clip);

    this.node.emit("SCORE", this.isSpecial ? 5 : 1);
  }

  fallDown(deltaTime: number) {
    this.node.getPosition(this.position);

    const y = this.position.y - this.speed * deltaTime;

    this.node.setPosition(this.position.x, y);
  }

  update(deltaTime: number) {
    this.fallDown(deltaTime);
    if (this.isMiss()) {
      this.node.active = false;
      this.node.destroy();
    }
  }

  isMiss() {
    const visibleSize = view.getVisibleSize();

    return (
      visibleSize.height <
        Math.abs(this.position.y) - this.transform.height / 2 ||
      visibleSize.width < Math.abs(this.position.x) - this.transform.width / 2
    );
  }
}
