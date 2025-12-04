import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('applicant')
export class Applicant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  applicant_id: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  contact_no: string;

  @Column({ nullable: true })
  email_id: string;

  @Column({ nullable: true })
  DOB: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  Pincode: string;

  @Column({ nullable: true })
  City: string;

  @Column({ nullable: true })
  State: string;

  @Column({ nullable: true })
  customer_name: string;

  @Column({ nullable: true })
  DOJ: string;

  @Column({ nullable: true })
  employee_status: string;

  @Column({ nullable: true })
  designation: string;

  @Column({ nullable: true })
  work_location: string;

  @Column({ nullable: true })
  company_name: string;


 @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
created_at: Date;

  // 🟣 NEW: store everything from Dash response
//   @Column({ type: 'json', nullable: true })
//   full_response: object;
}
