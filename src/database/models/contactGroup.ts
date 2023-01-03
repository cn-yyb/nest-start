import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface contactGroupAttributes {
  groupId?: number;
  uid: string;
  groupName?: string;
  groupOrder?: number;
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

  @Column({ primaryKey: true, type: DataType.CHAR(36) })
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
  })
  groupOrder?: number;
}
