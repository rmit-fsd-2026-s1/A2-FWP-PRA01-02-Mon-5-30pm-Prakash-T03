import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany, OneToOne } from "typeorm";
import { Venue } from "./Venue";
import { Application } from "./Application";
import { HirerDocument } from "./HirerDocument";
import { VendorComment } from "./VendorComment";
import { HireHistory } from "./HireHistory";

@Entity("users")
export class User {
  @PrimaryColumn({ type: "varchar", length: 50 })
  id!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "varchar", length: 20 })
  role!: "hirer" | "vendor" | "admin";

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 20 })
  phone!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  avatarUrl?: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  // Relations
  @OneToMany(() => Venue, (venue) => venue.vendor)
  venues?: Venue[];

  @OneToMany(() => Application, (application) => application.hir)
  applications?: Application[];

  @OneToOne(() => HirerDocument, (doc) => doc.user)
  document?: HirerDocument;

  @OneToMany(() => VendorComment, (comment) => comment.vendor)
  authoredComments?: VendorComment[];

  @OneToMany(() => VendorComment, (comment) => comment.hirer)
  receivedComments?: VendorComment[];

  @OneToMany(() => HireHistory, (history) => history.hirer)
  hirerHistory?: HireHistory[];

  @OneToMany(() => HireHistory, (history) => history.vendor)
  vendorHistory?: HireHistory[];
}
