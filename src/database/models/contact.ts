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
import { contactGroup } from './contactGroup';
import { chatRoom } from './chatRoom';

export interface contactAttributes {
  contactId?: number;
  uid: string;
  friendUid?: string;
  groupId?: number;
  chatId: number;
  contactName?: string;
  remark?: string;
  type?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

@Table({ tableName: 'contact', timestamps: true })
export class contact
  extends Model<contactAttributes, contactAttributes>
  implements contactAttributes
{
  @Column({
    field: 'contact_id',
    primaryKey: true,
    autoIncrement: true,
    type: DataType.SMALLINT,
    comment: '联系人编号',
  })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  contactId?: number;

  @ForeignKey(() => users)
  @Column({ type: DataType.CHAR(36) })
  @Index({ name: 'contact_uid', using: 'BTREE', order: 'ASC', unique: false })
  uid!: string;

  @Column({ field: 'friend_uid', allowNull: true, type: DataType.CHAR(36) })
  friendUid?: string;

  @ForeignKey(() => contactGroup)
  @Column({ field: 'group_id', allowNull: true, type: DataType.SMALLINT })
  groupId?: number;

  @ForeignKey(() => chatRoom)
  @Column({ field: 'chat_id', type: DataType.SMALLINT })
  chatId!: number;

  @Column({
    field: 'contact_name',
    allowNull: true,
    type: DataType.STRING(45),
    comment: '联系人昵称',
  })
  contactName?: string;

  @Column({ allowNull: true, type: DataType.STRING(45), comment: '备注' })
  remark?: string;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
    comment: '类型 0-私聊 | 1-群聊',
    defaultValue: 0,
  })
  type?: number;

  @Column({ field: 'created_at', allowNull: true, type: DataType.DATE })
  createdAt?: Date;

  @Column({ field: 'updated_at', allowNull: true, type: DataType.DATE })
  updatedAt?: Date;

  @Column({ field: 'deleted_at', allowNull: true, type: DataType.DATE })
  deletedAt?: Date;

  @BelongsTo(() => users)
  user?: users;

  @BelongsTo(() => contactGroup)
  contactGroup?: contactGroup;

  @BelongsTo(() => chatRoom)
  chatRoom?: chatRoom;
}
