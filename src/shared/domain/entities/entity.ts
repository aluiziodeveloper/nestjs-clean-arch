import { randomUUID as uuidv4 } from 'node:crypto';

export abstract class Entity<Props = any> {
  public readonly _id: string;
  public readonly props: Props;

  constructor(props: Props, id?: string) {
    this.props = props;
    this._id = id || uuidv4();
  }

  get id() {
    return this._id;
  }

  toJSON(): Required<{ id: string } & Props> {
    return {
      id: this._id,
      ...this.props,
    } as Required<{ id: string } & Props>;
  }
}
