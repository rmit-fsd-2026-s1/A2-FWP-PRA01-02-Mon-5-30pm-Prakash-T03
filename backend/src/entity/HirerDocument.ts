import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("hirer_documents")
export class HirerDocument {
  @PrimaryColumn({ type: "varchar", length: 50 })
  hirerId!: string;

  @Column({ type: "boolean", default: false })
  isBusinessApplicant!: boolean;

  @Column({ type: "varchar", length: 20, nullable: true })
  abn?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  driverLicenseName?: string;

  @Column({ type: "mediumtext", nullable: true })
  driverLicenseData?: string; // base64

  @Column({ type: "varchar", length: 255, nullable: true })
  publicLiabilityName?: string;

  @Column({ type: "mediumtext", nullable: true })
  publicLiabilityData?: string; // base64

  @Column({ type: "varchar", length: 255, nullable: true })
  businessCertName?: string;

  @Column({ type: "mediumtext", nullable: true })
  businessCertData?: string; // base64

  @Column({ type: "decimal", precision: 3, scale: 2, default: 0.00 })
  credibilityScore!: number;

  // Relations
  @OneToOne(() => User, (user) => user.document, { onDelete: "CASCADE" })
  @JoinColumn({ name: "hirerId" })
  user?: User;
}
