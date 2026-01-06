// import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// @Entity('payment')
// export class Payment{

//    @PrimaryGeneratedColumn ()
//    txnid:number;

//    //plan
//    @Column({nullable:true})
//    phonenumber:string

//    @Column({nullable:true})
//    firstname:string;


//    @Column({nullable:true})
//    email:string;


//    @Column({nullable:true})
//     amount:string


//     @Column({nullable:true})
//     productinfo:string;
    
// }



import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  email: string;

  @Column()
  contact_no: string;

  @Column()
  amount: string;

  @Column()
  txnid: string;

  @Column()
  productinfo: string;

  @Column()
  status: string;

  @Column({ type: 'timestamp' })
  payment_date: Date;
}
