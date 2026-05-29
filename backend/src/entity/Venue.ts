import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Application } from "./Application";
import { HireHistory } from "./HireHistory";

@Entity("venues")
export class Venue {
  @PrimaryColumn({ type: "varchar", length: 50 })
  id!: string;

  @Column({ type: "varchar", length: 50 })
  vendorId!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255 })
  location!: string;

  @Column({ type: "int" })
  capacity!: number;

  @Column({ type: "simple-json" })
  suitability!: string[];

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "varchar", length: 500 })
  imageUrl!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  pricePerHour!: number;

  @Column({ type: "boolean", default: false })
  isBlocked!: boolean;

  @Column({ type: "boolean", default: false })
  isFeatured!: boolean;

  @Column({ type: "timestamp", nullable: true })
  blockedFrom?: Date;

  @Column({ type: "timestamp", nullable: true })
  blockedUntil?: Date;

  @Column({ type: "text", nullable: true })
  blockReason?: string;

  // Relations
  @ManyToOne(() => User, (user) => user.venues, { onDelete: "CASCADE" })
  @JoinColumn({ name: "vendorId" })
  vendor?: User;

  @OneToMany(() => Application, (application) => application.venue)
  applications?: Application[];

  @OneToMany(() => HireHistory, (history) => history.venue)
  hireHistory?: HireHistory[];
}
