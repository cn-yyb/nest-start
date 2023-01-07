import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface userBlacklistAttributes {
  id?: number;
  uid?: string;
  targetUid?: string;
  createdAt: Date;
  updatedAt: Date;
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

  @Column({ allowNull: true, type: DataType.CHAR(36) })
  uid?: string;

  @Column({ field: 'target_uid', allowNull: true, type: DataType.CHAR(36) })
  targetUid?: string;

  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt!: Date;

  @Column({ field: 'updated_at', type: DataType.DATE })
  updatedAt!: Date;

  @Column({ field: 'deleted_at', allowNull: true, type: DataType.DATE })
  deletedAt?: Date;
}
