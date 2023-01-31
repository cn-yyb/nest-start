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
  chatId?: number;
  chatName?: string;
  chatAvatar?: string;
  owner?: string;
  status?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

@Table({ tableName: 'chat_room', timestamps: true })
export class chatRoom
  extends Model<chatRoomAttributes, chatRoomAttributes>
  implements chatRoomAttributes
{
  @Column({
    field: 'chat_id',
    primaryKey: true,
    autoIncrement: true,
    type: DataType.SMALLINT,
    comment: '房间号',
  })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  chatId?: number;

  @Column({
    field: 'chat_name',
    allowNull: true,
    type: DataType.STRING(45),
    comment: '群名称',
  })
  chatName?: string;

  @Column({
    field: 'chat_avatar',
    allowNull: true,
    type: DataType.STRING(200),
    comment: '群头像',
  })
  chatAvatar?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(45),
    comment: '群主ID（私聊默认未空）',
  })
  owner?: string;

  @Column({
    allowNull: true,
    type: DataType.TINYINT,
    comment: '房间状态：0 正常 | 1-禁言 | 2-封禁 ',
    defaultValue: 0,
  })
  status?: number;

  @Column({ field: 'created_at', allowNull: true, type: DataType.DATE })
  createdAt?: Date;

  @Column({ field: 'updated_at', allowNull: true, type: DataType.DATE })
  updatedAt?: Date;

  @Column({ field: 'deleted_at', allowNull: true, type: DataType.DATE })
  deletedAt?: Date;
}
