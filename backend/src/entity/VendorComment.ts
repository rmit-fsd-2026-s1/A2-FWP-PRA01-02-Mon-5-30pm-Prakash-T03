import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { Application } from "./Application";

@Entity("vendor_comments")
export class VendorComment {
  @PrimaryColumn({ type: "varchar", length: 50 })
  id!: string;

  @Column({ type: "varchar", length: 50 })
  vendorId!: string;

  @Column({ type: "varchar", length: 50 })
  hirerId!: string;

  @Column({ type: "varchar", length: 50 })
  applicationId!: string;

  @Column({ type: "text" })
  comment!: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.authoredComments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "vendorId" })
  vendor?: User;

  @ManyToOne(() => User, (user) => user.receivedComments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "hirerId" })
  hirer?: User;

  @ManyToOne(() => Application, (app) => app.comments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "applicationId" })
  application?: Application;
}
