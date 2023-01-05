import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface userApplyAttributes {
  id?: number;
  applyUid: string;
  friendUid: string;
  verifyMsg?: string;
  status?: number;
}

@Table({ tableName: 'user_apply', timestamps: true })
export class userApply
  extends Model<userApplyAttributes, userApplyAttributes>
  implements userApplyAttributes
{
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.SMALLINT })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  id?: number;

  @Column({ field: 'apply_uid', type: DataType.CHAR(32) })
  applyUid!: string;

  @Column({ field: 'friend_uid', type: DataType.CHAR(32) })
  friendUid!: string;

  @Column({ field: 'verify_msg', allowNull: true, type: DataType.STRING(200) })
  verifyMsg?: string;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
    comment: '0-未读 | 1-同意 | 2-不同意',
    defaultValue: '0',
  })
  status?: number;
}
