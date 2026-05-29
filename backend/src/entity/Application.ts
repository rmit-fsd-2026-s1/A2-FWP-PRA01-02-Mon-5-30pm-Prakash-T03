import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Venue } from "./Venue";
import { VendorComment } from "./VendorComment";

@Entity("applications")
export class Application {
  @PrimaryColumn({ type: "varchar", length: 50 })
  id!: string;

  @Column({ type: "varchar", length: 50 })
  hirerId!: string;

  @Column({ type: "varchar", length: 50 })
  venueId!: string;

  @Column({ type: "varchar", length: 255 })
  eventName!: string;

  @Column({ type: "int" })
  guestCount!: number;

  @Column({ type: "varchar", length: 20 })
  eventDate!: string; // 'YYYY-MM-DD'

  @Column({ type: "varchar", length: 20 })
  eventTime!: string; // 'HH:MM'

  @Column({ type: "int" })
  durationHours!: number;

  @Column({ type: "varchar", length: 20, default: "pending" })
  status!: "pending" | "approved" | "rejected";

  @Column({ type: "text", nullable: true })
  vendorComment?: string;

  @CreateDateColumn({ type: "timestamp" })
  submittedAt!: Date;

  @Column({ type: "timestamp", nullable: true })
  approvedAt?: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.applications, { onDelete: "CASCADE" })
  @JoinColumn({ name: "hirerId" })
  hir?: User;

  @ManyToOne(() => Venue, (venue) => venue.applications, { onDelete: "CASCADE" })
  @JoinColumn({ name: "venueId" })
  venue?: Venue;

  @OneToMany(() => VendorComment, (comment) => comment.application)
  comments?: VendorComment[];
}
