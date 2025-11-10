import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PayuService {
  private key = process.env.PAYU_KEY;
  private salt = process.env.PAYU_SALT;
  private payuUrl = process.env.PAYU_BASE_URL || 'https://secure.payu.in';

  // Step 1: Generate hash for transaction
  // generateHash(data: any): string {
  //   const hashString = `${this.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${this.salt}`;
  //   return crypto.createHash('sha512').update(hashString).digest('hex');
  // }

//   generateHash(data: any): string {
//   const hashString = `${this.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|${data.udf1 || ''}|${data.udf2 || ''}|${data.udf3 || ''}|${data.udf4 || ''}|${data.udf5 || ''}||||||${this.salt}`;
//   console.log("Generated Hash String:", hashString);
//   return crypto.createHash('sha512').update(hashString).digest('hex');
// }
generateHash(data: any): string {
  // As per PayU official format
  const hashString = `${this.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|${data.udf1 || ''}|${data.udf2 || ''}|${data.udf3 || ''}|${data.udf4 || ''}|${data.udf5 || ''}||||||${this.salt}`;
  
  console.log(" Correct PayU Hash String:", hashString);
  
  return crypto.createHash('sha512').update(hashString).digest('hex');
}





  // Step 2: Prepare payment initiation data
  async initiatePayment(paymentData: any) {
    const hash = this.generateHash(paymentData);
    return {
      ...paymentData,
      key: this.key,
      hash,
      payuUrl: this.payuUrl + '/_payment',
    };
  }

  // Step 3: Verify PayU callback hash
  verifyHash(response: any): boolean {
    const hashString = `${this.salt}|${response.status}|||||||||||${response.email}|${response.firstname}|${response.productinfo}|${response.amount}|${response.txnid}|${this.key}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');
    return hash === response.hash;
  }
}
 

