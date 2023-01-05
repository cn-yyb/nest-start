import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface userBacklistAttributes {
  id?: number;
  uid: string;
  targetUid: string;
}

@Table({ tableName: 'user_backlist', timestamps: true })
export class userBacklist
  extends Model<userBacklistAttributes, userBacklistAttributes>
  implements userBacklistAttributes
{
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.SMALLINT })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  id?: number;

  @Column({ type: DataType.CHAR(32) })
  uid!: string;

  @Column({ field: 'target_uid', type: DataType.CHAR(32) })
  targetUid!: string;
}
