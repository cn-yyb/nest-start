import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface contactAttributes {
  contactId?: number;
  uid: string;
  groupId?: number;
  chatId: number;
  contactName?: string;
  remark?: string;
  type?: number;
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

  @Column({ primaryKey: true, type: DataType.STRING(36) })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  uid!: string;

  @Column({ field: 'group_id', allowNull: true, type: DataType.INTEGER })
  groupId?: number;

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
    defaultValue: '0',
  })
  type?: number;
}
