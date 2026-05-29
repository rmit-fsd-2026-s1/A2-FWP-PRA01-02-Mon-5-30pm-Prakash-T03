import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Venue } from "./Venue";

@Entity("hire_history")
export class HireHistory {
  @PrimaryColumn({ type: "varchar", length: 50 })
  id!: string;

  @Column({ type: "varchar", length: 50 })
  hirerId!: string;

  @Column({ type: "varchar", length: 50 })
  vendorId!: string;

  @Column({ type: "varchar", length: 50 })
  venueId!: string;

  @Column({ type: "varchar", length: 255 })
  eventName!: string;

  @Column({ type: "varchar", length: 20 })
  dateOfHire!: string; // 'YYYY-MM-DD'

  @Column({ type: "int" })
  rating!: number; // 0-5 stars

  // Relations
  @ManyToOne(() => User, (user) => user.hirerHistory, { onDelete: "CASCADE" })
  @JoinColumn({ name: "hirerId" })
  hirer?: User;

  @ManyToOne(() => User, (user) => user.vendorHistory, { onDelete: "CASCADE" })
  @JoinColumn({ name: "vendorId" })
  vendor?: User;

  @ManyToOne(() => Venue, (venue) => venue.hireHistory, { onDelete: "CASCADE" })
  @JoinColumn({ name: "venueId" })
  venue?: Venue;
}
