import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { users } from './users';

export interface userBlacklistAttributes {
  id?: number;
  uid: string;
  targetUid: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

@Table({ tableName: 'user_blacklist', timestamps: true })
export class userBlacklist
  extends Model<userBlacklistAttributes, userBlacklistAttributes>
  implements userBlacklistAttributes
{
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.SMALLINT })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  id?: number;

  @ForeignKey(() => users)
  @Column({ type: DataType.CHAR(36) })
  @Index({ name: 'blacklist_uid', using: 'BTREE', order: 'ASC', unique: false })
  uid!: string;

  @Column({ field: 'target_uid', type: DataType.CHAR(36) })
  targetUid!: string;

  @Column({ field: 'created_at', allowNull: true, type: DataType.DATE })
  createdAt?: Date;

  @Column({ field: 'updated_at', allowNull: true, type: DataType.DATE })
  updatedAt?: Date;

  @Column({ field: 'deleted_at', allowNull: true, type: DataType.DATE })
  deletedAt?: Date;

  @BelongsTo(() => users)
  user?: users;
}
