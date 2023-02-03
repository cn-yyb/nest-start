import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import { contact } from './contact';
import { users } from './users';

export interface contactGroupAttributes {
  groupId?: number;
  uid: string;
  groupName?: string;
  groupOrder?: number;
  type?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

@Table({ tableName: 'contact_group', timestamps: true })
export class contactGroup
  extends Model<contactGroupAttributes, contactGroupAttributes>
  implements contactGroupAttributes
{
  @Column({
    field: 'group_id',
    primaryKey: true,
    autoIncrement: true,
    type: DataType.SMALLINT,
    comment: '分组id',
  })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  groupId?: number;

  @ForeignKey(() => users)
  @Column({ primaryKey: true, type: DataType.CHAR(36) })
  @Index({
    name: 'contact_goup_uid',
    using: 'BTREE',
    order: 'ASC',
    unique: false,
  })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  uid!: string;

  @Column({
    field: 'group_name',
    allowNull: true,
    type: DataType.STRING(45),
    comment: '分组名称',
  })
  groupName?: string;

  @Column({
    field: 'group_order',
    allowNull: true,
    type: DataType.INTEGER,
    comment: '分组排序',
    defaultValue: 0,
  })
  groupOrder?: number;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
    comment: '分类类型：0-系统初始默认 | 1-系统默认 | 2-用户自定义 ',
  })
  type?: number;

  @Column({ field: 'created_at', allowNull: true, type: DataType.DATE })
  createdAt?: Date;

  @Column({ field: 'updated_at', allowNull: true, type: DataType.DATE })
  updatedAt?: Date;

  @Column({ field: 'deleted_at', allowNull: true, type: DataType.DATE })
  deletedAt?: Date;

  @HasMany(() => contact, { sourceKey: 'groupId' })
  contacts?: contact[];

  @BelongsTo(() => users, { foreignKey: 'uid', targetKey: 'uid' })
  user?: users;
}
