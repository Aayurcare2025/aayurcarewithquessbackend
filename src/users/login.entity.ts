import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"login"})
export class Login
{
   @PrimaryGeneratedColumn()
   id:number;

   @Column({unique:true})
   phonenumber:string;

   
   @Column({type:'timestamp'})
   login_date:Date;

   //data 
   



}