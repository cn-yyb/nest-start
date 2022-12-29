import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface chatRoomAttributes {
  roomId?: number;
  status?: number;
  roomName?: string;
  type?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

@Table({ tableName: 'chat_room', timestamps: true })
export class chatRoom
  extends Model<chatRoomAttributes, chatRoomAttributes>
  implements chatRoomAttributes
{
  @Column({
    field: 'room_id',
    primaryKey: true,
    autoIncrement: true,
    type: DataType.SMALLINT,
    comment: '房间号',
  })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  roomId?: number;

  @Column({
    allowNull: true,
    type: DataType.TINYINT,
    comment: '房间状态：0 正常 | 1-禁言 | 2-封禁 ',
    defaultValue: '0',
  })
  status?: number;

  @Column({
    field: 'room_name',
    allowNull: true,
    type: DataType.STRING(25),
    comment: '房间名称',
  })
  roomName?: string;

  @Column({
    allowNull: true,
    type: DataType.TINYINT,
    comment: '类型 0-私聊 | 1-群聊',
  })
  type?: number;

  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt!: Date;

  @Column({ field: 'updated_at', type: DataType.DATE })
  updatedAt!: Date;

  @Column({ field: 'deleted_at', allowNull: true, type: DataType.DATE })
  deletedAt?: Date;
}
